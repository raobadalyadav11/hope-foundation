"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Search, Pause, Play, X } from "lucide-react"
import { toast } from "sonner"

interface Subscription {
  _id: string
  donorName: string
  donorEmail: string
  amount: number
  frequency: string
  status: string
  totalPayments: number
  totalAmount: number
  nextPaymentDate: string
  createdAt: string
  campaignId?: {
    title: string
  }
}

export default function AdminSubscriptionsPage() {
  const [subscriptions, setSubscriptions] = useState<Subscription[]>([])
  const [loading, setLoading] = useState(true)
  const [filters, setFilters] = useState({
    status: "all",
    frequency: "all",
    search: "",
  })

  const fetchSubscriptions = async () => {
    try {
      setLoading(true)
      const params = new URLSearchParams()
      if (filters.status !== "all") params.append("status", filters.status)
      if (filters.frequency !== "all") params.append("frequency", filters.frequency)
      if (filters.search) params.append("search", filters.search)

      const response = await fetch(`/api/admin/subscriptions?${params}`)
      const data = await response.json()

      if (response.ok) {
        setSubscriptions(data.subscriptions || [])
      } else {
        toast.error(data.error || "Failed to fetch subscriptions")
      }
    } catch (error) {
      toast.error("Failed to fetch subscriptions")
    } finally {
      setLoading(false)
    }
  }

  const handleStatusChange = async (subscriptionId: string, newStatus: string) => {
    try {
      const response = await fetch(`/api/admin/subscriptions/${subscriptionId}/status`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: newStatus }),
      })

      if (response.ok) {
        toast.success("Subscription status updated successfully")
        fetchSubscriptions()
      } else {
        const data = await response.json()
        toast.error(data.error || "Failed to update subscription status")
      }
    } catch (error) {
      toast.error("Failed to update subscription status")
    }
  }

  const getStatusBadge = (status: string) => {
    const variants: Record<string, "default" | "secondary" | "destructive" | "outline"> = {
      active: "default",
      paused: "secondary",
      cancelled: "destructive",
      expired: "outline",
    }

    return <Badge variant={variants[status] || "outline"}>{status.charAt(0).toUpperCase() + status.slice(1)}</Badge>
  }

  const getFrequencyBadge = (frequency: string) => {
    const colors: Record<string, string> = {
      monthly: "bg-blue-100 text-blue-800",
      quarterly: "bg-green-100 text-green-800",
      yearly: "bg-purple-100 text-purple-800",
    }

    return (
      <Badge className={colors[frequency] || "bg-gray-100 text-gray-800"}>
        {frequency.charAt(0).toUpperCase() + frequency.slice(1)}
      </Badge>
    )
  }

  useEffect(() => {
    fetchSubscriptions()
  }, [filters])

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Subscription Management</h1>
          <p className="text-muted-foreground">Monitor and manage recurring donations</p>
        </div>
      </div>

      {/* Filters */}
      <Card>
        <CardHeader>
          <CardTitle>Filters</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-4">
            <div className="relative">
              <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search subscriptions..."
                value={filters.search}
                onChange={(e) => setFilters({ ...filters, search: e.target.value })}
                className="pl-8"
              />
            </div>
            <Select value={filters.status} onValueChange={(value) => setFilters({ ...filters, status: value })}>
              <SelectTrigger>
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="active">Active</SelectItem>
                <SelectItem value="paused">Paused</SelectItem>
                <SelectItem value="cancelled">Cancelled</SelectItem>
                <SelectItem value="expired">Expired</SelectItem>
              </SelectContent>
            </Select>
            <Select value={filters.frequency} onValueChange={(value) => setFilters({ ...filters, frequency: value })}>
              <SelectTrigger>
                <SelectValue placeholder="Frequency" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Frequencies</SelectItem>
                <SelectItem value="monthly">Monthly</SelectItem>
                <SelectItem value="quarterly">Quarterly</SelectItem>
                <SelectItem value="yearly">Yearly</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Subscriptions Table */}
      <Card>
        <CardHeader>
          <CardTitle>Subscriptions</CardTitle>
          <CardDescription>All recurring donation subscriptions</CardDescription>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="flex items-center justify-center h-32">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Donor</TableHead>
                  <TableHead>Campaign</TableHead>
                  <TableHead>Amount</TableHead>
                  <TableHead>Frequency</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Total Paid</TableHead>
                  <TableHead>Next Payment</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {subscriptions.map((subscription) => (
                  <TableRow key={subscription._id}>
                    <TableCell>
                      <div>
                        <div className="font-medium">{subscription.donorName}</div>
                        <div className="text-sm text-muted-foreground">{subscription.donorEmail}</div>
                      </div>
                    </TableCell>
                    <TableCell>{subscription.campaignId?.title || "General Donation"}</TableCell>
                    <TableCell>₹{subscription.amount.toLocaleString()}</TableCell>
                    <TableCell>{getFrequencyBadge(subscription.frequency)}</TableCell>
                    <TableCell>{getStatusBadge(subscription.status)}</TableCell>
                    <TableCell>
                      <div>
                        <div className="font-medium">₹{subscription.totalAmount.toLocaleString()}</div>
                        <div className="text-sm text-muted-foreground">{subscription.totalPayments} payments</div>
                      </div>
                    </TableCell>
                    <TableCell>
                      {subscription.status === "active"
                        ? new Date(subscription.nextPaymentDate).toLocaleDateString()
                        : "N/A"}
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        {subscription.status === "active" && (
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleStatusChange(subscription._id, "paused")}
                          >
                            <Pause className="h-4 w-4" />
                          </Button>
                        )}
                        {subscription.status === "paused" && (
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleStatusChange(subscription._id, "active")}
                          >
                            <Play className="h-4 w-4" />
                          </Button>
                        )}
                        {(subscription.status === "active" || subscription.status === "paused") && (
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleStatusChange(subscription._id, "cancelled")}
                            className="text-red-600 hover:text-red-700"
                          >
                            <X className="h-4 w-4" />
                          </Button>
                        )}
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
