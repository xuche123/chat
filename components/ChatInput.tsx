"use client"

import { FC, useRef, useState } from "react"
import axios from "axios"
import { Loader2, MessageCircle } from "lucide-react"
import { toast } from "react-hot-toast"
import TextareaAutosize from "react-textarea-autosize"

import { cn } from "@/lib/utils"
import { Button, buttonVariants } from "./ui/button"

interface ChatInputProps {
  chatPartner: User
  chatId: string
}

const ChatInput: FC<ChatInputProps> = ({ chatPartner, chatId }) => {
  const textareaRef = useRef<HTMLTextAreaElement | null>(null)
  const [isLoading, setIsLoading] = useState<boolean>(false)
  const [input, setInput] = useState<string>("")

  const sendMessage = async () => {
    if (!input) return
    setIsLoading(true)

    try {
      await axios.post("/api/message/send", { text: input, chatId })
      setInput("")
      textareaRef.current?.focus()
    } catch {
      toast.error("Something went wrong. Please try again later.")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="mb-0 border-t border-gray-200 px-4 pt-4 sm:mb-0">
      <div className="relative flex-1 overflow-hidden rounded-lg shadow-sm ring-1 ring-inset ring-gray-300 focus-within:ring-2 focus-within:ring-indigo-600">
        <TextareaAutosize
          ref={textareaRef}
          onKeyDown={(e) => {
            if (e.key === "Enter" && !e.shiftKey) {
              e.preventDefault()
              sendMessage()
            }
          }}
          rows={1}
          // minRows={3}
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder={`Message ${chatPartner.name}`}
          className="block w-full resize-none border-0 bg-transparent p-1 text-gray-900 placeholder:text-gray-400 focus:ring-0 sm:py-1.5 sm:text-sm sm:leading-6"
        />
      </div>
    </div>
  )
}

export default ChatInput
