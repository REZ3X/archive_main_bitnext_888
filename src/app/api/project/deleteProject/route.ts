import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import pool from '../../db/db';
import { RowDataPacket, ResultSetHeader } from 'mysql2';

interface SessionRecord extends RowDataPacket {
  user_id: string;
}

export async function DELETE(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const projectId = searchParams.get('id');
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

    const [result] = await connection.execute<ResultSetHeader>(
      'DELETE FROM projects WHERE id = ? AND user_id = ?',
      [projectId, userId]
    );

    connection.release();

    if (result.affectedRows === 0) {
      return NextResponse.json({ message: 'Project not found or unauthorized' }, { status: 404 });
    }

    return NextResponse.json({ message: 'Project deleted successfully' });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ message: 'Internal server error' }, { status: 500 });
  }
}