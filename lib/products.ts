import fs from 'node:fs/promises'
import path from 'node:path'

import { getStore } from '@netlify/blobs'

export type Product = {
  id: string
  name: string
  price: string
  imageUrl: string
  createdAt: string
}

type ProductInput = {
  name: string
  price: string
  imageUrl: string
}

const STORE_NAME = 'products'
const STORE_KEY = 'items'
const localDataDir = path.join(process.cwd(), 'data')
const localDataFile = path.join(localDataDir, 'products.json')

const fallbackProducts: Product[] = [
  {
    id: 'classic-granite',
    name: "Класичний пам'ятник з граніту",
    price: '5000 грн',
    imageUrl:
      'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=1200&q=80',
    createdAt: '2026-04-16T00:00:00.000Z',
  },
  {
    id: 'modern-marble',
    name: "Модерний пам'ятник з мармуру",
    price: '7000 грн',
    imageUrl:
      'https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&w=1200&q=80',
    createdAt: '2026-04-16T00:00:01.000Z',
  },
  {
    id: 'black-granite',
    name: "Пам'ятник з чорного граніту",
    price: '6000 грн',
    imageUrl:
      'https://images.unsplash.com/photo-1511818966892-d7d671e672a2?auto=format&fit=crop&w=1200&q=80',
    createdAt: '2026-04-16T00:00:02.000Z',
  },
]

function normalizeProducts(products: Product[] | null | undefined) {
  if (!Array.isArray(products)) {
    return [...fallbackProducts]
  }

  return products
    .filter(
      (product): product is Product =>
        Boolean(product?.id && product?.name && product?.price && product?.imageUrl && product?.createdAt)
    )
    .sort((a, b) => (a.createdAt < b.createdAt ? 1 : -1))
}

async function writeLocalProducts(products: Product[]) {
  await fs.mkdir(localDataDir, { recursive: true })
  await fs.writeFile(localDataFile, JSON.stringify(products, null, 2), 'utf8')
}

async function readLocalProducts() {
  try {
    const raw = await fs.readFile(localDataFile, 'utf8')
    const data = JSON.parse(raw)
    return normalizeProducts(data)
  } catch {
    await writeLocalProducts(fallbackProducts)
    return [...fallbackProducts]
  }
}

function hasNetlifyBlobsConfig() {
  return Boolean(
    process.env.NETLIFY_BLOBS_CONTEXT ||
      process.env.NETLIFY_SITE_ID ||
      process.env.CONTEXT ||
      process.env.NETLIFY
  )
}

async function readProducts() {
  if (!hasNetlifyBlobsConfig()) {
    return readLocalProducts()
  }

  try {
    const store = getStore(STORE_NAME)
    const data = await store.get(STORE_KEY, { type: 'json' })
    const products = normalizeProducts(data as Product[] | null)

    if (!Array.isArray(data)) {
      await store.setJSON(STORE_KEY, products)
    }

    return products
  } catch {
    return readLocalProducts()
  }
}

async function writeProducts(products: Product[]) {
  if (!hasNetlifyBlobsConfig()) {
    await writeLocalProducts(products)
    return products
  }

  try {
    const store = getStore(STORE_NAME)
    await store.setJSON(STORE_KEY, products)
    return products
  } catch {
    await writeLocalProducts(products)
    return products
  }
}

function createProductId(name: string) {
  const slug = name
    .toLowerCase()
    .replace(/[^a-z0-9а-яіїєґ]+/gi, '-')
    .replace(/^-+|-+$/g, '')

  return `${slug || 'product'}-${Date.now()}`
}

export async function getProducts() {
  return readProducts()
}

export async function addProduct(input: ProductInput) {
  const products = await readProducts()
  const product: Product = {
    id: createProductId(input.name),
    name: input.name.trim(),
    price: input.price.trim(),
    imageUrl: input.imageUrl.trim(),
    createdAt: new Date().toISOString(),
  }

  const updatedProducts = [product, ...products]
  await writeProducts(updatedProducts)

  return product
}

export async function deleteProduct(productId: string) {
  const products = await readProducts()
  const updatedProducts = products.filter((product) => product.id !== productId)

  if (updatedProducts.length === products.length) {
    return false
  }

  await writeProducts(updatedProducts)
  return true
}
