"use client"

import { useQuery } from "@tanstack/react-query"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Users, DollarSign, Target, Calendar, FileText, UserCheck } from "lucide-react"
import { Line, LineChart, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts"

interface DashboardData {
  overview: {
    totalDonations: number
    totalDonationCount: number
    totalUsers: number
    totalCampaigns: number
    totalEvents: number
    totalVolunteers: number
    monthlyDonations: number
    monthlyDonationCount: number
  }
  campaigns: {
    totalGoal: number
    totalRaised: number
    activeCampaigns: number
    completedCampaigns: number
    progressPercentage: number
  }
  events: {
    upcomingEvents: number
    totalAttendees: number
  }
  volunteers: {
    approved: number
    pending: number
    rejected: number
    totalHours: number
  }
  blogs: {
    published: number
    draft: number
    totalViews: number
  }
  trends: {
    donations: Array<{
      month: string
      amount: number
      donations: number
    }>
  }
  topCampaigns: Array<{
    _id: string
    title: string
    raised: number
    goal: number
  }>
}

export default function AdminDashboard() {
  const { data: dashboardData, isLoading } = useQuery({
    queryKey: ["admin-dashboard"],
    queryFn: async () => {
      const response = await fetch("/api/analytics/dashboard")
      if (!response.ok) throw new Error("Failed to fetch dashboard data")
      return response.json() as Promise<DashboardData>
    },
  })

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
      </div>
    )
  }

  if (!dashboardData) {
    return <div>Error loading dashboard data</div>
  }

  const { overview, campaigns, events, volunteers, blogs, trends, topCampaigns } = dashboardData

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Admin Dashboard</h1>
        <p className="text-gray-600">Overview of your NGO's performance and activities</p>
      </div>

      {/* Overview Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Donations</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">₹{overview.totalDonations.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">
              {overview.totalDonationCount} donations • ₹{overview.monthlyDonations.toLocaleString()} this month
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Users</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{overview.totalUsers.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">Registered users on platform</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Campaigns</CardTitle>
            <Target className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{campaigns.activeCampaigns}</div>
            <p className="text-xs text-muted-foreground">
              {campaigns.completedCampaigns} completed • {campaigns.progressPercentage}% avg progress
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Volunteers</CardTitle>
            <UserCheck className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{volunteers.approved}</div>
            <p className="text-xs text-muted-foreground">
              {volunteers.pending} pending • {volunteers.totalHours.toLocaleString()} total hours
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Charts and Detailed Stats */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Donation Trends */}
        <Card>
          <CardHeader>
            <CardTitle>Donation Trends</CardTitle>
            <CardDescription>Monthly donation amounts over the last 6 months</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={trends.donations}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip formatter={(value) => [`₹${Number(value).toLocaleString()}`, "Amount"]} />
                <Line type="monotone" dataKey="amount" stroke="#3B82F6" strokeWidth={2} />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Top Campaigns */}
        <Card>
          <CardHeader>
            <CardTitle>Top Performing Campaigns</CardTitle>
            <CardDescription>Campaigns with highest fundraising amounts</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {topCampaigns.map((campaign, index) => (
                <div key={campaign._id} className="flex items-center justify-between">
                  <div className="flex-1">
                    <p className="font-medium text-sm line-clamp-1">{campaign.title}</p>
                    <div className="flex items-center gap-2 mt-1">
                      <Progress value={(campaign.raised / campaign.goal) * 100} className="flex-1 h-2" />
                      <span className="text-xs text-gray-500">
                        {Math.round((campaign.raised / campaign.goal) * 100)}%
                      </span>
                    </div>
                  </div>
                  <div className="text-right ml-4">
                    <p className="font-semibold text-sm">₹{campaign.raised.toLocaleString()}</p>
                    <p className="text-xs text-gray-500">of ₹{campaign.goal.toLocaleString()}</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Detailed Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Campaign Metrics */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Target className="h-5 w-5" />
              Campaign Metrics
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex justify-between">
              <span className="text-sm text-gray-600">Total Goal</span>
              <span className="font-semibold">₹{campaigns.totalGoal.toLocaleString()}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-sm text-gray-600">Total Raised</span>
              <span className="font-semibold">₹{campaigns.totalRaised.toLocaleString()}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-sm text-gray-600">Success Rate</span>
              <Badge variant="secondary">{campaigns.progressPercentage}%</Badge>
            </div>
            <Progress value={campaigns.progressPercentage} className="h-2" />
          </CardContent>
        </Card>

        {/* Event Metrics */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Calendar className="h-5 w-5" />
              Event Metrics
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex justify-between">
              <span className="text-sm text-gray-600">Upcoming Events</span>
              <span className="font-semibold">{events.upcomingEvents}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-sm text-gray-600">Total Attendees</span>
              <span className="font-semibold">{events.totalAttendees.toLocaleString()}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-sm text-gray-600">Avg per Event</span>
              <Badge variant="secondary">
                {events.upcomingEvents > 0 ? Math.round(events.totalAttendees / events.upcomingEvents) : 0}
              </Badge>
            </div>
          </CardContent>
        </Card>

        {/* Content Metrics */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FileText className="h-5 w-5" />
              Content Metrics
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex justify-between">
              <span className="text-sm text-gray-600">Published Blogs</span>
              <span className="font-semibold">{blogs.published}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-sm text-gray-600">Draft Blogs</span>
              <span className="font-semibold">{blogs.draft}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-sm text-gray-600">Total Views</span>
              <Badge variant="secondary">{blogs.totalViews.toLocaleString()}</Badge>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
