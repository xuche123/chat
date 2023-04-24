import Image from "next/image"
import Link from "next/link"
import { notFound } from "next/navigation"
import { getFriendsByUserId } from "@/helpers/getFriends"
import { fetchRedis } from "@/helpers/redis"
import { getServerSession } from "next-auth"

import { authOptions } from "@/lib/auth"
import FriendRequestsCount from "@/components/FriendRequestsCount"
import { Icon, Icons } from "@/components/Icons"
import SidebarChats from "@/components/SidebarChats"
import SignOutButton from "@/components/SignOutButton"

interface layoutProps {
  children: React.ReactNode
}

interface SidebarOptionsProps {
  id: number
  name: string
  href: string
  Icon: Icon
}

const SidebarOptions: SidebarOptionsProps[] = [
  {
    id: 1,
    name: "Add friend",
    href: "/dashboard/add",
    Icon: "UserPlus",
  },
]
const layout = async ({ children }: layoutProps) => {
  const session = await getServerSession(authOptions)
  // console.log(session)
  if (!session) {
    return notFound()
  }

  const friends = await getFriendsByUserId(session.user.id)

  const initialCount = (
    (await fetchRedis(
      "smembers",
      `user:${session.user.id}:incoming_friend_requests`
    )) as User[]
  ).length

  return (
    <div className="flex h-screen w-full">
      <div className="hidden h-full w-full max-w-xs grow flex-col gap-y-5 overflow-y-auto border-r border-gray-200 bg-white px-6 md:flex">
        <Link href="/dashboard" className="flex h-16 shrink-0 items-center">
          <Icons.Logo className="h-8 w-auto text-indigo-600" />
        </Link>

        {friends.length > 0 && (
          <div className="text-xs font-semibold leading-6 text-gray-400">
            Your chats
          </div>
        )}

        <nav className="flex flex-1 flex-col">
          <ul role="list" className="flex flex-1 flex-col gap-y-7">
            <li>
              <SidebarChats friends={friends} sessionId={session.user.id} />
            </li>
            <li>
              <div className="text-xs font-semibold leading-6 text-gray-400">
                Overview
              </div>

              <ul role="list" className="-mx-2 mt-2 space-y-1">
                {SidebarOptions.map((option) => {
                  const Icon = Icons[option.Icon]
                  return (
                    <li key={option.id}>
                      <Link
                        href={option.href}
                        className="group flex gap-3 rounded-md p-2 text-sm font-semibold leading-6 text-gray-700 hover:bg-gray-50 hover:text-indigo-600"
                      >
                        <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-lg border border-gray-200 bg-white text-[0.625rem] font-medium text-gray-400 group-hover:border-indigo-600 group-hover:text-indigo-600">
                          <Icon className="h-4 w-4" />
                        </span>

                        <span className="truncate">{option.name}</span>
                      </Link>
                    </li>
                  )
                })}
                <li>
                  <FriendRequestsCount
                    sessionId={session.user.id}
                    initialCount={initialCount}
                  />
                </li>
              </ul>
            </li>

            <li className="-mx-6 mt-auto flex items-center">
              <div className="flex flex-1 items-center gap-x-4 px-6 py-3 text-sm font-semibold leading-6 text-gray-900">
                <div className="relative h-8 w-8 bg-gray-50">
                  <Image
                    fill
                    referrerPolicy="no-referrer"
                    className="rounded-full"
                    src={session.user.image || ""}
                    alt="Your profile picture"
                    sizes="48px"
                  />
                </div>

                <span className="sr-only">Your profile</span>
                <div className="flex flex-col">
                  <span aria-hidden="true">{session.user.name}</span>
                  <span className="text-xs text-zinc-400" aria-hidden="true">
                    {session.user.email}
                  </span>
                </div>
              </div>

              <SignOutButton className="aspect-square h-full" />
            </li>
          </ul>
        </nav>
      </div>
      <aside className="max-h-screen w-full px-2 py-16 md:py-12">
        {children}
      </aside>
    </div>
  )
}

export default layout
