import crypto from 'node:crypto'

import { cookies } from 'next/headers'

export const ADMIN_COOKIE_NAME = 'zakaz_admin_session'

function getAdminPassword() {
  return process.env.ADMIN_PASSWORD ?? ''
}

function createSessionValue() {
  const password = getAdminPassword()
  const secret = process.env.ADMIN_SESSION_SECRET || password

  return crypto.createHash('sha256').update(`${password}:${secret}`).digest('hex')
}

export function isAdminPasswordConfigured() {
  return getAdminPassword().length > 0
}

export function validateAdminPassword(password: string) {
  return isAdminPasswordConfigured() && password === getAdminPassword()
}

export async function isAdminAuthenticated() {
  if (!isAdminPasswordConfigured()) {
    return false
  }

  const cookieStore = await cookies()
  return cookieStore.get(ADMIN_COOKIE_NAME)?.value === createSessionValue()
}

export function getAdminSessionValue() {
  return createSessionValue()
}
