import { Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import pool from '../config/database';
import { Staff } from '../types';
import { RowDataPacket } from 'mysql2';

export const register = async (req: Request, res: Response): Promise<void> => {
  try {
    const { email, password, full_name } = req.body;

    if (!email || !password || !full_name) {
      res.status(400).json({ message: 'All fields are required' });
      return;
    }

    const [existingUser] = await pool.query<RowDataPacket[]>(
      'SELECT id FROM staff WHERE email = ?',
      [email]
    );

    if (existingUser.length > 0) {
      res.status(400).json({ message: 'User already exists' });
      return;
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const [result] = await pool.query(
      'INSERT INTO staff (email, password, full_name) VALUES (?, ?, ?)',
      [email, hashedPassword, full_name]
    );

    res.status(201).json({
      message: 'User registered successfully',
      userId: (result as any).insertId
    });
  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({ message: 'Server error during registration' });
  }
};

export const login = async (req: Request, res: Response): Promise<void> => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      res.status(400).json({ message: 'Email and password are required' });
      return;
    }

    const [users] = await pool.query<(Staff & RowDataPacket)[]>(
      'SELECT * FROM staff WHERE email = ?',
      [email]
    );

    if (users.length === 0) {
      res.status(401).json({ message: 'Invalid credentials' });
      return;
    }

    const user = users[0];

    const isValidPassword = await bcrypt.compare(password, user.password);

    if (!isValidPassword) {
      res.status(401).json({ message: 'Invalid credentials' });
      return;
    }

    const token = jwt.sign(
      { id: user.id, email: user.email },
      process.env.JWT_SECRET || 'secret',
      { expiresIn: '24h' }
    );

    res.json({
      message: 'Login successful',
      token,
      user: {
        id: user.id,
        email: user.email,
        full_name: user.full_name
      }
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ message: 'Server error during login' });
  }
};
