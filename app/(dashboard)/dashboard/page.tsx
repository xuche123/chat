import { FC } from 'react'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'

interface pageProps {
  
}

const page = async ({ }) => {
  const session = await getServerSession(authOptions)
  return <div className='text-5xl text-center'>{session?.user.email}</div>
}

export default page