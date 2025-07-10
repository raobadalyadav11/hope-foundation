"use client"

import { useState } from "react"
import { useSession } from "next-auth/react"
import { Menu, X, Clock, Calendar, Users, Award, MapPin, CheckCircle, Star, Target, TrendingUp } from "lucide-react"
import Link from "next/link"
import { usePathname } from "next/navigation"

export default function VolunteerDashboardLayout({ children }: { children: React.ReactNode }) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false)
  const pathname = usePathname()
  const { data: session } = useSession()

  const navItems = [
    { name: "Overview", href: "/volunteer/dashboard", icon: Target },
    { name: "Tasks", href: "/volunteer/dashboard/tasks", icon: TrendingUp },
    {name:"Blogs",href:"/volunteer/dashboard/blogs",icon:Star},
    { name: "Assignments", href: "/volunteer/dashboard/assignments", icon: Calendar },
    { name: "Achievements", href: "/volunteer/dashboard/achievements", icon: Award },
    { name: "Profile", href: "/volunteer/dashboard/profile", icon: Users },
  ]

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="flex">
        {/* Sidebar */}
        <div className={`fixed inset-y-0 left-0 z-50 w-64 bg-white shadow-lg transform ${isSidebarOpen ? "translate-x-0" : "-translate-x-full"} md:translate-x-0 md:static md:w-64 transition-transform duration-300 ease-in-out`}>
          <div className="p-6">
            <div className="flex items-center justify-between mb-8">
              <h2 className="text-xl font-bold text-gray-900">Volunteer Dashboard</h2>
              <button className="md:hidden" onClick={() => setIsSidebarOpen(false)}>
                <X className="h-6 w-6" />
              </button>
            </div>
            <p className="text-gray-600 mb-6">Welcome, {session?.user?.name}!</p>
            <nav className="space-y-2">
              {navItems.map((item) => (
                <Link
                  key={item.name}
                  href={item.href}
                  className={`flex items-center p-2 rounded-lg ${
                    pathname === item.href ? "bg-blue-100 text-blue-600" : "text-gray-600 hover:bg-gray-100"
                  }`}
                  onClick={() => setIsSidebarOpen(false)}
                >
                  <item.icon className="h-5 w-5 mr-3" />
                  {item.name}
                </Link>
              ))}
            </nav>
          </div>
        </div>

        {/* Main content */}
        <div className="flex-1">
          <div className="md:hidden p-4 border-b">
            <button onClick={() => setIsSidebarOpen(true)}>
              <Menu className="h-6 w-6" />
            </button>
          </div>
          <div className="container mx-auto px-4 py-8">
            {children}
          </div>
        </div>

        {/* Overlay for mobile */}
        {isSidebarOpen && (
          <div 
            className="fixed inset-0 bg-black/50 z-40 md:hidden"
            onClick={() => setIsSidebarOpen(false)}
          />
        )}
      </div>
    </div>
  )
}
