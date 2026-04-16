import { AdminLogin } from '@/app/components/admin-login'
import { AdminPanel } from '@/app/components/admin-panel'
import { isAdminAuthenticated, isAdminPasswordConfigured } from '@/app/lib/admin-auth'
import { getProducts } from '@/app/lib/products'

export default async function AdminPage() {
  const isConfigured = isAdminPasswordConfigured()

  if (!isConfigured) {
    return (
      <div className="mx-auto flex min-h-screen w-full max-w-2xl items-center px-4 py-10">
        <div className="w-full rounded-3xl bg-white p-8 shadow-xl ring-1 ring-black/5">
          <h1 className="text-3xl font-bold text-gray-900">Адмінка ще не налаштована</h1>
          <p className="mt-3 text-sm text-gray-600">
            Додай змінну середовища <code>ADMIN_PASSWORD</code> у Netlify або в
            <code> .env.local</code>, щоб увімкнути вхід в адмінку.
          </p>
        </div>
      </div>
    )
  }

  const isAuthenticated = await isAdminAuthenticated()

  if (!isAuthenticated) {
    return <AdminLogin />
  }

  const products = await getProducts()
  return <AdminPanel initialProducts={products} />
}
