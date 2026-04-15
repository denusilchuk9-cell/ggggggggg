import NextAuth from 'next-auth'
import CredentialsProvider from 'next-auth/providers/credentials'
const { readUsers, saveUsers } = require('./userStore')

export default NextAuth({
  providers: [
    CredentialsProvider({
      name: 'credentials',
      credentials: {
        email: { label: 'Email', type: 'email' },
        password: { label: 'Password', type: 'password' },
        action: { label: 'Action', type: 'text' }
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) return null
        const { email, password, action } = credentials
        const users = readUsers()
        if (action === 'register') {
          const existing = users.find(u => u.email === email)
          if (existing) return null
          const user = { id: Date.now().toString(), email, password }
          users.push(user)
          saveUsers(users)
          return { id: user.id, email: user.email }
        } else {
          const user = users.find(u => u.email === email && u.password === password)
          if (user) return { id: user.id, email: user.email }
          return null
        }
      }
    })
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
    }
  },
  secret: process.env.NEXTAUTH_SECRET,
  pages: {
    signIn: '/login',
  },
})