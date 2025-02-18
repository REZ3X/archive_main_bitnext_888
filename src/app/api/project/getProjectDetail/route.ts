import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import pool from '../../db/db';

import { RowDataPacket } from 'mysql2';

interface SessionRecord extends RowDataPacket {
  user_id: string;
}

interface ProjectRecord extends RowDataPacket {
  id: string;
  user_id: string;
  name: string;
}

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const projectId = searchParams.get('id');
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
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }

    const userId = sessions[0].user_id;
    const [projects] = await connection.execute<ProjectRecord[]>(
      'SELECT * FROM projects WHERE id = ? AND user_id = ?',
      [projectId, userId]
    );

    if (!projects[0]) {
      connection.release();
      return NextResponse.json({ message: 'Project not found' }, { status: 404 });
    }

    const [notes] = await connection.execute(`
      SELECT n.*, p.id as project_id, p.name as project_name
      FROM notes n
      JOIN project_notes pn ON n.id = pn.note_id
      JOIN projects p ON pn.project_id = p.id
      WHERE p.id = ? AND n.user_id = ?
      ORDER BY n.created_at DESC
    `, [projectId, userId]);

    connection.release();
    return NextResponse.json({ 
      project: (projects as ProjectRecord[])[0],
      notes 
    });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ message: 'Internal server error' }, { status: 500 });
  }
}