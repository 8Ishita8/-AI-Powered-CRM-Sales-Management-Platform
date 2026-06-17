import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import ProtectedRoute from './components/layout/ProtectedRoute';
import Layout from './components/layout/Layout';

// Feature Views
import LoginView from './features/auth/LoginView';
import Dashboard from './features/dashboard/Dashboard';
import LeadsList from './features/leads/LeadsList';
import PipelineBoard from './features/pipeline/PipelineBoard';
import FollowupsCalendar from './features/followups/FollowupsCalendar';
import CampaignsView from './features/campaigns/CampaignsView';
import TeamView from './features/team-management/TeamView';
import AnalyticsView from './features/analytics/AnalyticsView';

export const App: React.FC = () => {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          {/* Public Auth Routes */}
          <Route path="/login" element={<LoginView />} />

          {/* Protected Main Panel Routes */}
          <Route element={<ProtectedRoute />}>
            <Route element={<Layout />}>
              {/* Default redirect to Dashboard */}
              <Route path="/" element={<Navigate to="/dashboard" replace />} />
              
              {/* Common Routes (Admin, Manager, Executive) */}
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/leads" element={<LeadsList />} />
              <Route path="/pipeline" element={<PipelineBoard />} />
              <Route path="/followups" element={<FollowupsCalendar />} />

              {/* Manager & Admin Routes */}
              <Route element={<ProtectedRoute allowedRoles={['admin', 'manager']} />}>
                <Route path="/campaigns" element={<CampaignsView />} />
                <Route path="/team-management" element={<TeamView />} />
              </Route>

              {/* Admin Only Routes */}
              <Route element={<ProtectedRoute allowedRoles={['admin']} />}>
                <Route path="/analytics" element={<AnalyticsView />} />
              </Route>
            </Route>
          </Route>

          {/* Catch-all route -> redirect to index */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
};

export default App;
