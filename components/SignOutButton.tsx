"use client"

import { ButtonHTMLAttributes, FC, useState } from "react"
import { Loader2, LogOut } from "lucide-react"
import { signOut } from "next-auth/react"
import { toast } from "react-hot-toast"

import { Button } from "./ui/button"

interface SignOutButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {}

const SignOutButton: FC<SignOutButtonProps> = ({ ...props }) => {
  const [isSigningOut, setIsSigningOut] = useState(false)
  const handleClick = async () => {
    try {
      setIsSigningOut(true)
      await signOut()
    } catch (error) {
      toast.error("Couldn't sign out")
    } finally {
      setIsSigningOut(false)
    }
  }
  return (
    <Button {...props} onClick={handleClick} variant="ghost">
      {isSigningOut ? (
        <Loader2 className="h-4 w-4 animate-spin" />
      ) : (
        <LogOut className="h-4 w-4" />
      )}
    </Button>
  )
}

export default SignOutButton
