"use client"

import { useQuery } from "@tanstack/react-query"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import Link from "next/link"

export default function CampaignsPage() {
  const { data: featuredCampaigns, isLoading } = useQuery({
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

  return (
    <div className="space-y-8">
      <h1 className="text-3xl font-bold text-gray-900">Featured Campaigns</h1>

      <Card>
        <CardHeader>
          <CardTitle>Featured Campaigns</CardTitle>
          <CardDescription>Support our most urgent causes</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {featuredCampaigns?.map((campaign: any) => (
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
            )) || (
              <div className="col-span-full text-center py-8 text-gray-500">
                <p>No featured campaigns available</p>
                <p className="text-sm">Check back later for new opportunities!</p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
