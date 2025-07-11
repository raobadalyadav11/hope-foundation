"use client"

import { useState } from "react"
import Link from "next/link"
import { useSession, signOut } from "next-auth/react"
import { useMobile } from "@/hooks/use-mobile"
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Menu, Home, Heart, Calendar, BookOpen, Mail, LogOut, LogIn, UserPlus, Settings, Target } from "lucide-react"

export function Navbar() {
  const { data: session } = useSession()
  const [open, setOpen] = useState(false)
  const isMobile = useMobile()

  const navItems = [
    { href: "/", label: "Home", icon: Home },
    { href: "/about", label: "About", icon: Heart },
    { href: "/campaigns", label: "Campaigns", icon: Target },
    { href: "/events", label: "Events", icon: Calendar },
    { href: "/blog", label: "Blog", icon: BookOpen },
    { href: "/contact", label: "Contact", icon: Mail },
  ]

  return (
    <header className="bg-white/95 backdrop-blur-md py-4 border-b sticky top-0 z-50">
      <div className="container mx-auto px-4 flex items-center justify-between">
        <Link href="/" className="font-bold text-xl">
          Hope Foundation
        </Link>

        {isMobile ? (
          <Sheet open={open} onOpenChange={setOpen}>
            <SheetTrigger asChild>
              <Button variant="ghost" size="sm">
                <Menu className="w-5 h-5" />
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="sm:w-64">
              <SheetHeader className="text-left">
                <SheetTitle>Menu</SheetTitle>
                <SheetDescription>Navigate the Hope Foundation website</SheetDescription>
              </SheetHeader>
              <div className="py-4">
                {navItems.map((item) => (
                  <Link
                    key={item.href}
                    href={item.href}
                    className="flex items-center space-x-2 py-2 px-4 rounded-md hover:bg-gray-100 block"
                  >
                    <item.icon className="w-4 h-4" />
                    <span>{item.label}</span>
                  </Link>
                ))}
                <Separator className="my-4" />
                {session?.user ? (
                  <>
                    <Link
                      href="/profile"
                      className="flex items-center space-x-2 py-2 px-4 rounded-md hover:bg-gray-100 block"
                    >
                      <Settings className="w-4 h-4" />
                      <span>Profile</span>
                    </Link>
                    <Button variant="ghost" size="sm" className="w-full justify-start" onClick={() => signOut()}>
                      <LogOut className="w-4 h-4 mr-2" />
                      Logout
                    </Button>
                  </>
                ) : (
                  <>
                    <Link
                      href="/signin"
                      className="flex items-center space-x-2 py-2 px-4 rounded-md hover:bg-gray-100 block"
                    >
                      <LogIn className="w-4 h-4" />
                      <span>Sign In</span>
                    </Link>
                    <Link
                      href="/signup"
                      className="flex items-center space-x-2 py-2 px-4 rounded-md hover:bg-gray-100 block"
                    >
                      <UserPlus className="w-4 h-4" />
                      <span>Sign Up</span>
                    </Link>
                  </>
                )}
              </div>
            </SheetContent>
          </Sheet>
        ) : (
          <div className="flex items-center space-x-6">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="hover:text-blue-600 transition-colors flex items-center gap-1"
              >
                {item.label}
              </Link>
            ))}
            {session?.user ? (
              <div className="flex items-center space-x-4">
                <Link href="/profile" className="hover:text-blue-600 transition-colors flex items-center gap-1">
                  <Avatar className="w-7 h-7">
                    <AvatarImage
                      src={session?.user?.image || "/placeholder.svg"}
                      alt={session?.user?.name || "Profile"}
                    />
                    <AvatarFallback>{session?.user?.name?.charAt(0).toUpperCase() || "U"}</AvatarFallback>
                  </Avatar>
                  <span>Profile</span>
                </Link>
                <Button variant="outline" size="sm" onClick={() => signOut()}>
                  <LogOut className="w-4 h-4 mr-2" />
                  Logout
                </Button>
              </div>
            ) : (
              <div className="flex items-center space-x-4">
                <Link href="/signin" className="hover:text-blue-600 transition-colors">
                  Sign In
                </Link>
                <Link
                  href="/signup"
                  className="bg-blue-600 text-white rounded-md px-4 py-2 hover:bg-blue-700 transition-colors"
                >
                  Sign Up
                </Link>
              </div>
            )}
          </div>
        )}
      </div>
    </header>
  )
}

const Separator = ({ className }: { className?: string }) => {
  return <div className={`border-b w-full ${className}`} />
}
