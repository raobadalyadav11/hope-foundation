"use client"

import { useSession } from "next-auth/react"
import { useQuery } from "@tanstack/react-query"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Heart, DollarSign, Target } from "lucide-react"
import Link from "next/link"
import { DonationHistory } from "@/components/donation-history"

interface DonorStats {
  totalDonated: number
  totalDonations: number
  campaignsSupported: number
  donations: Donation[]
}

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

export default function OverviewPage() {
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

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
      </div>
    )
  }

  return (
    <div className="space-y-8">
      <h1 className="text-3xl font-bold text-gray-900">Overview</h1>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
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

      {(!donorStats?.donations || donorStats.donations.length === 0) ? (
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
      ) : (
        <div className="mt-8">
          <DonationHistory userId={session?.user?.id || ""} />
        </div>
      )}
    </div>
  )
}
