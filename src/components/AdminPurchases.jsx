import React, { useState, useEffect } from 'react';
import { Table, Typography, Button, message, Modal, Descriptions, Space } from 'antd';
import { CheckOutlined, CloseOutlined, EyeOutlined, KeyOutlined } from '@ant-design/icons';
import Layout from './Layout';
import axios from 'axios';

const { Title } = Typography;

const AdminPurchases = () => {
  const [purchases, setPurchases] = useState([]);
  const [isReviewModalVisible, setIsReviewModalVisible] = useState(false);
  const [selectedPurchase, setSelectedPurchase] = useState(null);
  const [generatedLicenseKey, setGeneratedLicenseKey] = useState('');

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

  const showReviewModal = (purchase) => {
    setSelectedPurchase(purchase);
    setIsReviewModalVisible(true);
    setGeneratedLicenseKey('');
  };

  const generateLicenseKey = () => {
    const key = Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
    setGeneratedLicenseKey(key);
  };

  const handleApprove = async () => {
    if (!generatedLicenseKey) {
      message.error('Please generate a license key first');
      return;
    }
    try {
      await axios.post(`http://localhost:5000/api/purchases/${selectedPurchase._id}/approve`, {
        licenseKey: generatedLicenseKey
      }, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
      });
      message.success('Purchase approved and license generated');
      setIsReviewModalVisible(false);
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
      title: 'License Type',
      dataIndex: 'licenseType',
      key: 'licenseType',
    },
    {
      title: 'Quantity',
      dataIndex: 'quantity',
      key: 'quantity',
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
        <Space>
          {record.status === 'pending' && (
            <>
              <Button icon={<EyeOutlined />} onClick={() => showReviewModal(record)} type="primary">
                Review
              </Button>
              <Button icon={<CloseOutlined />} onClick={() => handleReject(record._id)} danger>
                Reject
              </Button>
            </>
          )}
        </Space>
      ),
    },
  ];

  return (
    <Layout>
      <Title level={2}>Purchase Management</Title>
      <Table columns={columns} dataSource={purchases} rowKey="_id" />
      <Modal
        title="Review Purchase"
        visible={isReviewModalVisible}
        onCancel={() => setIsReviewModalVisible(false)}
        footer={[
          <Button key="reject" onClick={() => handleReject(selectedPurchase._id)} danger>
            Reject
          </Button>,
          <Button key="approve" type="primary" onClick={handleApprove} disabled={!generatedLicenseKey}>
            Approve
          </Button>,
        ]}
        width={700}
      >
        {selectedPurchase && (
          <>
            <Descriptions title="Purchase Details" bordered column={1}>
              <Descriptions.Item label="User">{selectedPurchase.userId.name}</Descriptions.Item>
              <Descriptions.Item label="User Email">{selectedPurchase.userId.email}</Descriptions.Item>
              <Descriptions.Item label="Product">{selectedPurchase.productId.name}</Descriptions.Item>
              <Descriptions.Item label="License Type">{selectedPurchase.licenseType}</Descriptions.Item>
              <Descriptions.Item label="Quantity">{selectedPurchase.quantity}</Descriptions.Item>
              <Descriptions.Item label="Amount">${selectedPurchase.amount.toFixed(2)}</Descriptions.Item>
              <Descriptions.Item label="Status">{selectedPurchase.status}</Descriptions.Item>
            </Descriptions>
            <div style={{ marginTop: '20px' }}>
              <Button icon={<KeyOutlined />} onClick={generateLicenseKey} style={{ marginRight: '10px' }}>
                Generate License Key
              </Button>
              {generatedLicenseKey && (
                <span>Generated Key: <strong>{generatedLicenseKey}</strong></span>
              )}
            </div>
          </>
        )}
      </Modal>
    </Layout>
  );
};

export default AdminPurchases;