import React, { useState, useEffect } from 'react';
import { Table, Typography, Button, message } from 'antd';
import { UserAddOutlined, EditOutlined, DeleteOutlined } from '@ant-design/icons';
import Layout from './Layout';
import axios from 'axios';

const { Title } = Typography;

const AdminUsers = () => {
  const [users, setUsers] = useState([]);

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const response = await axios.get('http://localhost:5000/api/users', {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
      });
      setUsers(response.data);
    } catch (error) {
      message.error('Failed to fetch users');
    }
  };

  const columns = [
    {
      title: 'Name',
      dataIndex: 'name',
      key: 'name',
    },
    {
      title: 'Email',
      dataIndex: 'email',
      key: 'email',
    },
    {
      title: 'Role',
      dataIndex: 'role',
      key: 'role',
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

  const handleEdit = (user) => {
    // Implement edit functionality
    console.log('Edit user:', user);
  };

  const handleDelete = async (user) => {
    try {
      await axios.delete(`http://localhost:5000/api/users/${user._id}`, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
      });
      message.success('User deleted successfully');
      fetchUsers();
    } catch (error) {
      message.error('Failed to delete user');
    }
  };

  return (
    <Layout>
      <div className="flex justify-between items-center mb-4">
        <Title level={2}>Users Management</Title>
        <Button type="primary" icon={<UserAddOutlined />}>Add User</Button>
      </div>
      <Table columns={columns} dataSource={users} rowKey="_id" />
    </Layout>
  );
};

export default AdminUsers;