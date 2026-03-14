import { useEffect, useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { getMyApplications } from '../../api/api';

function statusClass(status) {
  switch (status) {
    case 'APPLIED': return 'badge badge-blue';
    case 'SHORTLISTED': return 'badge badge-orange';
    case 'REJECTED': return 'badge badge-red';
    case 'HIRED': return 'badge badge-green';
    default: return 'badge';
  }
}

export default function AppliedJobs() {
  const { user } = useAuth();
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getMyApplications(user.id)
      .then((res) => setApplications(res.data))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [user.id]);

  if (loading) return <div className="container"><p>Loading...</p></div>;

  return (
    <div className="container">
      <h1>My Applications</h1>
      {applications.length === 0 ? (
        <p className="info-text">You haven't applied to any jobs yet.</p>
      ) : (
        <div className="table-wrapper">
          <table className="data-table">
            <thead>
              <tr>
                <th>Job Title</th>
                <th>Location</th>
                <th>Max Salary</th>
                <th>Applied Date</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {applications.map((app) => (
                <tr key={app.id}>
                  <td>{app.job?.title || 'N/A'}</td>
                  <td>{app.job?.location || 'N/A'}</td>
                  <td>{app.job?.maxSalary ? `$${app.job.maxSalary.toLocaleString()}` : 'N/A'}</td>
                  <td>{app.appliedDate ? new Date(app.appliedDate).toLocaleDateString() : 'N/A'}</td>
                  <td><span className={statusClass(app.status)}>{app.status}</span></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
