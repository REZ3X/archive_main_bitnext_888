import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { v4 as uuidv4 } from 'uuid';
import pool from '../../db/db';
import { RowDataPacket } from 'mysql2';

interface SessionRecord extends RowDataPacket {
  user_id: string;
}

export async function POST(request: Request) {
  try {
    const { name } = await request.json();
    const cookieStore = await cookies();
    const sessionId = cookieStore.get('session')?.value;

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
    const projectId = uuidv4();

    await connection.execute(
      'INSERT INTO projects (id, user_id, name) VALUES (?, ?, ?)',
      [projectId, userId, name]
    );

    connection.release();
    return NextResponse.json({ message: 'Project created successfully' });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ message: 'Internal server error' }, { status: 500 });
  }
}