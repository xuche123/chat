"use client"

import { FC, useState } from "react"
import { Chrome, Github, Loader2, Send } from "lucide-react"
import { signIn } from "next-auth/react"
import { toast } from "react-hot-toast"

import { cn } from "@/lib/utils"
import { buttonVariants } from "@/components/ui/button"

const Page: FC = () => {
  const [isGitHubLoading, setIsGitHubLoading] = useState<boolean>(false)
  const [isGoogleLoading, setIsGoogleLoading] = useState<boolean>(false)
  const [isLoading, setIsLoading] = useState<boolean>(false)

  const githubLogin = () => {
    try {
      setIsGitHubLoading(true)
      setIsLoading(true)
      // throw new Error("Something went wrong with your login.")
      signIn("github")
    } catch (error) {
      toast.error("Something went wrong")
    } finally {
      setIsGitHubLoading(false)
      setIsLoading(false)
    }
  }

  const googleLogin = () => {
    try {
      setIsGoogleLoading(true)
      setIsLoading(true)
      // throw new Error("Something went wrong with your login.")
      signIn("google")
    } catch (error) {
      toast.error("Something went wrong")
    } finally {
      setIsGoogleLoading(false)
      setIsLoading(false)
    }
  }

  return (
    <>
      <div className="flex min-h-full items-center justify-center px-4 py-12 sm:px-6 lg:px-8">
        <div className="flex w-full max-w-md flex-col items-center space-y-8">
          <div className="flex flex-col items-center gap-8">
            <Send className="h-16 w-16" />
            <h2 className="mt-6 text-center text-3xl font-bold tracking-tight text-primary">
              Chat
            </h2>
          </div>
          <button
            type="button"
            className={cn(buttonVariants({ variant: "default" }))}
            onClick={githubLogin}
            disabled={isLoading || isGitHubLoading}
          >
            {isGitHubLoading ? (
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            ) : (
              <Github className="mr-2 h-4 w-4" />
            )}{" "}
            Sign In with Github
          </button>
          <button
            type="button"
            className={cn(buttonVariants({ variant: "default" }))}
            onClick={googleLogin}
            disabled={isLoading || isGoogleLoading}
          >
            {isGoogleLoading ? (
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            ) : (
              <Chrome className="mr-2 h-4 w-4" />
            )}{" "}
            Sign In with Google
          </button>
        </div>
      </div>
    </>
  )
}

export default Page
