import { describe, it, expect, vi, beforeEach } from 'vitest';
import axios from 'axios';

vi.mock('axios', () => {
  const mockInstance = {
    get: vi.fn(),
    post: vi.fn(),
    put: vi.fn(),
  };
  return {
    default: {
      create: vi.fn(() => mockInstance),
      __mockInstance: mockInstance,
    },
  };
});

// We need to get the mock instance that was returned by axios.create
let API;
let login, register, getCandidateProfile, updateCandidateProfile,
  searchJobs, applyToJob, getMyApplications, postJob,
  getMyPostedJobs, getJobApplications, updateApplicationStatus, searchCandidates;

beforeEach(async () => {
  vi.clearAllMocks();
  // Re-import to get fresh module
  const mod = await import('./api.js');
  login = mod.login;
  register = mod.register;
  getCandidateProfile = mod.getCandidateProfile;
  updateCandidateProfile = mod.updateCandidateProfile;
  searchJobs = mod.searchJobs;
  applyToJob = mod.applyToJob;
  getMyApplications = mod.getMyApplications;
  postJob = mod.postJob;
  getMyPostedJobs = mod.getMyPostedJobs;
  getJobApplications = mod.getJobApplications;
  updateApplicationStatus = mod.updateApplicationStatus;
  searchCandidates = mod.searchCandidates;
  API = axios.__mockInstance;
});

describe('API layer', () => {
  // Auth
  describe('login', () => {
    it('calls POST /auth/login with credentials', () => {
      const creds = { username: 'user1', password: 'pass' };
      login(creds);
      expect(API.post).toHaveBeenCalledWith('/auth/login', creds);
    });
  });

  describe('register', () => {
    it('calls POST /auth/register with data', () => {
      const data = { username: 'user1', password: 'pass', fullName: 'User One', role: 'CANDIDATE' };
      register(data);
      expect(API.post).toHaveBeenCalledWith('/auth/register', data);
    });
  });

  // Candidate Profile
  describe('getCandidateProfile', () => {
    it('calls GET /candidate/profile/:userId', () => {
      getCandidateProfile(42);
      expect(API.get).toHaveBeenCalledWith('/candidate/profile/42');
    });
  });

  describe('updateCandidateProfile', () => {
    it('calls PUT /candidate/profile/:userId with profile data', () => {
      const profile = { skills: 'Java,React', experience: 5 };
      updateCandidateProfile(42, profile);
      expect(API.put).toHaveBeenCalledWith('/candidate/profile/42', profile);
    });
  });

  // Job Search
  describe('searchJobs', () => {
    it('calls GET /jobs/search with params', () => {
      const params = { skill: 'Java', location: 'Remote' };
      searchJobs(params);
      expect(API.get).toHaveBeenCalledWith('/jobs/search', { params });
    });
  });

  // Applications
  describe('applyToJob', () => {
    it('calls POST /candidate/apply with data', () => {
      const data = { candidateId: 1, jobId: 5 };
      applyToJob(data);
      expect(API.post).toHaveBeenCalledWith('/candidate/apply', data);
    });
  });

  describe('getMyApplications', () => {
    it('calls GET /candidate/applications/:userId', () => {
      getMyApplications(7);
      expect(API.get).toHaveBeenCalledWith('/candidate/applications/7');
    });
  });

  // HR: Jobs
  describe('postJob', () => {
    it('calls POST /hr/jobs with job data', () => {
      const job = { title: 'Dev', postedBy: 1 };
      postJob(job);
      expect(API.post).toHaveBeenCalledWith('/hr/jobs', job);
    });
  });

  describe('getMyPostedJobs', () => {
    it('calls GET /hr/jobs/:userId', () => {
      getMyPostedJobs(3);
      expect(API.get).toHaveBeenCalledWith('/hr/jobs/3');
    });
  });

  // HR: Applications
  describe('getJobApplications', () => {
    it('calls GET /hr/jobs/:jobId/applications', () => {
      getJobApplications(10);
      expect(API.get).toHaveBeenCalledWith('/hr/jobs/10/applications');
    });
  });

  describe('updateApplicationStatus', () => {
    it('calls PUT /hr/applications/:id/status with status body', () => {
      updateApplicationStatus(5, 'SHORTLISTED');
      expect(API.put).toHaveBeenCalledWith('/hr/applications/5/status', { status: 'SHORTLISTED' });
    });
  });

  // HR: Candidate Search
  describe('searchCandidates', () => {
    it('calls GET /hr/candidates/search with params', () => {
      const params = { skill: 'React', minExperience: 2 };
      searchCandidates(params);
      expect(API.get).toHaveBeenCalledWith('/hr/candidates/search', { params });
    });
  });
});
