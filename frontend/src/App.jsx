import { Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import ProtectedRoute from './components/ProtectedRoute';
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import CandidateDashboard from './pages/candidate/CandidateDashboard';
import Profile from './pages/candidate/Profile';
import JobSearch from './pages/candidate/JobSearch';
import AppliedJobs from './pages/candidate/AppliedJobs';
import HrDashboard from './pages/hr/HrDashboard';
import PostJob from './pages/hr/PostJob';
import MyJobs from './pages/hr/MyJobs';
import JobApplications from './pages/hr/JobApplications';
import SearchCandidates from './pages/hr/SearchCandidates';

export default function App() {
  return (
    <>
      <Navbar />
      <main className="main-content">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />

          {/* Candidate routes */}
          <Route path="/candidate/dashboard" element={
            <ProtectedRoute role="CANDIDATE"><CandidateDashboard /></ProtectedRoute>
          } />
          <Route path="/candidate/profile" element={
            <ProtectedRoute role="CANDIDATE"><Profile /></ProtectedRoute>
          } />
          <Route path="/candidate/jobs" element={
            <ProtectedRoute role="CANDIDATE"><JobSearch /></ProtectedRoute>
          } />
          <Route path="/candidate/applications" element={
            <ProtectedRoute role="CANDIDATE"><AppliedJobs /></ProtectedRoute>
          } />

          {/* HR Admin routes */}
          <Route path="/hr/dashboard" element={
            <ProtectedRoute role="HR_ADMIN"><HrDashboard /></ProtectedRoute>
          } />
          <Route path="/hr/post-job" element={
            <ProtectedRoute role="HR_ADMIN"><PostJob /></ProtectedRoute>
          } />
          <Route path="/hr/my-jobs" element={
            <ProtectedRoute role="HR_ADMIN"><MyJobs /></ProtectedRoute>
          } />
          <Route path="/hr/jobs/:jobId/applications" element={
            <ProtectedRoute role="HR_ADMIN"><JobApplications /></ProtectedRoute>
          } />
          <Route path="/hr/search-candidates" element={
            <ProtectedRoute role="HR_ADMIN"><SearchCandidates /></ProtectedRoute>
          } />
        </Routes>
      </main>
    </>
  );
}
