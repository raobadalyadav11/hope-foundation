"use client"

import { useState, useEffect } from "react"
import { useSession } from "next-auth/react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Pause, Play, X, Calendar, CreditCard } from "lucide-react"
import { toast } from "sonner"

interface Subscription {
  _id: string
  amount: number
  frequency: string
  status: string
  totalPayments: number
  totalAmount: number
  nextPaymentDate: string
  startDate: string
  campaignId?: {
    _id: string
    title: string
  }
}

export default function DonorSubscriptionsPage() {
  const { data: session } = useSession()
  const [subscriptions, setSubscriptions] = useState<Subscription[]>([])
  const [loading, setLoading] = useState(true)

  const fetchSubscriptions = async () => {
    try {
      setLoading(true)
      const response = await fetch("/api/donor/subscriptions")
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
      const response = await fetch(`/api/donor/subscriptions/${subscriptionId}/status`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: newStatus }),
      })

      if (response.ok) {
        toast.success("Subscription updated successfully")
        fetchSubscriptions()
      } else {
        const data = await response.json()
        toast.error(data.error || "Failed to update subscription")
      }
    } catch (error) {
      toast.error("Failed to update subscription")
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

  const getFrequencyText = (frequency: string) => {
    const map: Record<string, string> = {
      monthly: "Monthly",
      quarterly: "Every 3 months",
      yearly: "Yearly",
    }
    return map[frequency] || frequency
  }

  useEffect(() => {
    if (session) {
      fetchSubscriptions()
    }
  }, [session])

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">My Subscriptions</h1>
        <p className="text-gray-600">Manage your recurring donations</p>
      </div>

      {subscriptions.length === 0 ? (
        <Card className="text-center py-12">
          <CardContent>
            <CreditCard className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h2 className="text-2xl font-bold mb-2">No Active Subscriptions</h2>
            <p className="text-gray-600 mb-6">You don't have any recurring donations set up yet.</p>
            <Button asChild>
              <a href="/donate">Set Up Recurring Donation</a>
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-6">
          {subscriptions.map((subscription) => (
            <Card key={subscription._id}>
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div>
                    <CardTitle className="flex items-center gap-2">
                      {subscription.campaignId?.title || "General Donation"}
                      {getStatusBadge(subscription.status)}
                    </CardTitle>
                    <CardDescription>
                      ₹{subscription.amount.toLocaleString()} • {getFrequencyText(subscription.frequency)}
                    </CardDescription>
                  </div>
                  <div className="flex items-center gap-2">
                    {subscription.status === "active" && (
                      <>
                        <Dialog>
                          <DialogTrigger asChild>
                            <Button variant="outline" size="sm">
                              <Pause className="h-4 w-4 mr-1" />
                              Pause
                            </Button>
                          </DialogTrigger>
                          <DialogContent>
                            <DialogHeader>
                              <DialogTitle>Pause Subscription</DialogTitle>
                            </DialogHeader>
                            <div className="space-y-4">
                              <p>Are you sure you want to pause this subscription? You can resume it anytime.</p>
                              <div className="flex gap-2">
                                <Button
                                  onClick={() => handleStatusChange(subscription._id, "paused")}
                                  className="flex-1"
                                >
                                  Yes, Pause
                                </Button>
                                <Button variant="outline" className="flex-1">
                                  Cancel
                                </Button>
                              </div>
                            </div>
                          </DialogContent>
                        </Dialog>
                        <Dialog>
                          <DialogTrigger asChild>
                            <Button variant="outline" size="sm" className="text-red-600 hover:text-red-700">
                              <X className="h-4 w-4 mr-1" />
                              Cancel
                            </Button>
                          </DialogTrigger>
                          <DialogContent>
                            <DialogHeader>
                              <DialogTitle>Cancel Subscription</DialogTitle>
                            </DialogHeader>
                            <div className="space-y-4">
                              <p>
                                Are you sure you want to cancel this subscription? This action cannot be undone, but you
                                can always create a new subscription.
                              </p>
                              <div className="flex gap-2">
                                <Button
                                  onClick={() => handleStatusChange(subscription._id, "cancelled")}
                                  variant="destructive"
                                  className="flex-1"
                                >
                                  Yes, Cancel
                                </Button>
                                <Button variant="outline" className="flex-1">
                                  Keep Subscription
                                </Button>
                              </div>
                            </div>
                          </DialogContent>
                        </Dialog>
                      </>
                    )}
                    {subscription.status === "paused" && (
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleStatusChange(subscription._id, "active")}
                      >
                        <Play className="h-4 w-4 mr-1" />
                        Resume
                      </Button>
                    )}
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div>
                    <p className="text-sm text-gray-600">Total Donated</p>
                    <p className="text-lg font-semibold">₹{subscription.totalAmount.toLocaleString()}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Payments Made</p>
                    <p className="text-lg font-semibold">{subscription.totalPayments}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Started</p>
                    <p className="text-lg font-semibold">{new Date(subscription.startDate).toLocaleDateString()}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Next Payment</p>
                    <p className="text-lg font-semibold">
                      {subscription.status === "active"
                        ? new Date(subscription.nextPaymentDate).toLocaleDateString()
                        : "N/A"}
                    </p>
                  </div>
                </div>
                {subscription.status === "active" && (
                  <div className="mt-4 p-3 bg-green-50 rounded-lg">
                    <div className="flex items-center gap-2 text-green-800">
                      <Calendar className="h-4 w-4" />
                      <span className="text-sm font-medium">
                        Your next donation of ₹{subscription.amount.toLocaleString()} will be processed on{" "}
                        {new Date(subscription.nextPaymentDate).toLocaleDateString()}
                      </span>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}
