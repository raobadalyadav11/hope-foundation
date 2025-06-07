"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Search, RefreshCw, AlertTriangle } from "lucide-react"
import { toast } from "sonner"

interface Payment {
  _id: string
  orderId: string
  paymentId: string
  amount: number
  currency: string
  status: string
  gateway: string
  fees: number
  netAmount: number
  createdAt: string
  donationId: {
    donorName: string
    donorEmail: string
    campaignId?: {
      title: string
    }
  }
}

interface PaymentStats {
  totalAmount: number
  totalFees: number
  totalNetAmount: number
  completedCount: number
  failedCount: number
  refundedCount: number
}

export default function AdminPaymentsPage() {
  const [payments, setPayments] = useState<Payment[]>([])
  const [stats, setStats] = useState<PaymentStats | null>(null)
  const [loading, setLoading] = useState(true)
  const [filters, setFilters] = useState({
    status: "all",
    gateway: "all",
    range: "30d",
    search: "",
  })
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 10,
    total: 0,
    pages: 0,
  })
  const [refundDialog, setRefundDialog] = useState<{
    open: boolean
    payment: Payment | null
  }>({
    open: false,
    payment: null,
  })
  const [refundData, setRefundData] = useState({
    amount: 0,
    reason: "",
  })

  const fetchPayments = async () => {
    try {
      setLoading(true)
      const params = new URLSearchParams({
        ...filters,
        page: pagination.page.toString(),
        limit: pagination.limit.toString(),
      })

      const response = await fetch(`/api/admin/payments?${params}`)
      const data = await response.json()

      if (response.ok) {
        setPayments(data.payments)
        setStats(data.stats)
        setPagination(data.pagination)
      } else {
        toast.error(data.error || "Failed to fetch payments")
      }
    } catch (error) {
      toast.error("Failed to fetch payments")
    } finally {
      setLoading(false)
    }
  }

  const handleRefund = async () => {
    if (!refundDialog.payment) return

    try {
      const response = await fetch(`/api/admin/payments/${refundDialog.payment._id}/refund`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(refundData),
      })

      const data = await response.json()

      if (response.ok) {
        toast.success("Refund processed successfully")
        setRefundDialog({ open: false, payment: null })
        setRefundData({ amount: 0, reason: "" })
        fetchPayments()
      } else {
        toast.error(data.error || "Failed to process refund")
      }
    } catch (error) {
      toast.error("Failed to process refund")
    }
  }

  const getStatusBadge = (status: string) => {
    const variants: Record<string, "default" | "secondary" | "destructive" | "outline"> = {
      completed: "default",
      pending: "secondary",
      failed: "destructive",
      refunded: "outline",
    }

    return <Badge variant={variants[status] || "outline"}>{status.charAt(0).toUpperCase() + status.slice(1)}</Badge>
  }

  useEffect(() => {
    fetchPayments()
  }, [filters, pagination.page])

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Payment Management</h1>
          <p className="text-muted-foreground">Monitor and manage all payment transactions</p>
        </div>
        <Button onClick={fetchPayments} disabled={loading}>
          <RefreshCw className={`h-4 w-4 mr-2 ${loading ? "animate-spin" : ""}`} />
          Refresh
        </Button>
      </div>

      {/* Statistics Cards */}
      {stats && (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Amount</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">₹{stats.totalAmount.toLocaleString()}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Net Amount</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">₹{stats.totalNetAmount.toLocaleString()}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Fees</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">₹{stats.totalFees.toLocaleString()}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Success Rate</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {((stats.completedCount / (stats.completedCount + stats.failedCount)) * 100 || 0).toFixed(1)}%
              </div>
            </CardContent>
          </Card>
        </div>
      )}

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
                placeholder="Search payments..."
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
                <SelectItem value="completed">Completed</SelectItem>
                <SelectItem value="pending">Pending</SelectItem>
                <SelectItem value="failed">Failed</SelectItem>
                <SelectItem value="refunded">Refunded</SelectItem>
              </SelectContent>
            </Select>
            <Select value={filters.gateway} onValueChange={(value) => setFilters({ ...filters, gateway: value })}>
              <SelectTrigger>
                <SelectValue placeholder="Gateway" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Gateways</SelectItem>
                <SelectItem value="razorpay">Razorpay</SelectItem>
                <SelectItem value="stripe">Stripe</SelectItem>
                <SelectItem value="paypal">PayPal</SelectItem>
              </SelectContent>
            </Select>
            <Select value={filters.range} onValueChange={(value) => setFilters({ ...filters, range: value })}>
              <SelectTrigger>
                <SelectValue placeholder="Date Range" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="7d">Last 7 days</SelectItem>
                <SelectItem value="30d">Last 30 days</SelectItem>
                <SelectItem value="90d">Last 90 days</SelectItem>
                <SelectItem value="365d">Last year</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Payments Table */}
      <Card>
        <CardHeader>
          <CardTitle>Payments</CardTitle>
          <CardDescription>All payment transactions</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Payment ID</TableHead>
                <TableHead>Donor</TableHead>
                <TableHead>Campaign</TableHead>
                <TableHead>Amount</TableHead>
                <TableHead>Gateway</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Date</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {payments.map((payment) => (
                <TableRow key={payment._id}>
                  <TableCell className="font-mono text-sm">{payment.paymentId}</TableCell>
                  <TableCell>
                    <div>
                      <div className="font-medium">{payment.donationId.donorName}</div>
                      <div className="text-sm text-muted-foreground">{payment.donationId.donorEmail}</div>
                    </div>
                  </TableCell>
                  <TableCell>{payment.donationId.campaignId?.title || "General Donation"}</TableCell>
                  <TableCell>
                    <div>
                      <div className="font-medium">₹{payment.amount.toLocaleString()}</div>
                      <div className="text-sm text-muted-foreground">Net: ₹{payment.netAmount.toLocaleString()}</div>
                    </div>
                  </TableCell>
                  <TableCell className="capitalize">{payment.gateway}</TableCell>
                  <TableCell>{getStatusBadge(payment.status)}</TableCell>
                  <TableCell>{new Date(payment.createdAt).toLocaleDateString()}</TableCell>
                  <TableCell>
                    {payment.status === "completed" && (
                      <Dialog
                        open={refundDialog.open && refundDialog.payment?._id === payment._id}
                        onOpenChange={(open) =>
                          setRefundDialog({
                            open,
                            payment: open ? payment : null,
                          })
                        }
                      >
                        <DialogTrigger asChild>
                          <Button variant="outline" size="sm">
                            <AlertTriangle className="h-4 w-4 mr-1" />
                            Refund
                          </Button>
                        </DialogTrigger>
                        <DialogContent>
                          <DialogHeader>
                            <DialogTitle>Process Refund</DialogTitle>
                          </DialogHeader>
                          <div className="space-y-4">
                            <div>
                              <Label htmlFor="amount">Refund Amount</Label>
                              <Input
                                id="amount"
                                type="number"
                                max={payment.amount}
                                value={refundData.amount}
                                onChange={(e) =>
                                  setRefundData({
                                    ...refundData,
                                    amount: Number(e.target.value),
                                  })
                                }
                              />
                              <p className="text-sm text-muted-foreground">
                                Maximum: ₹{payment.amount.toLocaleString()}
                              </p>
                            </div>
                            <div>
                              <Label htmlFor="reason">Refund Reason</Label>
                              <Textarea
                                id="reason"
                                value={refundData.reason}
                                onChange={(e) =>
                                  setRefundData({
                                    ...refundData,
                                    reason: e.target.value,
                                  })
                                }
                                placeholder="Enter reason for refund..."
                              />
                            </div>
                            <Button onClick={handleRefund} className="w-full">
                              Process Refund
                            </Button>
                          </div>
                        </DialogContent>
                      </Dialog>
                    )}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  )
}
