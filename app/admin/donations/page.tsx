"use client"

import { useState } from "react"
import { useQuery } from "@tanstack/react-query"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import {
  Search,
  MoreHorizontal,
  Download,
  Eye,
  CreditCard,
  TrendingUp,
  DollarSign,
  Users,
  Calendar,
} from "lucide-react"
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts"

interface Donation {
  _id: string
  donorName: string
  donorEmail: string
  amount: number
  campaignId?: string
  campaignTitle?: string
  paymentMethod: string
  status: "pending" | "completed" | "failed" | "refunded"
  isAnonymous: boolean
  message?: string
  receiptNumber: string
  createdAt: string
  paymentId?: string
}

const statusColors = {
  pending: "bg-yellow-100 text-yellow-800",
  completed: "bg-green-100 text-green-800",
  failed: "bg-red-100 text-red-800",
  refunded: "bg-gray-100 text-gray-800",
}

export default function AdminDonationsPage() {
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedStatus, setSelectedStatus] = useState("all")
  const [selectedCampaign, setSelectedCampaign] = useState("all")
  const [dateRange, setDateRange] = useState("30d")
  const [currentPage, setCurrentPage] = useState(1)

  const { data: donationsData, isLoading } = useQuery({
    queryKey: ["admin-donations", searchTerm, selectedStatus, selectedCampaign, dateRange, currentPage],
    queryFn: async () => {
      const params = new URLSearchParams({
        search: searchTerm,
        status: selectedStatus,
        campaign: selectedCampaign,
        range: dateRange,
        page: currentPage.toString(),
        limit: "10",
      })

      const response = await fetch(`/api/admin/donations?${params}`)
      if (!response.ok) throw new Error("Failed to fetch donations")
      return response.json()
    },
  })

  const { data: donationStats } = useQuery({
    queryKey: ["donation-stats", dateRange],
    queryFn: async () => {
      const response = await fetch(`/api/admin/donations/stats?range=${dateRange}`)
      if (!response.ok) throw new Error("Failed to fetch stats")
      return response.json()
    },
  })

  const { data: campaigns } = useQuery({
    queryKey: ["campaigns-list"],
    queryFn: async () => {
      const response = await fetch("/api/campaigns?limit=100&status=all")
      if (!response.ok) throw new Error("Failed to fetch campaigns")
      const data = await response.json()
      return data.campaigns
    },
  })

  const donations = donationsData?.donations || []
  const pagination = donationsData?.pagination || {}

  const exportDonations = async () => {
    try {
      const response = await fetch(
        `/api/admin/donations/export?${new URLSearchParams({
          status: selectedStatus,
          campaign: selectedCampaign,
          range: dateRange,
        })}`,
      )

      if (!response.ok) throw new Error("Failed to export")

      const blob = await response.blob()
      const url = window.URL.createObjectURL(blob)
      const a = document.createElement("a")
      a.href = url
      a.download = `donations-${new Date().toISOString().split("T")[0]}.csv`
      document.body.appendChild(a)
      a.click()
      window.URL.revokeObjectURL(url)
      document.body.removeChild(a)
    } catch (error) {
      console.error("Export failed:", error)
    }
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Donation Management</h1>
          <p className="text-gray-600 mt-2">Track and manage all donations</p>
        </div>
        <div className="flex gap-2">
          <Select value={dateRange} onValueChange={setDateRange}>
            <SelectTrigger className="w-32">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="7d">7 Days</SelectItem>
              <SelectItem value="30d">30 Days</SelectItem>
              <SelectItem value="90d">90 Days</SelectItem>
              <SelectItem value="1y">1 Year</SelectItem>
            </SelectContent>
          </Select>
          <Button onClick={exportDonations}>
            <Download className="w-4 h-4 mr-2" />
            Export
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Donations</CardTitle>
            <CreditCard className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{donationStats?.totalCount || 0}</div>
            <p className="text-xs text-muted-foreground">
              <span className="text-green-600">+{donationStats?.growth?.count || 0}%</span> from last period
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Amount</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">₹{(donationStats?.totalAmount || 0).toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">
              <span className="text-green-600">+{donationStats?.growth?.amount || 0}%</span> from last period
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Average Donation</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">₹{(donationStats?.averageAmount || 0).toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">Per donation</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Unique Donors</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{donationStats?.uniqueDonors || 0}</div>
            <p className="text-xs text-muted-foreground">Individual contributors</p>
          </CardContent>
        </Card>
      </div>

      {/* Chart */}
      {donationStats?.chartData && (
        <Card>
          <CardHeader>
            <CardTitle>Donation Trends</CardTitle>
            <CardDescription>Daily donation amounts over time</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={donationStats.chartData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" />
                <YAxis />
                <Tooltip formatter={(value) => [`₹${value.toLocaleString()}`, "Amount"]} />
                <Line type="monotone" dataKey="amount" stroke="#3B82F6" strokeWidth={2} />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      )}

      {/* Filters */}
      <Card>
        <CardHeader>
          <CardTitle>Filters</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col lg:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <Input
                  placeholder="Search by donor name, email, or receipt number..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            <Select value={selectedStatus} onValueChange={setSelectedStatus}>
              <SelectTrigger className="w-48">
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="completed">Completed</SelectItem>
                <SelectItem value="pending">Pending</SelectItem>
                <SelectItem value="failed">Failed</SelectItem>
                <SelectItem value="refunded">Refunded</SelectItem>
              </SelectContent>
            </Select>
            <Select value={selectedCampaign} onValueChange={setSelectedCampaign}>
              <SelectTrigger className="w-48">
                <SelectValue placeholder="Campaign" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Campaigns</SelectItem>
                <SelectItem value="general">General Donation</SelectItem>
                {campaigns?.map((campaign: any) => (
                  <SelectItem key={campaign._id} value={campaign._id}>
                    {campaign.title}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Donations List */}
      <div className="space-y-4">
        {donations.length === 0 ? (
          <Card>
            <CardContent className="text-center py-12">
              <CreditCard className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-gray-900 mb-2">No donations found</h3>
              <p className="text-gray-600">Try adjusting your search criteria.</p>
            </CardContent>
          </Card>
        ) : (
          donations.map((donation: Donation) => (
            <Card key={donation._id} className="hover:shadow-lg transition-shadow">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <Avatar className="h-10 w-10">
                      <AvatarFallback>
                        {donation.isAnonymous ? "A" : donation.donorName.charAt(0).toUpperCase()}
                      </AvatarFallback>
                    </Avatar>

                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <h3 className="font-semibold text-gray-900">
                          {donation.isAnonymous ? "Anonymous Donor" : donation.donorName}
                        </h3>
                        <Badge className={statusColors[donation.status]}>{donation.status}</Badge>
                      </div>

                      <div className="flex items-center gap-4 text-sm text-gray-600">
                        <span>{donation.donorEmail}</span>
                        <span>Receipt: {donation.receiptNumber}</span>
                        <div className="flex items-center gap-1">
                          <Calendar className="w-4 h-4" />
                          <span>{new Date(donation.createdAt).toLocaleDateString()}</span>
                        </div>
                      </div>

                      {donation.campaignTitle && (
                        <div className="text-sm text-blue-600 mt-1">Campaign: {donation.campaignTitle}</div>
                      )}

                      {donation.message && (
                        <div className="text-sm text-gray-600 italic mt-1">"{donation.message}"</div>
                      )}
                    </div>
                  </div>

                  <div className="flex items-center gap-4">
                    <div className="text-right">
                      <div className="text-2xl font-bold text-green-600">₹{donation.amount.toLocaleString()}</div>
                      <div className="text-sm text-gray-500">via {donation.paymentMethod}</div>
                    </div>

                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="sm">
                          <MoreHorizontal className="w-4 h-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem>
                          <Eye className="w-4 h-4 mr-2" />
                          View Details
                        </DropdownMenuItem>
                        <DropdownMenuItem>
                          <Download className="w-4 h-4 mr-2" />
                          Download Receipt
                        </DropdownMenuItem>
                        {donation.status === "completed" && (
                          <DropdownMenuItem className="text-red-600">Process Refund</DropdownMenuItem>
                        )}
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>

      {/* Pagination */}
      {pagination.pages > 1 && (
        <div className="flex justify-center items-center gap-4">
          <Button
            variant="outline"
            onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
            disabled={currentPage === 1}
          >
            Previous
          </Button>
          <span className="text-sm text-gray-600">
            Page {pagination.page} of {pagination.pages}
          </span>
          <Button
            variant="outline"
            onClick={() => setCurrentPage(Math.min(pagination.pages, currentPage + 1))}
            disabled={currentPage === pagination.pages}
          >
            Next
          </Button>
        </div>
      )}
    </div>
  )
}
