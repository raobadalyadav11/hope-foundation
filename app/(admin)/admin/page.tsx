"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Heart, Users, CreditCard, Calendar, TrendingUp, DollarSign } from "lucide-react"
import Link from "next/link"

interface DashboardStats {
  totalDonations: number
  totalAmount: number
  totalVolunteers: number
  totalCampaigns: number
  recentDonations: any[]
  recentVolunteers: any[]
}

export default function AdminDashboard() {
  const [stats, setStats] = useState<DashboardStats>({
    totalDonations: 0,
    totalAmount: 0,
    totalVolunteers: 0,
    totalCampaigns: 0,
    recentDonations: [],
    recentVolunteers: [],
  })
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const response = await fetch("/api/admin/dashboard")
        const data = await response.json()
        setStats(data)
      } catch (error) {
        console.error("Error fetching dashboard stats:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchStats()
  }, [])

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
      </div>
    )
  }

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
        <p className="text-gray-600 mt-2">Welcome to your NGO management dashboard</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Donations</CardTitle>
            <CreditCard className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalDonations}</div>
            <p className="text-xs text-muted-foreground">+12% from last month</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Amount</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">₹{stats.totalAmount.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">+8% from last month</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Volunteers</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalVolunteers}</div>
            <p className="text-xs text-muted-foreground">+5% from last month</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Campaigns</CardTitle>
            <Heart className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalCampaigns}</div>
            <p className="text-xs text-muted-foreground">+2 new this month</p>
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Button asChild className="h-20">
          <Link href="/admin/campaigns/new" className="flex flex-col items-center gap-2">
            <Heart className="h-6 w-6" />
            <span>New Campaign</span>
          </Link>
        </Button>
        <Button asChild variant="outline" className="h-20">
          <Link href="/admin/events/new" className="flex flex-col items-center gap-2">
            <Calendar className="h-6 w-6" />
            <span>New Event</span>
          </Link>
        </Button>
        <Button asChild variant="outline" className="h-20">
          <Link href="/admin/blog/new" className="flex flex-col items-center gap-2">
            <TrendingUp className="h-6 w-6" />
            <span>New Blog Post</span>
          </Link>
        </Button>
        <Button asChild variant="outline" className="h-20">
          <Link href="/admin/users" className="flex flex-col items-center gap-2">
            <Users className="h-6 w-6" />
            <span>Manage Users</span>
          </Link>
        </Button>
      </div>

      {/* Recent Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Recent Donations</CardTitle>
            <CardDescription>Latest donations received</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {stats.recentDonations.length > 0 ? (
                stats.recentDonations.map((donation, index) => (
                  <div key={index} className="flex items-center justify-between">
                    <div>
                      <p className="font-medium">{donation.donorName}</p>
                      <p className="text-sm text-gray-600">{new Date(donation.createdAt).toLocaleDateString()}</p>
                    </div>
                    <div className="text-right">
                      <p className="font-medium">₹{donation.amount.toLocaleString()}</p>
                      <p className="text-sm text-green-600">{donation.status}</p>
                    </div>
                  </div>
                ))
              ) : (
                <p className="text-gray-500">No recent donations</p>
              )}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Recent Volunteers</CardTitle>
            <CardDescription>New volunteer registrations</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {stats.recentVolunteers.length > 0 ? (
                stats.recentVolunteers.map((volunteer, index) => (
                  <div key={index} className="flex items-center justify-between">
                    <div>
                      <p className="font-medium">{volunteer.name}</p>
                      <p className="text-sm text-gray-600">{volunteer.email}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm text-blue-600">{volunteer.role}</p>
                      <p className="text-sm text-gray-500">{new Date(volunteer.createdAt).toLocaleDateString()}</p>
                    </div>
                  </div>
                ))
              ) : (
                <p className="text-gray-500">No recent volunteers</p>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
