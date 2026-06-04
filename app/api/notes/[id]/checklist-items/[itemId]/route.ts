import { NextResponse } from 'next/server';
import { query } from '@/lib/db';

export async function PATCH(
  request: Request,
  { params }: { params: { itemId: string } }
) {
  try {
    const { is_completed } = await request.json();
    const [item] = await query(
      'UPDATE checklist_items SET is_completed = $1 WHERE id = $2 RETURNING *',
      [is_completed, params.itemId]
    );
    if (!item) return NextResponse.json({ error: 'Item no encontrado' }, { status: 404 });
    return NextResponse.json(item);
  } catch {
    return NextResponse.json({ error: 'Error interno' }, { status: 500 });
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: { itemId: string } }
) {
  try {
    await query('DELETE FROM checklist_items WHERE id = $1', [params.itemId]);
    return new NextResponse(null, { status: 204 });
  } catch {
    return NextResponse.json({ error: 'Error interno' }, { status: 500 });
  }
}