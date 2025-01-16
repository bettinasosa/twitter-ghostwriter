"use server"

import { assistantService } from "@/lib/services/AssistantService"
import { UserInterests } from "@/lib/models/User"
import OpenAI from "openai"

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
})

export async function uploadFiles(files: File[]) {
  try {
    return await Promise.all(
      files.map(async file => {
        const arrayBuffer = await file.arrayBuffer()
        const buffer = Buffer.from(arrayBuffer)

        const uploadedFile = await openai.files.create({
          file: buffer,
          purpose: "assistants"
        })

        return uploadedFile.id
      })
    )
  } catch (error) {
    console.error("Upload error:", error)
    throw new Error("Failed to upload files")
  }
}

export async function updateAssistant(
  email: string,
  userInterests: UserInterests,
  fileIds: string[]
) {
  try {
    return await assistantService.getOrCreateAssistant(
      email,
      userInterests,
      fileIds
    )
  } catch (error) {
    console.error("Assistant update error:", error)
    throw new Error("Failed to update assistant")
  }
} 