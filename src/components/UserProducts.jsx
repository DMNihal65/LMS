import React, { useState, useEffect } from 'react';
import { Typography, Card, Row, Col, Button, message } from 'antd';
import { ShoppingCartOutlined } from '@ant-design/icons';
import Layout from './Layout';
import axios from 'axios';

const { Title, Paragraph } = Typography;

const UserProducts = () => {
  const [products, setProducts] = useState([]);

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      const response = await axios.get('http://localhost:5000/api/products');
      setProducts(response.data);
    } catch (error) {
      message.error('Failed to fetch products');
    }
  };

  const handlePurchase = async (productId) => {
    try {
      await axios.post('http://localhost:5000/api/purchases', { productId }, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
      });
      message.success('Product purchased successfully');
    } catch (error) {
      message.error('Failed to purchase product');
    }
  };

  return (
    <Layout>
      <Title level={2}>Available Products</Title>
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
    </Layout>
  );
};

export default UserProducts;