import { NextResponse } from 'next/server';
import { v4 as uuidv4 } from 'uuid';
import { cookies } from 'next/headers';
import pool from '../../db/db';
import { RowDataPacket } from 'mysql2';

interface SessionRecord extends RowDataPacket {
  user_id: string;
}

export async function POST(request: Request) {
    try {
      const { title, content, projectId } = await request.json();
      const cookieStore = await cookies();
      const sessionId = cookieStore.get('session')?.value;
  
      if (!sessionId) {
        return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
      }
  
      const connection = await pool.getConnection();
      await connection.beginTransaction();
  
      try {
        const [sessions] = await connection.execute<SessionRecord[]>(
          'SELECT user_id FROM sessions WHERE id = ?',
          [sessionId]
        );
  
        if (!sessions[0]) {
          await connection.rollback();
          connection.release();
          return NextResponse.json({ message: 'Invalid session' }, { status: 401 });
        }
  
        const userId = sessions[0].user_id;
        const noteId = uuidv4();
  
        await connection.execute(
          'INSERT INTO notes (id, user_id, title, content) VALUES (?, ?, ?, ?)',
          [noteId, userId, title, content]
        );
  
        if (projectId) {
          await connection.execute(
            'INSERT INTO project_notes (project_id, note_id) VALUES (?, ?)',
            [projectId, noteId]
          );
        }
  
        await connection.commit();
        connection.release();
        return NextResponse.json({ message: 'Note created successfully' });
      } catch (error) {
        await connection.rollback();
        throw error;
      }
    } catch (error) {
      console.error(error);
      return NextResponse.json({ message: 'Internal server error' }, { status: 500 });
    }
  }