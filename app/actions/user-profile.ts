'use server'

import { connectDB } from "@/lib/services/db"
import { UserInterests } from "@/lib/models/User"

export async function getUserProfile(email: string) {
  try {
    const { db } = await connectDB()
    const user = await db.collection('users').findOne({ email })
    
    if (!user) {
      return null
    }

    return user.userInterests as UserInterests
  } catch (error) {
    console.error('Error fetching user profile:', error)
    throw new Error('Failed to fetch user profile')
  }
} 