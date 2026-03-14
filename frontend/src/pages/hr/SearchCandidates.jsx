import { useState } from 'react';
import { searchCandidates } from '../../api/api';

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

  const handleChange = (e) => {
    setFilters({ ...filters, [e.target.name]: e.target.value });
  };

  const handleSearch = async (e) => {
    e.preventDefault();
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
        <input name="minExperience" placeholder="Min Experience" type="number" min="0" value={filters.minExperience} onChange={handleChange} />
        <input name="maxSalary" placeholder="Max Salary" type="number" min="0" value={filters.maxSalary} onChange={handleChange} />
        <input name="location" placeholder="Location" value={filters.location} onChange={handleChange} />
        <button type="submit" className="btn btn-primary" disabled={loading}>
          {loading ? 'Searching...' : 'Search'}
        </button>
      </form>

      {message && <p className="info-text">{message}</p>}

      <div className="card-grid">
        {candidates.map((c, idx) => (
          <div key={c.id || idx} className="candidate-card">
            <h3>{c.resumeHeadline || 'Candidate'}</h3>
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
          </div>
        ))}
      </div>
    </div>
  );
}
