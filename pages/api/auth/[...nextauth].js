import NextAuth from 'next-auth'
import CredentialsProvider from 'next-auth/providers/credentials'
import { readUsers, saveUsers } from './userStore'

const authSecret =
  process.env.NEXTAUTH_SECRET ||
  process.env.AUTH_SECRET ||
  'dev-only-secret-change-me'

export default NextAuth({
  providers: [
    CredentialsProvider({
      name: 'credentials',
      credentials: {
        email: { label: 'Email', type: 'email' },
        password: { label: 'Password', type: 'password' },
        action: { label: 'Action', type: 'text' },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) return null

        const email = credentials.email.trim().toLowerCase()
        const password = credentials.password
        const action = credentials.action
        const users = await readUsers()

        if (action === 'register') {
          const existing = users.find((u) => u.email === email)
          if (existing) return null

          try {
            const user = { id: Date.now().toString(), email, password }
            users.push(user)
            await saveUsers(users)
            return { id: user.id, email: user.email }
          } catch (error) {
            console.error('Registration failed:', error)
            return null
          }
        }

        const user = users.find((u) => u.email === email && u.password === password)
        if (user) {
          return { id: user.id, email: user.email }
        }

        return null
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.user = user
      }
      return token
    },
    async session({ session, token }) {
      if (token.user) {
        session.user = token.user
      }
      return session
    },
  },
  session: {
    strategy: 'jwt',
  },
  secret: authSecret,
  pages: {
    signIn: '/login',
    error: '/login',
  },
})
