import { NextResponse } from 'next/server'

import {
  ADMIN_COOKIE_NAME,
  getAdminSessionValue,
  isAdminPasswordConfigured,
  validateAdminPassword,
} from '@/app/lib/admin-auth'

export async function POST(request: Request) {
  if (!isAdminPasswordConfigured()) {
    return NextResponse.json(
      { error: 'ADMIN_PASSWORD ще не налаштований на сервері.' },
      { status: 500 }
    )
  }

  const { password } = (await request.json()) as { password?: string }

  if (!password || !validateAdminPassword(password)) {
    return NextResponse.json({ error: 'Неправильний пароль.' }, { status: 401 })
  }

  const response = NextResponse.json({ ok: true })
  response.cookies.set(ADMIN_COOKIE_NAME, getAdminSessionValue(), {
    httpOnly: true,
    sameSite: 'lax',
    secure: process.env.NODE_ENV === 'production',
    path: '/',
    maxAge: 60 * 60 * 24 * 7,
  })

  return response
}
