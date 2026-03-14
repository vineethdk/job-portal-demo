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
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
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
          </div>
          <div className="form-group">
            <label htmlFor="role">Role</label>
            <select id="role" name="role" value={form.role} onChange={handleChange}>
              <option value="CANDIDATE">Candidate</option>
              <option value="HR_ADMIN">HR Admin</option>
            </select>
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
