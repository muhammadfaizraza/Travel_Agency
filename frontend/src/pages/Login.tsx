import React from 'react';
import { Form, Input, Button, Card, Typography, message } from 'antd';
import { UserOutlined, LockOutlined } from '@ant-design/icons';
import { useNavigate, Link } from 'react-router-dom';
import { useLoginMutation } from '../store/api';

const { Title } = Typography;

const Login: React.FC = () => {
  const navigate = useNavigate();
  const [login, { isLoading }] = useLoginMutation();

  const onFinish = async (values: { email: string; password: string }) => {
    try {
      const response = await login(values).unwrap();
      localStorage.setItem('token', response.token);
      localStorage.setItem('user', JSON.stringify(response.user));
      message.success('Login successful!');
      navigate('/dashboard');
    } catch (error: any) {
      message.error(error.data?.message || 'Login failed');
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
            <UserOutlined style={{ fontSize: '32px', color: '#fff' }} />
          </div>
          <Title level={2} style={{ marginBottom: '8px', color: '#2d3748' }}>
            Travel Agency
          </Title>
          <Typography.Text style={{ fontSize: '16px', color: '#718096' }}>
            Staff Login Portal
          </Typography.Text>
        </div>

        <Form
          name="login"
          onFinish={onFinish}
          autoComplete="off"
          layout="vertical"
        >
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
            rules={[{ required: true, message: 'Please input your password!' }]}
          >
            <Input.Password
              prefix={<LockOutlined style={{ color: '#667eea' }} />}
              placeholder="Enter your password"
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
              Log In
            </Button>
          </Form.Item>

          <div style={{ textAlign: 'center', marginTop: '20px' }}>
            <Typography.Text style={{ color: '#718096' }}>
              Don't have an account?{' '}
              <Link
                to="/register"
                style={{
                  color: '#667eea',
                  fontWeight: 600,
                  textDecoration: 'none'
                }}
              >
                Register here
              </Link>
            </Typography.Text>
          </div>
        </Form>
      </Card>
    </div>
  );
};

export default Login;
