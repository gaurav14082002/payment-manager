import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import { VoucherProvider } from './context/VoucherContext';
import Login from './pages/Login';
import VoucherIndex from './pages/VoucherIndex';
import VoucherEntry from './pages/VoucherEntry';
import { Toaster } from 'sonner';

const ProtectedRoute = ({ children, adminOnly = false }) => {
  const { user, isAdmin } = useAuth();
  
  if (!user) {
    return <Navigate to="/login" replace />;
  }
  
  if (adminOnly && !isAdmin) {
    return <Navigate to="/" replace />;
  }
  
  return children;
};

const AppContent = () => {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route 
        path="/" 
        element={
          <ProtectedRoute>
            <VoucherIndex />
          </ProtectedRoute>
        } 
      />
      <Route 
        path="/create" 
        element={
          <ProtectedRoute>
            <VoucherEntry />
          </ProtectedRoute>
        } 
      />
      <Route 
        path="/edit/:id" 
        element={
          <ProtectedRoute adminOnly={true}>
            <VoucherEntry />
          </ProtectedRoute>
        } 
      />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
};

function App() {
  return (
    <AuthProvider>
      <VoucherProvider>
        <Router>
          <div className="min-h-screen bg-gray-100">
            <AppContent />
            <Toaster position="top-right" richColors />
          </div>
        </Router>
      </VoucherProvider>
    </AuthProvider>
  );
}

export default App;
