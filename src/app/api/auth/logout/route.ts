import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import pool from '../../db/db';

export async function POST() {
  try {
    const sessionId = (await cookies()).get('session')?.value;

    if (sessionId) {
      const connection = await pool.getConnection();
      await connection.execute(
        'DELETE FROM sessions WHERE id = ?',
        [sessionId]
      );
      connection.release();
    }

    (await cookies()).delete('session');

    return NextResponse.json({ message: 'Logged out successfully' });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { message: 'Internal server error' },
      { status: 500 }
    );
  }
}