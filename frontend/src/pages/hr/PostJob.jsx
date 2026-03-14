import { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { postJob } from '../../api/api';

export default function PostJob() {
  const { user } = useAuth();
  const [form, setForm] = useState({
    title: '',
    description: '',
    requiredSkills: '',
    minExperience: '',
    maxSalary: '',
    location: '',
  });
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage('');
    setError('');
    setLoading(true);
    try {
      await postJob({
        ...form,
        minExperience: Number(form.minExperience),
        maxSalary: Number(form.maxSalary),
        postedBy: user.id,
      });
      setMessage('Job posted successfully!');
      setForm({ title: '', description: '', requiredSkills: '', minExperience: '', maxSalary: '', location: '' });
    } catch (err) {
      setError(err.response?.data?.message || err.response?.data || 'Failed to post job.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container">
      <h1>Post a Job</h1>
      <div className="form-card" style={{ maxWidth: 600 }}>
        {message && <div className="alert alert-success">{message}</div>}
        {error && <div className="alert alert-error">{error}</div>}
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="title">Job Title</label>
            <input id="title" name="title" type="text" value={form.title} onChange={handleChange} required />
          </div>
          <div className="form-group">
            <label htmlFor="description">Description</label>
            <textarea id="description" name="description" rows="4" value={form.description} onChange={handleChange} required />
          </div>
          <div className="form-group">
            <label htmlFor="requiredSkills">Required Skills (comma-separated)</label>
            <input id="requiredSkills" name="requiredSkills" type="text" value={form.requiredSkills} onChange={handleChange} placeholder="e.g. Java, Spring Boot, SQL" required />
          </div>
          <div className="form-group">
            <label htmlFor="minExperience">Minimum Experience (years)</label>
            <input id="minExperience" name="minExperience" type="number" min="0" value={form.minExperience} onChange={handleChange} required />
          </div>
          <div className="form-group">
            <label htmlFor="maxSalary">Maximum Salary</label>
            <input id="maxSalary" name="maxSalary" type="number" min="0" value={form.maxSalary} onChange={handleChange} required />
          </div>
          <div className="form-group">
            <label htmlFor="location">Location</label>
            <input id="location" name="location" type="text" value={form.location} onChange={handleChange} required />
          </div>
          <button type="submit" className="btn btn-primary btn-block" disabled={loading}>
            {loading ? 'Posting...' : 'Post Job'}
          </button>
        </form>
      </div>
    </div>
  );
}
