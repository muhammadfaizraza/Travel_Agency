import React from 'react';
import { Modal, Form, Input, message } from 'antd';
import { useCreateCustomerMutation } from '../store/api';
import { CreateCustomerData } from '../types';

interface AddCustomerModalProps {
  visible: boolean;
  onCancel: () => void;
  onSuccess: () => void;
}

const AddCustomerModal: React.FC<AddCustomerModalProps> = ({
  visible,
  onCancel,
  onSuccess,
}) => {
  const [form] = Form.useForm();
  const [createCustomer, { isLoading }] = useCreateCustomerMutation();

  const handleSubmit = async () => {
    try {
      const values = await form.validateFields();

      await createCustomer(values as CreateCustomerData).unwrap();
      message.success('Customer added successfully!');
      form.resetFields();
      onSuccess();
    } catch (error: any) {
      if (error.data) {
        message.error(error.data.message || 'Failed to add customer');
      } else {
        message.error('Failed to add customer');
      }
    }
  };

  const handleCancel = () => {
    form.resetFields();
    onCancel();
  };

  return (
    <Modal
      title="Add New Customer"
      open={visible}
      onOk={handleSubmit}
      onCancel={handleCancel}
      confirmLoading={isLoading}
      okText="Add Customer"
    >
      <Form form={form} layout="vertical">
        <Form.Item
          name="first_name"
          label="First Name"
          rules={[{ required: true, message: 'Please enter first name' }]}
        >
          <Input placeholder="John" />
        </Form.Item>

        <Form.Item
          name="last_name"
          label="Last Name"
          rules={[{ required: true, message: 'Please enter last name' }]}
        >
          <Input placeholder="Doe" />
        </Form.Item>

        <Form.Item
          name="email"
          label="Email"
          rules={[
            { required: true, message: 'Please enter email' },
            { type: 'email', message: 'Please enter a valid email' },
          ]}
        >
          <Input placeholder="john.doe@example.com" />
        </Form.Item>

        <Form.Item
          name="phone_number"
          label="Phone Number"
          rules={[{ required: true, message: 'Please enter phone number' }]}
        >
          <Input placeholder="+1234567890" />
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default AddCustomerModal;
