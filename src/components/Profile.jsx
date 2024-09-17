import React from 'react';
import { Card, Avatar } from 'antd';
import { UserOutlined } from '@ant-design/icons';

const Profile = () => {
  const user = JSON.parse(localStorage.getItem('user'));

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col items-center pt-16">
      <Card className="w-96">
        <div className="flex flex-col items-center">
          <Avatar size={64} icon={<UserOutlined />} className="mb-4" />
          <h2 className="text-2xl font-bold mb-2">{user.name}</h2>
          <p className="text-gray-500 mb-2">{user.email}</p>
          <p className="text-gray-500 capitalize">{user.role}</p>
        </div>
      </Card>
    </div>
  );
};

export default Profile;