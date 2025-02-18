import { NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import { v4 as uuidv4 } from 'uuid';
import pool from '../../db/db';

interface UserRecord {
  id: string;
  username: string;
  email: string;
  password: string;
}

export async function POST(request: Request) {
  try {
    const { username, email, password } = await request.json();

    // Input validation
    if (!username || !email || !password) {
      return NextResponse.json(
        { message: 'All fields are required' },
        { status: 400 }
      );
    }

    const connection = await pool.getConnection();
    const [existing] = await connection.execute(
      'SELECT * FROM users WHERE username = ? OR email = ?',
      [username, email]
    );

    if ((existing as UserRecord[]).length > 0) {
      connection.release();
      return NextResponse.json(
        { message: 'Username or email already exists' },
        { status: 400 }
      );
    }

    // Hash password and create user
    const hashedPassword = await bcrypt.hash(password, 10);
    const userId = uuidv4();

    await connection.execute(
      'INSERT INTO users (id, username, email, password) VALUES (?, ?, ?, ?)',
      [userId, username, email, hashedPassword]
    );

    connection.release();
    return NextResponse.json({ message: 'User created successfully' });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { message: 'Internal server error' },
      { status: 500 }
    );
  }
}