"use client"

import type React from "react"

import { useState } from "react"
import { useSession } from "next-auth/react"
import { Menu, X, DollarSign, Heart, Target, Users, Edit, FileText } from "lucide-react"
import Link from "next/link"
import { usePathname } from "next/navigation"

export default function DonorDashboardLayout({ children }: { children: React.ReactNode }) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false)
  const pathname = usePathname()
  const { data: session } = useSession()

  const navItems = [
    { name: "Overview", href: "/donor/dashboard", icon: Target },
    { name: "Donations", href: "/donor/dashboard/donations", icon: DollarSign },
    { name: "Campaigns", href: "/donor/dashboard/campaigns", icon: Heart },
    { name: "Subscriptions", href: "/donor/dashboard/subscriptions", icon: Heart },
    { name: "Profile", href: "/donor/dashboard/profile", icon: Users },
  ]

  // Add blog navigation items if user has content creator role
  if (session?.user?.roles?.includes("content_creator")) {
    navItems.push(
      { name: "Blog Editor", href: "/donor/dashboard/blog-editor", icon: Edit },
      { name: "My Blogs", href: "/donor/dashboard/blogs", icon: FileText },
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="flex">
        {/* Sidebar */}
        <div
          className={`fixed inset-y-0 left-0 z-50 w-64 bg-white shadow-lg transform ${isSidebarOpen ? "translate-x-0" : "-translate-x-full"} md:translate-x-0 md:static md:w-64 transition-transform duration-300 ease-in-out`}
        >
          <div className="p-6">
            <div className="flex items-center justify-between mb-8">
              <h2 className="text-xl font-bold text-gray-900">Donor Dashboard</h2>
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
          <div className="container mx-auto px-4 py-8">{children}</div>
        </div>

        {/* Overlay for mobile */}
        {isSidebarOpen && (
          <div className="fixed inset-0 bg-black/50 z-40 md:hidden" onClick={() => setIsSidebarOpen(false)} />
        )}
      </div>
    </div>
  )
}
