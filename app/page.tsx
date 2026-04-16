'use client'

import { useState } from 'react'

const products = [
  {
    id: 1,
    name: "Класичний пам'ятник з граніту",
    description:
      "Пам'ятник під ключ з натурального граніту. Включає установку та обробку.",
    price: '5000 грн',
  },
  {
    id: 2,
    name: "Модерний пам'ятник з мармуру",
    description:
      'Сучасний дизайн з мармуру. Повний комплекс послуг від проєкту до монтажу.',
    price: '7000 грн',
  },
  {
    id: 3,
    name: "Пам'ятник з чорного граніту",
    description:
      'Елегантний чорний граніт. Під ключ, включаючи доставку та установку.',
    price: '6000 грн',
  },
]

export default function Home() {
  const [selectedProduct, setSelectedProduct] = useState<(typeof products)[number] | null>(null)
  const [name, setName] = useState('')
  const [surname, setSurname] = useState('')
  const [phone, setPhone] = useState('')
  const [address, setAddress] = useState('')
  const [email, setEmail] = useState('')

  const handleOrder = (product: (typeof products)[number]) => {
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

    alert(
      `Замовлення прийнято!\nПам'ятник: ${selectedProduct.name}\nІм'я: ${name} ${surname}\nТелефон: ${phone}\nАдреса: ${address}\nEmail: ${email}`
    )

    setSelectedProduct(null)
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="py-6">
            <h1 className="text-2xl font-bold text-gray-900">Магазин пам&apos;ятників</h1>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-7xl py-6 sm:px-6 lg:px-8">
        <div className="px-4 py-6 sm:px-0">
          <h2 className="mb-6 text-3xl font-extrabold text-gray-900">Наші пам&apos;ятники під ключ</h2>
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {products.map((product) => (
              <div
                key={product.id}
                className="overflow-hidden rounded-3xl bg-white shadow transition-transform duration-200 hover:-translate-y-1 hover:shadow-xl"
              >
                <div className="p-6 sm:p-7">
                  <h3 className="text-lg font-semibold text-gray-900">{product.name}</h3>
                  <p className="mt-3 text-sm leading-6 text-gray-500">{product.description}</p>
                  <p className="mt-5 text-lg font-semibold text-gray-900">{product.price}</p>
                  <button
                    type="button"
                    onClick={() => handleOrder(product)}
                    className="mt-6 w-full rounded-2xl bg-indigo-600 py-3 text-white transition duration-200 ease-out hover:scale-[1.02] hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500"
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
                <p className="mt-1 text-sm text-gray-600">Пам&apos;ятник: {selectedProduct.name}</p>
              </div>
              <button
                type="button"
                onClick={() => setSelectedProduct(null)}
                className="text-gray-400 hover:text-gray-700"
              >
                ×
              </button>
            </div>
            <form className="mt-6 grid gap-4 md:grid-cols-2" onSubmit={submitOrder}>
              <label className="space-y-1 text-sm text-gray-700">
                Ім&apos;я
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
              <div className="flex flex-col gap-3 md:col-span-2 sm:flex-row sm:justify-end">
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
