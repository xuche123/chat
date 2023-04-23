'use client'

import { FC, useState } from 'react'
import Link from 'next/link'
import { User } from 'lucide-react'

interface FriendRequestsCountProps {
  initialCount: number
  sessionId: string
}

const FriendRequestsCount: FC<FriendRequestsCountProps> = ({initialCount, sessionId}) => {
  const [requestCount, setRequestCount] = useState<number>(initialCount)
  return (
    <Link href="/dashboard/requests" className='text-gray-700 hover:text-indigo-600 hover:gray-50 group flex items-center gap-x-3 rounded-md p-2 text-sm leading-6 font-semibold'>
      <div className='text-gray-400 border0gray-200 group-hover:border-indigo-600 group-hover:text-indigo-600 flex h-6 w-6 shrink-0 items-center justify-center rounded-lg border text-[0.625rem] font-medium bg-white'>
        <User className='h-4 w-4' />
      </div>
      <p className='truncate'>Friend requests</p>
      {requestCount > 0 && <div className='rounded-full w-5 h-5 text-xs flex justify-center items-center text-white bg-indigo-600'>{requestCount}</div>}
    </Link>
  )
}

export default FriendRequestsCount