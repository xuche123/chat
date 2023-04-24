import { FC } from "react"
import { getServerSession } from "next-auth"

import { authOptions } from "@/lib/auth"

interface pageProps {}

const page = async ({}) => {
  const session = await getServerSession(authOptions)
  return <div className="text-center text-5xl">{session?.user.email}</div>
}

export default page
