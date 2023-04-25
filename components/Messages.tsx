"use client"

import { FC, useEffect, useRef, useState } from "react"
import Image from "next/image"
import { format } from "date-fns"

import { pusherClient } from "@/lib/pusher"
import { cn, toPusherKey } from "@/lib/utils"
import { Message } from "@/lib/validations/message"

interface MessagesProps {
  initialMessages: Message[]
  sessionId: string
  chatId: string
  sessionImg: string | null | undefined
  chatPartner: User
}

const Messages: FC<MessagesProps> = ({
  initialMessages,
  sessionId,
  chatId,
  chatPartner,
  sessionImg,
}) => {
  const [messages, setMessages] = useState<Message[]>(initialMessages)

  useEffect(() => {
    pusherClient.subscribe(toPusherKey(`chat:${chatId}`))

    const messageHandler = (message: Message) => {
      setMessages((prev) => [message, ...prev])
    }

    pusherClient.bind("incoming_message", messageHandler)

    return () => {
      pusherClient.unsubscribe(toPusherKey(`chat:${chatId}`))
      pusherClient.unbind("incoming_message", messageHandler)
    }
  }, [chatId])

  const scrollDownRef = useRef<HTMLDivElement | null>(null)

  const formatTimestamp = (timestamp: number) => {
    return format(timestamp, "HH:mm")
  }

  return (
    <div
      id="messages"
      className="scrollbar-thumb-blue scrollbar-thumb-rounded scrollbar-track-blue-lighter scrollbar-w-2 scrolling-touch flex h-full flex-1 flex-col-reverse gap-4 overflow-y-auto p-3"
    >
      <div ref={scrollDownRef} />

      {messages.map((message) => {
        const isCurrentUser = message.senderId === sessionId

        return (
          <div
            className={cn("chat break-all", {
              "chat-start": !isCurrentUser,
              "chat-end": isCurrentUser,
            })}
            key={`${message.id}-${message.timestamp}`}
          >
            <div className="chat-image avatar">
              <div className="relative w-10 rounded-full">
                <Image
                  fill
                  src={
                    isCurrentUser ? (sessionImg as string) : chatPartner.image
                  }
                  alt="Profile picture"
                  referrerPolicy="no-referrer"
                  className="rounded-full"
                  sizes="32px"
                />
              </div>
            </div>
            <div className="chat-header">
              {isCurrentUser ? "You" : chatPartner.name}{" "}
              <time className="text-xs opacity-50">
                {formatTimestamp(message.timestamp)}
              </time>
            </div>
            <div
              className={cn("chat-bubble", {
                "bg-accent text-primary": isCurrentUser,
                "bg-secondary text-primary": !isCurrentUser,
              })}
            >
              {message.text}
            </div>
          </div>
        )
      })}
    </div>
  )
}

export default Messages
