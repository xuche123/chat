"use client"

import { FC, useEffect, useState } from "react"
import Link from "next/link"
import { User } from "lucide-react"

import { pusherClient } from "@/lib/pusher"
import { toPusherKey } from "@/lib/utils"

interface FriendRequestsCountProps {
  initialCount: number
  sessionId: string
}

const FriendRequestsCount: FC<FriendRequestsCountProps> = ({
  initialCount,
  sessionId,
}) => {
  const [requestCount, setRequestCount] = useState<number>(initialCount)

  useEffect(() => {
    pusherClient.subscribe(
      toPusherKey(`user:${sessionId}:incoming_friend_requests`)
    )
    pusherClient.subscribe(toPusherKey(`user:${sessionId}:friends`))

    const friendRequestHandler = () => {
      setRequestCount((prev) => prev + 1)
    }

    const addedFriendHandler = () => {
      setRequestCount((prev) => prev - 1)
    }

    pusherClient.bind("incoming_friend_requests", friendRequestHandler)
    pusherClient.bind("new_friend", addedFriendHandler)

    return () => {
      pusherClient.unsubscribe(
        toPusherKey(`user:${sessionId}:incoming_friend_requests`)
      )
      pusherClient.unsubscribe(toPusherKey(`user:${sessionId}:friends`))

      pusherClient.unbind("new_friend", addedFriendHandler)
      pusherClient.unbind("incoming_friend_requests", friendRequestHandler)
    }
  }, [sessionId])

  return (
    <Link
      href="/dashboard/requests"
      className="group flex items-center gap-x-3 rounded-md p-2 text-sm font-semibold leading-6 text-primary hover:text-indigo-600"
    >
      <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-lg border border-border bg-background text-[0.625rem] font-medium text-primary group-hover:border-indigo-600 group-hover:text-indigo-600">
        <User className="h-4 w-4" />
      </div>
      <p className="truncate">Friend requests</p>
      {requestCount > 0 && (
        <div className="flex h-5 w-5 items-center justify-center rounded-full bg-accent text-xs text-primary">
          {requestCount}
        </div>
      )}
    </Link>
  )
}

export default FriendRequestsCount
