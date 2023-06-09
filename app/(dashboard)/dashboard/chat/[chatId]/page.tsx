import Image from "next/image"
import { notFound } from "next/navigation"
import { fetchRedis } from "@/helpers/redis"
import { getServerSession } from "next-auth"

import { authOptions } from "@/lib/auth"
import { messageArrayValidator } from "@/lib/validations/message"
import ChatInput from "@/components/ChatInput"
import Messages from "@/components/Messages"

interface PageProps {
  params: {
    chatId: string
  }
}

async function getChatMessages(chatId: string) {
  try {
    const results: string[] = await fetchRedis(
      "zrange",
      `chat:${chatId}:messages`,
      0,
      -1
    )

    const dbMessages = results.map((message) => JSON.parse(message) as Message)

    const reversedDbMessages = dbMessages.reverse()

    const messages = messageArrayValidator.parse(reversedDbMessages)

    return messages
  } catch (error) {
    notFound()
  }
}

const page = async ({ params }: PageProps) => {
  const { chatId } = params
  const session = await getServerSession(authOptions)
  if (!session) notFound()

  const { user } = session

  const [userId1, userId2] = chatId.split("--")

  if (user.id !== userId1 && user.id !== userId2) {
    notFound()
  }

  const chatPartnerId = user.id === userId1 ? userId2 : userId1
  // new

  const chatPartnerRaw = (await fetchRedis(
    "get",
    `user:${chatPartnerId}`
  )) as string
  const chatPartner = JSON.parse(chatPartnerRaw) as User
  const initialMessages = await getChatMessages(chatId)

  return (
    <div className="flex h-full max-h-[calc(100vh-1rem)] flex-1 flex-col justify-between">
      <div className="flex justify-between border-b-2 border-border py-3 sm:items-center">
        <div className="relative flex items-center space-x-4">
          <div className="relative">
            <div className="relative h-8 w-8 sm:h-12 sm:w-12">
              <Image
                fill
                referrerPolicy="no-referrer"
                src={chatPartner.image}
                alt={`${chatPartner.name} profile picture`}
                className="rounded-full"
                sizes="100px"
              />
            </div>
          </div>

          <div className="flex flex-col leading-tight">
            <div className="flex items-center text-xl">
              <span className="mr-3 font-semibold text-primary">
                {chatPartner.name}
              </span>
            </div>

            <span className="text-sm text-primary">{chatPartner.email}</span>
          </div>
        </div>
      </div>

      <Messages
        chatId={chatId}
        chatPartner={chatPartner}
        sessionImg={session.user.image}
        sessionId={session.user.id}
        initialMessages={initialMessages}
      />

      <ChatInput chatId={chatId} chatPartner={chatPartner} />
    </div>
  )
}

export default page
