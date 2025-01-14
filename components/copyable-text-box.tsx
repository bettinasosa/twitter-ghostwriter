"use client"

import { useState } from 'react'
import { Copy, Check } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'

interface CopyableTextBoxProps {
  text: string
  readOnly?: boolean
}

export function CopyableTextBox({ text, readOnly = true }: CopyableTextBoxProps) {
  const [isCopied, setIsCopied] = useState(false)

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(text)
      setIsCopied(true)
      setTimeout(() => setIsCopied(false), 2000)
    } catch (err) {
      console.error('Failed to copy text: ', err)
    }
  }

  return (
    <div className="relative">
      <Textarea
        value={text}
        readOnly={readOnly}
        className="pr-10 min-h-[100px]"
      />
      {readOnly && (
        <Button
          variant="ghost"
          size="icon"
          className="absolute top-2 right-2"
          onClick={copyToClipboard}
        >
          {isCopied ? (
            <Check className="h-4 w-4" />
          ) : (
            <Copy className="h-4 w-4" />
          )}
          <span className="sr-only">
            {isCopied ? 'Copied' : 'Copy to clipboard'}
          </span>
        </Button>
      )}
    </div>
  )
}

