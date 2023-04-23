'use client'

import { FC, useState } from 'react'
import { signIn } from 'next-auth/react'
import { buttonVariants } from '@/components/ui/button'
import { cn } from '@/lib/utils'
import { Loader2, Github, Send } from 'lucide-react'
import { toast } from 'react-hot-toast'

const Page: FC = () => {
  const [isGitHubLoading, setIsGitHubLoading] = useState<boolean>(false)
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

  return (
    <>
      <div className='flex min-h-full items-center justify-center py-12 px-4 sm:px-6 lg:px-8'>
        <div className='w-full flex flex-col items-center max-w-md space-y-8'>
          <div className='flex flex-col items-center gap-8'>
            <Send className='h-16 w-16' />
            <h2 className='mt-6 text-center text-3xl font-bold tracking-tight text-gray-900'>
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
          
        </div>
      </div>
    </>
  )
}

export default Page