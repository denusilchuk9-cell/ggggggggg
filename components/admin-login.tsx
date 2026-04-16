'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'

export function AdminLogin() {
  const router = useRouter()
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault()
    setError('')
    setIsSubmitting(true)

    try {
      const response = await fetch('/api/admin/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ password }),
      })

      const result = await response.json()

      if (!response.ok) {
        throw new Error(result.error || 'Не вдалося увійти в адмінку.')
      }

      router.refresh()
    } catch (error) {
      setError(error instanceof Error ? error.message : 'Не вдалося увійти в адмінку.')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="mx-auto flex min-h-screen w-full max-w-md items-center px-4 py-10">
      <div className="w-full rounded-3xl bg-white p-8 shadow-xl ring-1 ring-black/5">
        <h1 className="text-3xl font-bold text-gray-900">Вхід в адмінку</h1>
        <p className="mt-2 text-sm text-gray-600">
          Введи пароль адміністратора, щоб додавати і видаляти пам&apos;ятники.
        </p>

        {error && (
          <div className="mt-4 rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
            {error}
          </div>
        )}

        <form className="mt-6 space-y-4" onSubmit={handleSubmit}>
          <label className="block text-sm text-gray-700">
            Пароль
            <input
              type="password"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              required
              className="mt-1 w-full rounded-xl border border-gray-300 px-3 py-2 focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-200"
            />
          </label>

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full rounded-xl bg-indigo-600 px-5 py-3 text-sm font-semibold text-white transition hover:bg-indigo-700 disabled:cursor-not-allowed disabled:bg-indigo-400"
          >
            {isSubmitting ? 'Входимо...' : 'Увійти'}
          </button>
        </form>
      </div>
    </div>
  )
}
