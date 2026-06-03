-- Create departments table
CREATE TABLE departments (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
  name TEXT NOT NULL UNIQUE
);

-- Create profiles table (links to auth.users)
CREATE TABLE profiles (
  id UUID PRIMARY KEY REFERENCES auth.users ON DELETE CASCADE,
  updated_at TIMESTAMP WITH TIME ZONE,
  username TEXT UNIQUE,
  full_name TEXT,
  role TEXT CHECK (role IN ('admin', 'manager', 'employee')) DEFAULT 'employee',
  department_id UUID REFERENCES departments(id)
);

-- Create tasks table
CREATE TABLE tasks (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
  title TEXT NOT NULL,
  description TEXT,
  status TEXT CHECK (status IN ('pending', 'in_progress', 'completed')) DEFAULT 'pending',
  priority TEXT CHECK (priority IN ('low', 'medium', 'high')) DEFAULT 'medium',
  due_date TIMESTAMP WITH TIME ZONE,
  owner_id UUID REFERENCES profiles(id),
  department_id UUID REFERENCES departments(id) NOT NULL
);

-- Set up Row Level Security (RLS)

-- Departments: Everyone can read, only admins can create/update
ALTER TABLE departments ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Departments are viewable by everyone" ON departments FOR SELECT USING (true);
CREATE POLICY "Only admins can insert departments" ON departments FOR INSERT WITH CHECK (
  EXISTS (SELECT 1 FROM profiles WHERE profiles.id = auth.uid() AND profiles.role = 'admin')
);

-- Profiles: Users can read profiles in their department. Admins can do anything.
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Profiles are viewable by same department" ON profiles FOR SELECT USING (
  department_id = (SELECT department_id FROM profiles WHERE id = auth.uid()) OR 
  (SELECT role FROM profiles WHERE id = auth.uid()) = 'admin'
);
CREATE POLICY "Users can update own profile" ON profiles FOR UPDATE USING (auth.uid() = id);

-- Tasks: Users can only see tasks in their department.
ALTER TABLE tasks ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Tasks viewable by department members" ON tasks FOR SELECT USING (
  department_id = (SELECT department_id FROM profiles WHERE id = auth.uid()) OR
  (SELECT role FROM profiles WHERE id = auth.uid()) = 'admin'
);
CREATE POLICY "Managers and Admins can create tasks" ON tasks FOR INSERT WITH CHECK (
  (SELECT role FROM profiles WHERE id = auth.uid()) IN ('manager', 'admin')
);
CREATE POLICY "Owners and Managers can update tasks" ON tasks FOR UPDATE USING (
  auth.uid() = owner_id OR 
  (SELECT role FROM profiles WHERE id = auth.uid()) IN ('manager', 'admin')
);

-- Function to handle new user profiles on auth signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger AS $$
BEGIN
  INSERT INTO public.profiles (id, full_name, role)
  VALUES (new.id, new.raw_user_meta_data->>'full_name', 'employee');
  RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE PROCEDURE public.handle_new_user();
