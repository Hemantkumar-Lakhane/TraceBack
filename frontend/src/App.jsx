import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';
import Login from './pages/Login';
import Register from './pages/Register';
import { StudentDashboard, SecurityDashboard, AdminDashboard } from './pages/DashboardShell';
import ReportLost from './pages/ReportLost';
import ReportFound from './pages/ReportFound';
import Matches from './pages/Matches';
import MatchDetails from './pages/MatchDetails';

function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          <Route path="/" element={<Navigate to="/login" replace />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          
          <Route element={<ProtectedRoute allowedRoles={['STUDENT']} />}>
            <Route path="/dashboard" element={<StudentDashboard />} />
            <Route path="/report/lost" element={<ReportLost />} />
            <Route path="/report/found" element={<ReportFound />} />
            <Route path="/matches" element={<Matches />} />
            <Route path="/matches/:id" element={<MatchDetails />} />
          </Route>
          
          <Route element={<ProtectedRoute allowedRoles={['SECURITY']} />}>
            <Route path="/security" element={<SecurityDashboard />} />
            <Route path="/security/report/found" element={<ReportFound />} />
          </Route>
          
          <Route element={<ProtectedRoute allowedRoles={['ADMIN']} />}>
            <Route path="/admin" element={<AdminDashboard />} />
          </Route>
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;
