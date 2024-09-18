import React, { useState, useEffect } from 'react';
import { Table, Typography, Button, message, Modal, Form, Input, Select } from 'antd';
import { EditOutlined, DeleteOutlined } from '@ant-design/icons';
import Layout from './Layout';
import axios from 'axios';

const { Title } = Typography;
const { Option } = Select;

const AdminLicenses = () => {
  const [licenses, setLicenses] = useState([]);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [editingLicense, setEditingLicense] = useState(null);
  const [form] = Form.useForm();

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

  const showEditModal = (license) => {
    setEditingLicense(license);
    form.setFieldsValue(license);
    setIsModalVisible(true);
  };

  const handleEdit = async (values) => {
    try {
      await axios.put(`http://localhost:5000/api/licenses/${editingLicense._id}`, values, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
      });
      message.success('License updated successfully');
      setIsModalVisible(false);
      fetchLicenses();
    } catch (error) {
      message.error('Failed to update license');
    }
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(`http://localhost:5000/api/licenses/${id}`, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
      });
      message.success('License deleted successfully');
      fetchLicenses();
    } catch (error) {
      message.error('Failed to delete license');
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
      title: 'License Key',
      dataIndex: 'licenseKey',
      key: 'licenseKey',
    },
    {
      title: 'Type',
      dataIndex: 'type',
      key: 'type',
    },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
    },
    {
      title: 'Actions',
      key: 'actions',
      render: (_, record) => (
        <span>
          <Button icon={<EditOutlined />} onClick={() => showEditModal(record)} style={{ marginRight: 8 }}>
            Edit
          </Button>
          <Button icon={<DeleteOutlined />} onClick={() => handleDelete(record._id)} danger>
            Delete
          </Button>
        </span>
      ),
    },
  ];

  return (
    <Layout>
      <Title level={2}>License Management</Title>
      <Table columns={columns} dataSource={licenses} rowKey="_id" />
      <Modal
        title="Edit License"
        visible={isModalVisible}
        onCancel={() => setIsModalVisible(false)}
        footer={null}
      >
        <Form form={form} onFinish={handleEdit} layout="vertical">
          <Form.Item name="type" label="License Type" rules={[{ required: true }]}>
            <Input />
          </Form.Item>
          <Form.Item name="status" label="Status" rules={[{ required: true }]}>
            <Select>
              <Option value="active">Active</Option>
              <Option value="expired">Expired</Option>
              <Option value="revoked">Revoked</Option>
            </Select>
          </Form.Item>
          <Form.Item>
            <Button type="primary" htmlType="submit">
              Update License
            </Button>
          </Form.Item>
        </Form>
      </Modal>
    </Layout>
  );
};

export default AdminLicenses;