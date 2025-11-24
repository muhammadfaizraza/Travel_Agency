import React from 'react';
import { Form, Input, Button, Card, Typography, message } from 'antd';
import { UserOutlined, LockOutlined, TeamOutlined } from '@ant-design/icons';
import { useNavigate, Link } from 'react-router-dom';
import { useRegisterMutation } from '../store/api';

const { Title } = Typography;

const Register: React.FC = () => {
  const navigate = useNavigate();
  const [register, { isLoading }] = useRegisterMutation();

  const onFinish = async (values: { email: string; password: string; full_name: string }) => {
    try {
      await register(values).unwrap();
      message.success('Registration successful! Please login.');
      navigate('/login');
    } catch (error: any) {
      message.error(error.data?.message || 'Registration failed');
    }
  };

  return (
    <div style={{
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      padding: '20px'
    }}>
      <Card
        style={{
          width: 450,
          boxShadow: '0 20px 60px rgba(0, 0, 0, 0.3)',
          borderRadius: '20px',
          border: 'none'
        }}
      >
        <div style={{ textAlign: 'center', marginBottom: 32 }}>
          <div
            style={{
              width: '70px',
              height: '70px',
              borderRadius: '50%',
              background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              margin: '0 auto 16px',
              boxShadow: '0 8px 20px rgba(102, 126, 234, 0.4)'
            }}
          >
            <TeamOutlined style={{ fontSize: '32px', color: '#fff' }} />
          </div>
          <Title level={2} style={{ marginBottom: '8px', color: '#2d3748' }}>
            Travel Agency
          </Title>
          <Typography.Text style={{ fontSize: '16px', color: '#718096' }}>
            Staff Registration Portal
          </Typography.Text>
        </div>

        <Form
          name="register"
          onFinish={onFinish}
          autoComplete="off"
          layout="vertical"
        >
          <Form.Item
            name="full_name"
            rules={[{ required: true, message: 'Please input your full name!' }]}
          >
            <Input
              prefix={<TeamOutlined style={{ color: '#667eea' }} />}
              placeholder="Enter your full name"
              size="large"
              style={{ height: '48px' }}
            />
          </Form.Item>

          <Form.Item
            name="email"
            rules={[
              { required: true, message: 'Please input your email!' },
              { type: 'email', message: 'Please enter a valid email!' }
            ]}
          >
            <Input
              prefix={<UserOutlined style={{ color: '#667eea' }} />}
              placeholder="Enter your email"
              size="large"
              style={{ height: '48px' }}
            />
          </Form.Item>

          <Form.Item
            name="password"
            rules={[
              { required: true, message: 'Please input your password!' },
              { min: 6, message: 'Password must be at least 6 characters!' }
            ]}
          >
            <Input.Password
              prefix={<LockOutlined style={{ color: '#667eea' }} />}
              placeholder="Create a password (min. 6 characters)"
              size="large"
              style={{ height: '48px' }}
            />
          </Form.Item>

          <Form.Item style={{ marginTop: '24px' }}>
            <Button
              type="primary"
              htmlType="submit"
              loading={isLoading}
              block
              size="large"
              style={{ height: '48px', fontSize: '16px', fontWeight: 600 }}
            >
              Create Account
            </Button>
          </Form.Item>

          <div style={{ textAlign: 'center', marginTop: '20px' }}>
            <Typography.Text style={{ color: '#718096' }}>
              Already have an account?{' '}
              <Link
                to="/login"
                style={{
                  color: '#667eea',
                  fontWeight: 600,
                  textDecoration: 'none'
                }}
              >
                Login here
              </Link>
            </Typography.Text>
          </div>
        </Form>
      </Card>
    </div>
  );
};

export default Register;
