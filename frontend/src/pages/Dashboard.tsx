import React, { useState } from 'react';
import {
  Layout,
  Table,
  Button,
  Input,
  Space,
  Typography,
  Card,
  Statistic,
  Row,
  Col,
  Avatar
} from 'antd';
import {
  PlusOutlined,
  SearchOutlined,
  UserOutlined,
  LogoutOutlined,
  ShoppingOutlined,
  RocketOutlined
} from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import { useGetCustomersQuery, useGetOrdersQuery } from '../store/api';
import { Customer } from '../types';
import AddCustomerModal from '../components/AddCustomerModal';

const { Header, Content } = Layout;
const { Title, Text } = Typography;

const Dashboard: React.FC = () => {
  const [searchText, setSearchText] = useState('');
  const [modalVisible, setModalVisible] = useState(false);
  const navigate = useNavigate();

  const user = JSON.parse(localStorage.getItem('user') || '{}');

  const { data: customers = [], isLoading } = useGetCustomersQuery(searchText || undefined);
  const { data: orders = [] } = useGetOrdersQuery();

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/login');
  };

  const columns = [
    {
      title: 'Name',
      key: 'name',
      render: (record: Customer) => `${record.first_name} ${record.last_name}`,
    },
    {
      title: 'Email',
      dataIndex: 'email',
      key: 'email',
    },
    {
      title: 'Phone',
      dataIndex: 'phone_number',
      key: 'phone_number',
    },
    {
      title: 'Action',
      key: 'action',
      render: (record: Customer) => (
        <Button
          type="link"
          onClick={() => navigate(`/customers/${record.id}`)}
        >
          View Details
        </Button>
      ),
    },
  ];

  return (
    <Layout style={{ minHeight: '100vh' }}>
      <Header style={{
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        padding: '0 32px',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        boxShadow: '0 4px 12px rgba(102, 126, 234, 0.3)',
        height: '70px'
      }}>
        <Space size="middle">
          <RocketOutlined style={{ fontSize: '28px', color: '#fff' }} />
          <Title level={3} style={{ margin: 0, color: '#fff', fontWeight: 600 }}>
            Travel Agency
          </Title>
        </Space>
        <Space size="large">
          <Space>
            <Avatar style={{ background: 'rgba(255, 255, 255, 0.2)' }} icon={<UserOutlined />} />
            <Text style={{ color: '#fff', fontWeight: 500 }}>Welcome, {user.full_name}</Text>
          </Space>
          <Button
            icon={<LogoutOutlined />}
            onClick={handleLogout}
            style={{
              background: 'rgba(255, 255, 255, 0.2)',
              color: '#fff',
              border: '1px solid rgba(255, 255, 255, 0.3)',
              fontWeight: 500
            }}
          >
            Logout
          </Button>
        </Space>
      </Header>

      <Content style={{ padding: '32px', maxWidth: '1400px', margin: '0 auto', width: '100%' }}>
        <div className="fade-in-up">
          <Title level={2} style={{ marginBottom: '24px', color: '#2d3748' }}>
            Dashboard Overview
          </Title>

          <Row gutter={[24, 24]} style={{ marginBottom: 32 }}>
            <Col xs={24} sm={12} lg={8}>
              <Card
                hoverable
                style={{
                  background: 'linear-gradient(135deg, rgba(102, 126, 234, 0.1) 0%, rgba(118, 75, 162, 0.1) 100%)',
                  borderLeft: '4px solid #667eea'
                }}
              >
                <Statistic
                  title={<span style={{ fontSize: '16px', fontWeight: 600 }}>Total Customers</span>}
                  value={customers.length}
                  prefix={<UserOutlined style={{ color: '#667eea' }} />}
                  valueStyle={{ color: '#667eea', fontSize: '32px', fontWeight: 700 }}
                />
              </Card>
            </Col>
            <Col xs={24} sm={12} lg={8}>
              <Card
                hoverable
                style={{
                  background: 'linear-gradient(135deg, rgba(118, 75, 162, 0.1) 0%, rgba(102, 126, 234, 0.1) 100%)',
                  borderLeft: '4px solid #764ba2'
                }}
              >
                <Statistic
                  title={<span style={{ fontSize: '16px', fontWeight: 600 }}>Total Bookings</span>}
                  value={orders.length}
                  prefix={<ShoppingOutlined style={{ color: '#764ba2' }} />}
                  valueStyle={{ color: '#764ba2', fontSize: '32px', fontWeight: 700 }}
                />
              </Card>
            </Col>
            <Col xs={24} sm={12} lg={8}>
              <Card
                hoverable
                style={{
                  background: 'linear-gradient(135deg, rgba(240, 147, 251, 0.1) 0%, rgba(245, 87, 108, 0.1) 100%)',
                  borderLeft: '4px solid #f093fb'
                }}
              >
                <Statistic
                  title={<span style={{ fontSize: '16px', fontWeight: 600 }}>New Today</span>}
                  value={customers.filter(c => new Date(c.created_at).toDateString() === new Date().toDateString()).length}
                  prefix={<RocketOutlined style={{ color: '#f093fb' }} />}
                  valueStyle={{ color: '#f093fb', fontSize: '32px', fontWeight: 700 }}
                  suffix={<span style={{ fontSize: '16px', fontWeight: 400 }}>customers</span>}
                />
              </Card>
            </Col>
          </Row>

          <Card
            title={<span style={{ fontSize: '20px', fontWeight: 600 }}>Customer Management</span>}
            extra={
              <Button
                type="primary"
                icon={<PlusOutlined />}
                onClick={() => setModalVisible(true)}
                size="large"
              >
                Add Customer
              </Button>
            }
            style={{ marginTop: '16px' }}
          >
            <Space style={{ marginBottom: 20, width: '100%' }} direction="vertical" size="middle">
              <Input
                placeholder="Search customers by name, email or phone..."
                prefix={<SearchOutlined />}
                value={searchText}
                onChange={(e) => setSearchText(e.target.value)}
                style={{ width: 400 }}
                size="large"
                allowClear
              />
            </Space>

            <Table
              columns={columns}
              dataSource={customers}
              rowKey="id"
              loading={isLoading}
              pagination={{
                pageSize: 10,
                showSizeChanger: true,
                showTotal: (total) => `Total ${total} customers`
              }}
            />
          </Card>

          <AddCustomerModal
            visible={modalVisible}
            onCancel={() => setModalVisible(false)}
            onSuccess={() => setModalVisible(false)}
          />
        </div>
      </Content>
    </Layout>
  );
};

export default Dashboard;
