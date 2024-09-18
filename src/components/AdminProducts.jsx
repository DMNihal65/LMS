import React, { useState, useEffect } from 'react';
import { Table, Button, Modal, Form, Input, InputNumber, message, Typography, Space } from 'antd';
import { PlusOutlined, EditOutlined, DeleteOutlined, PlusCircleOutlined, MinusCircleOutlined } from '@ant-design/icons';
import Layout from './Layout';
import axios from 'axios';

const { Title } = Typography;
const { TextArea } = Input;

const AdminProducts = () => {
  const [products, setProducts] = useState([]);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [form] = Form.useForm();
  const [editingProductId, setEditingProductId] = useState(null);

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

  const showModal = (product = null) => {
    if (product) {
      form.setFieldsValue(product);
      setEditingProductId(product._id);
    } else {
      form.resetFields();
      setEditingProductId(null);
    }
    setIsModalVisible(true);
  };

  const handleCancel = () => {
    setIsModalVisible(false);
    form.resetFields();
    setEditingProductId(null);
  };

  const handleSubmit = async (values) => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        message.error('You are not authenticated. Please log in.');
        return;
      }

      const config = {
        headers: { Authorization: `Bearer ${token}` }
      };

      // Ensure licenseTypes is an array of objects
      const formattedValues = {
        ...values,
        licenseTypes: values.licenseTypes || []
      };

      if (editingProductId) {
        await axios.put(`http://localhost:5000/api/products/${editingProductId}`, formattedValues, config);
        message.success('Product updated successfully');
      } else {
        await axios.post('http://localhost:5000/api/products', formattedValues, config);
        message.success('Product created successfully');
      }
      setIsModalVisible(false);
      fetchProducts();
    } catch (error) {
      console.error('Error details:', error.response);
      if (error.response && error.response.status === 403) {
        message.error('You do not have permission to perform this action.');
      } else {
        message.error('Failed to save product: ' + error.response?.data?.message || error.message);
      }
    }
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(`http://localhost:5000/api/products/${id}`, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
      });
      message.success('Product deleted successfully');
      fetchProducts();
    } catch (error) {
      message.error('Failed to delete product');
    }
  };

  const columns = [
    { title: 'Name', dataIndex: 'name', key: 'name' },
    { title: 'Description', dataIndex: 'description', key: 'description' },
    { title: 'Version', dataIndex: 'version', key: 'version' },
    { title: 'Price', dataIndex: 'price', key: 'price', render: (price) => `$${price.toFixed(2)}` },
    {
      title: 'Actions',
      key: 'actions',
      render: (_, record) => (
        <Space>
          <Button icon={<EditOutlined />} onClick={() => showModal(record)}>Edit</Button>
          <Button icon={<DeleteOutlined />} onClick={() => handleDelete(record._id)} danger>Delete</Button>
        </Space>
      ),
    },
  ];

  return (
    <Layout>
      <div className="flex justify-between items-center mb-4">
        <Title level={2}>Products Management</Title>
        <Button type="primary" icon={<PlusOutlined />} onClick={() => showModal()}>Add Product</Button>
      </div>
      <Table columns={columns} dataSource={products} rowKey="_id" />
      <Modal
        title={editingProductId ? "Edit Product" : "Add New Product"}
        visible={isModalVisible}
        onCancel={handleCancel}
        footer={null}
        width={800}
      >
        <Form form={form} onFinish={handleSubmit} layout="vertical">
          <Form.Item name="name" label="Name" rules={[{ required: true }]}>
            <Input />
          </Form.Item>
          <Form.Item name="description" label="Description" rules={[{ required: true }]}>
            <TextArea rows={4} />
          </Form.Item>
          <Form.Item name="version" label="Version" rules={[{ required: true }]}>
            <Input />
          </Form.Item>
          <Form.Item name="price" label="Price" rules={[{ required: true }]}>
            <InputNumber min={0} step={0.01} />
          </Form.Item>
          <Form.Item name="features" label="Features (comma-separated)">
            <TextArea rows={2} />
          </Form.Item>
          <Form.Item name="systemRequirements" label="System Requirements">
            <TextArea rows={2} />
          </Form.Item>
          <Form.Item name="downloadUrl" label="Download URL">
            <Input />
          </Form.Item>
          <Form.Item name="documentationUrl" label="Documentation URL">
            <Input />
          </Form.Item>
          <Form.List name="licenseTypes">
            {(fields, { add, remove }) => (
              <>
                {fields.map(({ key, name, ...restField }) => (
                  <Space key={key} style={{ display: 'flex', marginBottom: 8 }} align="baseline">
                    <Form.Item
                      {...restField}
                      name={[name, 'type']}
                      rules={[{ required: true, message: 'Missing type' }]}
                    >
                      <Input placeholder="License Type" />
                    </Form.Item>
                    <Form.Item
                      {...restField}
                      name={[name, 'duration']}
                      rules={[{ required: true, message: 'Missing duration' }]}
                    >
                      <InputNumber placeholder="Duration (days)" min={0} />
                    </Form.Item>
                    <Form.Item
                      {...restField}
                      name={[name, 'price']}
                      rules={[{ required: true, message: 'Missing price' }]}
                    >
                      <InputNumber placeholder="Price" min={0} step={0.01} />
                    </Form.Item>
                    <MinusCircleOutlined onClick={() => remove(name)} />
                  </Space>
                ))}
                <Form.Item>
                  <Button 
                    type="dashed" 
                    onClick={() => add()} 
                    block 
                    icon={<PlusCircleOutlined />}
                    disabled={fields.length >= 5} // Limit to 5 license types
                  >
                    Add License Type
                  </Button>
                </Form.Item>
              </>
            )}
          </Form.List>
          <Form.Item name="licenseAgreement" label="License Agreement" rules={[{ required: true }]}>
            <TextArea rows={4} />
          </Form.Item>
          <Form.Item>
            <Button type="primary" htmlType="submit">
              {editingProductId ? "Update Product" : "Add Product"}
            </Button>
          </Form.Item>
        </Form>
      </Modal>
    </Layout>
  );
}

export default AdminProducts;