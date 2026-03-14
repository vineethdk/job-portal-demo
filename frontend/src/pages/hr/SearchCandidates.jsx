import { useState } from 'react';
import { searchCandidates, getResumeDownloadUrl } from '../../api/api';

export default function SearchCandidates() {
  const [filters, setFilters] = useState({
    skill: '',
    minExperience: '',
    maxSalary: '',
    location: '',
  });
  const [candidates, setCandidates] = useState([]);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [errors, setErrors] = useState({});
  const [expandedId, setExpandedId] = useState(null);

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
      const res = await searchCandidates(params);
      setCandidates(res.data);
      if (res.data.length === 0) setMessage('No candidates found matching your criteria.');
    } catch {
      setMessage('Error searching candidates.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container">
      <h1>Search Candidates</h1>

      <form className="filter-bar" onSubmit={handleSearch}>
        <input name="skill" placeholder="Skill (e.g. React)" value={filters.skill} onChange={handleChange} />
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
        {candidates.map((c, idx) => (
          <div key={c.id || idx} className="candidate-card">
            <h3>{c.user?.fullName || 'Candidate'}</h3>
            <p className="job-meta">{c.resumeHeadline}</p>
            <p className="job-meta">{c.location}</p>
            <div className="candidate-detail">
              <strong>Skills:</strong> {c.skills || 'N/A'}
            </div>
            <div className="candidate-detail">
              <strong>Experience:</strong> {c.experienceYears ?? 'N/A'} years
            </div>
            <div className="candidate-detail">
              <strong>Expected Salary:</strong> {c.expectedSalary ? `$${c.expectedSalary.toLocaleString()}` : 'N/A'}
            </div>
            <button
              className="btn btn-secondary"
              style={{ marginTop: '0.5rem' }}
              onClick={() => setExpandedId(expandedId === c.id ? null : c.id)}
            >
              {expandedId === c.id ? 'Hide Profile' : 'View Profile'}
            </button>
            {expandedId === c.id && (
              <div className="candidate-profile-details" style={{ marginTop: '0.75rem', padding: '0.75rem', background: 'var(--profile-details-bg)', borderRadius: '6px' }}>
                <div className="candidate-detail"><strong>Full Name:</strong> {c.user?.fullName || 'N/A'}</div>
                <div className="candidate-detail"><strong>Username:</strong> {c.user?.username || 'N/A'}</div>
                <div className="candidate-detail"><strong>Resume Headline:</strong> {c.resumeHeadline || 'N/A'}</div>
                <div className="candidate-detail"><strong>Skills:</strong> {c.skills || 'N/A'}</div>
                <div className="candidate-detail"><strong>Experience:</strong> {c.experienceYears ?? 'N/A'} years</div>
                <div className="candidate-detail"><strong>Expected Salary:</strong> {c.expectedSalary ? `$${c.expectedSalary.toLocaleString()}` : 'N/A'}</div>
                <div className="candidate-detail"><strong>Location:</strong> {c.location || 'N/A'}</div>
                {c.hasResume && (
                  <div className="candidate-detail" style={{ marginTop: '0.5rem' }}>
                    <a
                      href={getResumeDownloadUrl(c.user?.id)}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="btn btn-primary"
                    >
                      Download Resume
                    </a>
                  </div>
                )}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
