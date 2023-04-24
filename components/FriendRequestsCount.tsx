"use client"

import { FC, useState } from "react"
import Link from "next/link"
import { User } from "lucide-react"

interface FriendRequestsCountProps {
  initialCount: number
  sessionId: string
}

const FriendRequestsCount: FC<FriendRequestsCountProps> = ({
  initialCount,
  sessionId,
}) => {
  const [requestCount, setRequestCount] = useState<number>(initialCount)
  return (
    <Link
      href="/dashboard/requests"
      className="hover:gray-50 group flex items-center gap-x-3 rounded-md p-2 text-sm font-semibold leading-6 text-gray-700 hover:text-indigo-600"
    >
      <div className="border0gray-200 flex h-6 w-6 shrink-0 items-center justify-center rounded-lg border bg-white text-[0.625rem] font-medium text-gray-400 group-hover:border-indigo-600 group-hover:text-indigo-600">
        <User className="h-4 w-4" />
      </div>
      <p className="truncate">Friend requests</p>
      {requestCount > 0 && (
        <div className="flex h-5 w-5 items-center justify-center rounded-full bg-indigo-600 text-xs text-white">
          {requestCount}
        </div>
      )}
    </Link>
  )
}

export default FriendRequestsCount
