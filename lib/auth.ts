import type { NextAuthOptions } from "next-auth"
import CredentialsProvider from "next-auth/providers/credentials"
import GoogleProvider from "next-auth/providers/google"
import connectDB from "@/lib/mongodb"
import User from "@/lib/models/User"

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: "credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        try {
          if (!credentials?.email || !credentials?.password) {
            return null
          }

          await connectDB()

          const user = await User.findOne({ email: credentials.email }).select("+password")

          if (!user || !user.isActive) {
            return null
          }

          const isPasswordValid = await user.comparePassword(credentials.password)

          if (!isPasswordValid) {
            return null
          }

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
  callbacks: {
    async jwt({ token, user, account }) {
      if (user) {
        token.role = user.role
        token.image = user.image
      }
      if (account?.provider === "google") {
        try {
          await connectDB()
          const dbUser = await User.findOne({ email: token.email })
          if (dbUser) {
            token.role = dbUser.role
            token.image = dbUser.profileImage
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
  debug: false,
}
