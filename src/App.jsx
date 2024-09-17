import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { ConfigProvider } from 'antd';
import LandingPage from './components/LandingPage';
import SignIn from './components/SignIn';
import SignUp from './components/SignUp';
import AdminDashboard from './components/AdminDashboard';
import AdminUsers from './components/AdminUsers';
import AdminProducts from './components/AdminProducts';
import AdminLicenses from './components/AdminLicenses';
import UserDashboard from './components/UserDashboard';
import UserProducts from './components/UserProducts';
import UserLicenses from './components/UserLicenses';
import Profile from './components/Profile';
import ProtectedRoute from './components/ProtectedRoute';

function App() {
  return (
    <ConfigProvider>
      <Router>
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/signin" element={<SignIn />} />
          <Route path="/signup" element={<SignUp />} />
          <Route path="/admin/dashboard" element={<ProtectedRoute allowedRoles={['admin']}><AdminDashboard /></ProtectedRoute>} />
          <Route path="/admin/users" element={<ProtectedRoute allowedRoles={['admin']}><AdminUsers /></ProtectedRoute>} />
          <Route path="/admin/products" element={<ProtectedRoute allowedRoles={['admin']}><AdminProducts /></ProtectedRoute>} />
          <Route path="/admin/licenses" element={<ProtectedRoute allowedRoles={['admin']}><AdminLicenses /></ProtectedRoute>} />
          <Route path="/user/dashboard" element={<ProtectedRoute allowedRoles={['user', 'admin']}><UserDashboard /></ProtectedRoute>} />
          <Route path="/user/products" element={<ProtectedRoute allowedRoles={['user', 'admin']}><UserProducts /></ProtectedRoute>} />
          <Route path="/user/licenses" element={<ProtectedRoute allowedRoles={['user', 'admin']}><UserLicenses /></ProtectedRoute>} />
          <Route path="/profile" element={<ProtectedRoute allowedRoles={['user', 'admin']}><Profile /></ProtectedRoute>} />
        </Routes>
      </Router>
    </ConfigProvider>
  );
}

export default App;
