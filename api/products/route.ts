import { NextResponse } from 'next/server'

import { isAdminAuthenticated } from '@/app/lib/admin-auth'
import { addProduct, getProducts } from '@/app/lib/products'

export async function GET() {
  const products = await getProducts()
  return NextResponse.json({ products })
}

export async function POST(request: Request) {
  if (!(await isAdminAuthenticated())) {
    return NextResponse.json({ error: 'Потрібен вхід в адмінку.' }, { status: 401 })
  }

  let payload: { imageUrl?: string; name?: string; price?: string }

  try {
    payload = await request.json()
  } catch {
    return NextResponse.json({ error: 'Некоректні дані товару.' }, { status: 400 })
  }

  if (!payload.name?.trim() || !payload.price?.trim() || !payload.imageUrl?.trim()) {
    return NextResponse.json(
      { error: 'Заповніть назву, ціну та завантажте фото.' },
      { status: 400 }
    )
  }

  const product = await addProduct({
    name: payload.name,
    price: payload.price,
    imageUrl: payload.imageUrl,
  })

  return NextResponse.json({ product }, { status: 201 })
}
