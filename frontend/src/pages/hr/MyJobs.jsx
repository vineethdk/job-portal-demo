import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { getMyPostedJobs } from '../../api/api';

export default function MyJobs() {
  const { user } = useAuth();
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getMyPostedJobs(user.id)
      .then((res) => setJobs(res.data))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [user.id]);

  if (loading) return <div className="container"><p>Loading...</p></div>;

  return (
    <div className="container">
      <div className="page-header">
        <h1>My Posted Jobs</h1>
        <p className="subtitle">Manage your posted positions</p>
        {jobs.length > 0 && (
          <p className="record-count">{jobs.length} job{jobs.length !== 1 ? 's' : ''} posted</p>
        )}
      </div>
      {jobs.length === 0 ? (
        <p className="info-text">You haven't posted any jobs yet.</p>
      ) : (
        <div className="card-grid">
          {jobs.map((job) => (
            <div key={job.id} className="job-card">
              <h3>{job.title}</h3>
              <p className="job-meta">{job.location} &middot; Up to ${job.maxSalary?.toLocaleString()}</p>
              <p className="job-desc">{job.description}</p>
              <div className="job-tags">
                {job.requiredSkills?.split(',').map((s) => (
                  <span key={s.trim()} className="tag">{s.trim()}</span>
                ))}
              </div>
              <p className="job-exp">Min Experience: {job.minExperience} yrs</p>
              <Link to={`/hr/jobs/${job.id}/applications`} className="btn btn-primary">
                View Applications
              </Link>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
