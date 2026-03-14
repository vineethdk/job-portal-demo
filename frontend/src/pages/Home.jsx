import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function Home() {
  const { user } = useAuth();

  if (user) {
    return (
      <div className="page-center">
        <h1>Welcome back, {user.fullName}!</h1>
        <p style={{ marginTop: '1rem' }}>
          <Link
            to={user.role === 'HR_ADMIN' ? '/hr/dashboard' : '/candidate/dashboard'}
            className="btn btn-primary"
          >
            Go to Dashboard
          </Link>
        </p>
      </div>
    );
  }

  return (
    <div className="page-center">
      <h1 className="hero-title">Welcome to JobPortal</h1>
      <p className="hero-subtitle">
        Your one-stop destination for finding the perfect job or the perfect candidate.
      </p>

      <div className="home-cards">
        <div className="home-card">
          <div className="home-card-icon">&#128188;</div>
          <h2>I'm a Candidate</h2>
          <p>Search for jobs, build your profile, and apply to exciting opportunities.</p>
          <div className="home-card-actions">
            <Link to="/login" state={{ defaultRole: 'CANDIDATE' }} className="btn btn-primary">Login</Link>
            <Link to="/register" state={{ defaultRole: 'CANDIDATE' }} className="btn btn-outline">Register</Link>
          </div>
        </div>

        <div className="home-card">
          <div className="home-card-icon">&#128200;</div>
          <h2>I'm an HR Admin</h2>
          <p>Post jobs, review applications, and find top talent for your company.</p>
          <div className="home-card-actions">
            <Link to="/login" state={{ defaultRole: 'HR_ADMIN' }} className="btn btn-primary">Login</Link>
            <Link to="/register" state={{ defaultRole: 'HR_ADMIN' }} className="btn btn-outline">Register</Link>
          </div>
        </div>
      </div>
    </div>
  );
}
