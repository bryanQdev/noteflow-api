import { NextResponse } from 'next/server';
import { query } from '@/lib/db';
import { z } from 'zod';

const itemSchema = z.object({
  text: z.string().min(1),
});

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const items = await query(
      'SELECT * FROM checklist_items WHERE note_id = $1',
      [params.id]
    );
    return NextResponse.json(items);
  } catch {
    return NextResponse.json({ error: 'Error interno' }, { status: 500 });
  }
}

export async function POST(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const body = await request.json();
    const result = itemSchema.safeParse(body);
    if (!result.success) {
      return NextResponse.json({ errors: result.error.issues }, { status: 400 });
    }
    const [item] = await query(
      'INSERT INTO checklist_items (note_id, text) VALUES ($1, $2) RETURNING *',
      [params.id, result.data.text]
    );
    return NextResponse.json(item, { status: 201 });
  } catch {
    return NextResponse.json({ error: 'Error interno' }, { status: 500 });
  }
}