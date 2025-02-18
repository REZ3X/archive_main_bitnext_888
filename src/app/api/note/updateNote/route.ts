import { NextResponse } from 'next/server';
import pool from '../../db/db';

export async function PUT(request: Request) {
  try {
    const { id, title, content, projectId } = await request.json();
    const connection = await pool.getConnection();
    await connection.beginTransaction();

    try {
      // Update note content
      await connection.execute(
        'UPDATE notes SET title = ?, content = ? WHERE id = ?',
        [title, content, id]
      );

      // Handle project association
      await connection.execute('DELETE FROM project_notes WHERE note_id = ?', [id]);
      
      if (projectId) {
        await connection.execute(
          'INSERT INTO project_notes (project_id, note_id) VALUES (?, ?)',
          [projectId, id]
        );
      }

      await connection.commit();
      connection.release();
      return NextResponse.json({ message: 'Note updated successfully' });
    } catch (error) {
      await connection.rollback();
      connection.release();
      throw error;
    }
  } catch (error) {
    console.error(error);
    return NextResponse.json({ message: 'Internal server error' }, { status: 500 });
  }
}