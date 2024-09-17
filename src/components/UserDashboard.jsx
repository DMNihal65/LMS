import React, { useState, useEffect } from 'react';
import { Typography, Card, Row, Col, Button, message, Table } from 'antd';
import { ShoppingCartOutlined } from '@ant-design/icons';
import Layout from './Layout';
import axios from 'axios';

const { Title, Paragraph } = Typography;

const UserDashboard = () => {
  const [products, setProducts] = useState([]);
  const [licenses, setLicenses] = useState([]);
  const [pendingPurchases, setPendingPurchases] = useState([]);

  useEffect(() => {
    fetchProducts();
    fetchLicenses();
    fetchPendingPurchases();
  }, []);

  const fetchProducts = async () => {
    try {
      const response = await axios.get('http://localhost:5000/api/products');
      setProducts(response.data);
    } catch (error) {
      message.error('Failed to fetch products');
    }
  };

  const fetchLicenses = async () => {
    try {
      const response = await axios.get('http://localhost:5000/api/licenses/user', {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
      });
      setLicenses(response.data);
    } catch (error) {
      message.error('Failed to fetch licenses');
    }
  };

  const fetchPendingPurchases = async () => {
    try {
      const response = await axios.get('http://localhost:5000/api/purchases/user/pending', {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
      });
      setPendingPurchases(response.data);
    } catch (error) {
      message.error('Failed to fetch pending purchases');
    }
  };

  const handlePurchase = async (productId) => {
    try {
      await axios.post('http://localhost:5000/api/purchases', { productId }, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
      });
      message.success('Product purchased successfully. Awaiting approval.');
      fetchPendingPurchases();
    } catch (error) {
      message.error('Failed to purchase product: ' + error.response.data.message);
    }
  };

  const pendingPurchasesColumns = [
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
  ];

  return (
    <Layout>
      <Title level={2}>User Dashboard</Title>
      <Title level={3}>Available Products</Title>
      <Row gutter={[16, 16]}>
        {products.map(product => (
          <Col span={8} key={product._id}>
            <Card
              title={product.name}
              extra={<Button type="primary" icon={<ShoppingCartOutlined />} onClick={() => handlePurchase(product._id)}>Purchase</Button>}
            >
              <Paragraph>{product.description}</Paragraph>
              <Paragraph strong>Price: ${product.price.toFixed(2)}</Paragraph>
            </Card>
          </Col>
        ))}
      </Row>
      <Title level={3} style={{ marginTop: '2rem' }}>Your Licenses</Title>
      <Row gutter={[16, 16]}>
        {licenses.map(license => (
          <Col span={8} key={license._id}>
            <Card title={license.productId.name}>
              <Paragraph>License Key: {license.licenseKey}</Paragraph>
              <Paragraph>Status: {license.status}</Paragraph>
              <Paragraph>Expiry Date: {license.expiryDate ? new Date(license.expiryDate).toLocaleDateString() : 'N/A'}</Paragraph>
            </Card>
          </Col>
        ))}
      </Row>
      <Title level={3} style={{ marginTop: '2rem' }}>Pending Purchases</Title>
      <Table columns={pendingPurchasesColumns} dataSource={pendingPurchases} rowKey="_id" />
    </Layout>
  );
};

export default UserDashboard;