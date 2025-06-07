"use client"

import { useQuery } from "@tanstack/react-query"
import { useSession } from "next-auth/react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { DollarSign, Heart, Download, Calendar, Target } from "lucide-react"
import Link from "next/link"

interface Donation {
  _id: string
  amount: number
  campaignId?: {
    _id: string
    title: string
  }
  status: string
  receiptNumber?: string
  createdAt: string
}

interface DonorStats {
  totalDonated: number
  totalDonations: number
  campaignsSupported: number
  donations: Donation[]
}

export default function DonorDashboard() {
  const { data: session } = useSession()

  const { data: donorStats, isLoading } = useQuery({
    queryKey: ["donor-stats", session?.user?.id],
    queryFn: async () => {
      const response = await fetch(`/api/donations/user/${session?.user?.id}`)
      if (!response.ok) throw new Error("Failed to fetch donor stats")
      return response.json() as Promise<DonorStats>
    },
    enabled: !!session?.user?.id,
  })

  const { data: featuredCampaigns } = useQuery({
    queryKey: ["featured-campaigns"],
    queryFn: async () => {
      const response = await fetch("/api/campaigns?featured=true&limit=3")
      if (!response.ok) throw new Error("Failed to fetch campaigns")
      const data = await response.json()
      return data.campaigns
    },
  })

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
      </div>
    )
  }

  const downloadReceipt = async (donationId: string) => {
    try {
      const response = await fetch(`/api/donations/receipt/${donationId}`)
      if (response.ok) {
        const blob = await response.blob()
        const url = window.URL.createObjectURL(blob)
        const a = document.createElement("a")
        a.href = url
        a.download = `receipt-${donationId}.pdf`
        a.click()
        window.URL.revokeObjectURL(url)
      }
    } catch (error) {
      console.error("Error downloading receipt:", error)
    }
  }

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Donor Dashboard</h1>
        <p className="text-gray-600 mt-2">Track your donations and impact</p>
      </div>

      {/* Overview Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Donated</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">₹{donorStats?.totalDonated?.toLocaleString() || 0}</div>
            <p className="text-xs text-muted-foreground">Lifetime contributions</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Donations Made</CardTitle>
            <Heart className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{donorStats?.totalDonations || 0}</div>
            <p className="text-xs text-muted-foreground">Number of donations</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Campaigns Supported</CardTitle>
            <Target className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{donorStats?.campaignsSupported || 0}</div>
            <p className="text-xs text-muted-foreground">Different campaigns</p>
          </CardContent>
        </Card>
      </div>

      {/* Recent Donations */}
      {donorStats?.donations && donorStats.donations.length > 0 && (
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Recent Donations</CardTitle>
            <CardDescription>Your latest contributions and receipts</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {donorStats.donations.slice(0, 5).map((donation) => (
                <div key={donation._id} className="flex items-center justify-between border rounded-lg p-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="font-semibold">₹{donation.amount.toLocaleString()}</span>
                      <Badge variant={donation.status === "completed" ? "default" : "secondary"}>
                        {donation.status}
                      </Badge>
                    </div>
                    <p className="text-sm text-gray-600">{donation.campaignId?.title || "General Donation"}</p>
                    <div className="flex items-center gap-1 text-xs text-gray-500 mt-1">
                      <Calendar className="h-3 w-3" />
                      <span>{new Date(donation.createdAt).toLocaleDateString()}</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    {donation.receiptNumber && (
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => downloadReceipt(donation._id)}
                        className="flex items-center gap-1"
                      >
                        <Download className="h-3 w-3" />
                        Receipt
                      </Button>
                    )}
                    {donation.campaignId && (
                      <Button variant="ghost" size="sm" asChild>
                        <Link href={`/campaigns/${donation.campaignId._id}`}>View Campaign</Link>
                      </Button>
                    )}
                  </div>
                </div>
              ))}
            </div>
            {donorStats.donations.length > 5 && (
              <div className="mt-4 text-center">
                <Button variant="outline">View All Donations</Button>
              </div>
            )}
          </CardContent>
        </Card>
      )}

      {/* Featured Campaigns */}
      {featuredCampaigns && featuredCampaigns.length > 0 && (
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Featured Campaigns</CardTitle>
            <CardDescription>Support our most urgent causes</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {featuredCampaigns.map((campaign: any) => (
                <div key={campaign._id} className="border rounded-lg p-4">
                  <h3 className="font-semibold mb-2 line-clamp-2">{campaign.title}</h3>
                  <p className="text-sm text-gray-600 mb-3 line-clamp-3">{campaign.description}</p>
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>₹{campaign.raised.toLocaleString()}</span>
                      <span className="text-gray-500">₹{campaign.goal.toLocaleString()}</span>
                    </div>
                    <Progress value={(campaign.raised / campaign.goal) * 100} className="h-2" />
                    <div className="flex justify-between text-xs text-gray-500">
                      <span>{Math.round((campaign.raised / campaign.goal) * 100)}% funded</span>
                      <span>{campaign.daysLeft} days left</span>
                    </div>
                  </div>
                  <Button className="w-full mt-3" size="sm" asChild>
                    <Link href={`/campaigns/${campaign._id}`}>Donate Now</Link>
                  </Button>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Call to Action */}
      {(!donorStats?.donations || donorStats.donations.length === 0) && (
        <Card className="text-center py-12">
          <CardContent>
            <Heart className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h2 className="text-2xl font-bold mb-2">Start Making a Difference</h2>
            <p className="text-gray-600 mb-6">Your first donation can change someone's life today.</p>
            <Button size="lg" asChild>
              <Link href="/donate">Make Your First Donation</Link>
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
