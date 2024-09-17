import React, { useState, useEffect } from 'react';
import { Table, Typography, Button, Tag, message } from 'antd';
import { CheckOutlined, CloseOutlined } from '@ant-design/icons';
import Layout from './Layout';
import axios from 'axios';

const { Title } = Typography;

const AdminLicenses = () => {
  const [licenses, setLicenses] = useState([]);

  useEffect(() => {
    fetchLicenses();
  }, []);

  const fetchLicenses = async () => {
    try {
      const response = await axios.get('http://localhost:5000/api/licenses', {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
      });
      setLicenses(response.data);
    } catch (error) {
      message.error('Failed to fetch licenses');
    }
  };

  const columns = [
    {
      title: 'License Key',
      dataIndex: 'licenseKey',
      key: 'licenseKey',
    },
    {
      title: 'User',
      dataIndex: ['userId', 'name'],
      key: 'user',
    },
    {
      title: 'Product',
      dataIndex: ['productId', 'name'],
      key: 'product',
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
      render: (text, record) => (
        <span>
          {record.status === 'active' ? (
            <Button icon={<CloseOutlined />} onClick={() => handleDeactivate(record)} danger>
              Deactivate
            </Button>
          ) : (
            <Button icon={<CheckOutlined />} onClick={() => handleActivate(record)} type="primary">
              Activate
            </Button>
          )}
        </span>
      ),
    },
  ];

  const handleActivate = async (license) => {
    try {
      await axios.put(`http://localhost:5000/api/licenses/${license._id}`, { status: 'active' }, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
      });
      message.success('License activated successfully');
      fetchLicenses();
    } catch (error) {
      message.error('Failed to activate license');
    }
  };

  const handleDeactivate = async (license) => {
    try {
      await axios.put(`http://localhost:5000/api/licenses/${license._id}`, { status: 'inactive' }, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
      });
      message.success('License deactivated successfully');
      fetchLicenses();
    } catch (error) {
      message.error('Failed to deactivate license');
    }
  };

  return (
    <Layout>
      <Title level={2}>Licenses Management</Title>
      <Table columns={columns} dataSource={licenses} rowKey="_id" />
    </Layout>
  );
};

export default AdminLicenses;