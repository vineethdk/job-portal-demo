import { useEffect, useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { getMyApplications, withdrawApplication } from '../../api/api';

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
  const [withdrawingId, setWithdrawingId] = useState(null);

  useEffect(() => {
    getMyApplications(user.id)
      .then((res) => setApplications(res.data))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [user.id]);

  const handleWithdraw = async (appId) => {
    if (!window.confirm('Are you sure you want to withdraw this application?')) return;
    setWithdrawingId(appId);
    try {
      await withdrawApplication(appId, user.id);
      setApplications((prev) => prev.filter((a) => a.id !== appId));
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to withdraw application.');
    } finally {
      setWithdrawingId(null);
    }
  };

  if (loading) return <div className="container"><p>Loading...</p></div>;

  return (
    <div className="container">
      <div className="page-header">
        <h1>My Applications</h1>
        <p className="subtitle">Track the status of your applications</p>
        {applications.length > 0 && (
          <p className="record-count">{applications.length} application{applications.length !== 1 ? 's' : ''} total</p>
        )}
      </div>
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
                <th>Action</th>
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
                  <td>
                    {app.status === 'APPLIED' ? (
                      <button
                        className="btn btn-outline"
                        style={{ padding: '0.3rem 0.8rem', fontSize: '0.85rem' }}
                        disabled={withdrawingId === app.id}
                        onClick={() => handleWithdraw(app.id)}
                      >
                        {withdrawingId === app.id ? 'Withdrawing...' : 'Withdraw'}
                      </button>
                    ) : (
                      <span className="text-muted">—</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
