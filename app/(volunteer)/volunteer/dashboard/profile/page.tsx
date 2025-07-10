"use client"

import { useSession } from "next-auth/react"
import { useQuery } from "@tanstack/react-query"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Users } from "lucide-react"
import Link from "next/link"

interface VolunteerStats {
  totalHours: number
  eventsAttended: number
  tasksCompleted: number
  impactScore: number
  rank: string
  nextMilestone: {
    title: string
    hoursNeeded: number
    currentProgress: number
  }
}

export default function ProfilePage() {
  const { data: session } = useSession()

  const { data: volunteerData } = useQuery({
    queryKey: ["volunteer-dashboard", session?.user?.id],
    queryFn: async () => {
      const response = await fetch("/api/volunteer/dashboard")
      if (!response.ok) throw new Error("Failed to fetch volunteer data")
      return response.json()
    },
    enabled: !!session?.user?.id,
  })

  const stats: VolunteerStats = volunteerData?.stats || {
    totalHours: 0,
    eventsAttended: 0,
    tasksCompleted: 0,
    impactScore: 0,
    rank: "Newcomer",
    nextMilestone: {
      title: "Helper",
      hoursNeeded: 10,
      currentProgress: 0,
    },
  }

  return (
    <div className="space-y-8">
      <h1 className="text-3xl font-bold text-gray-900">Profile</h1>

      <Card>
        <CardHeader>
          <CardTitle>Volunteer Profile</CardTitle>
          <CardDescription>Manage your volunteer information and preferences</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            <div className="flex items-center gap-4">
              <div className="w-20 h-20 bg-gray-200 rounded-full flex items-center justify-center">
                <Users className="w-8 h-8 text-gray-400" />
              </div>
              <div>
                <h3 className="text-lg font-semibold">{session?.user?.name}</h3>
                <p className="text-gray-600">{session?.user?.email}</p>
                <Badge className="mt-1">{stats.rank} Volunteer</Badge>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h4 className="font-semibold mb-2">Skills & Interests</h4>
                <div className="flex flex-wrap gap-2">
                  {volunteerData?.profile?.skills?.map((skill: string, index: number) => (
                    <Badge key={index} variant="outline">
                      {skill}
                    </Badge>
                  )) || <p className="text-gray-500 text-sm">No skills added yet</p>}
                </div>
              </div>

              <div>
                <h4 className="font-semibold mb-2">Availability</h4>
                <p className="text-gray-600">{volunteerData?.profile?.availability || "Not specified"}</p>
              </div>
            </div>

            <Button asChild>
              <Link href="/volunteer/profile/edit">Edit Profile</Link>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}