"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
  LineChart,
  Line,
  AreaChart,
  Area,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts"
import { TrendingUp, TrendingDown, Users, Heart, Target, DollarSign, Activity, Download, RefreshCw } from "lucide-react"

interface AnalyticsData {
  overview: {
    totalDonations: number
    totalAmount: number
    totalVolunteers: number
    activeCampaigns: number
    monthlyGrowth: {
      donations: number
      amount: number
      volunteers: number
      campaigns: number
    }
  }
  charts: {
    donationTrends: Array<{
      month: string
      amount: number
      count: number
      recurring: number
    }>
    campaignPerformance: Array<{
      category: string
      raised: number
      goal: number
      campaigns: number
    }>
    volunteerActivity: Array<{
      month: string
      new: number
      active: number
      hours: number
    }>
    geographicDistribution: Array<{
      region: string
      donations: number
      volunteers: number
      campaigns: number
    }>
  }
  topPerformers: {
    campaigns: Array<{
      id: string
      title: string
      raised: number
      goal: number
      percentage: number
    }>
    donors: Array<{
      id: string
      name: string
      totalDonated: number
      donationCount: number
    }>
    volunteers: Array<{
      id: string
      name: string
      hoursContributed: number
      tasksCompleted: number
    }>
  }
}

const COLORS = ["#3B82F6", "#10B981", "#F59E0B", "#EF4444", "#8B5CF6", "#06B6D4"]

export default function AnalyticsPage() {
  const [data, setData] = useState<AnalyticsData | null>(null)
  const [loading, setLoading] = useState(true)
  const [timeRange, setTimeRange] = useState("30d")
  const [refreshing, setRefreshing] = useState(false)

  useEffect(() => {
    fetchAnalytics()
  }, [timeRange])

  const fetchAnalytics = async () => {
    try {
      setLoading(true)
      const response = await fetch(`/api/analytics/dashboard?range=${timeRange}`)
      const analyticsData = await response.json()
      setData(analyticsData)
    } catch (error) {
      console.error("Error fetching analytics:", error)
    } finally {
      setLoading(false)
    }
  }

  const handleRefresh = async () => {
    setRefreshing(true)
    await fetchAnalytics()
    setRefreshing(false)
  }

  const exportData = () => {
    // Implementation for exporting analytics data
    console.log("Exporting analytics data...")
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
      </div>
    )
  }

  if (!data) {
    return (
      <div className="text-center py-12">
        <Activity className="w-12 h-12 text-gray-400 mx-auto mb-4" />
        <h3 className="text-lg font-semibold">No analytics data available</h3>
        <Button onClick={fetchAnalytics} className="mt-4">
          <RefreshCw className="w-4 h-4 mr-2" />
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
          <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            Analytics Dashboard
          </h1>
          <p className="text-gray-600 mt-2">Comprehensive insights into your organization's performance</p>
        </div>

        <div className="flex items-center gap-4">
          <Select value={timeRange} onValueChange={setTimeRange}>
            <SelectTrigger className="w-40">
              <SelectValue placeholder="Time Range" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="7d">Last 7 days</SelectItem>
              <SelectItem value="30d">Last 30 days</SelectItem>
              <SelectItem value="90d">Last 90 days</SelectItem>
              <SelectItem value="1y">Last year</SelectItem>
            </SelectContent>
          </Select>

          <Button
            variant="outline"
            onClick={handleRefresh}
            disabled={refreshing}
            className="border-blue-200 text-blue-600 hover:bg-blue-50 bg-transparent"
          >
            <RefreshCw className={`w-4 h-4 mr-2 ${refreshing ? "animate-spin" : ""}`} />
            Refresh
          </Button>

          <Button
            onClick={exportData}
            className="bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700"
          >
            <Download className="w-4 h-4 mr-2" />
            Export
          </Button>
        </div>
      </div>

      {/* Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {[
          {
            title: "Total Donations",
            value: data.overview.totalDonations.toLocaleString(),
            change: data.overview.monthlyGrowth.donations,
            icon: Heart,
            color: "from-red-500 to-pink-600",
            bgColor: "from-red-50 to-pink-50",
          },
          {
            title: "Total Amount",
            value: `₹${(data.overview.totalAmount / 100000).toFixed(1)}L`,
            change: data.overview.monthlyGrowth.amount,
            icon: DollarSign,
            color: "from-green-500 to-emerald-600",
            bgColor: "from-green-50 to-emerald-50",
          },
          {
            title: "Active Volunteers",
            value: data.overview.totalVolunteers.toLocaleString(),
            change: data.overview.monthlyGrowth.volunteers,
            icon: Users,
            color: "from-blue-500 to-indigo-600",
            bgColor: "from-blue-50 to-indigo-50",
          },
          {
            title: "Active Campaigns",
            value: data.overview.activeCampaigns.toString(),
            change: data.overview.monthlyGrowth.campaigns,
            icon: Target,
            color: "from-purple-500 to-violet-600",
            bgColor: "from-purple-50 to-violet-50",
          },
        ].map((metric, index) => (
          <Card key={index} className="hover:shadow-xl transition-all duration-300 border-0 shadow-lg overflow-hidden">
            <CardContent className="p-0">
              <div className={`h-2 bg-gradient-to-r ${metric.color}`}></div>
              <div className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <div className={`p-3 rounded-xl bg-gradient-to-r ${metric.bgColor}`}>
                    <metric.icon className={`w-6 h-6 bg-gradient-to-r ${metric.color} bg-clip-text text-transparent`} />
                  </div>
                  <Badge
                    variant={metric.change >= 0 ? "default" : "destructive"}
                    className={`${metric.change >= 0 ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"}`}
                  >
                    {metric.change >= 0 ? (
                      <TrendingUp className="w-3 h-3 mr-1" />
                    ) : (
                      <TrendingDown className="w-3 h-3 mr-1" />
                    )}
                    {Math.abs(metric.change)}%
                  </Badge>
                </div>
                <div className="text-3xl font-bold text-gray-900 mb-1">{metric.value}</div>
                <div className="text-sm text-gray-600">{metric.title}</div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Charts Section */}
      <Tabs defaultValue="donations" className="w-full">
        <TabsList className="grid w-full grid-cols-4 bg-gray-100 rounded-xl p-1">
          <TabsTrigger value="donations" className="rounded-lg">
            Donations
          </TabsTrigger>
          <TabsTrigger value="campaigns" className="rounded-lg">
            Campaigns
          </TabsTrigger>
          <TabsTrigger value="volunteers" className="rounded-lg">
            Volunteers
          </TabsTrigger>
          <TabsTrigger value="geographic" className="rounded-lg">
            Geographic
          </TabsTrigger>
        </TabsList>

        <TabsContent value="donations" className="space-y-6">
          <div className="grid lg:grid-cols-2 gap-6">
            <Card className="hover:shadow-xl transition-all duration-300 border-0 shadow-lg">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <TrendingUp className="w-5 h-5 text-blue-600" />
                  Donation Trends
                </CardTitle>
                <CardDescription>Monthly donation amounts and counts over time</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <AreaChart data={data.charts.donationTrends}>
                    <defs>
                      <linearGradient id="colorAmount" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#3B82F6" stopOpacity={0.8} />
                        <stop offset="95%" stopColor="#3B82F6" stopOpacity={0.1} />
                      </linearGradient>
                      <linearGradient id="colorCount" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#10B981" stopOpacity={0.8} />
                        <stop offset="95%" stopColor="#10B981" stopOpacity={0.1} />
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                    <XAxis dataKey="month" stroke="#6b7280" />
                    <YAxis stroke="#6b7280" />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: "white",
                        border: "none",
                        borderRadius: "12px",
                        boxShadow: "0 10px 25px rgba(0,0,0,0.1)",
                      }}
                    />
                    <Area
                      type="monotone"
                      dataKey="amount"
                      stroke="#3B82F6"
                      fillOpacity={1}
                      fill="url(#colorAmount)"
                      strokeWidth={3}
                    />
                    <Area
                      type="monotone"
                      dataKey="count"
                      stroke="#10B981"
                      fillOpacity={1}
                      fill="url(#colorCount)"
                      strokeWidth={3}
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            <Card className="hover:shadow-xl transition-all duration-300 border-0 shadow-lg">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Activity className="w-5 h-5 text-purple-600" />
                  Donation Types
                </CardTitle>
                <CardDescription>One-time vs recurring donations breakdown</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      data={[
                        { name: "One-time", value: 70, color: "#3B82F6" },
                        { name: "Recurring", value: 30, color: "#10B981" },
                      ]}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                      outerRadius={100}
                      fill="#8884d8"
                      dataKey="value"
                    >
                      {[
                        { name: "One-time", value: 70, color: "#3B82F6" },
                        { name: "Recurring", value: 30, color: "#10B981" },
                      ].map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip
                      contentStyle={{
                        backgroundColor: "white",
                        border: "none",
                        borderRadius: "12px",
                        boxShadow: "0 10px 25px rgba(0,0,0,0.1)",
                      }}
                    />
                  </PieChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="campaigns" className="space-y-6">
          <Card className="hover:shadow-xl transition-all duration-300 border-0 shadow-lg">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Target className="w-5 h-5 text-green-600" />
                Campaign Performance by Category
              </CardTitle>
              <CardDescription>Fundraising performance across different campaign categories</CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={400}>
                <BarChart data={data.charts.campaignPerformance}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                  <XAxis dataKey="category" stroke="#6b7280" />
                  <YAxis stroke="#6b7280" />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "white",
                      border: "none",
                      borderRadius: "12px",
                      boxShadow: "0 10px 25px rgba(0,0,0,0.1)",
                    }}
                  />
                  <Legend />
                  <Bar dataKey="raised" fill="#10B981" name="Amount Raised" radius={[4, 4, 0, 0]} />
                  <Bar dataKey="goal" fill="#3B82F6" name="Goal Amount" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="volunteers" className="space-y-6">
          <Card className="hover:shadow-xl transition-all duration-300 border-0 shadow-lg">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Users className="w-5 h-5 text-blue-600" />
                Volunteer Activity Trends
              </CardTitle>
              <CardDescription>New registrations, active volunteers, and hours contributed</CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={400}>
                <LineChart data={data.charts.volunteerActivity}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                  <XAxis dataKey="month" stroke="#6b7280" />
                  <YAxis stroke="#6b7280" />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "white",
                      border: "none",
                      borderRadius: "12px",
                      boxShadow: "0 10px 25px rgba(0,0,0,0.1)",
                    }}
                  />
                  <Legend />
                  <Line type="monotone" dataKey="new" stroke="#3B82F6" strokeWidth={3} name="New Volunteers" />
                  <Line type="monotone" dataKey="active" stroke="#10B981" strokeWidth={3} name="Active Volunteers" />
                  <Line type="monotone" dataKey="hours" stroke="#F59E0B" strokeWidth={3} name="Hours Contributed" />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="geographic" className="space-y-6">
          <Card className="hover:shadow-xl transition-all duration-300 border-0 shadow-lg">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Activity className="w-5 h-5 text-purple-600" />
                Geographic Distribution
              </CardTitle>
              <CardDescription>Regional breakdown of donations, volunteers, and campaigns</CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={400}>
                <BarChart data={data.charts.geographicDistribution}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                  <XAxis dataKey="region" stroke="#6b7280" />
                  <YAxis stroke="#6b7280" />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "white",
                      border: "none",
                      borderRadius: "12px",
                      boxShadow: "0 10px 25px rgba(0,0,0,0.1)",
                    }}
                  />
                  <Legend />
                  <Bar dataKey="donations" fill="#3B82F6" name="Donations" radius={[4, 4, 0, 0]} />
                  <Bar dataKey="volunteers" fill="#10B981" name="Volunteers" radius={[4, 4, 0, 0]} />
                  <Bar dataKey="campaigns" fill="#F59E0B" name="Campaigns" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Top Performers */}
      <div className="grid lg:grid-cols-3 gap-6">
        <Card className="hover:shadow-xl transition-all duration-300 border-0 shadow-lg">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Target className="w-5 h-5 text-green-600" />
              Top Campaigns
            </CardTitle>
            <CardDescription>Best performing campaigns by funding percentage</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {data.topPerformers.campaigns.map((campaign, index) => (
              <div
                key={campaign.id}
                className="flex items-center justify-between p-4 rounded-xl bg-gradient-to-r from-green-50 to-emerald-50 border border-green-100"
              >
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-gradient-to-r from-green-500 to-emerald-600 flex items-center justify-center text-white font-bold text-sm">
                    {index + 1}
                  </div>
                  <div>
                    <div className="font-semibold text-gray-900 line-clamp-1">{campaign.title}</div>
                    <div className="text-sm text-gray-600">
                      ₹{campaign.raised.toLocaleString()} / ₹{campaign.goal.toLocaleString()}
                    </div>
                  </div>
                </div>
                <Badge className="bg-green-100 text-green-700">{campaign.percentage}%</Badge>
              </div>
            ))}
          </CardContent>
        </Card>

        <Card className="hover:shadow-xl transition-all duration-300 border-0 shadow-lg">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Heart className="w-5 h-5 text-red-600" />
              Top Donors
            </CardTitle>
            <CardDescription>Most generous contributors to our cause</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {data.topPerformers.donors.map((donor, index) => (
              <div
                key={donor.id}
                className="flex items-center justify-between p-4 rounded-xl bg-gradient-to-r from-red-50 to-pink-50 border border-red-100"
              >
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-gradient-to-r from-red-500 to-pink-600 flex items-center justify-center text-white font-bold text-sm">
                    {index + 1}
                  </div>
                  <div>
                    <div className="font-semibold text-gray-900">{donor.name}</div>
                    <div className="text-sm text-gray-600">{donor.donationCount} donations</div>
                  </div>
                </div>
                <div className="text-right">
                  <div className="font-bold text-red-600">₹{donor.totalDonated.toLocaleString()}</div>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        <Card className="hover:shadow-xl transition-all duration-300 border-0 shadow-lg">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Users className="w-5 h-5 text-blue-600" />
              Top Volunteers
            </CardTitle>
            <CardDescription>Most active volunteers by hours contributed</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {data.topPerformers.volunteers.map((volunteer, index) => (
              <div
                key={volunteer.id}
                className="flex items-center justify-between p-4 rounded-xl bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-100"
              >
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-gradient-to-r from-blue-500 to-indigo-600 flex items-center justify-center text-white font-bold text-sm">
                    {index + 1}
                  </div>
                  <div>
                    <div className="font-semibold text-gray-900">{volunteer.name}</div>
                    <div className="text-sm text-gray-600">{volunteer.tasksCompleted} tasks completed</div>
                  </div>
                </div>
                <div className="text-right">
                  <div className="font-bold text-blue-600">{volunteer.hoursContributed}h</div>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
