"use client"

import { useSession } from "next-auth/react"
import { useQuery } from "@tanstack/react-query"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Calendar, Download, Heart } from "lucide-react"
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

export default function DonationsPage() {
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

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
      </div>
    )
  }

  return (
    <div className="space-y-8">
      <h1 className="text-3xl font-bold text-gray-900">Donations</h1>

      <Card>
        <CardHeader>
          <CardTitle>Recent Donations</CardTitle>
          <CardDescription>Your latest contributions and receipts</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {donorStats?.donations?.map((donation: Donation) => (
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
            )) || (
              <div className="text-center py-8 text-gray-500">
                <Heart className="w-12 h-12 mx-auto mb-4 text-gray-300" />
                <p>No donations yet</p>
                <p className="text-sm">Make a donation to see your contributions here!</p>
              </div>
            )}
          </div>
          {donorStats?.donations?.length > 5 && (
            <div className="mt-4 text-center">
              <Button variant="outline">View All Donations</Button>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
