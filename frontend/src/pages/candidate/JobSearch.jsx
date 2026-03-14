import { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { searchJobs, applyToJob, getMyApplications } from '../../api/api';

export default function JobSearch() {
  const { user } = useAuth();
  const [filters, setFilters] = useState({
    skill: '',
    minExperience: '',
    maxSalary: '',
    location: '',
  });
  const [jobs, setJobs] = useState([]);
  const [appliedJobIds, setAppliedJobIds] = useState(new Set());
  const [loading, setLoading] = useState(false);
  const [applyingId, setApplyingId] = useState(null);
  const [message, setMessage] = useState('');
  const [errors, setErrors] = useState({});

  useEffect(() => {
    getMyApplications(user.id)
      .then((res) => {
        const ids = new Set(res.data.map((a) => a.job?.id || a.jobId));
        setAppliedJobIds(ids);
      })
      .catch(() => {});
  }, [user.id]);

  const handleChange = (e) => {
    setErrors((prev) => ({ ...prev, [e.target.name]: '' }));
    setFilters({ ...filters, [e.target.name]: e.target.value });
  };

  const validateFilters = () => {
    const errs = {};
    if (filters.minExperience !== '' && (Number(filters.minExperience) < 0 || Number(filters.minExperience) > 50)) {
      errs.minExperience = 'Min Experience must be between 0 and 50.';
    }
    if (filters.maxSalary !== '' && Number(filters.maxSalary) <= 0) {
      errs.maxSalary = 'Max Salary must be positive.';
    }
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSearch = async (e) => {
    e.preventDefault();
    if (!validateFilters()) return;
    setLoading(true);
    setMessage('');
    try {
      const params = {};
      if (filters.skill) params.skill = filters.skill;
      if (filters.minExperience) params.minExperience = filters.minExperience;
      if (filters.maxSalary) params.maxSalary = filters.maxSalary;
      if (filters.location) params.location = filters.location;
      const res = await searchJobs(params);
      setJobs(res.data);
      if (res.data.length === 0) setMessage('No jobs found matching your criteria.');
    } catch {
      setMessage('Error searching jobs.');
    } finally {
      setLoading(false);
    }
  };

  const handleApply = async (jobId) => {
    setApplyingId(jobId);
    try {
      await applyToJob({ candidateId: user.id, jobId });
      setAppliedJobIds((prev) => new Set(prev).add(jobId));
    } catch (err) {
      alert(err.response?.data?.message || err.response?.data || 'Failed to apply.');
    } finally {
      setApplyingId(null);
    }
  };

  return (
    <div className="container">
      <h1>Search Jobs</h1>

      <form className="filter-bar" onSubmit={handleSearch}>
        <input name="skill" placeholder="Skill (e.g. Java)" value={filters.skill} onChange={handleChange} />
        <div>
          <input name="minExperience" placeholder="Min Experience" type="number" min="0" value={filters.minExperience} onChange={handleChange} />
          {errors.minExperience && <span style={{ color: '#e74c3c', fontSize: '0.85rem', display: 'block', marginTop: '0.25rem' }}>{errors.minExperience}</span>}
        </div>
        <div>
          <input name="maxSalary" placeholder="Max Salary" type="number" min="0" value={filters.maxSalary} onChange={handleChange} />
          {errors.maxSalary && <span style={{ color: '#e74c3c', fontSize: '0.85rem', display: 'block', marginTop: '0.25rem' }}>{errors.maxSalary}</span>}
        </div>
        <input name="location" placeholder="Location" value={filters.location} onChange={handleChange} />
        <button type="submit" className="btn btn-primary" disabled={loading}>
          {loading ? 'Searching...' : 'Search'}
        </button>
      </form>

      {message && <p className="info-text">{message}</p>}

      <div className="card-grid">
        {jobs.map((job) => (
          <div key={job.id} className="job-card">
            <h3>{job.title}</h3>
            <p className="job-meta">{job.location} &middot; Up to ${job.maxSalary?.toLocaleString()}</p>
            <p className="job-desc">{job.description}</p>
            <div className="job-tags">
              {job.requiredSkills?.split(',').map((s) => (
                <span key={s.trim()} className="tag">{s.trim()}</span>
              ))}
            </div>
            <p className="job-exp">Min Experience: {job.minExperience} yrs</p>
            <button
              className="btn btn-primary"
              disabled={appliedJobIds.has(job.id) || applyingId === job.id}
              onClick={() => handleApply(job.id)}
            >
              {appliedJobIds.has(job.id) ? 'Applied' : applyingId === job.id ? 'Applying...' : 'Apply'}
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
