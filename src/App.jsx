import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from './context/AuthContext';
import { Navbar } from './components/common/Navbar';
import { Footer } from './components/common/Footer';
import { ProtectedRoute } from './components/common/ProtectedRoute';

// Pages
import { LoginPage } from './pages/auth/LoginPage';
import { RegisterPage } from './pages/auth/RegisterPage';
import { StudentDashboard } from './pages/student/StudentDashboard';
import { MyReportedItems } from './pages/student/MyReportedItems';
import { MyClaimsPage } from './pages/student/MyClaimsPage';
import { NotificationsPage } from './pages/student/NotificationsPage';
import { AdminDashboard } from './pages/admin/AdminDashboard';
import { ManageClaimsPage } from './pages/admin/ManageClaimsPage';
import { ManageItemsPage } from './pages/admin/ManageItemsPage';
import { ManageUsersPage } from './pages/admin/ManageUsersPage';
import { NotFoundPage } from './pages/NotFoundPage';

export const App = () => {
  const { isAuthenticated, isAdmin } = useAuth();

  return (
    <div className="app-container">
      <Navbar />
      <main className="main-content">
        <Routes>
          {/* Default Route: Redirects based on auth state */}
          <Route
            path="/"
            element={
              isAuthenticated ? (
                <Navigate to={isAdmin ? '/admin' : '/student'} replace />
              ) : (
                <Navigate to="/login" replace />
              )
            }
          />

          {/* Public Auth Routes */}
          <Route
            path="/login"
            element={
              isAuthenticated ? (
                <Navigate to={isAdmin ? '/admin' : '/student'} replace />
              ) : (
                <LoginPage />
              )
            }
          />
          <Route
            path="/register"
            element={
              isAuthenticated ? (
                <Navigate to="/student" replace />
              ) : (
                <RegisterPage />
              )
            }
          />

          {/* Student Protected Routes */}
          <Route
            path="/student"
            element={
              <ProtectedRoute>
                <StudentDashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/student/my-items"
            element={
              <ProtectedRoute>
                <MyReportedItems />
              </ProtectedRoute>
            }
          />
          <Route
            path="/student/claims"
            element={
              <ProtectedRoute>
                <MyClaimsPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/student/notifications"
            element={
              <ProtectedRoute>
                <NotificationsPage />
              </ProtectedRoute>
            }
          />

          {/* Admin Protected Routes */}
          <Route
            path="/admin"
            element={
              <ProtectedRoute requiredRole="ROLE_ADMIN">
                <AdminDashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/claims"
            element={
              <ProtectedRoute requiredRole="ROLE_ADMIN">
                <ManageClaimsPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/items"
            element={
              <ProtectedRoute requiredRole="ROLE_ADMIN">
                <ManageItemsPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/users"
            element={
              <ProtectedRoute requiredRole="ROLE_ADMIN">
                <ManageUsersPage />
              </ProtectedRoute>
            }
          />

          {/* Fallback 404 Route */}
          <Route path="*" element={<NotFoundPage />} />
        </Routes>
      </main>
      <Footer />
    </div>
  );
};

export default App;
