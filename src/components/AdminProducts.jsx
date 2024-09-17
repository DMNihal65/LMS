import React, { useState, useEffect } from 'react';
import { Table, Typography, Button, message, Modal, Form, Input, InputNumber } from 'antd';
import { PlusOutlined, EditOutlined, DeleteOutlined } from '@ant-design/icons';
import Layout from './Layout';
import axios from 'axios';

const { Title } = Typography;

const AdminProducts = () => {
  const [products, setProducts] = useState([]);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [form] = Form.useForm();

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

  const showModal = () => {
    setIsModalVisible(true);
  };

  const handleCancel = () => {
    setIsModalVisible(false);
    form.resetFields();
  };

  const handleAddProduct = async (values) => {
    try {
      const productData = {
        ...values,
        licenseTypes: [{
          type: 'perpetual',
          duration: 0,
          price: values.price
        }],
        features: values.features ? values.features.split(',').map(f => f.trim()) : []
      };
      await axios.post('http://localhost:5000/api/products', productData, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
      });
      message.success('Product added successfully');
      setIsModalVisible(false);
      form.resetFields();
      fetchProducts();
    } catch (error) {
      message.error('Failed to add product: ' + error.response.data.message);
    }
  };

  return (
    <Layout>
      <div className="flex justify-between items-center mb-4">
        <Title level={2}>Products Management</Title>
        <Button type="primary" icon={<PlusOutlined />} onClick={showModal}>Add Product</Button>
      </div>
      <Table columns={columns} dataSource={products} rowKey="_id" />
      <Modal
        title="Add New Product"
        visible={isModalVisible}
        onCancel={handleCancel}
        footer={null}
      >
        <Form form={form} onFinish={handleAddProduct} layout="vertical">
          <Form.Item name="name" label="Name" rules={[{ required: true }]}>
            <Input />
          </Form.Item>
          <Form.Item name="description" label="Description" rules={[{ required: true }]}>
            <Input.TextArea />
          </Form.Item>
          <Form.Item name="version" label="Version" rules={[{ required: true }]}>
            <Input />
          </Form.Item>
          <Form.Item name="price" label="Price" rules={[{ required: true }]}>
            <InputNumber min={0} step={0.01} />
          </Form.Item>
          <Form.Item name="features" label="Features (comma-separated)">
            <Input.TextArea />
          </Form.Item>
          <Form.Item name="systemRequirements" label="System Requirements">
            <Input.TextArea />
          </Form.Item>
          <Form.Item name="downloadUrl" label="Download URL">
            <Input />
          </Form.Item>
          <Form.Item name="documentationUrl" label="Documentation URL">
            <Input />
          </Form.Item>
          <Form.Item>
            <Button type="primary" htmlType="submit">Add Product</Button>
          </Form.Item>
        </Form>
      </Modal>
    </Layout>
  );
};

export default AdminProducts;