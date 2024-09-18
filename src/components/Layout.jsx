import React from 'react';
import { Layout as AntLayout, Menu } from 'antd';
import { Link, useLocation } from 'react-router-dom';
import {
  DashboardOutlined,
  UserOutlined,
  ShoppingOutlined,
  KeyOutlined,
  BarChartOutlined,
  LogoutOutlined,
  ShoppingCartOutlined
} from '@ant-design/icons';

const { Sider, Content } = AntLayout;

const Layout = ({ children }) => {
  const location = useLocation();
  const user = JSON.parse(localStorage.getItem('user'));

  const adminMenuItems = [
    { key: '/admin/dashboard', icon: <DashboardOutlined />, label: 'Dashboard' },
    { key: '/admin/users', icon: <UserOutlined />, label: 'Users' },
    { key: '/admin/products', icon: <ShoppingOutlined />, label: 'Products' },
    { key: '/admin/licenses', icon: <KeyOutlined />, label: 'Licenses' },
    { key: '/admin/purchases', icon: <ShoppingCartOutlined />, label: 'Purchases' },
    { key: '/admin/analytics', icon: <BarChartOutlined />, label: 'Analytics' },
  ];

  const userMenuItems = [
    { key: '/user/dashboard', icon: <DashboardOutlined />, label: 'Dashboard' },
    { key: '/user/products', icon: <ShoppingOutlined />, label: 'Products' },
    { key: '/user/licenses', icon: <KeyOutlined />, label: 'My Licenses' },
  ];

  const menuItems = user.role === 'admin' ? adminMenuItems : userMenuItems;

  return (
    <AntLayout className="min-h-screen">
      <Sider theme="light" className="shadow-md">
        <div className="logo p-4">
          <h2 className="text-xl font-bold text-blue-600">SLM</h2>
        </div>
        <Menu
          mode="inline"
          selectedKeys={[location.pathname]}
          items={menuItems.map(item => ({
            ...item,
            label: <Link to={item.key}>{item.label}</Link>
          }))}
        />
        <Menu
          mode="inline"
          selectable={false}
          items={[
            {
              key: 'logout',
              icon: <LogoutOutlined />,
              label: 'Logout',
              onClick: () => {
                localStorage.removeItem('token');
                localStorage.removeItem('user');
                window.location.href = '/signin';
              },
            },
          ]}
          className="absolute bottom-0 w-full"
        />
      </Sider>
      <AntLayout>
        <Content className="p-6 bg-gray-100">
          {children}
        </Content>
      </AntLayout>
    </AntLayout>
  );
}

export default Layout;