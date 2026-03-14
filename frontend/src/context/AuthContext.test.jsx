import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, act } from '@testing-library/react';
import { AuthProvider, useAuth } from './AuthContext';

// Mock the api module
vi.mock('../api/api', () => ({
  login: vi.fn(),
  register: vi.fn(),
}));

import * as api from '../api/api';

// Helper component that exposes auth context for testing
function TestConsumer({ action }) {
  const auth = useAuth();
  return (
    <div>
      <span data-testid="user">{auth.user ? JSON.stringify(auth.user) : 'null'}</span>
      {action && <button data-testid="action" onClick={() => action(auth)}>Do</button>}
    </div>
  );
}

beforeEach(() => {
  vi.clearAllMocks();
  localStorage.clear();
});

describe('AuthContext', () => {
  it('loads user from localStorage on init', () => {
    const storedUser = { id: 1, fullName: 'Test', role: 'CANDIDATE' };
    localStorage.setItem('jobportal_user', JSON.stringify(storedUser));

    render(
      <AuthProvider>
        <TestConsumer />
      </AuthProvider>
    );

    expect(screen.getByTestId('user').textContent).toEqual(JSON.stringify(storedUser));
  });

  it('starts with null user when localStorage is empty', () => {
    render(
      <AuthProvider>
        <TestConsumer />
      </AuthProvider>
    );

    expect(screen.getByTestId('user').textContent).toBe('null');
  });

  it('loginUser calls API, sets user state and localStorage', async () => {
    const mockUser = { id: 1, fullName: 'Alice', role: 'CANDIDATE' };
    api.login.mockResolvedValue({ data: mockUser });

    function LoginTrigger() {
      const { loginUser } = useAuth();
      return (
        <button data-testid="login-btn" onClick={async () => {
          await loginUser({ username: 'alice', password: 'pass' });
        }}>Login</button>
      );
    }

    render(
      <AuthProvider>
        <TestConsumer />
        <LoginTrigger />
      </AuthProvider>
    );

    expect(screen.getByTestId('user').textContent).toBe('null');

    await act(async () => {
      screen.getByTestId('login-btn').click();
    });

    expect(api.login).toHaveBeenCalledWith({ username: 'alice', password: 'pass' });
    expect(screen.getByTestId('user').textContent).toEqual(JSON.stringify(mockUser));
    expect(JSON.parse(localStorage.getItem('jobportal_user'))).toEqual(mockUser);
  });

  it('registerUser calls API, sets user state and localStorage', async () => {
    const mockUser = { id: 2, fullName: 'Bob', role: 'HR_ADMIN' };
    api.register.mockResolvedValue({ data: mockUser });

    function RegisterTrigger() {
      const { registerUser } = useAuth();
      return (
        <button data-testid="register-btn" onClick={async () => {
          await registerUser({ username: 'bob', password: 'pass', fullName: 'Bob', role: 'HR_ADMIN', companyName: 'Acme' });
        }}>Register</button>
      );
    }

    render(
      <AuthProvider>
        <TestConsumer />
        <RegisterTrigger />
      </AuthProvider>
    );

    await act(async () => {
      screen.getByTestId('register-btn').click();
    });

    expect(api.register).toHaveBeenCalledWith({
      username: 'bob', password: 'pass', fullName: 'Bob', role: 'HR_ADMIN', companyName: 'Acme',
    });
    expect(screen.getByTestId('user').textContent).toEqual(JSON.stringify(mockUser));
    expect(JSON.parse(localStorage.getItem('jobportal_user'))).toEqual(mockUser);
  });

  it('logout clears user state and localStorage', async () => {
    const storedUser = { id: 1, fullName: 'Test', role: 'CANDIDATE' };
    localStorage.setItem('jobportal_user', JSON.stringify(storedUser));

    function LogoutTrigger() {
      const { logout } = useAuth();
      return <button data-testid="logout-btn" onClick={logout}>Logout</button>;
    }

    render(
      <AuthProvider>
        <TestConsumer />
        <LogoutTrigger />
      </AuthProvider>
    );

    expect(screen.getByTestId('user').textContent).toEqual(JSON.stringify(storedUser));

    await act(async () => {
      screen.getByTestId('logout-btn').click();
    });

    expect(screen.getByTestId('user').textContent).toBe('null');
    expect(localStorage.getItem('jobportal_user')).toBeNull();
  });

  it('throws error when useAuth is used outside AuthProvider', () => {
    // Suppress console.error for this expected error
    const spy = vi.spyOn(console, 'error').mockImplementation(() => {});
    expect(() => render(<TestConsumer />)).toThrow('useAuth must be used within AuthProvider');
    spy.mockRestore();
  });
});
