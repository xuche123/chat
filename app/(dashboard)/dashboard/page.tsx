import { FC } from 'react'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'

interface pageProps {
  
}

const page: FC<pageProps> = ({ }) => {
  // const session = await getServerSession(authOptions)
  return <div>asdf</div>
}

export default page