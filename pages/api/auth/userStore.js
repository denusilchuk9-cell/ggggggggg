const fs = require('fs')
const path = require('path')

const dataDir = path.join(process.cwd(), 'data')
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
  } catch (error) {
    fs.writeFileSync(dataFile, '[]', 'utf8')
    return []
  }
}

function saveUsers(users) {
  ensureDataFile()
  fs.writeFileSync(dataFile, JSON.stringify(users, null, 2), 'utf8')
}

module.exports = { readUsers, saveUsers }
