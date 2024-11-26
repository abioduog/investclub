import React, { useState } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import RoleSelector from './components/RoleSelector';
import HomePage from './components/HomePage';
import { ToastProvider } from './contexts/ToastContext';
import ProtectedRoute from './components/ProtectedRoute';

// Update admin imports
import AdminDashboard from './components/admin/AdminDashboard';
import AdminMembersList from './components/admin/AdminMembersList';
import AdminInvestments from './components/admin/AdminInvestments';
import AdminContributions from './components/admin/AdminContributions';
import AdminReports from './components/admin/AdminReports';
import AdminProfile from './components/admin/AdminProfile';

// Update member imports
import MemberDashboard from './components/member/MemberDashboard';
import MemberContributions from './components/member/MemberContributions';
import MemberInvestments from './components/member/MemberInvestments';
import MemberProfile from './components/member/MemberProfile';
import MemberReports from './components/member/MemberReports';
import MemberSettings from './components/member/MemberSettings';
import MemberSupport from './components/member/MemberSupport';

const App: React.FC = () => {
  const [userRole, setUserRole] = useState<'admin' | 'member' | null>(null);

  // Helper function to render protected routes
  const renderProtectedRoute = (role: 'admin' | 'member', Component: React.ComponentType) => {
    if (!userRole) return <Navigate to="/login" replace />;
    if (userRole !== role) return <Navigate to="/dashboard" replace />;
    return <Component />;
  };

  return (
    <ToastProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/login" element={<RoleSelector onRoleSelect={setUserRole} />} />
          
          {/* Admin Routes */}
          <Route
            path="/admin/*"
            element={
              <ProtectedRoute allowedRole="admin">
                <Routes>
                  <Route path="dashboard" element={<AdminDashboard />} />
                  <Route path="members" element={<AdminMembersList />} />
                  <Route path="investments" element={<AdminInvestments />} />
                  <Route path="contributions" element={<AdminContributions />} />
                  <Route path="reports" element={<AdminReports />} />
                  <Route path="profile" element={<AdminProfile />} />
                </Routes>
              </ProtectedRoute>
            }
          />

          {/* Member Routes */}
          <Route
            path="/member/*"
            element={
              <ProtectedRoute allowedRole="member">
                <Routes>
                  <Route path="dashboard" element={<MemberDashboard />} />
                  <Route path="contributions" element={<MemberContributions />} />
                  <Route path="investments" element={<MemberInvestments />} />
                  <Route path="reports" element={<MemberReports />} />
                  <Route path="settings" element={<MemberSettings />} />
                  <Route path="support" element={<MemberSupport />} />
                  <Route path="profile" element={<MemberProfile />} />
                </Routes>
              </ProtectedRoute>
            }
          />

          {/* Redirect /dashboard to the appropriate dashboard based on role */}
          <Route 
            path="/dashboard" 
            element={
              <Navigate 
                to={userRole === 'admin' ? '/admin/dashboard' : '/member/dashboard'} 
                replace 
              />
            }
          />
        </Routes>
      </BrowserRouter>
    </ToastProvider>
  );
};

export default App;