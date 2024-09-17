import React from 'react';
import { Typography, Card, Row, Col, Statistic } from 'antd';
import { UserOutlined, ShoppingOutlined, KeyOutlined, DollarOutlined } from '@ant-design/icons';
import Layout from './Layout';

const { Title } = Typography;

const AdminDashboard = () => {
  // In a real application, you would fetch these statistics from your backend
  const stats = {
    users: 150,
    products: 25,
    licenses: 200,
    revenue: 15000
  };

  return (
    <Layout>
      <Title level={2}>Admin Dashboard</Title>
      <Row gutter={16}>
        <Col span={6}>
          <Card>
            <Statistic
              title="Total Users"
              value={stats.users}
              prefix={<UserOutlined />}
            />
          </Card>
        </Col>
        <Col span={6}>
          <Card>
            <Statistic
              title="Total Products"
              value={stats.products}
              prefix={<ShoppingOutlined />}
            />
          </Card>
        </Col>
        <Col span={6}>
          <Card>
            <Statistic
              title="Active Licenses"
              value={stats.licenses}
              prefix={<KeyOutlined />}
            />
          </Card>
        </Col>
        <Col span={6}>
          <Card>
            <Statistic
              title="Total Revenue"
              value={stats.revenue}
              prefix={<DollarOutlined />}
              precision={2}
            />
          </Card>
        </Col>
      </Row>
    </Layout>
  );
};

export default AdminDashboard;