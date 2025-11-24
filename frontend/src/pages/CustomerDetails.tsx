import React, { useState } from 'react';
import {
  Layout,
  Card,
  Descriptions,
  Table,
  Button,
  Typography,
  Statistic,
  Row,
  Col,
  Tag,
  Space,
  Avatar
} from 'antd';
import {
  ArrowLeftOutlined,
  PlusOutlined,
  DollarOutlined,
  UserOutlined,
  MailOutlined,
  PhoneOutlined,
  CalendarOutlined,
  RocketOutlined
} from '@ant-design/icons';
import { useParams, useNavigate } from 'react-router-dom';
import {
  useGetCustomerByIdQuery,
  useGetOrdersByCustomerQuery,
  useGetCustomerRevenueQuery
} from '../store/api';
import BookFlightModal from '../components/BookFlightModal';

const { Header, Content } = Layout;
const { Title, Text } = Typography;

const CustomerDetails: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [modalVisible, setModalVisible] = useState(false);

  const customerId = parseInt(id!);
  const { data: customer } = useGetCustomerByIdQuery(customerId);
  const { data: orders = [], isLoading } = useGetOrdersByCustomerQuery(customerId);
  const { data: revenueData } = useGetCustomerRevenueQuery(customerId);
  const totalRevenue = revenueData?.totalRevenue || 0;

  const columns = [
    {
      title: 'From',
      dataIndex: 'departure_city',
      key: 'departure_city',
    },
    {
      title: 'To',
      dataIndex: 'destination_city',
      key: 'destination_city',
    },
    {
      title: 'Travel Date',
      dataIndex: 'travel_date',
      key: 'travel_date',
      render: (date: string) => new Date(date).toLocaleDateString(),
    },
    {
      title: 'Price',
      dataIndex: 'flight_price',
      key: 'flight_price',
      render: (price: number) => `$${(Number(price) || 0).toFixed(2)}`,
    },
    {
      title: 'Booked On',
      dataIndex: 'created_at',
      key: 'created_at',
      render: (date: string) => new Date(date).toLocaleDateString(),
    },
  ];

  if (!customer) {
    return <div>Loading...</div>;
  }

  return (
    <Layout style={{ minHeight: '100vh' }}>
      <Header style={{
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        padding: '0 32px',
        display: 'flex',
        alignItems: 'center',
        boxShadow: '0 4px 12px rgba(102, 126, 234, 0.3)',
        height: '70px'
      }}>
        <Button
          icon={<ArrowLeftOutlined />}
          onClick={() => navigate('/dashboard')}
          style={{
            marginRight: 16,
            background: 'rgba(255, 255, 255, 0.2)',
            color: '#fff',
            border: '1px solid rgba(255, 255, 255, 0.3)',
            fontWeight: 500
          }}
          size="large"
        >
          Back
        </Button>
        <Space>
          <UserOutlined style={{ fontSize: '24px', color: '#fff' }} />
          <Title level={3} style={{ margin: 0, color: '#fff', fontWeight: 600 }}>
            Customer Profile
          </Title>
        </Space>
      </Header>

      <Content style={{ padding: '32px', maxWidth: '1400px', margin: '0 auto', width: '100%' }}>
        <div className="fade-in-up">
          <Card
            style={{
              marginBottom: 32,
              background: 'linear-gradient(135deg, rgba(102, 126, 234, 0.05) 0%, rgba(118, 75, 162, 0.05) 100%)'
            }}
          >
            <Row gutter={24} align="middle">
              <Col>
                <Avatar
                  size={80}
                  style={{
                    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                    fontSize: '32px'
                  }}
                  icon={<UserOutlined />}
                />
              </Col>
              <Col flex="auto">
                <Title level={2} style={{ margin: 0, marginBottom: '8px' }}>
                  {customer.first_name} {customer.last_name}
                </Title>
                <Space size="large" wrap>
                  <Space>
                    <MailOutlined style={{ color: '#667eea' }} />
                    <Text strong>{customer.email}</Text>
                  </Space>
                  <Space>
                    <PhoneOutlined style={{ color: '#764ba2' }} />
                    <Text strong>{customer.phone_number}</Text>
                  </Space>
                  <Space>
                    <CalendarOutlined style={{ color: '#f093fb' }} />
                    <Text>Customer since {new Date(customer.created_at).toLocaleDateString()}</Text>
                  </Space>
                </Space>
              </Col>
            </Row>
          </Card>

          <Row gutter={[24, 24]} style={{ marginBottom: 32 }}>
            <Col xs={24} sm={12}>
              <Card
                hoverable
                style={{
                  background: 'linear-gradient(135deg, rgba(102, 126, 234, 0.1) 0%, rgba(118, 75, 162, 0.1) 100%)',
                  borderLeft: '4px solid #667eea'
                }}
              >
                <Statistic
                  title={<span style={{ fontSize: '16px', fontWeight: 600 }}>Total Bookings</span>}
                  value={orders.length}
                  prefix={<RocketOutlined style={{ color: '#667eea' }} />}
                  valueStyle={{ color: '#667eea', fontSize: '32px', fontWeight: 700 }}
                />
              </Card>
            </Col>
            <Col xs={24} sm={12}>
              <Card
                hoverable
                style={{
                  background: 'linear-gradient(135deg, rgba(118, 75, 162, 0.1) 0%, rgba(102, 126, 234, 0.1) 100%)',
                  borderLeft: '4px solid #764ba2'
                }}
              >
                <Statistic
                  title={<span style={{ fontSize: '16px', fontWeight: 600 }}>Total Revenue</span>}
                  value={totalRevenue}
                  prefix={<DollarOutlined style={{ color: '#764ba2' }} />}
                  precision={2}
                  valueStyle={{ color: '#764ba2', fontSize: '32px', fontWeight: 700 }}
                />
              </Card>
            </Col>
          </Row>

          <Card
            title={<span style={{ fontSize: '20px', fontWeight: 600 }}>Flight Bookings History</span>}
            extra={
              <Button
                type="primary"
                icon={<PlusOutlined />}
                onClick={() => setModalVisible(true)}
                size="large"
              >
                Book Flight
              </Button>
            }
          >
            <Table
              columns={columns}
              dataSource={orders}
              rowKey="id"
              loading={isLoading}
              pagination={{
                pageSize: 10,
                showSizeChanger: true,
                showTotal: (total) => `Total ${total} bookings`
              }}
              locale={{ emptyText: 'No bookings yet. Click "Book Flight" to add one!' }}
            />
          </Card>

          <BookFlightModal
            visible={modalVisible}
            customerId={customerId}
            onCancel={() => setModalVisible(false)}
            onSuccess={() => setModalVisible(false)}
          />
        </div>
      </Content>
    </Layout>
  );
};

export default CustomerDetails;
