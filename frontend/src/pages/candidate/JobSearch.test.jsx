import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import JobSearch from './JobSearch';

vi.mock('../../context/AuthContext', () => ({
  useAuth: vi.fn(),
}));

vi.mock('../../api/api', () => ({
  searchJobs: vi.fn(),
  applyToJob: vi.fn(),
  getMyApplications: vi.fn(),
}));

import { useAuth } from '../../context/AuthContext';
import { searchJobs, applyToJob, getMyApplications } from '../../api/api';

beforeEach(() => {
  vi.clearAllMocks();
  useAuth.mockReturnValue({
    user: { id: 1, fullName: 'Alice', role: 'CANDIDATE' },
  });
  // Default: no existing applications
  getMyApplications.mockResolvedValue({ data: [] });
});

describe('JobSearch', () => {
  it('renders search filter inputs', () => {
    render(<JobSearch />);

    expect(screen.getByPlaceholderText('Skill (e.g. Java)')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Min Experience')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Max Salary')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Location')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Search' })).toBeInTheDocument();
  });

  it('fetches existing applications on mount to track applied jobs', async () => {
    getMyApplications.mockResolvedValue({
      data: [{ job: { id: 5 } }, { job: { id: 10 } }],
    });

    render(<JobSearch />);

    await waitFor(() => {
      expect(getMyApplications).toHaveBeenCalledWith(1);
    });
  });

  it('displays jobs from API after search', async () => {
    const mockJobs = [
      {
        id: 1,
        title: 'Java Developer',
        location: 'Remote',
        maxSalary: 120000,
        description: 'Build microservices',
        requiredSkills: 'Java,Spring Boot',
        minExperience: 3,
      },
      {
        id: 2,
        title: 'React Engineer',
        location: 'NYC',
        maxSalary: 150000,
        description: 'Build UIs',
        requiredSkills: 'React,TypeScript',
        minExperience: 2,
      },
    ];
    searchJobs.mockResolvedValue({ data: mockJobs });

    render(<JobSearch />);

    const user = userEvent.setup();
    await user.type(screen.getByPlaceholderText('Skill (e.g. Java)'), 'Java');
    await user.click(screen.getByRole('button', { name: 'Search' }));

    await waitFor(() => {
      expect(screen.getByText('Java Developer')).toBeInTheDocument();
      expect(screen.getByText('React Engineer')).toBeInTheDocument();
    });

    expect(searchJobs).toHaveBeenCalledWith({ skill: 'Java' });
  });

  it('shows "No jobs found" message when search returns empty', async () => {
    searchJobs.mockResolvedValue({ data: [] });

    render(<JobSearch />);

    const user = userEvent.setup();
    await user.click(screen.getByRole('button', { name: 'Search' }));

    await waitFor(() => {
      expect(screen.getByText('No jobs found matching your criteria.')).toBeInTheDocument();
    });
  });

  it('only sends non-empty filter params', async () => {
    searchJobs.mockResolvedValue({ data: [] });

    render(<JobSearch />);

    const user = userEvent.setup();
    await user.type(screen.getByPlaceholderText('Location'), 'Remote');
    await user.click(screen.getByRole('button', { name: 'Search' }));

    await waitFor(() => {
      expect(searchJobs).toHaveBeenCalledWith({ location: 'Remote' });
    });
  });

  it('apply button calls applyToJob and shows "Applied" state', async () => {
    const mockJobs = [
      {
        id: 7,
        title: 'Python Dev',
        location: 'Remote',
        maxSalary: 100000,
        description: 'Write Python',
        requiredSkills: 'Python',
        minExperience: 1,
      },
    ];
    searchJobs.mockResolvedValue({ data: mockJobs });
    applyToJob.mockResolvedValue({ data: {} });

    render(<JobSearch />);

    const user = userEvent.setup();
    await user.click(screen.getByRole('button', { name: 'Search' }));

    await waitFor(() => {
      expect(screen.getByText('Python Dev')).toBeInTheDocument();
    });

    await user.click(screen.getByRole('button', { name: 'Apply' }));

    await waitFor(() => {
      expect(applyToJob).toHaveBeenCalledWith({ candidateId: 1, jobId: 7 });
      expect(screen.getByRole('button', { name: 'Applied' })).toBeDisabled();
    });
  });

  it('shows already applied jobs as disabled on load', async () => {
    getMyApplications.mockResolvedValue({
      data: [{ job: { id: 7 } }],
    });
    const mockJobs = [
      {
        id: 7,
        title: 'Python Dev',
        location: 'Remote',
        maxSalary: 100000,
        description: 'Write Python',
        requiredSkills: 'Python',
        minExperience: 1,
      },
    ];
    searchJobs.mockResolvedValue({ data: mockJobs });

    render(<JobSearch />);

    const user = userEvent.setup();

    // Wait for applications to load
    await waitFor(() => {
      expect(getMyApplications).toHaveBeenCalled();
    });

    await user.click(screen.getByRole('button', { name: 'Search' }));

    await waitFor(() => {
      expect(screen.getByRole('button', { name: 'Applied' })).toBeDisabled();
    });
  });

  it('shows error message when search fails', async () => {
    searchJobs.mockRejectedValue(new Error('Network error'));

    render(<JobSearch />);

    const user = userEvent.setup();
    await user.click(screen.getByRole('button', { name: 'Search' }));

    await waitFor(() => {
      expect(screen.getByText('Error searching jobs.')).toBeInTheDocument();
    });
  });
});
