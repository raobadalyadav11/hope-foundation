"use client"

import { useEffect, useState } from "react"
import { useSession } from "next-auth/react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  Heart,
  Users,
  CreditCard,
  Calendar,
  TrendingUp,
  DollarSign,
  FileText,
  AlertTriangle,
  CheckCircle,
  Activity,
} from "lucide-react"
import Link from "next/link"
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from "recharts"

interface DashboardStats {
  totalDonations: number
  totalAmount: number
  totalVolunteers: number
  totalCampaigns: number
  totalEvents: number
  totalBlogPosts: number
  monthlyGrowth: {
    donations: number
    volunteers: number
    campaigns: number
  }
  recentActivity: Array<{
    id: string
    type: "donation" | "volunteer" | "campaign" | "event"
    title: string
    amount?: number
    user: string
    timestamp: string
  }>
  chartData: {
    donations: Array<{ month: string; amount: number; count: number }>
    campaigns: Array<{ category: string; count: number; amount: number }>
    volunteers: Array<{ month: string; count: number }>
  }
  urgentTasks: Array<{
    id: string
    title: string
    type: "campaign" | "event" | "volunteer" | "system"
    priority: "high" | "medium" | "low"
    dueDate: string
  }>
}

const COLORS = ["#3B82F6", "#10B981", "#F59E0B", "#EF4444", "#8B5CF6", "#06B6D4"]

export default function AdminDashboard() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const [stats, setStats] = useState<DashboardStats | null>(null)
  const [loading, setLoading] = useState(true)
  const [timeRange, setTimeRange] = useState("30d")

  useEffect(() => {
    if (status === "loading") return

    if (!session || session.user.role !== "admin") {
      router.push("/signin")
      return
    }

    fetchDashboardData()
  }, [session, status, router, timeRange])

  const fetchDashboardData = async () => {
    try {
      const response = await fetch(`/api/admin/dashboard?range=${timeRange}`)
      const data = await response.json()
      setStats(data)
    } catch (error) {
      console.error("Error fetching dashboard data:", error)
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
      </div>
    )
  }

  if (!stats) {
    return (
      <div className="text-center py-12">
        <AlertTriangle className="w-12 h-12 text-red-500 mx-auto mb-4" />
        <h3 className="text-lg font-semibold">Failed to load dashboard data</h3>
        <Button onClick={fetchDashboardData} className="mt-4">
          Retry
        </Button>
      </div>
    )
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Admin Dashboard</h1>
          <p className="text-gray-600 mt-2">Welcome back, {session?.user?.name}</p>
        </div>
        <div className="flex gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setTimeRange("7d")}
            className={timeRange === "7d" ? "bg-blue-100" : ""}
          >
            7 Days
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setTimeRange("30d")}
            className={timeRange === "30d" ? "bg-blue-100" : ""}
          >
            30 Days
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setTimeRange("90d")}
            className={timeRange === "90d" ? "bg-blue-100" : ""}
          >
            90 Days
          </Button>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="hover:shadow-lg transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Donations</CardTitle>
            <CreditCard className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalDonations.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">
              <span className={`${stats.monthlyGrowth.donations >= 0 ? "text-green-600" : "text-red-600"}`}>
                {stats.monthlyGrowth.donations >= 0 ? "+" : ""}
                {stats.monthlyGrowth.donations}%
              </span>{" "}
              from last month
            </p>
          </CardContent>
        </Card>

        <Card className="hover:shadow-lg transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Amount</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">₹{stats.totalAmount.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">
              <span className="text-green-600">+12%</span> from last month
            </p>
          </CardContent>
        </Card>

        <Card className="hover:shadow-lg transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Volunteers</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalVolunteers.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">
              <span className={`${stats.monthlyGrowth.volunteers >= 0 ? "text-green-600" : "text-red-600"}`}>
                {stats.monthlyGrowth.volunteers >= 0 ? "+" : ""}
                {stats.monthlyGrowth.volunteers}%
              </span>{" "}
              from last month
            </p>
          </CardContent>
        </Card>

        <Card className="hover:shadow-lg transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Campaigns</CardTitle>
            <Heart className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalCampaigns}</div>
            <p className="text-xs text-muted-foreground">
              <span className={`${stats.monthlyGrowth.campaigns >= 0 ? "text-green-600" : "text-red-600"}`}>
                {stats.monthlyGrowth.campaigns >= 0 ? "+" : ""}
                {stats.monthlyGrowth.campaigns}
              </span>{" "}
              from last month
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions */}
      <Card>
        <CardHeader>
          <CardTitle>Quick Actions</CardTitle>
          <CardDescription>Frequently used admin functions</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
            <Button asChild className="h-20 flex-col">
              <Link href="/admin/campaigns/new">
                <Heart className="h-6 w-6 mb-2" />
                New Campaign
              </Link>
            </Button>
            <Button asChild variant="outline" className="h-20 flex-col">
              <Link href="/admin/events/new">
                <Calendar className="h-6 w-6 mb-2" />
                New Event
              </Link>
            </Button>
            <Button asChild variant="outline" className="h-20 flex-col">
              <Link href="/admin/blog/new">
                <FileText className="h-6 w-6 mb-2" />
                New Blog Post
              </Link>
            </Button>
            <Button asChild variant="outline" className="h-20 flex-col">
              <Link href="/admin/users">
                <Users className="h-6 w-6 mb-2" />
                Manage Users
              </Link>
            </Button>
            <Button asChild variant="outline" className="h-20 flex-col">
              <Link href="/admin/donations">
                <CreditCard className="h-6 w-6 mb-2" />
                View Donations
              </Link>
            </Button>
            <Button asChild variant="outline" className="h-20 flex-col">
              <Link href="/admin/analytics">
                <TrendingUp className="h-6 w-6 mb-2" />
                Analytics
              </Link>
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Charts and Analytics */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Donation Trends */}
        <Card>
          <CardHeader>
            <CardTitle>Donation Trends</CardTitle>
            <CardDescription>Monthly donation amounts and counts</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={stats.chartData.donations}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip
                  formatter={(value, name) => [
                    name === "amount" ? `₹${value.toLocaleString()}` : value,
                    name === "amount" ? "Amount" : "Count",
                  ]}
                />
                <Line type="monotone" dataKey="amount" stroke="#3B82F6" strokeWidth={2} />
                <Line type="monotone" dataKey="count" stroke="#10B981" strokeWidth={2} />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Campaign Categories */}
        <Card>
          <CardHeader>
            <CardTitle>Campaign Categories</CardTitle>
            <CardDescription>Distribution by category</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={stats.chartData.campaigns}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ category, percent }) => `${category} ${(percent * 100).toFixed(0)}%`}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="count"
                >
                  {stats.chartData.campaigns.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Tabs for detailed views */}
      <Tabs defaultValue="activity" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="activity">Recent Activity</TabsTrigger>
          <TabsTrigger value="urgent">Urgent Tasks</TabsTrigger>
          <TabsTrigger value="overview">System Overview</TabsTrigger>
        </TabsList>

        <TabsContent value="activity" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Recent Activity</CardTitle>
              <CardDescription>Latest actions across the platform</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {stats.recentActivity.map((activity) => (
                  <div key={activity.id} className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex items-center gap-3">
                      <div
                        className={`p-2 rounded-full ${
                          activity.type === "donation"
                            ? "bg-green-100 text-green-600"
                            : activity.type === "volunteer"
                              ? "bg-blue-100 text-blue-600"
                              : activity.type === "campaign"
                                ? "bg-purple-100 text-purple-600"
                                : "bg-orange-100 text-orange-600"
                        }`}
                      >
                        {activity.type === "donation" && <CreditCard className="w-4 h-4" />}
                        {activity.type === "volunteer" && <Users className="w-4 h-4" />}
                        {activity.type === "campaign" && <Heart className="w-4 h-4" />}
                        {activity.type === "event" && <Calendar className="w-4 h-4" />}
                      </div>
                      <div>
                        <p className="font-medium">{activity.title}</p>
                        <p className="text-sm text-gray-600">by {activity.user}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      {activity.amount && (
                        <p className="font-semibold text-green-600">₹{activity.amount.toLocaleString()}</p>
                      )}
                      <p className="text-sm text-gray-500">{new Date(activity.timestamp).toLocaleDateString()}</p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="urgent" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Urgent Tasks</CardTitle>
              <CardDescription>Items requiring immediate attention</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {stats.urgentTasks.map((task) => (
                  <div key={task.id} className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex items-center gap-3">
                      <div
                        className={`p-2 rounded-full ${
                          task.priority === "high"
                            ? "bg-red-100 text-red-600"
                            : task.priority === "medium"
                              ? "bg-yellow-100 text-yellow-600"
                              : "bg-gray-100 text-gray-600"
                        }`}
                      >
                        <AlertTriangle className="w-4 h-4" />
                      </div>
                      <div>
                        <p className="font-medium">{task.title}</p>
                        <p className="text-sm text-gray-600 capitalize">{task.type}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <Badge
                        variant={
                          task.priority === "high"
                            ? "destructive"
                            : task.priority === "medium"
                              ? "default"
                              : "secondary"
                        }
                      >
                        {task.priority}
                      </Badge>
                      <p className="text-sm text-gray-500 mt-1">Due: {new Date(task.dueDate).toLocaleDateString()}</p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="overview" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Calendar className="w-5 h-5" />
                  Events
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stats.totalEvents}</div>
                <p className="text-sm text-gray-600">Total events</p>
                <Button asChild className="w-full mt-4" size="sm">
                  <Link href="/admin/events">Manage Events</Link>
                </Button>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <FileText className="w-5 h-5" />
                  Blog Posts
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stats.totalBlogPosts}</div>
                <p className="text-sm text-gray-600">Published posts</p>
                <Button asChild className="w-full mt-4" size="sm">
                  <Link href="/admin/blog">Manage Blog</Link>
                </Button>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Activity className="w-5 h-5" />
                  System Health
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center gap-2 mb-2">
                  <CheckCircle className="w-5 h-5 text-green-600" />
                  <span className="text-sm">All systems operational</span>
                </div>
                <div className="text-sm text-gray-600">Last updated: {new Date().toLocaleTimeString()}</div>
                <Button asChild className="w-full mt-4" size="sm" variant="outline">
                  <Link href="/admin/settings">System Settings</Link>
                </Button>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}
