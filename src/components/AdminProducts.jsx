import React, { useState, useEffect } from 'react';
import { Table, Typography, Button, message } from 'antd';
import { PlusOutlined, EditOutlined, DeleteOutlined } from '@ant-design/icons';
import Layout from './Layout';
import axios from 'axios';

const { Title } = Typography;

const AdminProducts = () => {
  const [products, setProducts] = useState([]);

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      const response = await axios.get('http://localhost:5000/api/products', {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
      });
      setProducts(response.data);
    } catch (error) {
      message.error('Failed to fetch products');
    }
  };

  const columns = [
    {
      title: 'Name',
      dataIndex: 'name',
      key: 'name',
    },
    {
      title: 'Description',
      dataIndex: 'description',
      key: 'description',
    },
    {
      title: 'Price',
      dataIndex: 'price',
      key: 'price',
      render: (price) => `$${price.toFixed(2)}`,
    },
    {
      title: 'Actions',
      key: 'actions',
      render: (text, record) => (
        <span>
          <Button icon={<EditOutlined />} onClick={() => handleEdit(record)} />
          <Button icon={<DeleteOutlined />} onClick={() => handleDelete(record)} danger />
        </span>
      ),
    },
  ];

  const handleEdit = (product) => {
    // Implement edit functionality
    console.log('Edit product:', product);
  };

  const handleDelete = async (product) => {
    try {
      await axios.delete(`http://localhost:5000/api/products/${product._id}`, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
      });
      message.success('Product deleted successfully');
      fetchProducts();
    } catch (error) {
      message.error('Failed to delete product');
    }
  };

  return (
    <Layout>
      <div className="flex justify-between items-center mb-4">
        <Title level={2}>Products Management</Title>
        <Button type="primary" icon={<PlusOutlined />}>Add Product</Button>
      </div>
      <Table columns={columns} dataSource={products} rowKey="_id" />
    </Layout>
  );
};

export default AdminProducts;