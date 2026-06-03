const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: './app/.env' });

// IMPORTANT: To create users programmatically, you need the SERVICE_ROLE_KEY
// from Supabase Settings -> API. Do NOT use this key in the frontend app.
const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseServiceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY; 

if (!supabaseUrl || !supabaseServiceRoleKey) {
  console.error('Missing environment variables. Ensure VITE_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY are set.');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseServiceRoleKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false
  }
});

async function createUser(email, password, fullName, role, departmentName) {
  console.log(`Creating user: ${email}...`);

  // 1. Get Department ID (Optional for admins)
  let departmentId = null;
  if (departmentName) {
    const { data: dept, error: deptError } = await supabase
      .from('departments')
      .select('id')
      .eq('name', departmentName)
      .single();

    if (deptError || !dept) {
      console.error(`Department "${departmentName}" not found.`);
      if (role !== 'admin') return;
    } else {
      departmentId = dept.id;
    }
  }

  // 2. Create User in Auth
  const { data: authUser, error: authError } = await supabase.auth.admin.createUser({
    email,
    password,
    email_confirm: true,
    user_metadata: { full_name: fullName }
  });

  if (authError) {
    console.error('Error creating auth user:', authError.message);
    return;
  }

  // 3. Update Profile (The trigger handle_new_user might have already created a basic profile, so we update it)
  const { error: profileError } = await supabase
    .from('profiles')
    .update({ 
      full_name: fullName, 
      role: role, 
      department_id: departmentId 
    })
    .eq('id', authUser.user.id);

  if (profileError) {
    console.error('Error updating profile:', profileError.message);
    return;
  }

  console.log('User created successfully!');
  console.log(`Email: ${email}`);
  console.log(`Role: ${role}`);
  console.log(`Department: ${departmentName}`);
}

// Usage: node scripts/create-user.js email password "Full Name" role "Dept Name"
const args = process.argv.slice(2);
if (args.length < 5) {
  console.log('Usage: node scripts/create-user.js <email> <password> "<Full Name>" <role> "<Department Name>"');
  console.log('Example: node scripts/create-user.js john@example.com password123 "John Doe" manager "Sales"');
} else {
  createUser(args[0], args[1], args[2], args[3], args[4]);
}
