import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { getJobApplications, updateApplicationStatus } from '../../api/api';

const STATUSES = ['APPLIED', 'SHORTLISTED', 'REJECTED', 'HIRED'];

function statusClass(status) {
  switch (status) {
    case 'APPLIED': return 'badge badge-blue';
    case 'SHORTLISTED': return 'badge badge-orange';
    case 'REJECTED': return 'badge badge-red';
    case 'HIRED': return 'badge badge-green';
    default: return 'badge';
  }
}

export default function JobApplications() {
  const { jobId } = useParams();
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [updatingId, setUpdatingId] = useState(null);

  useEffect(() => {
    getJobApplications(jobId)
      .then((res) => setApplications(res.data))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [jobId]);

  const handleStatusChange = async (appId, newStatus) => {
    setUpdatingId(appId);
    try {
      await updateApplicationStatus(appId, newStatus);
      setApplications((prev) =>
        prev.map((a) => (a.id === appId ? { ...a, status: newStatus } : a))
      );
    } catch (err) {
      alert(err.response?.data?.message || err.response?.data || 'Failed to update status.');
    } finally {
      setUpdatingId(null);
    }
  };

  if (loading) return <div className="container"><p>Loading...</p></div>;

  return (
    <div className="container">
      <h1>Applications for Job #{jobId}</h1>
      {applications.length === 0 ? (
        <p className="info-text">No applications received yet.</p>
      ) : (
        <div className="table-wrapper">
          <table className="data-table">
            <thead>
              <tr>
                <th>Candidate</th>
                <th>Skills</th>
                <th>Experience</th>
                <th>Expected Salary</th>
                <th>Location</th>
                <th>Status</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {applications.map((app) => {
                const profile = app.candidate?.candidateProfile;
                return (
                  <tr key={app.id}>
                    <td>{app.candidate?.fullName || 'N/A'}</td>
                    <td>{profile?.skills || 'N/A'}</td>
                    <td>{profile?.experienceYears ?? 'N/A'} yrs</td>
                    <td>{profile?.expectedSalary ? `$${profile.expectedSalary.toLocaleString()}` : 'N/A'}</td>
                    <td>{profile?.location || 'N/A'}</td>
                    <td><span className={statusClass(app.status)}>{app.status}</span></td>
                    <td>
                      <select
                        value={app.status}
                        onChange={(e) => handleStatusChange(app.id, e.target.value)}
                        disabled={updatingId === app.id}
                        className="status-select"
                      >
                        {STATUSES.map((s) => (
                          <option key={s} value={s}>{s}</option>
                        ))}
                      </select>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
