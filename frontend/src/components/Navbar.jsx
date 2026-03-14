import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <nav className="navbar">
      <Link to="/" className="navbar-logo">JobPortal</Link>

      <div className="navbar-links">
        {!user && (
          <>
            <Link to="/login">Login</Link>
            <Link to="/register">Register</Link>
          </>
        )}

        {user?.role === 'CANDIDATE' && (
          <>
            <Link to="/candidate/dashboard">Dashboard</Link>
            <Link to="/candidate/profile">Profile</Link>
            <Link to="/candidate/jobs">Search Jobs</Link>
            <Link to="/candidate/applications">My Applications</Link>
          </>
        )}

        {user?.role === 'HR_ADMIN' && (
          <>
            <Link to="/hr/dashboard">Dashboard</Link>
            <Link to="/hr/post-job">Post Job</Link>
            <Link to="/hr/my-jobs">My Jobs</Link>
            <Link to="/hr/search-candidates">Search Candidates</Link>
          </>
        )}
      </div>

      <div className="navbar-right">
        {user && (
          <>
            <span className="navbar-user">Hi, {user.fullName}</span>
            <button className="btn btn-outline" onClick={handleLogout}>Logout</button>
          </>
        )}
      </div>
    </nav>
  );
}
