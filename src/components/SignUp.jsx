import React from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Form, Input, Button, Select, message } from 'antd';
import { UserOutlined, MailOutlined, LockOutlined } from '@ant-design/icons';

const { Option } = Select;

const SignUp = () => {
	const navigate = useNavigate();

	const onFinish = async (values) => {
		try {
			await axios.post('http://localhost:5000/api/auth/register', values);
			message.success('Registration successful! Please sign in.');
			navigate('/signin');
		} catch (error) {
			message.error('Registration failed: ' + error.response.data.message);
		}
	};

	return (
		<div className="min-h-screen bg-gray-100 flex flex-col justify-center items-center p-4">
			<div className="bg-white p-8 rounded-lg shadow-md w-full max-w-md">
				<h2 className="text-2xl font-bold text-center mb-6">Sign Up</h2>
				<Form
					name="signup"
					onFinish={onFinish}
					layout="vertical"
				>
					<Form.Item
						name="name"
						rules={[{ required: true, message: 'Please input your name!' }]}
					>
						<Input prefix={<UserOutlined />} placeholder="Name" />
					</Form.Item>
					<Form.Item
						name="email"
						rules={[
							{ required: true, message: 'Please input your email!' },
							{ type: 'email', message: 'Please enter a valid email!' }
						]}
					>
						<Input prefix={<MailOutlined />} placeholder="Email" />
					</Form.Item>
					<Form.Item
						name="password"
						rules={[{ required: true, message: 'Please input your password!' }]}
					>
						<Input.Password prefix={<LockOutlined />} placeholder="Password" />
					</Form.Item>
					<Form.Item
						name="role"
						rules={[{ required: true, message: 'Please select a role!' }]}
					>
						<Select placeholder="Select a role">
							<Option value="user">User</Option>
							<Option value="admin">Admin</Option>
						</Select>
					</Form.Item>
					<Form.Item>
						<Button type="primary" htmlType="submit" className="w-full">
							Sign Up
						</Button>
					</Form.Item>
				</Form>
			</div>
		</div>
	);
};

export default SignUp;