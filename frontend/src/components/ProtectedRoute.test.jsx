import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import ProtectedRoute from './ProtectedRoute';

// Mock useAuth
vi.mock('../context/AuthContext', () => ({
  useAuth: vi.fn(),
}));

import { useAuth } from '../context/AuthContext';

function renderWithRouter(ui, { initialEntries = ['/'] } = {}) {
  return render(
    <MemoryRouter initialEntries={initialEntries}>
      {ui}
    </MemoryRouter>
  );
}

describe('ProtectedRoute', () => {
  it('redirects to /login when user is not authenticated', () => {
    useAuth.mockReturnValue({ user: null });

    const { container } = renderWithRouter(
      <ProtectedRoute role="CANDIDATE">
        <div>Protected Content</div>
      </ProtectedRoute>,
      { initialEntries: ['/candidate/dashboard'] }
    );

    expect(screen.queryByText('Protected Content')).not.toBeInTheDocument();
  });

  it('redirects to / when user has wrong role', () => {
    useAuth.mockReturnValue({
      user: { id: 1, fullName: 'Test', role: 'CANDIDATE' },
    });

    const { container } = renderWithRouter(
      <ProtectedRoute role="HR_ADMIN">
        <div>HR Only Content</div>
      </ProtectedRoute>,
      { initialEntries: ['/hr/dashboard'] }
    );

    expect(screen.queryByText('HR Only Content')).not.toBeInTheDocument();
  });

  it('renders children when user has the correct role', () => {
    useAuth.mockReturnValue({
      user: { id: 1, fullName: 'Test', role: 'CANDIDATE' },
    });

    renderWithRouter(
      <ProtectedRoute role="CANDIDATE">
        <div>Candidate Content</div>
      </ProtectedRoute>
    );

    expect(screen.getByText('Candidate Content')).toBeInTheDocument();
  });

  it('renders children when no role is specified and user is authenticated', () => {
    useAuth.mockReturnValue({
      user: { id: 1, fullName: 'Test', role: 'HR_ADMIN' },
    });

    renderWithRouter(
      <ProtectedRoute>
        <div>Any Authenticated Content</div>
      </ProtectedRoute>
    );

    expect(screen.getByText('Any Authenticated Content')).toBeInTheDocument();
  });
});
