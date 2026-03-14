import { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function Register() {
  const { registerUser } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const defaultRole = location.state?.defaultRole || 'CANDIDATE';

  const [form, setForm] = useState({
    username: '',
    password: '',
    fullName: '',
    role: defaultRole,
    companyName: '',
  });
  const [error, setError] = useState('');
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setErrors((prev) => ({ ...prev, [e.target.name]: '' }));
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const validate = () => {
    const errs = {};
    if (!form.fullName.trim()) errs.fullName = 'Full Name is required.';
    else if (form.fullName.trim().length < 2) errs.fullName = 'Full Name must be at least 2 characters.';
    else if (form.fullName.trim().length > 100) errs.fullName = 'Full Name must be at most 100 characters.';
    if (!form.username.trim()) errs.username = 'Username is required.';
    else if (form.username.trim().length < 3) errs.username = 'Username must be at least 3 characters.';
    else if (form.username.trim().length > 50) errs.username = 'Username must be at most 50 characters.';
    else if (!/^[a-zA-Z0-9_]+$/.test(form.username.trim())) errs.username = 'Username can only contain letters, numbers, and underscores.';
    if (!form.password) errs.password = 'Password is required.';
    else if (form.password.length < 6) errs.password = 'Password must be at least 6 characters.';
    if (!form.role) errs.role = 'Role is required.';
    if (form.role === 'HR_ADMIN') {
      if (!form.companyName.trim()) errs.companyName = 'Company Name is required for HR Admin.';
      else if (form.companyName.trim().length > 100) errs.companyName = 'Company Name must be at most 100 characters.';
    }
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    if (!validate()) return;
    setLoading(true);
    try {
      const payload = { ...form };
      if (payload.role !== 'HR_ADMIN') {
        delete payload.companyName;
      }
      const user = await registerUser(payload);
      if (user.role === 'HR_ADMIN') {
        navigate('/hr/dashboard');
      } else {
        navigate('/candidate/dashboard');
      }
    } catch (err) {
      setError(err.response?.data?.message || err.response?.data || 'Registration failed.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="page-center">
      <div className="form-card">
        <h2>Register</h2>
        {error && <div className="alert alert-error">{error}</div>}
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="fullName">Full Name</label>
            <input
              id="fullName"
              name="fullName"
              type="text"
              value={form.fullName}
              onChange={handleChange}
              required
            />
            {errors.fullName && <span style={{ color: '#e74c3c', fontSize: '0.85rem', marginTop: '0.25rem' }}>{errors.fullName}</span>}
          </div>
          <div className="form-group">
            <label htmlFor="username">Username</label>
            <input
              id="username"
              name="username"
              type="text"
              value={form.username}
              onChange={handleChange}
              required
            />
            {errors.username && <span style={{ color: '#e74c3c', fontSize: '0.85rem', marginTop: '0.25rem' }}>{errors.username}</span>}
          </div>
          <div className="form-group">
            <label htmlFor="password">Password</label>
            <input
              id="password"
              name="password"
              type="password"
              value={form.password}
              onChange={handleChange}
              required
              minLength={4}
            />
            {errors.password && <span style={{ color: '#e74c3c', fontSize: '0.85rem', marginTop: '0.25rem' }}>{errors.password}</span>}
          </div>
          <div className="form-group">
            <label htmlFor="role">Role</label>
            <select id="role" name="role" value={form.role} onChange={handleChange}>
              <option value="CANDIDATE">Candidate</option>
              <option value="HR_ADMIN">HR Admin</option>
            </select>
            {errors.role && <span style={{ color: '#e74c3c', fontSize: '0.85rem', marginTop: '0.25rem' }}>{errors.role}</span>}
          </div>
          {form.role === 'HR_ADMIN' && (
            <div className="form-group">
              <label htmlFor="companyName">Company Name</label>
              <input
                id="companyName"
                name="companyName"
                type="text"
                value={form.companyName}
                onChange={handleChange}
                required
              />
              {errors.companyName && <span style={{ color: '#e74c3c', fontSize: '0.85rem', marginTop: '0.25rem' }}>{errors.companyName}</span>}
            </div>
          )}
          <button type="submit" className="btn btn-primary btn-block" disabled={loading}>
            {loading ? 'Registering...' : 'Register'}
          </button>
        </form>
        <p className="form-footer">
          Already have an account? <Link to="/login" state={location.state}>Login here</Link>
        </p>
      </div>
    </div>
  );
}
