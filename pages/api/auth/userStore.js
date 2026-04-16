import { getStore } from '@netlify/blobs'

const store = getStore('users')

async function readUsers() {
  const users = await store.get('list', { type: 'json' })
  return Array.isArray(users) ? users : []
}

async function saveUsers(users) {
  await store.setJSON('list', users)
}

export { readUsers, saveUsers }
і
