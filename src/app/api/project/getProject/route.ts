import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import pool from '../../db/db';
import { RowDataPacket } from 'mysql2';

interface SessionRecord extends RowDataPacket {
  user_id: string;
}

export async function GET() {
  try {
    const sessionId = (await cookies()).get('session')?.value;

    if (!sessionId) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }

    const connection = await pool.getConnection();
    
    const [sessions] = await connection.execute<SessionRecord[]>(
      'SELECT user_id FROM sessions WHERE id = ?',
      [sessionId]
    );

    if (!sessions[0]) {
      connection.release();
      return NextResponse.json({ message: 'Invalid session' }, { status: 401 });
    }

    const userId = sessions[0].user_id;

    const [projects] = await connection.execute(
      'SELECT * FROM projects WHERE user_id = ? ORDER BY created_at DESC',
      [userId]
    );

    connection.release();
    return NextResponse.json({ projects });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ message: 'Internal server error' }, { status: 500 });
  }
}