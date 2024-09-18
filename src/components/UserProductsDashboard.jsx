import React, { useState, useEffect } from 'react';
import { Typography, Card, Row, Col, Button, message, Modal, Form, Select, Checkbox, Descriptions } from 'antd';
import { ShoppingCartOutlined } from '@ant-design/icons';
import axios from 'axios';
import Layout from './Layout';

const { Title, Paragraph, Text } = Typography;
const { Option } = Select;

const UserProducts = ({ onPurchase }) => {
  const [products, setProducts] = useState([]);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [isLicenseModalVisible, setIsLicenseModalVisible] = useState(false);
  const [form] = Form.useForm();

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

  const showPurchaseModal = (product) => {
    setSelectedProduct(product);
    setIsModalVisible(true);
  };

  const showLicenseAgreement = () => {
    setIsLicenseModalVisible(true);
  };

  const handlePurchase = async (values) => {
    try {
      await axios.post('http://localhost:5000/api/purchases', {
        productId: selectedProduct._id,
        licenseType: values.licenseType,
        quantity: values.quantity,
        agreedToTerms: values.agreedToTerms
      }, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
      });
      message.success('Purchase request submitted successfully. Awaiting approval.');
      setIsModalVisible(false);
      form.resetFields();
      if (onPurchase) {
        onPurchase();
      }
    } catch (error) {
      message.error('Failed to submit purchase request: ' + error.response?.data?.message || error.message);
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
              extra={<Button type="primary" icon={<ShoppingCartOutlined />} onClick={() => showPurchaseModal(product)}>Purchase</Button>}
            >
              <Paragraph>{product.description}</Paragraph>
              <Paragraph strong>Starting from: ${product.price.toFixed(2)}</Paragraph>
            </Card>
          </Col>
        ))}
      </Row>
      <Modal
        title={`Purchase ${selectedProduct?.name}`}
        visible={isModalVisible}
        onCancel={() => setIsModalVisible(false)}
        footer={null}
        width={700}
      >
        <Descriptions title="Product Details" bordered column={1}>
          <Descriptions.Item label="Name">{selectedProduct?.name}</Descriptions.Item>
          <Descriptions.Item label="Description">{selectedProduct?.description}</Descriptions.Item>
          <Descriptions.Item label="Version">{selectedProduct?.version}</Descriptions.Item>
          <Descriptions.Item label="Features">{selectedProduct?.features.join(', ')}</Descriptions.Item>
          <Descriptions.Item label="System Requirements">{selectedProduct?.systemRequirements}</Descriptions.Item>
        </Descriptions>
        <Form form={form} onFinish={handlePurchase} layout="vertical" style={{ marginTop: '20px' }}>
          <Form.Item name="licenseType" label="License Type" rules={[{ required: true }]}>
            <Select>
              {selectedProduct?.licenseTypes.map(type => (
                <Option key={type.type} value={type.type}>
                  {type.type} - ${type.price.toFixed(2)} {type.duration > 0 ? `(${type.duration} days)` : ''}
                </Option>
              ))}
            </Select>
          </Form.Item>
          <Form.Item name="quantity" label="Quantity" rules={[{ required: true }]}>
            <Select>
              {[1, 2, 3, 4, 5].map(num => (
                <Option key={num} value={num}>{num}</Option>
              ))}
            </Select>
          </Form.Item>
          <Form.Item>
            <Button type="link" onClick={showLicenseAgreement}>Read License Agreement</Button>
          </Form.Item>
          <Form.Item name="agreedToTerms" valuePropName="checked" rules={[{ required: true, message: 'You must agree to the terms' }]}>
            <Checkbox>I agree to the license terms and conditions</Checkbox>
          </Form.Item>
          <Form.Item>
            <Button type="primary" htmlType="submit">
              Submit Purchase Request
            </Button>
          </Form.Item>
        </Form>
      </Modal>
      <Modal
        title="License Agreement"
        visible={isLicenseModalVisible}
        onCancel={() => setIsLicenseModalVisible(false)}
        footer={[
          <Button key="close" onClick={() => setIsLicenseModalVisible(false)}>
            Close
          </Button>
        ]}
      >
        <Typography>
          <Paragraph>
            This is a placeholder for the license agreement. In a real application, you would include the full text of your license agreement here.
          </Paragraph>
          <Paragraph>
            The license agreement should cover:
          </Paragraph>
          <ul>
            <li>Terms of use for the software</li>
            <li>Limitations of liability</li>
            <li>Intellectual property rights</li>
            <li>Support and maintenance terms</li>
            <li>Termination conditions</li>
          </ul>
          <Paragraph>
            <Text strong>Please read the full license agreement before agreeing to the terms and conditions.</Text>
          </Paragraph>
        </Typography>
      </Modal>
    </Layout>
  );
};

export default UserProductsDashboard;