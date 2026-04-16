import fs from 'fs'
import os from 'os'
import path from 'path'

function resolveStorageDir() {
  if (process.env.NETLIFY) {
    return path.join(os.tmpdir(), 'zakaz-data')
  }

  return path.join(process.cwd(), 'data')
}

const dataDir = resolveStorageDir()
const dataFile = path.join(dataDir, 'users.json')

function ensureDataFile() {
  if (!fs.existsSync(dataDir)) {
    fs.mkdirSync(dataDir, { recursive: true })
  }
  if (!fs.existsSync(dataFile)) {
    fs.writeFileSync(dataFile, '[]', 'utf8')
  }
}

function readUsers() {
  ensureDataFile()
  const raw = fs.readFileSync(dataFile, 'utf8')
  try {
    return JSON.parse(raw)
  } catch {
    fs.writeFileSync(dataFile, '[]', 'utf8')
    return []
  }
}

function saveUsers(users) {
  ensureDataFile()
  fs.writeFileSync(dataFile, JSON.stringify(users, null, 2), 'utf8')
}

export { readUsers, saveUsers }
