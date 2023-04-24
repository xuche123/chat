"use client"

import { FC, useState } from "react"
import { zodResolver } from "@hookform/resolvers/zod"
import axios, { AxiosError } from "axios"
import { useForm } from "react-hook-form"
import toast from "react-hot-toast"
import * as z from "zod"

import { addFriendSchema } from "@/lib/validations/add-friend"
import { Button } from "./ui/button"
import { Input } from "./ui/input"

interface AddFriendProps {}

const AddFriend: FC<AddFriendProps> = ({}) => {
  type FormData = z.infer<typeof addFriendSchema>

  const { register, handleSubmit, setError } = useForm<FormData>({
    resolver: zodResolver(addFriendSchema),
  })

  const [success, setSuccess] = useState(false)

  const addFriend = async (email: string) => {
    try {
      const validatedEmail = addFriendSchema.parse({ email })
      await axios.post("/api/friends/add", { email: validatedEmail })
      setSuccess(true)
    } catch (error) {
      if (error instanceof z.ZodError) {
        setError("email", { message: error.message })
        toast.error(error.message)
      } else if (error instanceof AxiosError) {
        setError("email", { message: error.response?.data })
        toast.error(error.response?.data)
      } else {
        setError("email", { message: "Something went wrong" })
        toast.error("Something went wrong")
      }
    }
  }

  const onSubmit = (data: FormData) => {
    addFriend(data.email)
  }

  return (
    <form className="max-w-sm" onSubmit={handleSubmit(onSubmit)}>
      <h2 className="text-lg font-semibold">Add friend by email</h2>
      <div className="flex w-full max-w-sm items-center space-x-2">
        <Input {...register("email")} placeholder="Email" />
        <Button type="submit">add</Button>
      </div>
      {success && <p className="text-green-500">Friend request sent</p>}
    </form>
  )
}

export default AddFriend
