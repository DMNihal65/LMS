import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Menu, Dropdown, Button } from 'antd';
import { HomeOutlined, UserOutlined, LogoutOutlined } from '@ant-design/icons';

const Navbar = ({ role }) => {
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem('user'));

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/signin');
  };

  const menu = (
    <Menu>
      <Menu.Item key="profile" onClick={() => navigate('/profile')}>
        <UserOutlined /> Profile
      </Menu.Item>
      <Menu.Item key="logout" onClick={handleLogout}>
        <LogoutOutlined /> Log out
      </Menu.Item>
    </Menu>
  );

  return (
    <nav className="bg-white shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex">
            <Link to={role === 'admin' ? '/admin/dashboard' : '/user/dashboard'} className="flex-shrink-0 flex items-center">
              <HomeOutlined className="h-6 w-6 text-indigo-600" />
              <span className="ml-2 text-xl font-semibold">SLM</span>
            </Link>
          </div>
          <div className="flex items-center">
            <Dropdown overlay={menu} placement="bottomRight" arrow>
              <Button icon={<UserOutlined />} shape="circle" />
            </Dropdown>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;