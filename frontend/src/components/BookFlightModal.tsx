import React from 'react';
import { Modal, Form, Select, DatePicker, InputNumber, message } from 'antd';
import { useCreateOrderMutation } from '../store/api';
import { CreateOrderData } from '../types';
import { CITIES } from '../utils/citiesData';

interface BookFlightModalProps {
  visible: boolean;
  customerId: number;
  onCancel: () => void;
  onSuccess: () => void;
}

const BookFlightModal: React.FC<BookFlightModalProps> = ({
  visible,
  customerId,
  onCancel,
  onSuccess,
}) => {
  const [form] = Form.useForm();
  const [createOrder, { isLoading }] = useCreateOrderMutation();

  const handleSubmit = async () => {
    try {
      const values = await form.validateFields();

      const orderData: CreateOrderData = {
        customer_id: customerId,
        departure_city: values.departure_city,
        destination_city: values.destination_city,
        travel_date: values.travel_date.format('YYYY-MM-DD'),
        flight_price: values.flight_price,
      };

      await createOrder(orderData).unwrap();
      message.success('Flight booked successfully!');
      form.resetFields();
      onSuccess();
    } catch (error: any) {
      if (error.data) {
        message.error(error.data.message || 'Failed to book flight');
      } else {
        message.error('Failed to book flight');
      }
    }
  };

  const handleCancel = () => {
    form.resetFields();
    onCancel();
  };

  return (
    <Modal
      title="Book Flight"
      open={visible}
      onOk={handleSubmit}
      onCancel={handleCancel}
      confirmLoading={isLoading}
      okText="Book Flight"
    >
      <Form form={form} layout="vertical">
        <Form.Item
          name="departure_city"
          label="Departure City"
          rules={[{ required: true, message: 'Please select departure city' }]}
        >
          <Select
            showSearch
            placeholder="Select or search departure city"
            optionFilterProp="children"
            filterOption={(input, option) =>
              (option?.label ?? '').toLowerCase().includes(input.toLowerCase())
            }
            options={CITIES.map(city => ({ label: city, value: city }))}
          />
        </Form.Item>

        <Form.Item
          name="destination_city"
          label="Destination City"
          rules={[{ required: true, message: 'Please select destination city' }]}
        >
          <Select
            showSearch
            placeholder="Select or search destination city"
            optionFilterProp="children"
            filterOption={(input, option) =>
              (option?.label ?? '').toLowerCase().includes(input.toLowerCase())
            }
            options={CITIES.map(city => ({ label: city, value: city }))}
          />
        </Form.Item>

        <Form.Item
          name="travel_date"
          label="Travel Date"
          rules={[{ required: true, message: 'Please select travel date' }]}
        >
          <DatePicker style={{ width: '100%' }} />
        </Form.Item>

        <Form.Item
          name="flight_price"
          label="Flight Price"
          rules={[
            { required: true, message: 'Please enter flight price' },
            { type: 'number', min: 0, message: 'Price must be positive' },
          ]}
        >
          <InputNumber
            style={{ width: '100%' }}
            prefix="$"
            precision={2}
            placeholder="299.99"
          />
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default BookFlightModal;
