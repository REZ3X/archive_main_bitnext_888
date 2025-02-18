import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import pool from '../../db/db';
import { RowDataPacket, ResultSetHeader } from 'mysql2';

interface Session extends RowDataPacket {
  user_id: number;
}

export async function DELETE(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const noteId = searchParams.get('id');
    const cookieStore = await cookies();
    const sessionId = cookieStore.get('session')?.value;

    if (!sessionId) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }
    const connection = await pool.getConnection();
    const [sessions] = await connection.execute<Session[]>(
      'SELECT user_id FROM sessions WHERE id = ?',
      [sessionId]
    );

    if (!sessions[0]) {
      connection.release();
      return NextResponse.json({ message: 'Invalid session' }, { status: 401 });
    }

    const userId = sessions[0].user_id;

    // Delete note only if it belongs to the user
    const [result] = await connection.execute<ResultSetHeader>(
      'DELETE FROM notes WHERE id = ? AND user_id = ?',
      [noteId, userId]
    );

    connection.release();

    if (result.affectedRows === 0) {
      return NextResponse.json({ message: 'Note not found or unauthorized' }, { status: 404 });
    }

    return NextResponse.json({ message: 'Note deleted successfully' });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ message: 'Internal server error' }, { status: 500 });
  }
}