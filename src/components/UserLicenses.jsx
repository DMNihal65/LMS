import React, { useState, useEffect } from 'react';
import { Typography, Table, Tag } from 'antd';
import Layout from './Layout';
import axios from 'axios';

const { Title } = Typography;

const UserLicenses = () => {
  const [licenses, setLicenses] = useState([]);

  useEffect(() => {
    fetchLicenses();
  }, []);

  const fetchLicenses = async () => {
    try {
      const response = await axios.get('http://localhost:5000/api/licenses/user', {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
      });
      setLicenses(response.data);
    } catch (error) {
      console.error('Failed to fetch licenses:', error);
    }
  };

  const columns = [
    {
      title: 'Product',
      dataIndex: ['productId', 'name'],
      key: 'product',
    },
    {
      title: 'License Key',
      dataIndex: 'licenseKey',
      key: 'licenseKey',
    },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      render: status => (
        <Tag color={status === 'active' ? 'green' : 'red'}>
          {status.toUpperCase()}
        </Tag>
      ),
    },
    {
      title: 'Expiry Date',
      dataIndex: 'expiryDate',
      key: 'expiryDate',
      render: date => date ? new Date(date).toLocaleDateString() : 'N/A',
    },
  ];

  return (
    <Layout>
      <Title level={2}>Your Licenses</Title>
      <Table columns={columns} dataSource={licenses} rowKey="_id" />
    </Layout>
  );
};

export default UserLicenses;