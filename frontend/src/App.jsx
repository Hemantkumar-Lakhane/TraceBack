import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { ThemeProvider } from './context/ThemeContext';
import { AuthProvider } from './context/AuthContext';
import { ToastProvider } from './context/ToastContext';
import ToastContainer from './components/ToastContainer';
import ProtectedRoute from './components/ProtectedRoute';
import AppLayout from './components/Layout/AppLayout';

// Public / Auth Pages
import Landing from './pages/Landing';
import Login from './pages/Login';
import Register from './pages/Register';

// Student Pages
import StudentDashboard from './pages/StudentDashboard';
import ReportLost from './pages/ReportLost';
import ReportFound from './pages/ReportFound';
import BrowseReports from './pages/BrowseReports';
import ReportDetails from './pages/ReportDetails';
import Matches from './pages/Matches';
import MatchDetails from './pages/MatchDetails';
import Chat from './pages/Chat';
import ClaimForm from './pages/ClaimForm';
import ClaimDetails from './pages/ClaimDetails';
import MyClaims from './pages/MyClaims';
import Notifications from './pages/Notifications';
import Profile from './pages/Profile';

// Security Pages
import SecurityDashboard from './pages/SecurityDashboard';
import SecurityPendingClaims from './pages/SecurityPendingClaims';
import SecurityClaimVerification from './pages/SecurityClaimVerification';
import SecurityInventory from './pages/SecurityInventory';

// Admin Pages
import AdminDashboard from './pages/AdminDashboard';
import AdminUserManagement from './pages/AdminUserManagement';
import AdminModeration from './pages/AdminModeration';
import AdminAnalytics from './pages/AdminAnalytics';
import AdminConfig from './pages/AdminConfig';

function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <ToastProvider>
          <Router>
            <ToastContainer />
            <Routes>
            {/* Public Pages */}
            <Route path="/" element={<Landing />} />
            <Route path="/landing" element={<Landing />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />

            {/* Authenticated Master Layout */}
            <Route element={<AppLayout />}>
              {/* Common Browsing & Reporting (Accessible to all authenticated users) */}
              <Route path="/browse" element={<BrowseReports />} />
              <Route path="/reports/:type/:id" element={<ReportDetails />} />
              <Route path="/report/lost" element={<ReportLost />} />
              <Route path="/report/found" element={<ReportFound />} />
              <Route path="/notifications" element={<Notifications />} />
              <Route path="/profile" element={<Profile />} />

              {/* Student Protected Routes */}
              <Route element={<ProtectedRoute allowedRoles={['STUDENT', 'ADMIN']} />}>
                <Route path="/dashboard" element={<StudentDashboard />} />
                <Route path="/matches" element={<Matches />} />
                <Route path="/matches/:id" element={<MatchDetails />} />
                <Route path="/chat" element={<Chat />} />
                <Route path="/chat/:id" element={<Chat />} />
                <Route path="/claims" element={<MyClaims />} />
                <Route path="/claims/new/:matchId" element={<ClaimForm />} />
                <Route path="/claims/:id" element={<ClaimDetails />} />
              </Route>

              {/* Security Protected Routes */}
              <Route element={<ProtectedRoute allowedRoles={['SECURITY', 'ADMIN']} />}>
                <Route path="/security" element={<SecurityDashboard />} />
                <Route path="/security/claims" element={<SecurityPendingClaims />} />
                <Route path="/security/claims/:id" element={<SecurityClaimVerification />} />
                <Route path="/security/inventory" element={<SecurityInventory />} />
                <Route path="/security/report/found" element={<ReportFound />} />
              </Route>

              {/* Admin Protected Routes */}
              <Route element={<ProtectedRoute allowedRoles={['ADMIN']} />}>
                <Route path="/admin" element={<AdminDashboard />} />
                <Route path="/admin/users" element={<AdminUserManagement />} />
                <Route path="/admin/moderation" element={<AdminModeration />} />
                <Route path="/admin/analytics" element={<AdminAnalytics />} />
                <Route path="/admin/config" element={<AdminConfig />} />
              </Route>
            </Route>

            {/* Fallback */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </Router>
      </ToastProvider>
    </AuthProvider>
  </ThemeProvider>
);
}

export default App;
