'use client'

import { useState } from 'react'
import { useSession, signOut } from 'next-auth/react'
import Link from 'next/link'

const products = [
  {
    id: 1,
    name: 'Класичний пам\'ятник з граніту',
    description: 'Пам\'ятник під ключ з натурального граніту. Включає установку та обробку.',
    price: '5000 грн'
  },
  {
    id: 2,
    name: 'Модерний пам\'ятник з мармуру',
    description: 'Сучасний дизайн з мармуру. Повний комплекс послуг від проекту до монтажу.',
    price: '7000 грн'
  },
  {
    id: 3,
    name: 'Пам\'ятник з чорного граніту',
    description: 'Елегантний чорний граніт. Під ключ, включаючи доставку та установку.',
    price: '6000 грн'
  }
]

export default function Home() {
  const { data: session } = useSession()
  const [selectedProduct, setSelectedProduct] = useState<typeof products[number] | null>(null)
  const [name, setName] = useState('')
  const [surname, setSurname] = useState('')
  const [phone, setPhone] = useState('')
  const [address, setAddress] = useState('')
  const [email, setEmail] = useState('')

  const handleOrder = (product: typeof products[number]) => {
    setSelectedProduct(product)
    setName('')
    setSurname('')
    setPhone('')
    setAddress('')
    setEmail('')
  }

  const submitOrder = (event: React.FormEvent) => {
    event.preventDefault()
    if (!selectedProduct) return
    alert(`Замовлення прийнято!\nПам\'ятник: ${selectedProduct.name}\nІм\'я: ${name} ${surname}\nТелефон: ${phone}\nАдреса: ${address}\nEmail: ${email}`)
    setSelectedProduct(null)
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col gap-4 sm:flex-row sm:justify-between sm:items-center py-6">
            <div className="flex items-center justify-between w-full">
              <h1 className="text-2xl font-bold text-gray-900">Магазин Пам\'ятників</h1>
              {session && (
                <span className="text-sm text-gray-600 sm:hidden">{session.user?.email}</span>
              )}
            </div>
            <div className="flex flex-col sm:flex-row sm:items-center gap-3">
              {session ? (
                <>
                  <span className="text-sm text-gray-600 hidden sm:inline">Вітаємо, {session.user?.email}</span>
                  <button
                    onClick={() => signOut()}
                    className="transition duration-200 ease-out bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700 hover:-translate-y-0.5 focus:outline-none focus:ring-2 focus:ring-red-500"
                  >
                    Вийти
                  </button>
                </>
              ) : (
                <Link
                  href="/login"
                  className="transition duration-200 ease-out bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 hover:-translate-y-0.5 text-center"
                >
                  Увійти
                </Link>
              )}
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="px-4 py-6 sm:px-0">
          <h2 className="text-3xl font-extrabold text-gray-900 mb-6">Наші Пам\'ятники Під Ключ</h2>
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {products.map((product) => (
              <div key={product.id} className="bg-white overflow-hidden shadow rounded-3xl transition-transform duration-200 hover:-translate-y-1 hover:shadow-xl">
                <div className="p-6 sm:p-7">
                  <h3 className="text-lg font-semibold text-gray-900">{product.name}</h3>
                  <p className="mt-3 text-sm leading-6 text-gray-500">{product.description}</p>
                  <p className="mt-5 text-lg font-semibold text-gray-900">{product.price}</p>
                  <button
                    type="button"
                    onClick={() => handleOrder(product)}
                    className="mt-6 w-full bg-indigo-600 text-white py-3 rounded-2xl transition duration-200 ease-out hover:bg-indigo-700 hover:scale-[1.02] focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  >
                    Замовити
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </main>

      {selectedProduct && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4 py-6 sm:px-6">
          <div className="w-full max-w-xl rounded-3xl bg-white p-6 shadow-2xl ring-1 ring-black/10">
            <div className="flex items-start justify-between gap-4">
              <div>
                <h2 className="text-2xl font-semibold text-gray-900">Оформити замовлення</h2>
                <p className="mt-1 text-sm text-gray-600">Пам\'ятник: {selectedProduct.name}</p>
              </div>
              <button
                type="button"
                onClick={() => setSelectedProduct(null)}
                className="text-gray-400 hover:text-gray-700"
              >
                ✕
              </button>
            </div>
            <form className="mt-6 grid gap-4 md:grid-cols-2" onSubmit={submitOrder}>
              <label className="space-y-1 text-sm text-gray-700">
                Ім\'я
                <input
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                  className="w-full rounded-xl border border-gray-300 px-3 py-2 focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-200"
                />
              </label>
              <label className="space-y-1 text-sm text-gray-700">
                Прізвище
                <input
                  value={surname}
                  onChange={(e) => setSurname(e.target.value)}
                  required
                  className="w-full rounded-xl border border-gray-300 px-3 py-2 focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-200"
                />
              </label>
              <label className="space-y-1 text-sm text-gray-700 md:col-span-2">
                Телефон
                <input
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  required
                  type="tel"
                  className="w-full rounded-xl border border-gray-300 px-3 py-2 focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-200"
                />
              </label>
              <label className="space-y-1 text-sm text-gray-700 md:col-span-2">
                Адреса
                <input
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  required
                  className="w-full rounded-xl border border-gray-300 px-3 py-2 focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-200"
                />
              </label>
              <label className="space-y-1 text-sm text-gray-700 md:col-span-2">
                Email
                <input
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  type="email"
                  className="w-full rounded-xl border border-gray-300 px-3 py-2 focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-200"
                />
              </label>
              <div className="md:col-span-2 flex flex-col gap-3 sm:flex-row sm:justify-end">
                <button
                  type="button"
                  onClick={() => setSelectedProduct(null)}
                  className="rounded-xl border border-gray-300 px-5 py-3 text-sm font-semibold text-gray-700 transition duration-200 hover:border-gray-400 hover:bg-gray-50"
                >
                  Закрити
                </button>
                <button
                  type="submit"
                  className="rounded-xl bg-indigo-600 px-5 py-3 text-sm font-semibold text-white transition duration-200 hover:bg-indigo-700"
                >
                  Підтвердити замовлення
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
