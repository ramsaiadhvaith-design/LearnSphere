import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import RoleProtectedRoute from './components/RoleProtectedRoute';

// Pages
import HomePage from './pages/HomePage';
import LoginPage from './pages/auth/LoginPage';
import RegisterPage from './pages/auth/RegisterPage';

// Student Pages
import StudentDashboard from './pages/student/StudentDashboard';
import ResourceLibrary from './pages/student/ResourceLibrary';
import CareerRoleSelect from './pages/student/CareerRoleSelect';
import SkillAssessment from './pages/student/SkillAssessment';
import AssessmentResults from './pages/student/AssessmentResults';
import LearningRoadmap from './pages/student/LearningRoadmap';

// Faculty Pages
import FacultyDashboard from './pages/faculty/FacultyDashboard';

// Admin Pages
import AdminDashboard from './pages/admin/AdminDashboard';
import UserManagement from './pages/admin/UserManagement';
import CareerRoleManagement from './pages/admin/CareerRoleManagement';

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <div className="min-h-screen flex flex-col bg-slate-50 text-slate-900">
          <Navbar />

          <main className="flex-1">
            <Routes>
              {/* Public Routes */}
              <Route path="/" element={<HomePage />} />
              <Route path="/login" element={<LoginPage />} />
              <Route path="/register" element={<RegisterPage />} />

              {/* Shared Authenticated Routes */}
              <Route
                path="/resources"
                element={
                  <RoleProtectedRoute allowedRoles={['student', 'faculty', 'admin']}>
                    <ResourceLibrary />
                  </RoleProtectedRoute>
                }
              />
              <Route
                path="/career-roles"
                element={
                  <RoleProtectedRoute allowedRoles={['student', 'faculty', 'admin']}>
                    <CareerRoleSelect />
                  </RoleProtectedRoute>
                }
              />

              {/* Student Portal Routes */}
              <Route
                path="/student"
                element={
                  <RoleProtectedRoute allowedRoles={['student']}>
                    <StudentDashboard />
                  </RoleProtectedRoute>
                }
              />
              <Route
                path="/assessment"
                element={
                  <RoleProtectedRoute allowedRoles={['student']}>
                    <SkillAssessment />
                  </RoleProtectedRoute>
                }
              />
              <Route
                path="/assessment/results/:id"
                element={
                  <RoleProtectedRoute allowedRoles={['student', 'admin']}>
                    <AssessmentResults />
                  </RoleProtectedRoute>
                }
              />
              <Route
                path="/roadmap"
                element={
                  <RoleProtectedRoute allowedRoles={['student']}>
                    <LearningRoadmap />
                  </RoleProtectedRoute>
                }
              />

              {/* Faculty Portal Routes */}
              <Route
                path="/faculty"
                element={
                  <RoleProtectedRoute allowedRoles={['faculty']}>
                    <FacultyDashboard />
                  </RoleProtectedRoute>
                }
              />

              {/* Admin Portal Routes */}
              <Route
                path="/admin"
                element={
                  <RoleProtectedRoute allowedRoles={['admin']}>
                    <AdminDashboard />
                  </RoleProtectedRoute>
                }
              />
              <Route
                path="/admin/users"
                element={
                  <RoleProtectedRoute allowedRoles={['admin']}>
                    <UserManagement />
                  </RoleProtectedRoute>
                }
              />
              <Route
                path="/admin/roles"
                element={
                  <RoleProtectedRoute allowedRoles={['admin']}>
                    <CareerRoleManagement />
                  </RoleProtectedRoute>
                }
              />

              {/* Fallback */}
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </main>

          <Footer />
        </div>
      </BrowserRouter>
    </AuthProvider>
  );
}
