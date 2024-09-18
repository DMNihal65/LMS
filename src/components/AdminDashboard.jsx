import React, { useState, useEffect } from 'react';
import { Typography, Card, Row, Col, Statistic, Table, Input, Space, Spin, message } from 'antd';
import { UserOutlined, ShoppingOutlined, KeyOutlined, DollarOutlined, SearchOutlined } from '@ant-design/icons';
import Layout from './Layout';
import axios from 'axios';

const { Title } = Typography;
const { Search } = Input;

const AdminDashboard = () => {
  const [stats, setStats] = useState({
    users: 0,
    products: 0,
    licenses: 0,
    revenue: 0
  });
  const [recentActivities, setRecentActivities] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      const [statsResponse, activitiesResponse] = await Promise.all([
        axios.get('http://localhost:5000/api/admin/stats', {
          headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
        }),
        axios.get('http://localhost:5000/api/admin/recent-activities', {
          headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
        })
      ]);
      setStats(statsResponse.data);
      setRecentActivities(activitiesResponse.data);
      setLoading(false);
    } catch (error) {
      message.error('Failed to fetch dashboard data');
      setLoading(false);
    }
  };

  const columns = [
    {
      title: 'Activity',
      dataIndex: 'activity',
      key: 'activity',
    },
    {
      title: 'User',
      dataIndex: 'user',
      key: 'user',
    },
    {
      title: 'Date',
      dataIndex: 'date',
      key: 'date',
      render: (text) => new Date(text).toLocaleString(),
    },
  ];

  return (
    <Layout>
      <Title level={2}>Admin Dashboard</Title>
      <Spin spinning={loading}>
        <Row gutter={[16, 16]}>
          <Col xs={24} sm={12} md={6}>
            <Card hoverable>
              <Statistic
                title="Total Users"
                value={stats.users}
                prefix={<UserOutlined />}
                valueStyle={{ color: '#3f8600' }}
              />
            </Card>
          </Col>
          <Col xs={24} sm={12} md={6}>
            <Card hoverable>
              <Statistic
                title="Total Products"
                value={stats.products}
                prefix={<ShoppingOutlined />}
                valueStyle={{ color: '#cf1322' }}
              />
            </Card>
          </Col>
          <Col xs={24} sm={12} md={6}>
            <Card hoverable>
              <Statistic
                title="Active Licenses"
                value={stats.licenses}
                prefix={<KeyOutlined />}
                valueStyle={{ color: '#1890ff' }}
              />
            </Card>
          </Col>
          <Col xs={24} sm={12} md={6}>
            <Card hoverable>
              <Statistic
                title="Total Revenue"
                value={stats.revenue}
                prefix={<DollarOutlined />}
                precision={2}
                valueStyle={{ color: '#096dd9' }}
              />
            </Card>
          </Col>
        </Row>

        <Title level={3} style={{ marginTop: '2rem' }}>Recent Activities</Title>
        <Search
          placeholder="Search activities"
          onSearch={(value) => console.log(value)}
          style={{ marginBottom: '1rem' }}
        />
        <Table
          columns={columns}
          dataSource={recentActivities}
          rowKey="id"
          pagination={{ pageSize: 5 }}
          scroll={{ x: true }}
        />
      </Spin>
    </Layout>
  );
};

export default AdminDashboard;