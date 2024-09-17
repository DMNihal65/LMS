import React from 'react';
import Navbar from './Navbar';
import { Typography } from 'antd';

const { Title, Paragraph } = Typography;

const AdminDashboard = () => {
  return (
    <div className="min-h-screen bg-gray-100">
      <Navbar role="admin" />
      <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <Title level={2}>Admin Dashboard</Title>
        <Paragraph>
          Welcome to the admin dashboard! Here you can manage users, licenses, and more.
        </Paragraph>
        {/* Add more admin-specific content here */}
      </div>
    </div>
  );
};

export default AdminDashboard;