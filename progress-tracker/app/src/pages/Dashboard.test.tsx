import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import Dashboard from './Dashboard';
import { BrowserRouter } from 'react-router-dom';

// Mock Supabase
vi.mock('../lib/supabase', () => {
  const mockQuery: any = Promise.resolve({ data: [], error: null });
  mockQuery.select = vi.fn().mockReturnValue(mockQuery);
  mockQuery.eq = vi.fn().mockReturnValue(mockQuery);
  mockQuery.order = vi.fn().mockReturnValue(mockQuery);
  mockQuery.single = vi.fn().mockReturnValue(Promise.resolve({ data: null, error: null }));

  return {
    supabase: {
      from: vi.fn(() => mockQuery),
      auth: {
        getSession: vi.fn(() => Promise.resolve({ data: { session: null } })),
        onAuthStateChange: vi.fn(() => ({ data: { subscription: { unsubscribe: vi.fn() } } }))
      }
    }
  };
});

// Mock Auth Context
const { stableProfile } = vi.hoisted(() => ({
  stableProfile: { department_id: '123', role: 'employee' }
}));

vi.mock('../contexts/AuthContext', async () => {
  const actual = await vi.importActual('../contexts/AuthContext');
  return {
    ...actual,
    useAuth: () => ({
      profile: stableProfile,
      loading: false,
      signOut: vi.fn()
    })
  };
});

describe('Dashboard', () => {
  it('renders department tasks heading', async () => {
    render(
      <BrowserRouter>
        <Dashboard />
      </BrowserRouter>
    );
    expect(await screen.findByText(/Department Tasks/i)).toBeInTheDocument();
  });

  it('shows no tasks found message when list is empty', async () => {
    render(
      <BrowserRouter>
        <Dashboard />
      </BrowserRouter>
    );
    expect(await screen.findByText(/No tasks found/i)).toBeInTheDocument();
  });
});
