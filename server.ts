import { config } from 'dotenv'
import { Hono } from 'hono'
import type { Context } from 'hono'
import { serve } from '@hono/node-server'
import { readFile, writeFile } from 'fs/promises'
import { existsSync } from 'fs'

// Load environment variables
config()

const app = new Hono()

const USERS_FILE = 'users.json'

// Load users from file
async function loadUsers() {
  try {
    if (existsSync(USERS_FILE)) {
      const data = await readFile(USERS_FILE, 'utf-8')
      return JSON.parse(data)
    } else {
      const initialUsers: any[] = []
      await writeFile(USERS_FILE, JSON.stringify(initialUsers, null, 2), 'utf-8')
      return initialUsers
    }
  } catch (error) {
    console.error('Error loading users:', error)
    return []
  }
}

// Save users to file
async function saveUsers(users: any[]) {
  try {
    await writeFile(USERS_FILE, JSON.stringify(users, null, 2), 'utf-8')
  } catch (error) {
    console.error('Error saving users:', error)
  }
}

// In-memory storage for users
let users: any[] = []

// Root route
app.get('/', (c: Context) => {
  return c.json({
    message: 'Welcome to Hono API!',
    version: '1.0.0',
    endpoints: {
      'GET /api/users': 'Get all users',
      'POST /api/users': 'Create a new user'
    }
  })
})

// GET all users
app.get('/api/users', (c: Context) => {
  return c.json(users)
})

// POST create new user
app.post('/api/users', async (c: Context) => {
  try {
    const body = await c.req.json()
    const { name, email, age } = body

    if (!name || !email) {
      return c.json({ error: 'Name and email are required' }, 400)
    }

    const newUser = {
      id: users.length > 0 ? Math.max(...users.map(u => u.id)) + 1 : 1,
      name,
      email,
      age: age || null
    }

    users.push(newUser)
    await saveUsers(users)
    return c.json(newUser, 201)
  } catch (error) {
    return c.json({ error: 'Invalid JSON' }, 400)
  }
})

const port = process.env.PORT ? parseInt(process.env.PORT) : 3000

// Initialize users on startup
loadUsers().then((loadedUsers) => {
  users = loadedUsers
  console.log(`Loaded ${users.length} users from ${USERS_FILE}`)
  console.log(`Server is running on port ${port}`)
  
  serve({
    fetch: app.fetch,
    port
  })
})

