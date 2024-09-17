import React from 'react';
import Navbar from './Navbar';
import { Typography } from 'antd';

const { Title, Paragraph } = Typography;

const UserDashboard = () => {
  return (
    <div className="min-h-screen bg-gray-100">
      <Navbar role="user" />
      <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <Title level={2}>User Dashboard</Title>
        <Paragraph>
          Welcome to your dashboard! Here you can view your licenses and manage your account.
        </Paragraph>
        {/* Add more user-specific content here */}
      </div>
    </div>
  );
};

export default UserDashboard;