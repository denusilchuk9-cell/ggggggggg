'use client'

import Image from 'next/image'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useState } from 'react'

import type { Product } from '@/app/lib/products'

type AdminPanelProps = {
  initialProducts: Product[]
}

export function AdminPanel({ initialProducts }: AdminPanelProps) {
  const router = useRouter()
  const [products, setProducts] = useState(initialProducts)
  const [name, setName] = useState('')
  const [price, setPrice] = useState('')
  const [imageFile, setImageFile] = useState<File | null>(null)
  const [isSaving, setIsSaving] = useState(false)
  const [message, setMessage] = useState('')
  const [error, setError] = useState('')
  const [deletingId, setDeletingId] = useState('')

  const resetForm = () => {
    setName('')
    setPrice('')
    setImageFile(null)
    const fileInput = document.getElementById('admin-image') as HTMLInputElement | null
    if (fileInput) {
      fileInput.value = ''
    }
  }

  const handleLogout = async () => {
    await fetch('/api/admin/logout', { method: 'POST' })
    router.refresh()
  }

  const uploadImage = async () => {
    if (!imageFile) {
      throw new Error('Оберіть фото пам’ятника.')
    }

    const formData = new FormData()
    formData.set('file', imageFile)

    const response = await fetch('/api/admin/upload', {
      method: 'POST',
      body: formData,
    })

    const result = await response.json()

    if (!response.ok) {
      throw new Error(result.error || 'Не вдалося завантажити фото.')
    }

    return result.imageUrl as string
  }

  const handleAddProduct = async (event: React.FormEvent) => {
    event.preventDefault()
    setIsSaving(true)
    setError('')
    setMessage('')

    try {
      const imageUrl = await uploadImage()

      const response = await fetch('/api/products', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name,
          price,
          imageUrl,
        }),
      })

      const result = await response.json()

      if (!response.ok) {
        throw new Error(result.error || 'Не вдалося додати товар.')
      }

      setProducts((current) => [result.product as Product, ...current])
      setMessage('Пам’ятник додано.')
      resetForm()
      router.refresh()
    } catch (error) {
      setError(error instanceof Error ? error.message : 'Не вдалося додати товар.')
    } finally {
      setIsSaving(false)
    }
  }

  const handleDeleteProduct = async (productId: string) => {
    setDeletingId(productId)
    setError('')
    setMessage('')

    try {
      const response = await fetch(`/api/products/${productId}`, {
        method: 'DELETE',
      })

      const result = await response.json()

      if (!response.ok) {
        throw new Error(result.error || 'Не вдалося видалити товар.')
      }

      setProducts((current) => current.filter((product) => product.id !== productId))
      setMessage('Пам’ятник видалено.')
      router.refresh()
    } catch (error) {
      setError(error instanceof Error ? error.message : 'Не вдалося видалити товар.')
    } finally {
      setDeletingId('')
    }
  }

  return (
    <div className="min-h-screen bg-slate-100">
      <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-3xl font-bold text-slate-900">Адмінка</h1>
            <p className="mt-2 text-sm text-slate-600">
              Додавай нові пам&apos;ятники і керуй асортиментом сайту.
            </p>
          </div>
          <div className="flex gap-3">
            <Link
              href="/"
              className="rounded-xl border border-slate-300 px-4 py-2 text-sm font-semibold text-slate-700 transition hover:border-slate-400 hover:bg-white"
            >
              На сайт
            </Link>
            <button
              type="button"
              onClick={handleLogout}
              className="rounded-xl bg-slate-900 px-4 py-2 text-sm font-semibold text-white transition hover:bg-slate-800"
            >
              Вийти
            </button>
          </div>
        </div>

        <div className="grid gap-8 lg:grid-cols-[360px_minmax(0,1fr)]">
          <section className="rounded-3xl bg-white p-6 shadow-sm ring-1 ring-black/5">
            <h2 className="text-xl font-semibold text-slate-900">Додати пам&apos;ятник</h2>
            <p className="mt-2 text-sm text-slate-600">
              Заповни назву, ціну і завантаж фото, щоб товар з&apos;явився на сайті.
            </p>

            {message && (
              <div className="mt-4 rounded-2xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-700">
                {message}
              </div>
            )}

            {error && (
              <div className="mt-4 rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
                {error}
              </div>
            )}

            <form className="mt-6 space-y-4" onSubmit={handleAddProduct}>
              <label className="block text-sm text-slate-700">
                Назва
                <input
                  value={name}
                  onChange={(event) => setName(event.target.value)}
                  required
                  className="mt-1 w-full rounded-xl border border-slate-300 px-3 py-2 focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-200"
                />
              </label>

              <label className="block text-sm text-slate-700">
                Ціна
                <input
                  value={price}
                  onChange={(event) => setPrice(event.target.value)}
                  required
                  placeholder="Наприклад: 6500 грн"
                  className="mt-1 w-full rounded-xl border border-slate-300 px-3 py-2 focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-200"
                />
              </label>

              <label className="block text-sm text-slate-700">
                Фото
                <input
                  id="admin-image"
                  type="file"
                  accept="image/*"
                  onChange={(event) => setImageFile(event.target.files?.[0] ?? null)}
                  required
                  className="mt-1 block w-full rounded-xl border border-slate-300 px-3 py-2 text-sm file:mr-3 file:rounded-lg file:border-0 file:bg-slate-100 file:px-3 file:py-2 file:text-sm file:font-semibold file:text-slate-700 hover:file:bg-slate-200"
                />
              </label>

              <button
                type="submit"
                disabled={isSaving}
                className="w-full rounded-xl bg-indigo-600 px-5 py-3 text-sm font-semibold text-white transition hover:bg-indigo-700 disabled:cursor-not-allowed disabled:bg-indigo-400"
              >
                {isSaving ? 'Зберігаємо...' : 'Додати'}
              </button>
            </form>
          </section>

          <section className="rounded-3xl bg-white p-6 shadow-sm ring-1 ring-black/5">
            <div className="flex items-center justify-between gap-4">
              <h2 className="text-xl font-semibold text-slate-900">Усі пам&apos;ятники</h2>
              <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-600">
                {products.length} шт.
              </span>
            </div>

            <div className="mt-6 grid gap-4">
              {products.map((product) => (
                <div
                  key={product.id}
                  className="flex flex-col gap-4 rounded-2xl border border-slate-200 p-4 sm:flex-row sm:items-center sm:justify-between"
                >
                  <div className="flex items-center gap-4">
                    <Image
                      src={product.imageUrl}
                      alt={product.name}
                      width={80}
                      height={80}
                      className="h-20 w-20 rounded-2xl object-cover"
                      unoptimized
                    />
                    <div>
                      <h3 className="font-semibold text-slate-900">{product.name}</h3>
                      <p className="mt-1 text-sm text-slate-600">{product.price}</p>
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={() => handleDeleteProduct(product.id)}
                    disabled={deletingId === product.id}
                    className="rounded-xl border border-red-200 px-4 py-2 text-sm font-semibold text-red-600 transition hover:bg-red-50 disabled:cursor-not-allowed disabled:opacity-60"
                  >
                    {deletingId === product.id ? 'Видаляємо...' : 'Видалити'}
                  </button>
                </div>
              ))}
            </div>
          </section>
        </div>
      </div>
    </div>
  )
}
