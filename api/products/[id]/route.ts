import { NextResponse } from 'next/server'

import { isAdminAuthenticated } from '@/app/lib/admin-auth'
import { deleteProduct } from '@/app/lib/products'

export async function DELETE(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  if (!(await isAdminAuthenticated())) {
    return NextResponse.json({ error: 'Потрібен вхід в адмінку.' }, { status: 401 })
  }

  const { id } = await params
  const deleted = await deleteProduct(id)

  if (!deleted) {
    return NextResponse.json({ error: 'Товар не знайдено.' }, { status: 404 })
  }

  return NextResponse.json({ ok: true })
}
