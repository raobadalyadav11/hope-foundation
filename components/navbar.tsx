"use client"

import { useState } from "react"
import Link from "next/link"
import { useSession, signOut } from "next-auth/react"
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {
  Menu,
  Home,
  Heart,
  Calendar,
  BookOpen,
  Mail,
  LogOut,
  LogIn,
  UserPlus,
  Settings,
  Target,
  Sparkles,
} from "lucide-react"

export function Navbar() {
  const { data: session } = useSession()
  const [open, setOpen] = useState(false)

  const navItems = [
    { href: "/", label: "Home" },
    { href: "/about", label: "About" },
    { href: "/campaigns", label: "Campaigns" },
    { href: "/events", label: "Events"},
    { href: "/blog", label: "Blog"},
    { href: "/contact", label: "Contact"},
  ]

  return (
    <header className="bg-white/95 backdrop-blur-md py-4 border-b border-blue-100 sticky top-0 z-50 shadow-sm">
      <div className="container mx-auto px-4 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-3 group">
          <div className="w-10 h-10 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-full flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
            <Heart className="w-5 h-5 text-white" />
          </div>
          <div>
            <div className="font-bold text-xl text-gray-900">Hope Foundation</div>
            <div className="text-xs text-gray-500 -mt-1">Creating Change Together</div>
          </div>
        </Link>

        {/* Desktop Navigation */}
        <div className="hidden lg:flex items-center space-x-8">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="flex items-center gap-2 text-gray-700 hover:text-blue-600 transition-colors font-medium group"
            >
              {item.label}
            </Link>
          ))}
        </div>

        {/* Desktop Actions */}
        <div className="hidden lg:flex items-center space-x-4">
          {session?.user ? (
            <div className="flex items-center space-x-4">
              <Button className="bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white rounded-full px-6 shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300">
                <Link href="/donate" className="flex items-center gap-2">
                  <Sparkles className="w-4 h-4" />
                  Donate Now
                </Link>
              </Button>

              <div className="flex items-center gap-3 p-2 bg-gray-50 rounded-full hover:bg-gray-100 transition-colors cursor-pointer">
                <Avatar className="w-8 h-8">
                  <AvatarImage
                    src={session?.user?.image || "/placeholder.svg"}
                    alt={session?.user?.name || "Profile"}
                  />
                  <AvatarFallback className="bg-gradient-to-r from-blue-500 to-indigo-500 text-white">
                    {session?.user?.name?.charAt(0).toUpperCase() || "U"}
                  </AvatarFallback>
                </Avatar>
                <Link
                  href="/profile"
                  className="text-sm font-medium text-gray-700 hover:text-blue-600 transition-colors"
                >
                  {session?.user?.name?.split(" ")[0] || "Profile"}
                </Link>
              </div>

              <Button variant="ghost" size="sm" onClick={() => signOut()} className="text-gray-500 hover:text-red-500">
                <LogOut className="w-4 h-4" />
              </Button>
            </div>
          ) : (
            <div className="flex items-center space-x-4">
              <Link href="/signin" className="text-gray-700 hover:text-blue-600 transition-colors font-medium">
                Sign In
              </Link>
              <Button className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white rounded-full px-6 shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300">
                <Link href="/signup">Get Started</Link>
              </Button>
            </div>
          )}
        </div>

        {/* Mobile Menu */}
        <Sheet open={open} onOpenChange={setOpen}>
          <SheetTrigger asChild className="lg:hidden">
            <Button variant="ghost" size="sm" className="p-2">
              <Menu className="w-6 h-6" />
            </Button>
          </SheetTrigger>
          <SheetContent side="right" className="w-80 bg-gradient-to-br from-blue-50 to-indigo-100">
            <SheetHeader className="text-left mb-6">
              <SheetTitle className="flex items-center gap-3">
                <div className="w-8 h-8 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-full flex items-center justify-center">
                  <Heart className="w-4 h-4 text-white" />
                </div>
                Hope Foundation
              </SheetTitle>
              <SheetDescription>Navigate our website and discover how you can make a difference</SheetDescription>
            </SheetHeader>

            <div className="space-y-4">
              {navItems.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className="flex items-center space-x-3 py-3 px-4 rounded-xl hover:bg-white/50 transition-colors group"
                  onClick={() => setOpen(false)}
                >
                  <div className="w-10 h-10 bg-white/70 rounded-full flex items-center justify-center group-hover:scale-110 transition-transform duration-200">
                  </div>
                  <span className="font-medium text-gray-700">{item.label}</span>
                </Link>
              ))}

              <div className="pt-6 space-y-4 border-t border-white/30">
                {session?.user ? (
                  <>
                    <div className="flex items-center space-x-3 p-4 bg-white/50 rounded-xl">
                      <Avatar className="w-10 h-10">
                        <AvatarImage
                          src={session?.user?.image || "/placeholder.svg"}
                          alt={session?.user?.name || "Profile"}
                        />
                        <AvatarFallback className="bg-gradient-to-r from-blue-500 to-indigo-500 text-white">
                          {session?.user?.name?.charAt(0).toUpperCase() || "U"}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <p className="font-medium text-gray-900">{session?.user?.name}</p>
                        <p className="text-sm text-gray-600">{session?.user?.email}</p>
                      </div>
                    </div>

                    <Button
                      className="w-full bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white rounded-xl py-3 shadow-lg"
                      asChild
                    >
                      <Link href="/donate" onClick={() => setOpen(false)}>
                        <Sparkles className="w-4 h-4 mr-2" />
                        Donate Now
                      </Link>
                    </Button>

                    <Button variant="outline" className="w-full rounded-xl py-3 border-2 bg-transparent" asChild>
                      <Link href="/profile" onClick={() => setOpen(false)}>
                        <Settings className="w-4 h-4 mr-2" />
                        Profile Settings
                      </Link>
                    </Button>

                    <Button
                      variant="ghost"
                      className="w-full text-red-500 hover:text-red-600 hover:bg-red-50 rounded-xl py-3"
                      onClick={() => signOut()}
                    >
                      <LogOut className="w-4 h-4 mr-2" />
                      Sign Out
                    </Button>
                  </>
                ) : (
                  <>
                    <Button variant="outline" className="w-full rounded-xl py-3 border-2 bg-transparent" asChild>
                      <Link href="/signin" onClick={() => setOpen(false)}>
                        <LogIn className="w-4 h-4 mr-2" />
                        Sign In
                      </Link>
                    </Button>
                    <Button
                      className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white rounded-xl py-3 shadow-lg"
                      asChild
                    >
                      <Link href="/signup" onClick={() => setOpen(false)}>
                        <UserPlus className="w-4 h-4 mr-2" />
                        Get Started
                      </Link>
                    </Button>
                  </>
                )}
              </div>
            </div>
          </SheetContent>
        </Sheet>
      </div>
    </header>
  )
}
