import { Response } from 'express';
import pool from '../config/database';
import { AuthRequest, Order } from '../types';
import { RowDataPacket } from 'mysql2';

export const getOrdersByCustomer = async (
  req: AuthRequest,
  res: Response
): Promise<void> => {
  try {
    const { customerId } = req.params;

    const [orders] = await pool.query<(Order & RowDataPacket)[]>(
      'SELECT * FROM orders WHERE customer_id = ? ORDER BY travel_date DESC',
      [customerId]
    );

    res.json(orders);
  } catch (error) {
    console.error('Get orders error:', error);
    res.status(500).json({ message: 'Server error fetching orders' });
  }
};

export const createOrder = async (
  req: AuthRequest,
  res: Response
): Promise<void> => {
  try {
    const { customer_id, departure_city, destination_city, travel_date, flight_price } = req.body;

    if (!customer_id || !departure_city || !destination_city || !travel_date || !flight_price) {
      res.status(400).json({ message: 'All fields are required' });
      return;
    }

    const [customers] = await pool.query<RowDataPacket[]>(
      'SELECT id FROM customers WHERE id = ?',
      [customer_id]
    );

    if (customers.length === 0) {
      res.status(404).json({ message: 'Customer not found' });
      return;
    }

    const [result] = await pool.query(
      'INSERT INTO orders (customer_id, departure_city, destination_city, travel_date, flight_price) VALUES (?, ?, ?, ?, ?)',
      [customer_id, departure_city, destination_city, travel_date, flight_price]
    );

    res.status(201).json({
      message: 'Flight booked successfully',
      orderId: (result as any).insertId
    });
  } catch (error) {
    console.error('Create order error:', error);
    res.status(500).json({ message: 'Server error creating order' });
  }
};

export const getCustomerRevenue = async (
  req: AuthRequest,
  res: Response
): Promise<void> => {
  try {
    const { customerId } = req.params;

    const [result] = await pool.query<RowDataPacket[]>(
      'SELECT SUM(flight_price) as total_revenue FROM orders WHERE customer_id = ?',
      [customerId]
    );

    res.json({
      customerId: parseInt(customerId),
      totalRevenue: result[0]?.total_revenue || 0
    });
  } catch (error) {
    console.error('Get revenue error:', error);
    res.status(500).json({ message: 'Server error calculating revenue' });
  }
};

export const getAllOrders = async (
  req: AuthRequest,
  res: Response
): Promise<void> => {
  try {
    const [orders] = await pool.query<(Order & RowDataPacket)[]>(
      `SELECT o.*, c.first_name, c.last_name, c.email
       FROM orders o
       JOIN customers c ON o.customer_id = c.id
       ORDER BY o.created_at DESC`
    );

    res.json(orders);
  } catch (error) {
    console.error('Get all orders error:', error);
    res.status(500).json({ message: 'Server error fetching orders' });
  }
};
