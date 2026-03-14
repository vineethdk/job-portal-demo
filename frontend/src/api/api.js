import axios from 'axios';

const API = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || '/api',
  headers: { 'Content-Type': 'application/json' },
});

// ─── Auth ───────────────────────────────────────────────
export const login = (credentials) =>
  API.post('/auth/login', credentials);

export const register = (data) =>
  API.post('/auth/register', data);

// ─── Candidate Profile ──────────────────────────────────
export const getCandidateProfile = (userId) =>
  API.get(`/candidate/profile/${userId}`);

export const updateCandidateProfile = (userId, profile) =>
  API.put(`/candidate/profile/${userId}`, profile);

// ─── Job Search (Candidate) ────────────────────────────
export const searchJobs = (params) =>
  API.get('/jobs/search', { params });

// ─── Applications (Candidate) ──────────────────────────
export const applyToJob = (data) =>
  API.post('/candidate/apply', data);

export const getMyApplications = (userId) =>
  API.get(`/candidate/applications/${userId}`);

export const withdrawApplication = (applicationId, userId) =>
  API.delete(`/candidate/applications/${applicationId}`, { params: { userId } });

// ─── HR: Jobs ──────────────────────────────────────────
export const postJob = (job) =>
  API.post('/hr/jobs', job);

export const getMyPostedJobs = (userId) =>
  API.get(`/hr/jobs/${userId}`);

// ─── HR: Applications ──────────────────────────────────
export const getJobApplications = (jobId) =>
  API.get(`/hr/jobs/${jobId}/applications`);

export const updateApplicationStatus = (applicationId, status) =>
  API.put(`/hr/applications/${applicationId}/status`, { status });

// ─── HR: Candidate Search ──────────────────────────────
export const searchCandidates = (params) =>
  API.get('/hr/candidates/search', { params });

// ─── Resume ──────────────────────────────────────────────
export const uploadResume = (userId, file) => {
  const formData = new FormData();
  formData.append('file', file);
  return API.post(`/candidate/profile/${userId}/resume`, formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });
};

export const deleteResume = (userId) =>
  API.delete(`/candidate/profile/${userId}/resume`);

export const getResumeDownloadUrl = (userId) =>
  `${API.defaults.baseURL}/candidate/profile/${userId}/resume`;

export default API;
