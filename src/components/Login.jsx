import React, { useState } from 'react';
import { Button, Form, Input, message } from 'antd';
import axios from 'axios';

const Login = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = async (values) => {
    try {
      const response = await axios.post('http://localhost:5000/api/auth/login', values);
      localStorage.setItem('token', response.data.token);
      localStorage.setItem('userRole', response.data.user.role); // Store the user's role
      // Redirect to admin dashboard or handle successful login
      console.log('Login successful:', response.data); // Add this line for debugging
    } catch (error) {
      console.error('Login error:', error.response); // Add this line for debugging
      message.error('Login failed: ' + error.response?.data?.message || error.message);
    }
  };

  return (
    <div>
      <h1>Login</h1>
      <Form
        onFinish={handleLogin}
        layout="vertical"
      >
        <Form.Item
          label="Username"
          name="username"
          rules={[{ required: true, message: 'Please input your username!' }]}
        >
          <Input
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            placeholder="Enter your username"
          />
        </Form.Item>

        <Form.Item
          label="Password"
          name="password"
          rules={[{ required: true, message: 'Please input your password!' }]}
        >
          <Input.Password
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Enter your password"
          />
        </Form.Item>

        <Form.Item>
          <Button type="primary" htmlType="submit">
            Login
          </Button>
        </Form.Item>
      </Form>
    </div>
  );
};

export default Login;