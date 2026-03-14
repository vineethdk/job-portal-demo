import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter } from 'react-router-dom';
import Login from './Login';

const mockNavigate = vi.fn();

vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom');
  return {
    ...actual,
    useNavigate: () => mockNavigate,
  };
});

vi.mock('../context/AuthContext', () => ({
  useAuth: vi.fn(),
}));

import { useAuth } from '../context/AuthContext';

function renderLogin() {
  return render(
    <MemoryRouter>
      <Login />
    </MemoryRouter>
  );
}

beforeEach(() => {
  vi.clearAllMocks();
});

describe('Login', () => {
  it('renders login form with username and password fields', () => {
    useAuth.mockReturnValue({ loginUser: vi.fn() });
    renderLogin();

    expect(screen.getByLabelText('Username')).toBeInTheDocument();
    expect(screen.getByLabelText('Password')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Login' })).toBeInTheDocument();
  });

  it('renders a link to register page', () => {
    useAuth.mockReturnValue({ loginUser: vi.fn() });
    renderLogin();

    expect(screen.getByText('Register here')).toBeInTheDocument();
  });

  it('submits credentials and navigates to candidate dashboard on success', async () => {
    const mockLoginUser = vi.fn().mockResolvedValue({ id: 1, fullName: 'Alice', role: 'CANDIDATE' });
    useAuth.mockReturnValue({ loginUser: mockLoginUser });
    renderLogin();

    const user = userEvent.setup();
    await user.type(screen.getByLabelText('Username'), 'alice');
    await user.type(screen.getByLabelText('Password'), 'password');
    await user.click(screen.getByRole('button', { name: 'Login' }));

    await waitFor(() => {
      expect(mockLoginUser).toHaveBeenCalledWith({ username: 'alice', password: 'password' });
      expect(mockNavigate).toHaveBeenCalledWith('/candidate/dashboard');
    });
  });

  it('navigates to HR dashboard when HR_ADMIN logs in', async () => {
    const mockLoginUser = vi.fn().mockResolvedValue({ id: 2, fullName: 'Bob', role: 'HR_ADMIN' });
    useAuth.mockReturnValue({ loginUser: mockLoginUser });
    renderLogin();

    const user = userEvent.setup();
    await user.type(screen.getByLabelText('Username'), 'bob');
    await user.type(screen.getByLabelText('Password'), 'password');
    await user.click(screen.getByRole('button', { name: 'Login' }));

    await waitFor(() => {
      expect(mockNavigate).toHaveBeenCalledWith('/hr/dashboard');
    });
  });

  it('shows error message on login failure', async () => {
    const mockLoginUser = vi.fn().mockRejectedValue({
      response: { data: { message: 'Invalid credentials' } },
    });
    useAuth.mockReturnValue({ loginUser: mockLoginUser });
    renderLogin();

    const user = userEvent.setup();
    await user.type(screen.getByLabelText('Username'), 'wrong');
    await user.type(screen.getByLabelText('Password'), 'wrong');
    await user.click(screen.getByRole('button', { name: 'Login' }));

    await waitFor(() => {
      expect(screen.getByText('Invalid credentials')).toBeInTheDocument();
    });
  });

  it('shows generic error message when response has no message', async () => {
    const mockLoginUser = vi.fn().mockRejectedValue({});
    useAuth.mockReturnValue({ loginUser: mockLoginUser });
    renderLogin();

    const user = userEvent.setup();
    await user.type(screen.getByLabelText('Username'), 'x');
    await user.type(screen.getByLabelText('Password'), 'x');
    await user.click(screen.getByRole('button', { name: 'Login' }));

    await waitFor(() => {
      expect(screen.getByText('Login failed. Please check your credentials.')).toBeInTheDocument();
    });
  });

  it('disables button and shows loading text while logging in', async () => {
    let resolveLogin;
    const mockLoginUser = vi.fn().mockImplementation(
      () => new Promise((resolve) => { resolveLogin = resolve; })
    );
    useAuth.mockReturnValue({ loginUser: mockLoginUser });
    renderLogin();

    const user = userEvent.setup();
    await user.type(screen.getByLabelText('Username'), 'alice');
    await user.type(screen.getByLabelText('Password'), 'pass');
    await user.click(screen.getByRole('button', { name: 'Login' }));

    expect(screen.getByRole('button', { name: 'Logging in...' })).toBeDisabled();

    // Resolve the promise to clean up
    resolveLogin({ id: 1, role: 'CANDIDATE' });
  });
});
