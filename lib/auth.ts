import type { NextAuthOptions } from "next-auth"
import CredentialsProvider from "next-auth/providers/credentials"
import GoogleProvider from "next-auth/providers/google"
import connectDB from "@/lib/mongodb"
import User from "@/lib/models/User"

// Simple in-memory rate limiting (in production, use Redis)
const loginAttempts = new Map<string, { count: number; lastAttempt: number }>()

const MAX_LOGIN_ATTEMPTS = 5
const LOCKOUT_TIME = 15 * 60 * 1000 // 15 minutes

function getClientIP(request: Request): string {
  const forwarded = request.headers.get('x-forwarded-for')
  const realIP = request.headers.get('x-real-ip')
  const cfConnectingIP = request.headers.get('cf-connecting-ip')
  
  return forwarded?.split(',')[0] || realIP || cfConnectingIP || 'unknown'
}

function checkRateLimit(identifier: string): boolean {
  const now = Date.now()
  const attempts = loginAttempts.get(identifier)
  
  if (!attempts) {
    return true
  }
  
  // Reset if lockout period has passed
  if (now - attempts.lastAttempt > LOCKOUT_TIME) {
    loginAttempts.delete(identifier)
    return true
  }
  
  // Check if max attempts exceeded
  return attempts.count < MAX_LOGIN_ATTEMPTS
}

function recordLoginAttempt(identifier: string): void {
  const now = Date.now()
  const attempts = loginAttempts.get(identifier)
  
  if (attempts) {
    attempts.count += 1
    attempts.lastAttempt = now
  } else {
    loginAttempts.set(identifier, { count: 1, lastAttempt: now })
  }
}

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: "credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials, req) {
        try {
          if (!credentials?.email || !credentials?.password) {
            return null
          }

          const clientIP = getClientIP(req.headers as any)
          const identifier = `${credentials.email}-${clientIP}`
          
          // Check rate limiting
          if (!checkRateLimit(identifier)) {
            console.warn(`Rate limit exceeded for ${identifier}`)
            return null
          }

          await connectDB()

          const user = await User.findOne({ email: credentials.email }).select("+password")

          if (!user) {
            recordLoginAttempt(identifier)
            return null
          }

          // Check if user is active
          if (!user.isActive) {
            return null
          }

          const isPasswordValid = await user.comparePassword(credentials.password)

          if (!isPasswordValid) {
            recordLoginAttempt(identifier)
            return null
          }

          // Clear rate limit on successful login
          loginAttempts.delete(identifier)

          // Update last login
          await User.findByIdAndUpdate(user._id, { lastLogin: new Date() })

          return {
            id: user._id.toString(),
            email: user.email,
            name: user.name,
            role: user.role,
            image: user.profileImage || null,
          }
        } catch (error) {
          console.error("Auth error:", error)
          return null
        }
      },
    }),
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID || "",
      clientSecret: process.env.GOOGLE_CLIENT_SECRET || "",
      authorization: {
        params: {
          prompt: "consent",
          access_type: "offline",
          response_type: "code"
        }
      }
    }),
  ],
  session: {
    strategy: "jwt",
    maxAge: 30 * 24 * 60 * 60, // 30 days
  },
  jwt: {
    maxAge: 30 * 24 * 60 * 60, // 30 days
  },
  callbacks: {
    async jwt({ token, user, account }) {
      if (user) {
        token.role = user.role
        token.image = user.image
        token.id = user.id
      }
      if (account?.provider === "google") {
        try {
          await connectDB()
          const dbUser = await User.findOne({ email: token.email })
          if (dbUser) {
            token.role = dbUser.role
            token.image = dbUser.profileImage
            token.id = dbUser._id.toString()
          }
        } catch (error) {
          console.error("JWT callback error:", error)
        }
      }
      return token
    },
    async session({ session, token }) {
      if (token && session.user) {
        session.user.id = token.sub!
        session.user.role = token.role as "admin" | "donor" | "volunteer" | "creator"
        session.user.image = token.image as string
        session.user.email = token.email as string
      }
      return session
    },
    async signIn({ user, account, profile }) {
      try {
        if (account?.provider === "google") {
          await connectDB()

          const existingUser = await User.findOne({ email: user.email })

          if (!existingUser) {
            await User.create({
              name: user.name,
              email: user.email,
              profileImage: user.image,
              role: "donor",
              isActive: true,
              isVerified: true,
              lastLogin: new Date(),
            })
          } else {
            await User.findByIdAndUpdate(existingUser._id, {
              lastLogin: new Date(),
              profileImage: user.image || existingUser.profileImage,
            })
          }
        }
        return true
      } catch (error) {
        console.error("SignIn callback error:", error)
        return false
      }
    },
  },
  pages: {
    signIn: "/signin",
    error: "/signin",
  },
  debug: process.env.NODE_ENV === "development",
}
