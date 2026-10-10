import NextAuth from "next-auth"
import Credentials from "next-auth/providers/credentials"
import { compare } from "bcryptjs"
import { prisma } from "@/lib/prisma"
import { loginSchema } from "@/lib/validators"
import authConfig from "@/lib/auth.config"

// ponytail: in-memory rate limiter — remplacer par Redis/Upstash en multi-instance
const attempts = new Map<string, { n: number; resetAt: number }>()

function checkRateLimit(ip: string): boolean {
  const now = Date.now()
  const windowMs = 15 * 60 * 1000
  const max = 5
  const rec = attempts.get(ip)
  if (!rec || now >= rec.resetAt) {
    attempts.set(ip, { n: 1, resetAt: now + windowMs })
    return true
  }
  if (rec.n >= max) return false
  rec.n++
  return true
}

export const { handlers, auth, signIn, signOut } = NextAuth({
  ...authConfig,
  callbacks: {
    ...authConfig.callbacks,
    jwt({ token, user }) {
      if (user) {
        token.id = user.id!
        token.role = (user as any).role
      }
      return token
    },
    session({ session, token }) {
      session.user.id = token.id as string
      session.user.role = token.role as any
      return session
    },
  },
  providers: [
    Credentials({
      authorize: async (credentials, req) => {
        const ip = req?.headers?.get("x-forwarded-for") ?? "unknown"
        if (!checkRateLimit(ip)) {
          throw new Error("Trop de tentatives. Réessayez dans 15 minutes.")
        }
        const parsed = loginSchema.safeParse(credentials)
        if (!parsed.success) return null

        const user = await prisma.user.findUnique({ where: { email: parsed.data.email } })
        if (!user) return null

        const valid = await compare(parsed.data.password, user.password)
        if (!valid) return null

        return { id: user.id, email: user.email, role: user.role, name: user.email }
      },
    }),
  ],
  session: { strategy: "jwt", maxAge: 8 * 60 * 60 },
})
