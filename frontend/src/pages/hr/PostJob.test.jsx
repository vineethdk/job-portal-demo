import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import PostJob from './PostJob';

vi.mock('../../context/AuthContext', () => ({
  useAuth: vi.fn(),
}));

vi.mock('../../api/api', () => ({
  postJob: vi.fn(),
}));

import { useAuth } from '../../context/AuthContext';
import { postJob } from '../../api/api';

beforeEach(() => {
  vi.clearAllMocks();
  useAuth.mockReturnValue({
    user: { id: 10, fullName: 'HR Bob', role: 'HR_ADMIN' },
  });
});

describe('PostJob', () => {
  it('renders job posting form with all fields', () => {
    render(<PostJob />);

    expect(screen.getByLabelText('Job Title')).toBeInTheDocument();
    expect(screen.getByLabelText('Description')).toBeInTheDocument();
    expect(screen.getByLabelText('Required Skills (comma-separated)')).toBeInTheDocument();
    expect(screen.getByLabelText('Minimum Experience (years)')).toBeInTheDocument();
    expect(screen.getByLabelText('Maximum Salary')).toBeInTheDocument();
    expect(screen.getByLabelText('Location')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Post Job' })).toBeInTheDocument();
  });

  it('submits job with correct data and shows success message', async () => {
    postJob.mockResolvedValue({ data: {} });

    render(<PostJob />);

    const user = userEvent.setup();
    await user.type(screen.getByLabelText('Job Title'), 'Senior Java Dev');
    await user.type(screen.getByLabelText('Description'), 'Build enterprise apps');
    await user.type(screen.getByLabelText('Required Skills (comma-separated)'), 'Java,Spring');
    await user.type(screen.getByLabelText('Minimum Experience (years)'), '5');
    await user.type(screen.getByLabelText('Maximum Salary'), '200000');
    await user.type(screen.getByLabelText('Location'), 'NYC');
    await user.click(screen.getByRole('button', { name: 'Post Job' }));

    await waitFor(() => {
      expect(postJob).toHaveBeenCalledWith({
        title: 'Senior Java Dev',
        description: 'Build enterprise apps',
        requiredSkills: 'Java,Spring',
        minExperience: 5,
        maxSalary: 200000,
        location: 'NYC',
        postedBy: 10,
      });
      expect(screen.getByText('Job posted successfully!')).toBeInTheDocument();
    });
  });

  it('clears form fields after successful submission', async () => {
    postJob.mockResolvedValue({ data: {} });

    render(<PostJob />);

    const user = userEvent.setup();
    await user.type(screen.getByLabelText('Job Title'), 'Dev');
    await user.type(screen.getByLabelText('Description'), 'Desc');
    await user.type(screen.getByLabelText('Required Skills (comma-separated)'), 'JS');
    await user.type(screen.getByLabelText('Minimum Experience (years)'), '1');
    await user.type(screen.getByLabelText('Maximum Salary'), '100000');
    await user.type(screen.getByLabelText('Location'), 'Remote');
    await user.click(screen.getByRole('button', { name: 'Post Job' }));

    await waitFor(() => {
      expect(screen.getByLabelText('Job Title')).toHaveValue('');
      expect(screen.getByLabelText('Description')).toHaveValue('');
      expect(screen.getByLabelText('Required Skills (comma-separated)')).toHaveValue('');
      expect(screen.getByLabelText('Location')).toHaveValue('');
    });
  });

  it('shows error message on failure', async () => {
    postJob.mockRejectedValue({
      response: { data: { message: 'Title is required' } },
    });

    render(<PostJob />);

    const user = userEvent.setup();
    await user.type(screen.getByLabelText('Job Title'), 'Dev');
    await user.type(screen.getByLabelText('Description'), 'Desc');
    await user.type(screen.getByLabelText('Required Skills (comma-separated)'), 'JS');
    await user.type(screen.getByLabelText('Minimum Experience (years)'), '1');
    await user.type(screen.getByLabelText('Maximum Salary'), '50000');
    await user.type(screen.getByLabelText('Location'), 'Remote');
    await user.click(screen.getByRole('button', { name: 'Post Job' }));

    await waitFor(() => {
      expect(screen.getByText('Title is required')).toBeInTheDocument();
    });
  });

  it('shows generic error when response has no message', async () => {
    postJob.mockRejectedValue({});

    render(<PostJob />);

    const user = userEvent.setup();
    await user.type(screen.getByLabelText('Job Title'), 'Dev');
    await user.type(screen.getByLabelText('Description'), 'Desc');
    await user.type(screen.getByLabelText('Required Skills (comma-separated)'), 'JS');
    await user.type(screen.getByLabelText('Minimum Experience (years)'), '1');
    await user.type(screen.getByLabelText('Maximum Salary'), '50000');
    await user.type(screen.getByLabelText('Location'), 'Remote');
    await user.click(screen.getByRole('button', { name: 'Post Job' }));

    await waitFor(() => {
      expect(screen.getByText('Failed to post job.')).toBeInTheDocument();
    });
  });

  it('disables button and shows loading text while posting', async () => {
    let resolvePost;
    postJob.mockImplementation(() => new Promise((resolve) => { resolvePost = resolve; }));

    render(<PostJob />);

    const user = userEvent.setup();
    await user.type(screen.getByLabelText('Job Title'), 'Dev');
    await user.type(screen.getByLabelText('Description'), 'Desc');
    await user.type(screen.getByLabelText('Required Skills (comma-separated)'), 'JS');
    await user.type(screen.getByLabelText('Minimum Experience (years)'), '1');
    await user.type(screen.getByLabelText('Maximum Salary'), '50000');
    await user.type(screen.getByLabelText('Location'), 'Remote');
    await user.click(screen.getByRole('button', { name: 'Post Job' }));

    expect(screen.getByRole('button', { name: 'Posting...' })).toBeDisabled();

    // Resolve to clean up
    resolvePost({ data: {} });
  });

  it('renders the page heading', () => {
    render(<PostJob />);
    expect(screen.getByText('Post a Job')).toBeInTheDocument();
  });
});
