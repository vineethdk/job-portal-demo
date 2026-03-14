import { useEffect, useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { getCandidateProfile, updateCandidateProfile, uploadResume, deleteResume, getResumeDownloadUrl } from '../../api/api';

export default function Profile() {
  const { user } = useAuth();
  const [form, setForm] = useState({
    skills: '',
    experienceYears: '',
    expectedSalary: '',
    location: '',
    resumeHeadline: '',
  });
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [resumeFile, setResumeFile] = useState(null);
  const [hasResume, setHasResume] = useState(false);
  const [resumeMsg, setResumeMsg] = useState('');

  useEffect(() => {
    getCandidateProfile(user.id)
      .then((res) => {
        const p = res.data;
        setForm({
          skills: p.skills || '',
          experienceYears: p.experienceYears ?? '',
          expectedSalary: p.expectedSalary ?? '',
          location: p.location || '',
          resumeHeadline: p.resumeHeadline || '',
        });
        setHasResume(p.hasResume || false);
      })
      .catch(() => {
        // Profile not created yet — that's fine
      });
  }, [user.id]);

  const handleChange = (e) => {
    setErrors((prev) => ({ ...prev, [e.target.name]: '' }));
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const validate = () => {
    const errs = {};
    if (!form.resumeHeadline.trim()) errs.resumeHeadline = 'Resume Headline is required.';
    else if (form.resumeHeadline.trim().length < 5) errs.resumeHeadline = 'Resume Headline must be at least 5 characters.';
    else if (form.resumeHeadline.trim().length > 200) errs.resumeHeadline = 'Resume Headline must be at most 200 characters.';
    if (!form.skills.trim()) errs.skills = 'Skills are required.';
    else if (form.skills.trim().length < 2) errs.skills = 'Skills must be at least 2 characters.';
    else if (form.skills.trim().length > 500) errs.skills = 'Skills must be at most 500 characters.';
    else if (/^\d+$/.test(form.skills.trim())) errs.skills = 'Skills cannot be numeric values.';
    else if (!/[a-zA-Z]/.test(form.skills)) errs.skills = 'Skills must contain letters.';
    if (form.experienceYears === '' || form.experienceYears === null || form.experienceYears === undefined) errs.experienceYears = 'Experience is required.';
    else if (Number(form.experienceYears) < 0 || Number(form.experienceYears) > 50) errs.experienceYears = 'Experience must be between 0 and 50 years.';
    if (form.expectedSalary === '' || form.expectedSalary === null || form.expectedSalary === undefined) errs.expectedSalary = 'Expected Salary is required.';
    else if (Number(form.expectedSalary) <= 0) errs.expectedSalary = 'Expected Salary must be positive.';
    else if (Number(form.expectedSalary) > 10000000) errs.expectedSalary = 'Expected Salary must be at most 10,000,000.';
    if (!form.location.trim()) errs.location = 'Location is required.';
    else if (form.location.trim().length < 2) errs.location = 'Location must be at least 2 characters.';
    else if (form.location.trim().length > 100) errs.location = 'Location must be at most 100 characters.';
    else if (/^\d+$/.test(form.location.trim())) errs.location = 'Location cannot be numeric values.';
    else if (!/[a-zA-Z]/.test(form.location)) errs.location = 'Location must contain letters.';
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage('');
    setError('');
    if (!validate()) return;
    setLoading(true);
    try {
      await updateCandidateProfile(user.id, {
        ...form,
        experienceYears: Number(form.experienceYears),
        expectedSalary: Number(form.expectedSalary),
      });
      setMessage('Profile saved successfully!');
    } catch (err) {
      setError(err.response?.data?.message || err.response?.data || 'Failed to save profile.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container">
      <div className="page-header">
        <h1>My Profile</h1>
        <p className="subtitle">Keep your profile updated to attract the best opportunities</p>
      </div>
      <div className="form-card" style={{ maxWidth: 600 }}>
        {message && <div className="alert alert-success">{message}</div>}
        {error && <div className="alert alert-error">{error}</div>}
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="resumeHeadline">Resume Headline</label>
            <input
              id="resumeHeadline"
              name="resumeHeadline"
              type="text"
              value={form.resumeHeadline}
              onChange={handleChange}
              placeholder="e.g. Senior React Developer"
              required
            />
            {errors.resumeHeadline && <span style={{ color: '#e74c3c', fontSize: '0.85rem', marginTop: '0.25rem' }}>{errors.resumeHeadline}</span>}
          </div>
          <div className="form-group">
            <label htmlFor="skills">Skills (comma-separated)</label>
            <input
              id="skills"
              name="skills"
              type="text"
              value={form.skills}
              onChange={handleChange}
              placeholder="e.g. Java, React, SQL"
              required
            />
            {errors.skills && <span style={{ color: '#e74c3c', fontSize: '0.85rem', marginTop: '0.25rem' }}>{errors.skills}</span>}
          </div>
          <div className="form-group">
            <label htmlFor="experienceYears">Experience (years)</label>
            <input
              id="experienceYears"
              name="experienceYears"
              type="number"
              min="0"
              value={form.experienceYears}
              onChange={handleChange}
              required
            />
            {errors.experienceYears && <span style={{ color: '#e74c3c', fontSize: '0.85rem', marginTop: '0.25rem' }}>{errors.experienceYears}</span>}
          </div>
          <div className="form-group">
            <label htmlFor="expectedSalary">Expected Salary</label>
            <input
              id="expectedSalary"
              name="expectedSalary"
              type="number"
              min="0"
              value={form.expectedSalary}
              onChange={handleChange}
              required
            />
            {errors.expectedSalary && <span style={{ color: '#e74c3c', fontSize: '0.85rem', marginTop: '0.25rem' }}>{errors.expectedSalary}</span>}
          </div>
          <div className="form-group">
            <label htmlFor="location">Location</label>
            <input
              id="location"
              name="location"
              type="text"
              value={form.location}
              onChange={handleChange}
              placeholder="e.g. New York"
              required
            />
            {errors.location && <span style={{ color: '#e74c3c', fontSize: '0.85rem', marginTop: '0.25rem' }}>{errors.location}</span>}
          </div>
          <button type="submit" className="btn btn-primary btn-block" disabled={loading}>
            {loading ? 'Saving...' : 'Save Profile'}
          </button>
        </form>

        {/* Resume Section */}
        <div className="resume-section" style={{ marginTop: '1.5rem', paddingTop: '1.5rem', borderTop: '1px solid #ddd' }}>
          <h3>Resume (PDF)</h3>
          {resumeMsg && <div className="alert alert-success">{resumeMsg}</div>}
          <div className="form-group">
            <input
              type="file"
              accept=".pdf,application/pdf"
              onChange={(e) => setResumeFile(e.target.files[0] || null)}
            />
          </div>
          <button
            type="button"
            className="btn btn-primary"
            disabled={!resumeFile}
            onClick={async () => {
              setResumeMsg('');
              try {
                await uploadResume(user.id, resumeFile);
                setHasResume(true);
                setResumeMsg('Resume uploaded successfully!');
              } catch (err) {
                setResumeMsg(err.response?.data?.message || err.response?.data || 'Failed to upload resume.');
              }
            }}
          >
            Upload Resume
          </button>
          {hasResume && (
            <div style={{ marginTop: '0.75rem', display: 'flex', gap: '0.75rem', alignItems: 'center' }}>
              <a
                href={getResumeDownloadUrl(user.id)}
                target="_blank"
                rel="noopener noreferrer"
                className="btn btn-secondary"
              >
                View Resume
              </a>
              <button
                type="button"
                className="btn btn-secondary"
                style={{ background: '#e74c3c', color: '#fff' }}
                onClick={async () => {
                  setResumeMsg('');
                  try {
                    await deleteResume(user.id);
                    setHasResume(false);
                    setResumeMsg('Resume deleted.');
                  } catch (err) {
                    setResumeMsg(err.response?.data?.message || err.response?.data || 'Failed to delete resume.');
                  }
                }}
              >
                Delete Resume
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
