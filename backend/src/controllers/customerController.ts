import { Response } from 'express';
import pool from '../config/database';
import { AuthRequest, Customer } from '../types';
import { RowDataPacket } from 'mysql2';

export const getCustomers = async (
  req: AuthRequest,
  res: Response
): Promise<void> => {
  try {
    const { search } = req.query;

    let query = 'SELECT * FROM customers';
    let params: any[] = [];

    if (search) {
      query += ' WHERE first_name LIKE ? OR last_name LIKE ? OR email LIKE ?';
      const searchPattern = `%${search}%`;
      params = [searchPattern, searchPattern, searchPattern];
    }

    query += ' ORDER BY created_at DESC';

    const [customers] = await pool.query<(Customer & RowDataPacket)[]>(
      query,
      params
    );

    res.json(customers);
  } catch (error) {
    console.error('Get customers error:', error);
    res.status(500).json({ message: 'Server error fetching customers' });
  }
};

export const getCustomerById = async (
  req: AuthRequest,
  res: Response
): Promise<void> => {
  try {
    const { id } = req.params;

    const [customers] = await pool.query<(Customer & RowDataPacket)[]>(
      'SELECT * FROM customers WHERE id = ?',
      [id]
    );

    if (customers.length === 0) {
      res.status(404).json({ message: 'Customer not found' });
      return;
    }

    res.json(customers[0]);
  } catch (error) {
    console.error('Get customer error:', error);
    res.status(500).json({ message: 'Server error fetching customer' });
  }
};

export const createCustomer = async (
  req: AuthRequest,
  res: Response
): Promise<void> => {
  try {
    const { first_name, last_name, email, phone_number } = req.body;

    if (!first_name || !last_name || !email || !phone_number) {
      res.status(400).json({ message: 'All fields are required' });
      return;
    }

    const [existingCustomer] = await pool.query<RowDataPacket[]>(
      'SELECT id FROM customers WHERE email = ?',
      [email]
    );

    if (existingCustomer.length > 0) {
      res.status(400).json({ message: 'Customer with this email already exists' });
      return;
    }

    const [result] = await pool.query(
      'INSERT INTO customers (first_name, last_name, email, phone_number) VALUES (?, ?, ?, ?)',
      [first_name, last_name, email, phone_number]
    );

    res.status(201).json({
      message: 'Customer created successfully',
      customerId: (result as any).insertId
    });
  } catch (error) {
    console.error('Create customer error:', error);
    res.status(500).json({ message: 'Server error creating customer' });
  }
};
