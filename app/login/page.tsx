'use client'

import { useState } from 'react'
import { signIn } from 'next-auth/react'
import { useRouter } from 'next/navigation'

export default function LoginPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [isRegister, setIsRegister] = useState(false)
  const router = useRouter()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (isRegister && password !== confirmPassword) {
      alert('Паролі не співпадають. Будь ласка, введіть однакові паролі.')
      return
    }

    const result = await signIn('credentials', {
      email,
      password,
      action: isRegister ? 'register' : 'login',
      redirect: false,
    })
    if (result?.ok) {
      router.push('/')
    } else {
      alert('Error: ' + (isRegister ? 'Registration failed' : 'Login failed'))
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4 py-10">
      <div className="max-w-md w-full space-y-8">
        <div>
          <h2 className="mt-2 text-center text-3xl font-extrabold text-gray-900">
            {isRegister ? 'Реєстрація' : 'Вхід'}
          </h2>
          <p className="mt-3 text-center text-sm text-gray-500">
            {isRegister ? 'Введіть свої дані для створення акаунта' : 'Увійдіть, щоб швидко оформити замовлення'}
          </p>
        </div>
        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          <div className="rounded-3xl border border-gray-200 bg-white p-4 shadow-sm ring-1 ring-black/5">
            <div className="space-y-4">
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                  Email
                </label>
                <input
                  id="email"
                  name="email"
                  type="email"
                  required
                  className="mt-1 block w-full rounded-2xl border border-gray-300 bg-gray-50 px-3 py-2 text-gray-900 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm"
                  placeholder="Email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
              <div>
                <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                  Пароль
                </label>
                <input
                  id="password"
                  name="password"
                  type="password"
                  required
                  className="mt-1 block w-full rounded-2xl border border-gray-300 bg-gray-50 px-3 py-2 text-gray-900 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm"
                  placeholder="Пароль"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </div>
            </div>
          </div>
          {isRegister && (
            <div className="rounded-3xl border border-gray-200 bg-white p-4 shadow-sm ring-1 ring-black/5">
              <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700">
                Повторіть пароль
              </label>
              <input
                id="confirmPassword"
                name="confirmPassword"
                type="password"
                required
                className="mt-1 block w-full rounded-2xl border border-gray-300 bg-gray-50 px-3 py-2 text-gray-900 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm"
                placeholder="Підтвердіть пароль"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
              />
            </div>
          )}
          <div>
            <button
              type="submit"
              className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              {isRegister ? 'Зареєструватися' : 'Увійти'}
            </button>
          </div>
          <div className="text-center">
            <button
              type="button"
              onClick={() => setIsRegister(!isRegister)}
              className="text-indigo-600 hover:text-indigo-500"
            >
              {isRegister ? 'Вже маєте акаунт? Увійти' : 'Немає акаунта? Зареєструватися'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}