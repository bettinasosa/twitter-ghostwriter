import NextAuth from "next-auth"
import CredentialsProvider from "next-auth/providers/credentials"
import { connectDB } from "@/lib/services/db"
import bcrypt from "bcryptjs"
import { User } from "@/lib/models/User"

const handler = NextAuth({
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" }
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          throw new Error("Missing credentials")
        }

        try {
          const { db } = await connectDB()
          const user = await db
            .collection("users")
            .findOne({ email: credentials.email }) as User | null

          if (!user) {
            throw new Error("No user found")
          }

          const isValid = await bcrypt.compare(
            credentials.password,
            user.password
          )

          if (!isValid) {
            throw new Error("Invalid password")
          }

          return {
            id: user._id.toString(),
            email: user.email,
          }
        } catch (error) {
          console.error("Auth error:", error)
          throw error
        }
      }
    })
  ],
  callbacks: {
    async session({ session, token }) {
      return {
        ...session,
        user: {
          ...session.user,
          id: token.sub
        }
      }
    }
  },
  session: {
    strategy: "jwt"
  },
  pages: {
    signIn: "/login"
  }
})

export { handler as GET, handler as POST }
