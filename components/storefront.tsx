'use client'

import Image from 'next/image'
import Link from 'next/link'
import { useState } from 'react'

import type { Product } from '@/app/lib/products'

type StorefrontProps = {
  initialProducts: Product[]
}

export function Storefront({ initialProducts }: StorefrontProps) {
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null)
  const [name, setName] = useState('')
  const [surname, setSurname] = useState('')
  const [phone, setPhone] = useState('')
  const [address, setAddress] = useState('')
  const [email, setEmail] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitMessage, setSubmitMessage] = useState('')
  const [submitError, setSubmitError] = useState('')

  const resetForm = () => {
    setName('')
    setSurname('')
    setPhone('')
    setAddress('')
    setEmail('')
  }

  const handleOrder = (product: Product) => {
    setSelectedProduct(product)
    resetForm()
    setSubmitMessage('')
    setSubmitError('')
  }

  const closeModal = () => {
    setSelectedProduct(null)
    setSubmitError('')
    setIsSubmitting(false)
  }

  const submitOrder = async (event: React.FormEvent) => {
    event.preventDefault()

    if (!selectedProduct || isSubmitting) {
      return
    }

    setIsSubmitting(true)
    setSubmitMessage('')
    setSubmitError('')

    try {
      const response = await fetch('/api/orders', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          productId: selectedProduct.id,
          productName: selectedProduct.name,
          productPrice: selectedProduct.price,
          name,
          surname,
          phone,
          address,
          email,
        }),
      })

      const result = await response.json()

      if (!response.ok) {
        throw new Error(result.error || 'Не вдалося надіслати замовлення.')
      }

      setSubmitMessage('Замовлення надіслано. Ми звʼяжемося з вами найближчим часом.')
      resetForm()
      setSelectedProduct(null)
    } catch (error) {
      const message =
        error instanceof Error ? error.message : 'Сталася помилка під час надсилання замовлення.'
      setSubmitError(message)
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <>
      <main className="mx-auto max-w-7xl py-6 sm:px-6 lg:px-8">
        <div className="px-4 py-6 sm:px-0">
          <div className="mb-6 flex items-center justify-between gap-4">
            <h2 className="text-3xl font-extrabold text-gray-900">Наші пам&apos;ятники під ключ</h2>
            <Link
              href="/admin"
              className="rounded-xl border border-gray-300 px-4 py-2 text-sm font-semibold text-gray-700 transition hover:border-gray-400 hover:bg-gray-50"
            >
              Адмінка
            </Link>
          </div>

          {submitMessage && (
            <div className="mb-6 rounded-2xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-700">
              {submitMessage}
            </div>
          )}

          {submitError && !selectedProduct && (
            <div className="mb-6 rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
              {submitError}
            </div>
          )}

          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {initialProducts.map((product) => (
              <div
                key={product.id}
                className="overflow-hidden rounded-3xl bg-white shadow transition-transform duration-200 hover:-translate-y-1 hover:shadow-xl"
              >
                <div className="aspect-[4/3] bg-gray-100">
                  <Image
                    src={product.imageUrl}
                    alt={product.name}
                    width={1200}
                    height={900}
                    className="h-full w-full object-cover"
                    unoptimized
                  />
                </div>
                <div className="p-6 sm:p-7">
                  <h3 className="text-lg font-semibold text-gray-900">{product.name}</h3>
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
                onClick={closeModal}
                className="text-2xl leading-none text-gray-400 hover:text-gray-700"
                aria-label="Закрити форму"
              >
                ×
              </button>
            </div>

            {submitError && (
              <div className="mt-4 rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
                {submitError}
              </div>
            )}

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
                  onClick={closeModal}
                  className="rounded-xl border border-gray-300 px-5 py-3 text-sm font-semibold text-gray-700 transition duration-200 hover:border-gray-400 hover:bg-gray-50"
                >
                  Закрити
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="rounded-xl bg-indigo-600 px-5 py-3 text-sm font-semibold text-white transition duration-200 hover:bg-indigo-700 disabled:cursor-not-allowed disabled:bg-indigo-400"
                >
                  {isSubmitting ? 'Надсилаємо...' : 'Підтвердити замовлення'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  )
}
