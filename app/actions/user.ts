'use server'

import { connectDB } from "@/lib/services/db"
import { User, UserInterests } from "@/lib/models/User"
import { revalidatePath } from "next/cache"

export async function updateUser(email: string, data: { userInterests: UserInterests }) {
  try {
    const { db } = await connectDB()
    
    const result = await db.collection('users').updateOne(
      { email },
      { 
        $set: {
          userInterests: data.userInterests,
          updated_at: new Date()
        }
      }
    )

    if (!result.matchedCount) {
      throw new Error('User not found')
    }

    revalidatePath('/account')
    return { success: true }
  } catch (error) {
    console.error('Error updating user:', error)
    throw new Error(error instanceof Error ? error.message : 'Failed to update user')
  }
}

export async function getUser(email: string) {
  try {
    const { db } = await connectDB()
    const user = await db.collection('users').findOne({ email })
    
    if (!user) {
      throw new Error('User not found')
    }

    // Transform the MongoDB document to match User type
    const typedUser: User = {
      _id: user._id.toString(),
      email: user.email,
      password: user.password,
      userInterests: user.userInterests,
      created_at: user.created_at,
      updated_at: user.updated_at
    }

    return typedUser
  } catch (error) {
    console.error('Error fetching user:', error)
    throw new Error(error instanceof Error ? error.message : 'Failed to fetch user')
  }
} 