"use client"

import { useEffect, useState } from "react"
import { useSession } from "next-auth/react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
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
  ResponsiveContainer,
  Legend,
} from "recharts"
import { TrendingUp, TrendingDown, Users, Heart, DollarSign, Target, Download, Filter } from "lucide-react"

const COLORS = ["#3B82F6", "#10B981", "#F59E0B", "#EF4444", "#8B5CF6", "#06B6D4"]

interface AnalyticsData {
  overview: {
    totalRevenue: number
    totalDonors: number
    totalCampaigns: number
    totalVolunteers: number
    revenueGrowth: number
    donorGrowth: number
    campaignGrowth: number
    volunteerGrowth: number
  }
  charts: {
    revenueChart: Array<{ month: string; revenue: number; donations: number }>
    donorChart: Array<{ month: string; new: number; returning: number }>
    campaignChart: Array<{ category: string; count: number; revenue: number }>
    geographicChart: Array<{ region: string; donors: number; revenue: number }>
  }
  topCampaigns: Array<{
    id: string
    title: string
    raised: number
    target: number
    donors: number
    category: string
  }>
  topDonors: Array<{
    id: string
    name: string
    totalDonated: number
    lastDonation: string
    donationCount: number
  }>
}

export default function AnalyticsPage() {
  const { data: session } = useSession()
  const [analytics, setAnalytics] = useState<AnalyticsData | null>(null)
  const [loading, setLoading] = useState(true)
  const [timeRange, setTimeRange] = useState("30d")

  useEffect(() => {
    fetchAnalytics()
  }, [timeRange])

  const fetchAnalytics = async () => {
    try {
      const response = await fetch(`/api/analytics/dashboard?range=${timeRange}`)
      const data = await response.json()
      setAnalytics(data)
    } catch (error) {
      console.error("Error fetching analytics:", error)
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
      </div>
    )
  }

  if (!analytics) {
    return <div className="text-center py-12">Failed to load analytics data</div>
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            Analytics Dashboard
          </h1>
          <p className="text-gray-600 mt-2">Comprehensive insights into your organization's performance</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm">
            <Filter className="w-4 h-4 mr-2" />
            Filters
          </Button>
          <Button variant="outline" size="sm">
            <Download className="w-4 h-4 mr-2" />
            Export
          </Button>
          <div className="flex gap-1">
            {["7d", "30d", "90d", "1y"].map((range) => (
              <Button
                key={range}
                variant={timeRange === range ? "default" : "outline"}
                size="sm"
                onClick={() => setTimeRange(range)}
                className={timeRange === range ? "bg-blue-600 hover:bg-blue-700" : ""}
              >
                {range}
              </Button>
            ))}
          </div>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="border-l-4 border-l-blue-500 hover:shadow-lg transition-all duration-300">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">Total Revenue</CardTitle>
            <div className="p-2 bg-blue-100 rounded-full">
              <DollarSign className="h-4 w-4 text-blue-600" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-gray-900">₹{analytics.overview.totalRevenue.toLocaleString()}</div>
            <div className="flex items-center mt-2">
              {analytics.overview.revenueGrowth >= 0 ? (
                <TrendingUp className="h-4 w-4 text-green-500 mr-1" />
              ) : (
                <TrendingDown className="h-4 w-4 text-red-500 mr-1" />
              )}
              <span
                className={`text-sm font-medium ${
                  analytics.overview.revenueGrowth >= 0 ? "text-green-600" : "text-red-600"
                }`}
              >
                {analytics.overview.revenueGrowth >= 0 ? "+" : ""}
                {analytics.overview.revenueGrowth}%
              </span>
              <span className="text-sm text-gray-500 ml-1">from last period</span>
            </div>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-green-500 hover:shadow-lg transition-all duration-300">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">Total Donors</CardTitle>
            <div className="p-2 bg-green-100 rounded-full">
              <Users className="h-4 w-4 text-green-600" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-gray-900">{analytics.overview.totalDonors.toLocaleString()}</div>
            <div className="flex items-center mt-2">
              {analytics.overview.donorGrowth >= 0 ? (
                <TrendingUp className="h-4 w-4 text-green-500 mr-1" />
              ) : (
                <TrendingDown className="h-4 w-4 text-red-500 mr-1" />
              )}
              <span
                className={`text-sm font-medium ${
                  analytics.overview.donorGrowth >= 0 ? "text-green-600" : "text-red-600"
                }`}
              >
                {analytics.overview.donorGrowth >= 0 ? "+" : ""}
                {analytics.overview.donorGrowth}%
              </span>
              <span className="text-sm text-gray-500 ml-1">from last period</span>
            </div>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-purple-500 hover:shadow-lg transition-all duration-300">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">Active Campaigns</CardTitle>
            <div className="p-2 bg-purple-100 rounded-full">
              <Heart className="h-4 w-4 text-purple-600" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-gray-900">{analytics.overview.totalCampaigns}</div>
            <div className="flex items-center mt-2">
              {analytics.overview.campaignGrowth >= 0 ? (
                <TrendingUp className="h-4 w-4 text-green-500 mr-1" />
              ) : (
                <TrendingDown className="h-4 w-4 text-red-500 mr-1" />
              )}
              <span
                className={`text-sm font-medium ${
                  analytics.overview.campaignGrowth >= 0 ? "text-green-600" : "text-red-600"
                }`}
              >
                {analytics.overview.campaignGrowth >= 0 ? "+" : ""}
                {analytics.overview.campaignGrowth}%
              </span>
              <span className="text-sm text-gray-500 ml-1">from last period</span>
            </div>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-orange-500 hover:shadow-lg transition-all duration-300">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">Volunteers</CardTitle>
            <div className="p-2 bg-orange-100 rounded-full">
              <Target className="h-4 w-4 text-orange-600" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-gray-900">{analytics.overview.totalVolunteers}</div>
            <div className="flex items-center mt-2">
              {analytics.overview.volunteerGrowth >= 0 ? (
                <TrendingUp className="h-4 w-4 text-green-500 mr-1" />
              ) : (
                <TrendingDown className="h-4 w-4 text-red-500 mr-1" />
              )}
              <span
                className={`text-sm font-medium ${
                  analytics.overview.volunteerGrowth >= 0 ? "text-green-600" : "text-red-600"
                }`}
              >
                {analytics.overview.volunteerGrowth >= 0 ? "+" : ""}
                {analytics.overview.volunteerGrowth}%
              </span>
              <span className="text-sm text-gray-500 ml-1">from last period</span>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Charts */}
      <Tabs defaultValue="revenue" className="w-full">
        <TabsList className="grid w-full grid-cols-4 bg-gray-100">
          <TabsTrigger value="revenue" className="data-[state=active]:bg-blue-600 data-[state=active]:text-white">
            Revenue Trends
          </TabsTrigger>
          <TabsTrigger value="donors" className="data-[state=active]:bg-green-600 data-[state=active]:text-white">
            Donor Analytics
          </TabsTrigger>
          <TabsTrigger value="campaigns" className="data-[state=active]:bg-purple-600 data-[state=active]:text-white">
            Campaign Performance
          </TabsTrigger>
          <TabsTrigger value="geographic" className="data-[state=active]:bg-orange-600 data-[state=active]:text-white">
            Geographic Data
          </TabsTrigger>
        </TabsList>

        <TabsContent value="revenue" className="space-y-6">
          <Card className="shadow-lg border-0">
            <CardHeader className="bg-gradient-to-r from-blue-50 to-blue-100 rounded-t-lg">
              <CardTitle className="text-blue-800">Revenue & Donation Trends</CardTitle>
              <CardDescription className="text-blue-600">Monthly revenue and donation count over time</CardDescription>
            </CardHeader>
            <CardContent className="pt-6">
              <ResponsiveContainer width="100%" height={400}>
                <AreaChart data={analytics.charts.revenueChart}>
                  <defs>
                    <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#3B82F6" stopOpacity={0.8} />
                      <stop offset="95%" stopColor="#3B82F6" stopOpacity={0.1} />
                    </linearGradient>
                    <linearGradient id="colorDonations" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#10B981" stopOpacity={0.8} />
                      <stop offset="95%" stopColor="#10B981" stopOpacity={0.1} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
                  <XAxis dataKey="month" stroke="#6B7280" />
                  <YAxis stroke="#6B7280" />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "white",
                      border: "1px solid #E5E7EB",
                      borderRadius: "8px",
                      boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1)",
                    }}
                  />
                  <Area
                    type="monotone"
                    dataKey="revenue"
                    stroke="#3B82F6"
                    fillOpacity={1}
                    fill="url(#colorRevenue)"
                    strokeWidth={2}
                  />
                  <Area
                    type="monotone"
                    dataKey="donations"
                    stroke="#10B981"
                    fillOpacity={1}
                    fill="url(#colorDonations)"
                    strokeWidth={2}
                  />
                </AreaChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="donors" className="space-y-6">
          <Card className="shadow-lg border-0">
            <CardHeader className="bg-gradient-to-r from-green-50 to-green-100 rounded-t-lg">
              <CardTitle className="text-green-800">Donor Acquisition</CardTitle>
              <CardDescription className="text-green-600">New vs returning donors over time</CardDescription>
            </CardHeader>
            <CardContent className="pt-6">
              <ResponsiveContainer width="100%" height={400}>
                <BarChart data={analytics.charts.donorChart}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
                  <XAxis dataKey="month" stroke="#6B7280" />
                  <YAxis stroke="#6B7280" />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "white",
                      border: "1px solid #E5E7EB",
                      borderRadius: "8px",
                      boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1)",
                    }}
                  />
                  <Legend />
                  <Bar dataKey="new" fill="#10B981" name="New Donors" radius={[4, 4, 0, 0]} />
                  <Bar dataKey="returning" fill="#059669" name="Returning Donors" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="campaigns" className="space-y-6">
          <Card className="shadow-lg border-0">
            <CardHeader className="bg-gradient-to-r from-purple-50 to-purple-100 rounded-t-lg">
              <CardTitle className="text-purple-800">Campaign Categories</CardTitle>
              <CardDescription className="text-purple-600">Performance by campaign category</CardDescription>
            </CardHeader>
            <CardContent className="pt-6">
              <ResponsiveContainer width="100%" height={400}>
                <PieChart>
                  <Pie
                    data={analytics.charts.campaignChart}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ category, percent }) => `${category} ${(percent * 100).toFixed(0)}%`}
                    outerRadius={120}
                    fill="#8884d8"
                    dataKey="count"
                  >
                    {analytics.charts.campaignChart.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "white",
                      border: "1px solid #E5E7EB",
                      borderRadius: "8px",
                      boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1)",
                    }}
                  />
                </PieChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="geographic" className="space-y-6">
          <Card className="shadow-lg border-0">
            <CardHeader className="bg-gradient-to-r from-orange-50 to-orange-100 rounded-t-lg">
              <CardTitle className="text-orange-800">Geographic Distribution</CardTitle>
              <CardDescription className="text-orange-600">Donors and revenue by region</CardDescription>
            </CardHeader>
            <CardContent className="pt-6">
              <ResponsiveContainer width="100%" height={400}>
                <BarChart data={analytics.charts.geographicChart} layout="horizontal">
                  <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
                  <XAxis type="number" stroke="#6B7280" />
                  <YAxis dataKey="region" type="category" stroke="#6B7280" width={100} />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "white",
                      border: "1px solid #E5E7EB",
                      borderRadius: "8px",
                      boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1)",
                    }}
                  />
                  <Legend />
                  <Bar dataKey="donors" fill="#F59E0B" name="Donors" radius={[0, 4, 4, 0]} />
                  <Bar dataKey="revenue" fill="#D97706" name="Revenue (₹)" radius={[0, 4, 4, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Top Performers */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="shadow-lg border-0">
          <CardHeader className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-t-lg">
            <CardTitle className="text-gray-800">Top Performing Campaigns</CardTitle>
            <CardDescription className="text-gray-600">Campaigns with highest fundraising success</CardDescription>
          </CardHeader>
          <CardContent className="pt-6">
            <div className="space-y-4">
              {analytics.topCampaigns.map((campaign, index) => (
                <div key={campaign.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                  <div className="flex items-center gap-3">
                    <div className="flex items-center justify-center w-8 h-8 bg-blue-100 text-blue-600 rounded-full font-semibold">
                      {index + 1}
                    </div>
                    <div>
                      <p className="font-medium text-gray-900">{campaign.title}</p>
                      <div className="flex items-center gap-2 mt-1">
                        <Badge variant="secondary" className="text-xs">
                          {campaign.category}
                        </Badge>
                        <span className="text-sm text-gray-500">{campaign.donors} donors</span>
                      </div>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold text-green-600">₹{campaign.raised.toLocaleString()}</p>
                    <p className="text-sm text-gray-500">
                      {((campaign.raised / campaign.target) * 100).toFixed(1)}% of goal
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card className="shadow-lg border-0">
          <CardHeader className="bg-gradient-to-r from-green-50 to-blue-50 rounded-t-lg">
            <CardTitle className="text-gray-800">Top Donors</CardTitle>
            <CardDescription className="text-gray-600">Most generous supporters</CardDescription>
          </CardHeader>
          <CardContent className="pt-6">
            <div className="space-y-4">
              {analytics.topDonors.map((donor, index) => (
                <div key={donor.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                  <div className="flex items-center gap-3">
                    <div className="flex items-center justify-center w-8 h-8 bg-green-100 text-green-600 rounded-full font-semibold">
                      {index + 1}
                    </div>
                    <div>
                      <p className="font-medium text-gray-900">{donor.name}</p>
                      <div className="flex items-center gap-2 mt-1">
                        <span className="text-sm text-gray-500">{donor.donationCount} donations</span>
                        <span className="text-sm text-gray-400">•</span>
                        <span className="text-sm text-gray-500">
                          Last: {new Date(donor.lastDonation).toLocaleDateString()}
                        </span>
                      </div>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold text-blue-600">₹{donor.totalDonated.toLocaleString()}</p>
                    <p className="text-sm text-gray-500">Total donated</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
