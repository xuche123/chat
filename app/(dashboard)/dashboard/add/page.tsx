import { FC } from "react"

import AddFriend from "@/components/AddFriend"

interface pageProps {}

const page: FC<pageProps> = ({}) => {
  return (
    <main className="pt-8">
      <h1 className="mb-8 text-5xl font-bold">Add a friend</h1>
      <AddFriend />
    </main>
  )
}

export default page
