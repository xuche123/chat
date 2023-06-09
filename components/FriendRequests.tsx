"use client"

import { FC, useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import axios from "axios"
import { Check, UserPlus, X } from "lucide-react"

import { pusherClient } from "@/lib/pusher"
import { toPusherKey } from "@/lib/utils"

interface FriendRequestsProps {
  incomingFriendRequests: IncomingFriendRequest[]
  sessionId: string
}

const FriendRequests: FC<FriendRequestsProps> = ({
  incomingFriendRequests,
  sessionId,
}) => {
  const [friendRequests, setFriendRequests] = useState<IncomingFriendRequest[]>(
    incomingFriendRequests
  )
  const router = useRouter()

  useEffect(() => {
    pusherClient.subscribe(
      toPusherKey(`user:${sessionId}:incoming_friend_requests`)
    )

    const friendRequestHandler = ({
      senderId,
      senderEmail,
    }: IncomingFriendRequest) => {
      setFriendRequests((prev) => [...prev, { senderId, senderEmail }])
    }

    pusherClient.bind("incoming_friend_requests", friendRequestHandler)

    return () => {
      pusherClient.unsubscribe(
        toPusherKey(`user:${sessionId}:incoming_friend_requests`)
      )
      pusherClient.unbind("incoming_friend_requests", friendRequestHandler)
    }
  }, [sessionId])

  const acceptFriend = async (senderId: string) => {
    await axios.post("/api/friends/accept", { id: senderId })

    setFriendRequests((prev) =>
      prev.filter((request) => request.senderId !== senderId)
    )

    router.refresh()
  }

  const denyFriend = async (senderId: string) => {
    await axios.post("/api/friends/deny", { id: senderId })

    setFriendRequests((prev) =>
      prev.filter((request) => request.senderId !== senderId)
    )

    router.refresh()
  }

  return (
    <>
      {friendRequests.length === 0 ? (
        <p className="text-sm text-primary">Nothing to show here....</p>
      ) : (
        friendRequests.map((request) => (
          <div key={request.senderId} className="flex items-center gap-4">
            <UserPlus className="text-black" />
            <p className="text-lg font-medium">{request.senderEmail}</p>
            <button
              onClick={() => acceptFriend(request.senderId)}
              className="grid h-8 w-8 place-items-center rounded-full bg-accent transition hover:bg-indigo-700 hover:shadow-md"
            >
              <Check className="h-3/4 w-3/4 font-semibold text-primary" />
            </button>

            <button
              onClick={() => denyFriend(request.senderId)}
              className="grid h-8 w-8 place-items-center rounded-full bg-red-600 transition hover:bg-red-700 hover:shadow-md"
            >
              <X className="h-3/4 w-3/4 font-semibold text-primary" />
            </button>
          </div>
        ))
      )}
    </>
  )
}

export default FriendRequests
