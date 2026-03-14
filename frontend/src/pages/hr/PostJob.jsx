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
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setErrors((prev) => ({ ...prev, [e.target.name]: '' }));
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const validate = () => {
    const errs = {};
    if (!form.title.trim()) errs.title = 'Job Title is required.';
    else if (form.title.trim().length < 2) errs.title = 'Job Title must be at least 2 characters.';
    else if (form.title.trim().length > 100) errs.title = 'Job Title must be at most 100 characters.';
    if (form.description.length > 2000) errs.description = 'Description must be at most 2000 characters.';
    if (!form.requiredSkills.trim()) errs.requiredSkills = 'Required Skills are required.';
    else if (form.requiredSkills.trim().length < 2) errs.requiredSkills = 'Required Skills must be at least 2 characters.';
    else if (form.requiredSkills.trim().length > 500) errs.requiredSkills = 'Required Skills must be at most 500 characters.';
    if (form.minExperience === '' || form.minExperience === null || form.minExperience === undefined) errs.minExperience = 'Minimum Experience is required.';
    else if (Number(form.minExperience) < 0 || Number(form.minExperience) > 50) errs.minExperience = 'Minimum Experience must be between 0 and 50 years.';
    if (form.maxSalary === '' || form.maxSalary === null || form.maxSalary === undefined) errs.maxSalary = 'Maximum Salary is required.';
    else if (Number(form.maxSalary) <= 0) errs.maxSalary = 'Maximum Salary must be positive.';
    else if (Number(form.maxSalary) > 10000000) errs.maxSalary = 'Maximum Salary must be at most 10,000,000.';
    if (!form.location.trim()) errs.location = 'Location is required.';
    else if (form.location.trim().length < 2) errs.location = 'Location must be at least 2 characters.';
    else if (form.location.trim().length > 100) errs.location = 'Location must be at most 100 characters.';
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage('');
    setError('');
    if (!validate()) return;
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
      <div className="page-header">
        <h1>Post a Job</h1>
        <p className="subtitle">Fill in the details to find the perfect candidate</p>
      </div>
      <div className="form-card" style={{ maxWidth: 600 }}>
        {message && <div className="alert alert-success">{message}</div>}
        {error && <div className="alert alert-error">{error}</div>}
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="title">Job Title</label>
            <input id="title" name="title" type="text" value={form.title} onChange={handleChange} required />
            {errors.title && <span style={{ color: '#e74c3c', fontSize: '0.85rem', marginTop: '0.25rem' }}>{errors.title}</span>}
          </div>
          <div className="form-group">
            <label htmlFor="description">Description</label>
            <textarea id="description" name="description" rows="4" value={form.description} onChange={handleChange} required />
            {errors.description && <span style={{ color: '#e74c3c', fontSize: '0.85rem', marginTop: '0.25rem' }}>{errors.description}</span>}
          </div>
          <div className="form-group">
            <label htmlFor="requiredSkills">Required Skills (comma-separated)</label>
            <input id="requiredSkills" name="requiredSkills" type="text" value={form.requiredSkills} onChange={handleChange} placeholder="e.g. Java, Spring Boot, SQL" required />
            {errors.requiredSkills && <span style={{ color: '#e74c3c', fontSize: '0.85rem', marginTop: '0.25rem' }}>{errors.requiredSkills}</span>}
          </div>
          <div className="form-group">
            <label htmlFor="minExperience">Minimum Experience (years)</label>
            <input id="minExperience" name="minExperience" type="number" min="0" value={form.minExperience} onChange={handleChange} required />
            {errors.minExperience && <span style={{ color: '#e74c3c', fontSize: '0.85rem', marginTop: '0.25rem' }}>{errors.minExperience}</span>}
          </div>
          <div className="form-group">
            <label htmlFor="maxSalary">Maximum Salary</label>
            <input id="maxSalary" name="maxSalary" type="number" min="0" value={form.maxSalary} onChange={handleChange} required />
            {errors.maxSalary && <span style={{ color: '#e74c3c', fontSize: '0.85rem', marginTop: '0.25rem' }}>{errors.maxSalary}</span>}
          </div>
          <div className="form-group">
            <label htmlFor="location">Location</label>
            <input id="location" name="location" type="text" value={form.location} onChange={handleChange} required />
            {errors.location && <span style={{ color: '#e74c3c', fontSize: '0.85rem', marginTop: '0.25rem' }}>{errors.location}</span>}
          </div>
          <button type="submit" className="btn btn-primary btn-block" disabled={loading}>
            {loading ? 'Posting...' : 'Post Job'}
          </button>
        </form>
      </div>
    </div>
  );
}
