import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { getMyPostedJobs, getJobApplications } from '../../api/api';

export default function HrDashboard() {
  const { user } = useAuth();
  const [jobCount, setJobCount] = useState(0);
  const [appCount, setAppCount] = useState(0);

  useEffect(() => {
    getMyPostedJobs(user.id)
      .then(async (res) => {
        const jobs = res.data;
        setJobCount(jobs.length);
        let total = 0;
        for (const job of jobs) {
          try {
            const appRes = await getJobApplications(job.id);
            total += appRes.data.length;
          } catch {
            // ignore
          }
        }
        setAppCount(total);
      })
      .catch(() => {});
  }, [user.id]);

  return (
    <div className="container">
      <div className="page-header">
        <h1>Welcome, {user.fullName}!</h1>
        <p className="subtitle">Here's your recruitment overview</p>
      </div>

      <div className="stats-row">
        <div className="stat-card">
          <div className="stat-value">{jobCount}</div>
          <div className="stat-label">Jobs Posted</div>
        </div>
        <div className="stat-card">
          <div className="stat-value">{appCount}</div>
          <div className="stat-label">Total Applications</div>
        </div>
      </div>

      <div className="dashboard-cards">
        <Link to="/hr/post-job" className="dash-card">
          <h3>Post a Job</h3>
          <p>Create a new job listing for candidates.</p>
        </Link>
        <Link to="/hr/my-jobs" className="dash-card">
          <h3>My Jobs</h3>
          <p>View your posted jobs and applications.</p>
        </Link>
        <Link to="/hr/search-candidates" className="dash-card">
          <h3>Search Candidates</h3>
          <p>Find the best talent for your openings.</p>
        </Link>
      </div>
    </div>
  );
}
