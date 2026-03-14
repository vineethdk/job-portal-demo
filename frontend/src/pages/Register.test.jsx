import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter } from 'react-router-dom';
import Register from './Register';

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

function renderRegister() {
  return render(
    <MemoryRouter>
      <Register />
    </MemoryRouter>
  );
}

beforeEach(() => {
  vi.clearAllMocks();
});

describe('Register', () => {
  it('renders registration form fields', () => {
    useAuth.mockReturnValue({ registerUser: vi.fn() });
    renderRegister();

    expect(screen.getByLabelText('Full Name')).toBeInTheDocument();
    expect(screen.getByLabelText('Username')).toBeInTheDocument();
    expect(screen.getByLabelText('Password')).toBeInTheDocument();
    expect(screen.getByLabelText('Role')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Register' })).toBeInTheDocument();
  });

  it('does not show company name field when CANDIDATE is selected (default)', () => {
    useAuth.mockReturnValue({ registerUser: vi.fn() });
    renderRegister();

    expect(screen.queryByLabelText('Company Name')).not.toBeInTheDocument();
  });

  it('shows company name field when HR_ADMIN role is selected', async () => {
    useAuth.mockReturnValue({ registerUser: vi.fn() });
    renderRegister();

    const user = userEvent.setup();
    await user.selectOptions(screen.getByLabelText('Role'), 'HR_ADMIN');

    expect(screen.getByLabelText('Company Name')).toBeInTheDocument();
  });

  it('hides company name field when switching back to CANDIDATE', async () => {
    useAuth.mockReturnValue({ registerUser: vi.fn() });
    renderRegister();

    const user = userEvent.setup();
    await user.selectOptions(screen.getByLabelText('Role'), 'HR_ADMIN');
    expect(screen.getByLabelText('Company Name')).toBeInTheDocument();

    await user.selectOptions(screen.getByLabelText('Role'), 'CANDIDATE');
    expect(screen.queryByLabelText('Company Name')).not.toBeInTheDocument();
  });

  it('submits candidate registration and navigates to candidate dashboard', async () => {
    const mockRegisterUser = vi.fn().mockResolvedValue({ id: 1, fullName: 'Alice', role: 'CANDIDATE' });
    useAuth.mockReturnValue({ registerUser: mockRegisterUser });
    renderRegister();

    const user = userEvent.setup();
    await user.type(screen.getByLabelText('Full Name'), 'Alice');
    await user.type(screen.getByLabelText('Username'), 'alice');
    await user.type(screen.getByLabelText('Password'), 'password');
    // Role is CANDIDATE by default
    await user.click(screen.getByRole('button', { name: 'Register' }));

    await waitFor(() => {
      expect(mockRegisterUser).toHaveBeenCalledWith({
        fullName: 'Alice',
        username: 'alice',
        password: 'password',
        role: 'CANDIDATE',
      });
      expect(mockNavigate).toHaveBeenCalledWith('/candidate/dashboard');
    });
  });

  it('submits HR registration with companyName and navigates to HR dashboard', async () => {
    const mockRegisterUser = vi.fn().mockResolvedValue({ id: 2, fullName: 'Bob', role: 'HR_ADMIN' });
    useAuth.mockReturnValue({ registerUser: mockRegisterUser });
    renderRegister();

    const user = userEvent.setup();
    await user.type(screen.getByLabelText('Full Name'), 'Bob');
    await user.type(screen.getByLabelText('Username'), 'bob');
    await user.type(screen.getByLabelText('Password'), 'password');
    await user.selectOptions(screen.getByLabelText('Role'), 'HR_ADMIN');
    await user.type(screen.getByLabelText('Company Name'), 'Acme Corp');
    await user.click(screen.getByRole('button', { name: 'Register' }));

    await waitFor(() => {
      expect(mockRegisterUser).toHaveBeenCalledWith({
        fullName: 'Bob',
        username: 'bob',
        password: 'password',
        role: 'HR_ADMIN',
        companyName: 'Acme Corp',
      });
      expect(mockNavigate).toHaveBeenCalledWith('/hr/dashboard');
    });
  });

  it('shows error message on registration failure', async () => {
    const mockRegisterUser = vi.fn().mockRejectedValue({
      response: { data: { message: 'Username already taken' } },
    });
    useAuth.mockReturnValue({ registerUser: mockRegisterUser });
    renderRegister();

    const user = userEvent.setup();
    await user.type(screen.getByLabelText('Full Name'), 'Alice');
    await user.type(screen.getByLabelText('Username'), 'alice');
    await user.type(screen.getByLabelText('Password'), 'password');
    await user.click(screen.getByRole('button', { name: 'Register' }));

    await waitFor(() => {
      expect(screen.getByText('Username already taken')).toBeInTheDocument();
    });
  });

  it('shows generic error when response has no message', async () => {
    const mockRegisterUser = vi.fn().mockRejectedValue({});
    useAuth.mockReturnValue({ registerUser: mockRegisterUser });
    renderRegister();

    const user = userEvent.setup();
    await user.type(screen.getByLabelText('Full Name'), 'Alice');
    await user.type(screen.getByLabelText('Username'), 'alice');
    await user.type(screen.getByLabelText('Password'), 'password');
    await user.click(screen.getByRole('button', { name: 'Register' }));

    await waitFor(() => {
      expect(screen.getByText('Registration failed.')).toBeInTheDocument();
    });
  });

  it('renders a link to login page', () => {
    useAuth.mockReturnValue({ registerUser: vi.fn() });
    renderRegister();

    expect(screen.getByText('Login here')).toBeInTheDocument();
  });
});
