import { NextResponse } from 'next/server'

type OrderPayload = {
  productId?: string
  productName?: string
  productPrice?: string
  name?: string
  surname?: string
  phone?: string
  address?: string
  email?: string
}

const requiredFields: Array<keyof OrderPayload> = [
  'productName',
  'productPrice',
  'name',
  'surname',
  'phone',
  'address',
  'email',
]

// Функція для відправки повідомлення в адмін бота
async function sendToAdminBot(message: string) {
  const adminBotToken = process.env.ADMIN_BOT_TOKEN
  const adminChatId = process.env.ADMIN_CHAT_ID

  if (!adminBotToken || !adminChatId) {
    console.log('Admin bot not configured')
    return false
  }

  try {
    const response = await fetch(`https://api.telegram.org/bot${adminBotToken}/sendMessage`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        chat_id: adminChatId,
        text: message,
        parse_mode: 'HTML',
      }),
    })
    return response.ok
  } catch (error) {
    console.error('Failed to send to admin bot:', error)
    return false
  }
}

export async function POST(request: Request) {
  const botToken = process.env.TELEGRAM_BOT_TOKEN
  const chatId = process.env.TELEGRAM_CHAT_ID

  if (!botToken || !chatId) {
    return NextResponse.json(
      { error: 'Telegram bot is not configured on the server.' },
      { status: 500 }
    )
  }

  let payload: OrderPayload

  try {
    payload = await request.json()
  } catch {
    return NextResponse.json({ error: 'Некоректні дані замовлення.' }, { status: 400 })
  }

  for (const field of requiredFields) {
    if (!payload[field]?.toString().trim()) {
      return NextResponse.json({ error: 'Будь ласка, заповніть усі поля форми.' }, { status: 400 })
    }
  }

  const messageLines = [
    '🛍 <b>НОВЕ ЗАМОВЛЕННЯ!</b>',
    '',
    `📦 Товар: ${payload.productName}`,
    `💰 Ціна: ${payload.productPrice}`,
    payload.productId ? `🆔 ID товару: ${payload.productId}` : null,
    '',
    `👤 Ім'я: ${payload.name} ${payload.surname}`,
    `📞 Телефон: ${payload.phone}`,
    `🏠 Адреса: ${payload.address}`,
    `📧 Email: ${payload.email}`,
    '',
    `🕐 Час: ${new Date().toLocaleString('uk-UA', { timeZone: 'Europe/Kiev' })}`,
  ].filter(Boolean)

  const telegramResponse = await fetch(`https://api.telegram.org/bot${botToken}/sendMessage`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      chat_id: chatId,
      text: messageLines.join('\n'),
      parse_mode: 'HTML',
    }),
  })

  // Відправляємо також в адмін бота (гарне форматування)
  const adminMessage = [
    '🛍 <b>НОВЕ ЗАМОВЛЕННЯ НА САЙТІ!</b>',
    '',
    '╔════════════════════════════╗',
    `║ 📦 <b>Товар:</b> ${payload.productName}`,
    `║ 💰 <b>Ціна:</b> ${payload.productPrice}`,
    '╠════════════════════════════╣',
    `║ 👤 <b>Клієнт:</b> ${payload.name} ${payload.surname}`,
    `║ 📞 <b>Телефон:</b> ${payload.phone}`,
    `║ 🏠 <b>Адреса:</b> ${payload.address}`,
    `║ 📧 <b>Email:</b> ${payload.email}`,
    '╠════════════════════════════╣',
    `║ 🕐 <b>Час:</b> ${new Date().toLocaleString('uk-UA')}`,
    '╚════════════════════════════╝',
  ].join('\n')

  await sendToAdminBot(adminMessage)

  if (!telegramResponse.ok) {
    const telegramError = await telegramResponse.text()
    return NextResponse.json(
      {
        error: 'Не вдалося відправити повідомлення в Telegram.',
        details: telegramError,
      },
      { status: 502 }
    )
  }

  return NextResponse.json({ ok: true })
}