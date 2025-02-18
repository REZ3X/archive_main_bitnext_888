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
        
        const [sessions] = await connection.execute<SessionRecord[]>('SELECT user_id FROM sessions WHERE id = ?', [sessionId]);
        
        if (!sessions.length) {
          connection.release();
          return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
        }
        
        const userId = sessions[0].user_id;
      
      const [notes] = await connection.execute(`
      SELECT 
        n.*,
        p.id as project_id,
        p.name as project_name
      FROM notes n
      LEFT JOIN project_notes pn ON n.id = pn.note_id
      LEFT JOIN projects p ON pn.project_id = p.id
      WHERE n.user_id = ?
      ORDER BY n.created_at DESC
    `, [userId]);

    connection.release();
    return NextResponse.json({ notes });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ message: 'Internal server error' }, { status: 500 });
  }
}