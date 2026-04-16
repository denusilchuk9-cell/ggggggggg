import crypto from 'node:crypto'

import { NextResponse } from 'next/server'

import { isAdminAuthenticated } from '@/app/lib/admin-auth'

function createCloudinarySignature(timestamp: string, folder: string, apiSecret: string) {
  const signatureBase = `folder=${folder}&timestamp=${timestamp}${apiSecret}`
  return crypto.createHash('sha1').update(signatureBase).digest('hex')
}

export async function POST(request: Request) {
  if (!(await isAdminAuthenticated())) {
    return NextResponse.json({ error: 'Потрібен вхід в адмінку.' }, { status: 401 })
  }

  const cloudName = process.env.CLOUDINARY_CLOUD_NAME
  const apiKey = process.env.CLOUDINARY_API_KEY
  const apiSecret = process.env.CLOUDINARY_API_SECRET

  if (!cloudName || !apiKey || !apiSecret) {
    return NextResponse.json(
      { error: 'Cloudinary ще не налаштований на сервері.' },
      { status: 500 }
    )
  }

  const formData = await request.formData()
  const file = formData.get('file')

  if (!(file instanceof File) || file.size === 0) {
    return NextResponse.json({ error: 'Фото не завантажено.' }, { status: 400 })
  }

  const timestamp = Math.floor(Date.now() / 1000).toString()
  const folder = 'zakaz-products'
  const signature = createCloudinarySignature(timestamp, folder, apiSecret)

  const uploadFormData = new FormData()
  uploadFormData.set('file', file)
  uploadFormData.set('api_key', apiKey)
  uploadFormData.set('timestamp', timestamp)
  uploadFormData.set('folder', folder)
  uploadFormData.set('signature', signature)

  const response = await fetch(`https://api.cloudinary.com/v1_1/${cloudName}/image/upload`, {
    method: 'POST',
    body: uploadFormData,
  })

  const data = (await response.json()) as { secure_url?: string; error?: { message?: string } }

  if (!response.ok || !data.secure_url) {
    return NextResponse.json(
      { error: data.error?.message || 'Не вдалося завантажити фото.' },
      { status: 502 }
    )
  }

  return NextResponse.json({ imageUrl: data.secure_url })
}
