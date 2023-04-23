import { fetchRedis } from "@/helpers/redis"
import { authOptions } from "@/lib/auth"
import { db } from "@/lib/db"
import { addFriendSchema } from "@/lib/validations/add-friend"
import { getServerSession } from "next-auth"
import * as z from "zod"

export async function POST(req: Request, res: Response) {
  try {
    const body = await req.json()
    const { email } = addFriendSchema.parse(body.email)
    
    const idToAdd = await fetchRedis('get', `user:email:${email}`) as string

    if (!idToAdd) {
      return new Response('User not found', { status: 400 })
    }

    const session = await getServerSession(authOptions)
    
    if (!session) {
      return new Response('Unauthorized', { status: 401 })
    }

    if (session.user.id === idToAdd) {
      return new Response('You cannot add yourself', { status: 400 })
    }

    const isAlreadyAdded = await fetchRedis('sismember', `user:${idToAdd}:incoming_friend_requests`, session.user.id) as boolean

    if (isAlreadyAdded) {
      return new Response('You have already added this user', { status: 400 })
    }

    const isAlreadyFriend = await fetchRedis('sismember', `user:${session.user.id}:friends`, idToAdd) as boolean

    if (isAlreadyFriend) {
      return new Response('You have already added this user', { status: 400 })
    }

    db.sadd(`user:${idToAdd}:incoming_friend_requests`, session.user.id)

    return new Response('Friend request sent!', { status: 200 })
  } catch (error) {
    if (error instanceof z.ZodError) {
      return new Response('Invalid request payload', { status: 422 })
    }

    return new Response('Invalid request', { status: 400 })
  }
}