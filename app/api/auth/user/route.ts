import { connectDB } from "@/lib/services/db"
import { NextResponse } from "next/server"

export async function GET(request: Request) {
  const email = new URL(request.url).searchParams.get("email")
  if (!email) {
    return NextResponse.json({ error: "Email required" }, { status: 400 })
  }

  const { db } = await connectDB()
  const user = await db.collection("users").findOne({ email })
  
  return NextResponse.json(user)
} 