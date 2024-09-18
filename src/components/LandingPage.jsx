import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Button, Typography, Layout, Space, Card, Row, Col, Form, Input, Modal } from 'antd';
import { ArrowRightOutlined, CheckCircleOutlined, ShoppingCartOutlined } from '@ant-design/icons';
import axios from 'axios';

const { Title, Paragraph } = Typography;
const { Header, Content, Footer } = Layout;

const LandingPage = () => {
  const [products, setProducts] = useState([]);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [isModalVisible, setIsModalVisible] = useState(false);

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      const response = await axios.get('http://localhost:5000/api/products');
      setProducts(response.data);
    } catch (error) {
      console.error('Failed to fetch products:', error);
    }
  };

  const showProductDetails = (product) => {
    setSelectedProduct(product);
    setIsModalVisible(true);
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1
    }
  };

  return (
    <Layout className="min-h-screen">
      <Header className="bg-white shadow-md">
        <div className="container mx-auto flex justify-between items-center">
          <motion.div
            initial={{ x: -50, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ duration: 0.5 }}
            className="text-2xl font-bold text-blue-600"
          >
            SLM
          </motion.div>
          <Space>
            <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.95 }}>
              <Link to="/signin" className="text-gray-600 hover:text-blue-600">Sign In</Link>
            </motion.div>
            <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.95 }}>
              <Link to="/signup" className="text-gray-600 hover:text-blue-600">Sign Up</Link>
            </motion.div>
          </Space>
        </div>
      </Header>
      <Content>
        <motion.div
          initial="hidden"
          animate="visible"
          variants={containerVariants}
          className="hero bg-blue-50 py-20"
        >
          <div className="container mx-auto text-center">
            <motion.div variants={itemVariants}>
              <Title level={1} className="text-4xl mb-4">Software License Management Made Easy</Title>
            </motion.div>
            <motion.div variants={itemVariants}>
              <Paragraph className="text-xl mb-8">Streamline your software licensing process with our powerful platform</Paragraph>
            </motion.div>
            <motion.div variants={itemVariants} whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Button type="primary" size="large" icon={<ArrowRightOutlined />}>
              <Link to="/signup" className="text-gray-600 hover:text-blue-600">Get Started</Link>
              </Button>
            </motion.div>
          </div>
        </motion.div>

        <motion.div
          initial="hidden"
          animate="visible"
          variants={containerVariants}
          className="features py-16"
        >
          <div className="container mx-auto">
            <Title level={2} className="text-center mb-12">Why Choose Our Platform?</Title>
            <Row gutter={[32, 32]}>
              {[
                { title: 'Easy Management', description: 'Manage all your software licenses in one place' },
                { title: 'Secure', description: 'Top-notch security to protect your valuable assets' },
                { title: 'Flexible', description: 'Customizable licensing options to fit your needs' },
                { title: 'Analytics', description: 'Gain insights with detailed usage analytics' },
              ].map((feature, index) => (
                <Col xs={24} sm={12} md={6} key={index}>
                  <motion.div variants={itemVariants}>
                    <Card className="h-full text-center hover:shadow-lg transition-shadow duration-300">
                      <CheckCircleOutlined className="text-4xl text-blue-500 mb-4" />
                      <Title level={4}>{feature.title}</Title>
                      <Paragraph>{feature.description}</Paragraph>
                    </Card>
                  </motion.div>
                </Col>
              ))}
            </Row>
          </div>
        </motion.div>

        <motion.div
          initial="hidden"
          animate="visible"
          variants={containerVariants}
          className="products-showcase bg-gray-100 py-16"
        >
          <div className="container mx-auto">
            <Title level={2} className="text-center mb-12">Our Products</Title>
            <Row gutter={[32, 32]}>
              {products.map((product, index) => (
                <Col xs={24} sm={12} md={8} key={product._id}>
                  <motion.div variants={itemVariants}>
                    <Card
                      hoverable
                      cover={<div className="h-48 bg-gray-300" />}
                      actions={[
                        <Button onClick={() => showProductDetails(product)}>Learn More</Button>,
                        <Button className='bg-blue-400 text-white'  icon={<ShoppingCartOutlined />}>
                           <Link to="/signup" className='text-white'>Buy Now</Link>
                        </Button>
                      ]}
                    >
                      <Card.Meta title={product.name} description={product.description.substring(0, 100) + '...'} />
                    </Card>
                  </motion.div>
                </Col>
              ))}
            </Row>
          </div>
        </motion.div>

        <motion.div
          initial="hidden"
          animate="visible"
          variants={containerVariants}
          className="about py-16"
        >
          <div className="container mx-auto">
            <Title level={2} className="text-center mb-12">About Us</Title>
            <Row gutter={32} align="middle">
              <Col xs={24} md={12}>
                <motion.div variants={itemVariants}>
                  <Paragraph className="text-lg">
                    We are a team of passionate developers and business professionals dedicated to simplifying software license management. Our platform is designed to help businesses of all sizes efficiently manage their software licenses, saving time and reducing costs.
                  </Paragraph>
                </motion.div>
              </Col>
              <Col xs={24} md={12}>
                <motion.div variants={itemVariants} className="h-64 bg-gray-300 rounded-lg" />
              </Col>
            </Row>
          </div>
        </motion.div>

        <motion.div
          initial="hidden"
          animate="visible"
          variants={containerVariants}
          className="contact-us bg-blue-50 py-16"
        >
          <div className="container mx-auto">
            <Title level={2} className="text-center mb-12">Contact Us</Title>
            <Row justify="center">
              <Col xs={24} sm={20} md={16} lg={12}>
                <motion.div variants={itemVariants}>
                  <Form layout="vertical">
                    <Form.Item name="name" label="Name" rules={[{ required: true }]}>
                      <Input />
                    </Form.Item>
                    <Form.Item name="email" label="Email" rules={[{ required: true, type: 'email' }]}>
                      <Input />
                    </Form.Item>
                    <Form.Item name="message" label="Message" rules={[{ required: true }]}>
                      <Input.TextArea rows={4} />
                    </Form.Item>
                    <Form.Item>
                      <Button type="primary" htmlType="submit">Send Message</Button>
                    </Form.Item>
                  </Form>
                </motion.div>
              </Col>
            </Row>
          </div>
        </motion.div>
      </Content>
      <Footer className="text-center bg-gray-800 text-white py-8">
        <Paragraph>© 2023 Software License Management. All rights reserved.</Paragraph>
      </Footer>

      <Modal
        title={selectedProduct?.name}
        visible={isModalVisible}
        onCancel={() => setIsModalVisible(false)}
        footer={[
          <Button key="back" onClick={() => setIsModalVisible(false)}>
            Close
          </Button>,
          <Button key="buy" type="primary" icon={<ShoppingCartOutlined />}>
             <Link to="/signup" className="">Buy Now</Link>
          </Button>,
        ]}
        width={800}
      >
        {selectedProduct && (
          <div>
            <Paragraph>{selectedProduct.description}</Paragraph>
            <Title level={4}>Features:</Title>
            <ul>
              {selectedProduct.features.map((feature, index) => (
                <li key={index}>{feature}</li>
              ))}
            </ul>
            <Title level={4}>System Requirements:</Title>
            <Paragraph>{selectedProduct.systemRequirements}</Paragraph>
            <Title level={4}>License Types:</Title>
            <ul>
              {selectedProduct.licenseTypes.map((license, index) => (
                <li key={index}>
                  {license.type}: ${license.price} ({license.duration} days)
                </li>
              ))}
            </ul>
          </div>
        )}
      </Modal>
    </Layout>
  );
};

export default LandingPage;