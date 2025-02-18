import { NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import { v4 as uuidv4 } from 'uuid';
import pool from '../../db/db';
import { cookies } from 'next/headers';

interface User {
  id: number;
  username: string;
  password: string;
}

export async function POST(request: Request) {
  try {
    const { username, password } = await request.json();

    const connection = await pool.getConnection();
    const [users] = await connection.execute(
      'SELECT * FROM users WHERE username = ?',
      [username]
    );
    connection.release();

    const user = (users as User[])[0];
    if (!user || !await bcrypt.compare(password, user.password)) {
      return NextResponse.json(
        { message: 'Invalid credentials' },
        { status: 401 }
      );
    }

    const sessionId = uuidv4();
    const expires = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000); // 7 days

    await connection.execute(
      'INSERT INTO sessions (id, user_id, expires) VALUES (?, ?, ?)',
      [sessionId, user.id, expires]
    );

    (await cookies()).set('session', sessionId, {
      expires,
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/'
    });

    return NextResponse.json({ message: 'Login successful' });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { message: 'Internal server error' },
      { status: 500 }
    );
  }
}