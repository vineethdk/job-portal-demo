import { useEffect, useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { getCandidateProfile, updateCandidateProfile } from '../../api/api';

export default function Profile() {
  const { user } = useAuth();
  const [form, setForm] = useState({
    skills: '',
    experienceYears: '',
    expectedSalary: '',
    location: '',
    resumeHeadline: '',
  });
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    getCandidateProfile(user.id)
      .then((res) => {
        const p = res.data;
        setForm({
          skills: p.skills || '',
          experienceYears: p.experienceYears ?? '',
          expectedSalary: p.expectedSalary ?? '',
          location: p.location || '',
          resumeHeadline: p.resumeHeadline || '',
        });
      })
      .catch(() => {
        // Profile not created yet — that's fine
      });
  }, [user.id]);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage('');
    setError('');
    setLoading(true);
    try {
      await updateCandidateProfile(user.id, {
        ...form,
        experienceYears: Number(form.experienceYears),
        expectedSalary: Number(form.expectedSalary),
      });
      setMessage('Profile saved successfully!');
    } catch (err) {
      setError(err.response?.data?.message || err.response?.data || 'Failed to save profile.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container">
      <h1>My Profile</h1>
      <div className="form-card" style={{ maxWidth: 600 }}>
        {message && <div className="alert alert-success">{message}</div>}
        {error && <div className="alert alert-error">{error}</div>}
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="resumeHeadline">Resume Headline</label>
            <input
              id="resumeHeadline"
              name="resumeHeadline"
              type="text"
              value={form.resumeHeadline}
              onChange={handleChange}
              placeholder="e.g. Senior React Developer"
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="skills">Skills (comma-separated)</label>
            <input
              id="skills"
              name="skills"
              type="text"
              value={form.skills}
              onChange={handleChange}
              placeholder="e.g. Java, React, SQL"
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="experienceYears">Experience (years)</label>
            <input
              id="experienceYears"
              name="experienceYears"
              type="number"
              min="0"
              value={form.experienceYears}
              onChange={handleChange}
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="expectedSalary">Expected Salary</label>
            <input
              id="expectedSalary"
              name="expectedSalary"
              type="number"
              min="0"
              value={form.expectedSalary}
              onChange={handleChange}
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="location">Location</label>
            <input
              id="location"
              name="location"
              type="text"
              value={form.location}
              onChange={handleChange}
              placeholder="e.g. New York"
              required
            />
          </div>
          <button type="submit" className="btn btn-primary btn-block" disabled={loading}>
            {loading ? 'Saving...' : 'Save Profile'}
          </button>
        </form>
      </div>
    </div>
  );
}
