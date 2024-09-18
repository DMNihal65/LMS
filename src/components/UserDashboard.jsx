import React, { useState, useEffect } from 'react';
import { Typography, Card, Row, Col, Button, Statistic, Table, Input, Space, Spin, message, Tag } from 'antd';
import { KeyOutlined, DownloadOutlined, SearchOutlined } from '@ant-design/icons';
import Layout from './Layout';
import axios from 'axios';
import UserProducts2 from './UserProducts2';

const { Title } = Typography;
const { Search } = Input;

const UserDashboard = () => {
  const [licenses, setLicenses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchText, setSearchText] = useState('');

  useEffect(() => {
    fetchLicenses();
  }, []);

  const fetchLicenses = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        message.error('You are not authenticated. Please log in.');
        return;
      }

      setLoading(true);
      const response = await axios.get('http://localhost:5000/api/licenses/user', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setLicenses(response.data);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching licenses:', error.response || error);
      message.error('Failed to fetch licenses: ' + (error.response?.data?.message || error.message));
      setLoading(false);
    }
  };

  const handleSearch = (value) => {
    setSearchText(value);
  };

  const filteredLicenses = licenses.filter(license => 
    license.productId.name.toLowerCase().includes(searchText.toLowerCase()) ||
    license.licenseKey.toLowerCase().includes(searchText.toLowerCase())
  );

  const licenseColumns = [
    {
      title: 'Product',
      dataIndex: ['productId', 'name'],
      key: 'product',
      sorter: (a, b) => a.productId.name.localeCompare(b.productId.name),
    },
    {
      title: 'License Key',
      dataIndex: 'licenseKey',
      key: 'licenseKey',
    },
    {
      title: 'Type',
      dataIndex: 'type',
      key: 'type',
      filters: [
        { text: 'Perpetual', value: 'perpetual' },
        { text: 'Subscription', value: 'subscription' },
      ],
      onFilter: (value, record) => record.type === value,
    },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      render: (status) => (
        <Tag color={status === 'active' ? 'green' : 'red'}>
          {status.toUpperCase()}
        </Tag>
      ),
    },
    {
      title: 'Actions',
      key: 'actions',
      render: (_, record) => (
        <Button icon={<DownloadOutlined />} onClick={() => handleDownload(record)}>
          Download
        </Button>
      ),
    },
  ];

  const handleDownload = (license) => {
    // Implement download functionality
    message.success(`Downloading ${license.productId.name}`);
  };

  return (
    <Layout>
      <Title level={2}>Welcome to Your Dashboard</Title>
      <Spin spinning={loading}>
        <Row gutter={[16, 16]}>
          <Col xs={24} sm={8}>
            <Card hoverable>
              <Statistic 
                title="Total Licenses" 
                value={licenses.length} 
                prefix={<KeyOutlined />} 
                valueStyle={{ color: '#3f8600' }}
              />
            </Card>
          </Col>
          <Col xs={24} sm={8}>
            <Card hoverable>
              <Statistic 
                title="Active Licenses" 
                value={licenses.filter(l => l.status === 'active').length} 
                prefix={<KeyOutlined />} 
                valueStyle={{ color: '#1890ff' }}
              />
            </Card>
          </Col>
          <Col xs={24} sm={8}>
            <Card hoverable>
              <Statistic 
                title="Expired Licenses" 
                value={licenses.filter(l => l.status === 'expired').length} 
                prefix={<KeyOutlined />} 
                valueStyle={{ color: '#cf1322' }}
              />
            </Card>
          </Col>
        </Row>

        <Title level={3} style={{ marginTop: '2rem' }}>Your Licenses</Title>
        <Search
          placeholder="Search licenses"
          onSearch={handleSearch}
          style={{ marginBottom: 16 }}
        />
        <Table 
          columns={licenseColumns} 
          dataSource={filteredLicenses} 
          rowKey="_id"
          pagination={{ pageSize: 3 }}
          scroll={{ x: true }}
        />

        <Title level={3} style={{ marginTop: '2rem' }}></Title>
        <UserProducts2 />
      </Spin>
    </Layout>
  );
};

export default UserDashboard;