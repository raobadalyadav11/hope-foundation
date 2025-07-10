"use client"

import { useSession } from "next-auth/react"
import { useQuery } from "@tanstack/react-query"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Award } from "lucide-react"

interface Achievement {
  _id: string
  title: string
  description: string
  icon: string
  earnedAt: string
  category: string
}

export default function AchievementsPage() {
  const { data: session } = useSession()

  const { data: achievements } = useQuery({
    queryKey: ["volunteer-achievements", session?.user?.id],
    queryFn: async () => {
      const response = await fetch("/api/volunteer/achievements")
      if (!response.ok) throw new Error("Failed to fetch achievements")
      return response.json()
    },
    enabled: !!session?.user?.id,
  })

  return (
    <div className="space-y-8">
      <h1 className="text-3xl font-bold text-gray-900">Achievements</h1>

      <Card>
        <CardHeader>
          <CardTitle>Your Achievements</CardTitle>
          <CardDescription>Badges and milestones you've earned</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {achievements?.map((achievement: Achievement) => (
              <div key={achievement._id} className="border rounded-lg p-4 text-center">
                <div className="text-4xl mb-2">{achievement.icon}</div>
                <h3 className="font-semibold">{achievement.title}</h3>
                <p className="text-sm text-gray-600 mb-2">{achievement.description}</p>
                <Badge variant="outline">{achievement.category}</Badge>
                <div className="text-xs text-gray-500 mt-2">
                  Earned {new Date(achievement.earnedAt).toLocaleDateString()}
                </div>
              </div>
            )) || (
              <div className="col-span-full text-center py-8 text-gray-500">
                <Award className="w-12 h-12 mx-auto mb-4 text-gray-300" />
                <p>No achievements yet</p>
                <p className="text-sm">Complete tasks and attend events to earn badges!</p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}