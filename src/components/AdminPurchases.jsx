import React, { useState, useEffect } from 'react';
import { Table, Typography, Button, message } from 'antd';
import { CheckOutlined, CloseOutlined } from '@ant-design/icons';
import Layout from './Layout';
import axios from 'axios';

const { Title } = Typography;

const AdminPurchases = () => {
  const [purchases, setPurchases] = useState([]);

  useEffect(() => {
    fetchPurchases();
  }, []);

  const fetchPurchases = async () => {
    try {
      const response = await axios.get('http://localhost:5000/api/purchases', {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
      });
      setPurchases(response.data);
    } catch (error) {
      message.error('Failed to fetch purchases');
    }
  };

  const handleApprove = async (purchaseId) => {
    try {
      await axios.post(`http://localhost:5000/api/purchases/${purchaseId}/approve`, {}, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
      });
      message.success('Purchase approved and license generated');
      fetchPurchases();
    } catch (error) {
      message.error('Failed to approve purchase');
    }
  };

  const handleReject = async (purchaseId) => {
    try {
      await axios.post(`http://localhost:5000/api/purchases/${purchaseId}/reject`, {}, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
      });
      message.success('Purchase rejected');
      fetchPurchases();
    } catch (error) {
      message.error('Failed to reject purchase');
    }
  };

  const columns = [
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
      title: 'Amount',
      dataIndex: 'amount',
      key: 'amount',
      render: (amount) => `$${amount.toFixed(2)}`,
    },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
    },
    {
      title: 'Actions',
      key: 'actions',
      render: (text, record) => (
        <span>
          {record.status === 'pending' && (
            <>
              <Button icon={<CheckOutlined />} onClick={() => handleApprove(record._id)} type="primary">
                Approve
              </Button>
              <Button icon={<CloseOutlined />} onClick={() => handleReject(record._id)} danger>
                Reject
              </Button>
            </>
          )}
        </span>
      ),
    },
  ];

  return (
    <Layout>
      <Title level={2}>Purchase Management</Title>
      <Table columns={columns} dataSource={purchases} rowKey="_id" />
    </Layout>
  );
};

export default AdminPurchases;