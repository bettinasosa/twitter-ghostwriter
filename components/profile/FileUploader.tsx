"use client"

import { useState, useRef } from "react"
import { useToast } from "@/components/ui/use-toast"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Upload, File as FileIcon, X } from "lucide-react"
import { LoadingSpinner } from "@/components/ui/loading"
import { UserInterests } from "@/lib/models/User"
import { useAuth } from "@/lib/AuthContext"
import { uploadFiles, updateAssistant } from "@/app/actions/assistant"

interface FileUploaderProps {
  userInterests: UserInterests
}

export function FileUploader({ userInterests }: FileUploaderProps) {
  const [files, setFiles] = useState<File[]>([])
  const [isUploading, setIsUploading] = useState(false)
  const { toast } = useToast()
  const { user } = useAuth()
  const inputRef = useRef<HTMLInputElement>(null)

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setFiles(Array.from(e.target.files))
    }
  }

  const removeFile = (index: number) => {
    setFiles(files.filter((_, i) => i !== index))
  }

  const handleUpload = async () => {
    if (!user?.email || files.length === 0) return

    setIsUploading(true)
    try {
      const uploadedFileIds = await uploadFiles(files)
      await updateAssistant(user.email, userInterests, uploadedFileIds)

      toast({
        title: "Files uploaded successfully",
        description: "Your assistant has been updated with the new context."
      })
      setFiles([])
    } catch (error) {
      console.error("Upload error:", error)
      toast({
        title: "Upload failed",
        description: "There was an error uploading your files.",
        variant: "destructive"
      })
    } finally {
      setIsUploading(false)
    }
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-4">
        <Input
          ref={inputRef}
          type="file"
          multiple
          onChange={handleFileChange}
          className="hidden"
          accept=".txt,.pdf,.doc,.docx,.md"
        />
        <Button
          type="button"
          variant="outline"
          onClick={() => inputRef.current?.click()}
        >
          <Upload className="mr-2 h-4 w-4" />
          Select Files
        </Button>
        {files.length > 0 && (
          <Button type="button" onClick={handleUpload} disabled={isUploading}>
            {isUploading ? (
              <>
                <LoadingSpinner className="mr-2 h-4 w-4" />
                Uploading...
              </>
            ) : (
              "Upload Files"
            )}
          </Button>
        )}
      </div>

      {files.length > 0 && (
        <div className="space-y-2">
          {files.map((file, index) => (
            <div
              key={index}
              className="flex items-center justify-between p-2 bg-muted rounded-md"
            >
              <div className="flex items-center gap-2">
                <FileIcon className="h-4 w-4" />
                <span className="text-sm">{file.name}</span>
              </div>
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={() => removeFile(index)}
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
