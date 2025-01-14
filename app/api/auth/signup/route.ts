import { connectDB } from "@/lib/services/db"
import { NextResponse } from "next/server"
import bcrypt from "bcryptjs"

export async function POST(request: Request) {
  const { email, password } = await request.json()

  const { db } = await connectDB()
  const existingUser = await db.collection("users").findOne({ email })
  
  if (existingUser) {
    return NextResponse.json(
      { error: "User already exists" },
      { status: 400 }
    )
  }

  const hashedPassword = await bcrypt.hash(password, 10)
  const result = await db.collection("users").insertOne({
    email,
    password: hashedPassword,
    created_at: new Date(),
    updated_at: new Date(),
    userInterests: null
  })

  const newUser = await db
    .collection("users")
    .findOne({ _id: result.insertedId })

  return NextResponse.json(newUser)
} 