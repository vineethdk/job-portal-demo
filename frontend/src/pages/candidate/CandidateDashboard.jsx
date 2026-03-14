import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { getCandidateProfile, getMyApplications } from '../../api/api';

export default function CandidateDashboard() {
  const { user } = useAuth();
  const [profileComplete, setProfileComplete] = useState(false);
  const [appCount, setAppCount] = useState(0);

  useEffect(() => {
    getCandidateProfile(user.id)
      .then(() => setProfileComplete(true))
      .catch(() => setProfileComplete(false));

    getMyApplications(user.id)
      .then((res) => setAppCount(res.data.length))
      .catch(() => setAppCount(0));
  }, [user.id]);

  return (
    <div className="container">
      <div className="page-header">
        <h1>Welcome, {user.fullName}!</h1>
        <p className="subtitle">Here's your activity overview</p>
      </div>

      <div className="stats-row">
        <div className="stat-card">
          <div className="stat-value">{profileComplete ? 'Yes' : 'No'}</div>
          <div className="stat-label">Profile Complete</div>
        </div>
        <div className="stat-card">
          <div className="stat-value">{appCount}</div>
          <div className="stat-label">Applications</div>
        </div>
      </div>

      <div className="dashboard-cards">
        <Link to="/candidate/profile" className="dash-card">
          <h3>My Profile</h3>
          <p>{profileComplete ? 'View and edit your profile.' : 'Complete your profile to get started.'}</p>
        </Link>
        <Link to="/candidate/jobs" className="dash-card">
          <h3>Search Jobs</h3>
          <p>Browse and apply for open positions.</p>
        </Link>
        <Link to="/candidate/applications" className="dash-card">
          <h3>My Applications</h3>
          <p>Track the status of your job applications.</p>
        </Link>
      </div>
    </div>
  );
}
