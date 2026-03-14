import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter } from 'react-router-dom';
import Navbar from './Navbar';

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

function renderNavbar() {
  return render(
    <MemoryRouter>
      <Navbar />
    </MemoryRouter>
  );
}

beforeEach(() => {
  vi.clearAllMocks();
});

describe('Navbar', () => {
  it('shows Login and Register links when not authenticated', () => {
    useAuth.mockReturnValue({ user: null, logout: vi.fn() });
    renderNavbar();

    expect(screen.getByText('Login')).toBeInTheDocument();
    expect(screen.getByText('Register')).toBeInTheDocument();
    expect(screen.queryByText('Logout')).not.toBeInTheDocument();
  });

  it('shows candidate nav links when logged in as CANDIDATE', () => {
    useAuth.mockReturnValue({
      user: { id: 1, fullName: 'Alice', role: 'CANDIDATE' },
      logout: vi.fn(),
    });
    renderNavbar();

    expect(screen.getByText('Dashboard')).toBeInTheDocument();
    expect(screen.getByText('Profile')).toBeInTheDocument();
    expect(screen.getByText('Search Jobs')).toBeInTheDocument();
    expect(screen.getByText('My Applications')).toBeInTheDocument();
    expect(screen.queryByText('Post Job')).not.toBeInTheDocument();
    expect(screen.queryByText('Login')).not.toBeInTheDocument();
  });

  it('shows HR nav links when logged in as HR_ADMIN', () => {
    useAuth.mockReturnValue({
      user: { id: 2, fullName: 'Bob', role: 'HR_ADMIN' },
      logout: vi.fn(),
    });
    renderNavbar();

    expect(screen.getByText('Dashboard')).toBeInTheDocument();
    expect(screen.getByText('Post Job')).toBeInTheDocument();
    expect(screen.getByText('My Jobs')).toBeInTheDocument();
    expect(screen.getByText('Search Candidates')).toBeInTheDocument();
    expect(screen.queryByText('Profile')).not.toBeInTheDocument();
    expect(screen.queryByText('Login')).not.toBeInTheDocument();
  });

  it('shows greeting with user full name when logged in', () => {
    useAuth.mockReturnValue({
      user: { id: 1, fullName: 'Alice Smith', role: 'CANDIDATE' },
      logout: vi.fn(),
    });
    renderNavbar();

    expect(screen.getByText('Hi, Alice Smith')).toBeInTheDocument();
  });

  it('calls logout and navigates to / when Logout button is clicked', async () => {
    const mockLogout = vi.fn();
    useAuth.mockReturnValue({
      user: { id: 1, fullName: 'Alice', role: 'CANDIDATE' },
      logout: mockLogout,
    });
    renderNavbar();

    const user = userEvent.setup();
    await user.click(screen.getByText('Logout'));

    expect(mockLogout).toHaveBeenCalled();
    expect(mockNavigate).toHaveBeenCalledWith('/');
  });

  it('always shows the Talent Hub logo link', () => {
    useAuth.mockReturnValue({ user: null, logout: vi.fn() });
    renderNavbar();

    expect(screen.getByText('Talent Hub')).toBeInTheDocument();
  });
});
