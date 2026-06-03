import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import ProtectedRoute from './ProtectedRoute';
import Login from '../pages/Login';
import Dashboard from '../pages/Dashboard';
import TestForm from '../pages/TestForm';
import Questions from '../pages/Questions';
import PreviewPublish from '../pages/PreviewPublish';
import Navbar from '../components/Navbar';
import Sidebar from '../components/Sidebar';
import { useAuthStore } from '../store/authStore';

// Main layout wrapper for protected views
const Layout: React.FC = () => {
  const logout = useAuthStore((state) => state.logout);
  const user = useAuthStore((state) => state.user);
  const isMock = useAuthStore((state) => state.isMockMode);

  return (
    <div className="flex h-screen overflow-hidden bg-slate-50">
      {/* Sidebar - fixed navigation */}
      <Sidebar />

      {/* Main content container */}
      <div className="flex flex-col flex-1 min-w-0 overflow-hidden">
        {/* Navbar - top header */}
        <Navbar user={user} logout={logout} isMock={isMock} />

        {/* Scrollable page content */}
        <main className="flex-1 overflow-y-auto p-4 md:p-6 lg:p-8">
          <Routes>
            <Route path="dashboard" element={<Dashboard />} />
            <Route path="tests/create" element={<TestForm />} />
            <Route path="tests/edit/:id" element={<TestForm />} />
            <Route path="tests/:id/questions" element={<Questions />} />
            <Route path="tests/:id/preview" element={<PreviewPublish />} />
            <Route path="*" element={<Navigate to="dashboard" replace />} />
          </Routes>
        </main>
      </div>
    </div>
  );
};

const AppRoutes: React.FC = () => {
  return (
    <Routes>
      {/* Public Route */}
      <Route path="/login" element={<Login />} />

      {/* Protected Routes */}
      <Route path="/" element={<ProtectedRoute />}>
        {/* Render Layout with nested routing */}
        <Route path="*" element={<Layout />} />
      </Route>

      {/* Catch-all */}
      <Route path="*" element={<Navigate to="/login" replace />} />
    </Routes>
  );
};

export default AppRoutes;
