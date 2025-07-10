"use client"

import { useSession } from "next-auth/react"
import { useQuery } from "@tanstack/react-query"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Clock, Calendar, Users, CheckCircle, Star, Target, TrendingUp, Award } from "lucide-react"
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

export default function OverviewPage() {
  const { data: session } = useSession()

  const { data: volunteerData, isLoading } = useQuery({
    queryKey: ["volunteer-dashboard", session?.user?.id],
    queryFn: async () => {
      const response = await fetch("/api/volunteer/dashboard")
      if (!response.ok) throw new Error("Failed to fetch volunteer data")
      return response.json()
    },
    enabled: !!session?.user?.id,
  })

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
      </div>
    )
  }

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
      <h1 className="text-3xl font-bold text-gray-900">Overview</h1>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="hover:shadow-lg transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Hours</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalHours}</div>
            <p className="text-xs text-muted-foreground">
              <span className="text-green-600">+5</span> this month
            </p>
          </CardContent>
        </Card>

        <Card className="hover:shadow-lg transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Events Attended</CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.eventsAttended}</div>
            <p className="text-xs text-muted-foreground">
              <span className="text-green-600">+2</span> this month
            </p>
          </CardContent>
        </Card>

        <Card className="hover:shadow-lg transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Tasks Completed</CardTitle>
            <CheckCircle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.tasksCompleted}</div>
            <p className="text-xs text-muted-foreground">
              <span className="text-green-600">+3</span> this month
            </p>
          </CardContent>
        </Card>

        <Card className="hover:shadow-lg transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Impact Score</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.impactScore}</div>
            <p className="text-xs text-muted-foreground">
              <span className="text-green-600">+15</span> this month
            </p>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Your Progress</CardTitle>
            <CardDescription>Track your volunteer journey and milestones</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium">Current Rank: {stats.rank}</span>
                <Badge className="bg-blue-100 text-blue-800">
                  <Star className="w-3 h-3 mr-1" />
                  {stats.rank}
                </Badge>
              </div>
              <div className="text-sm text-gray-600 mb-4">Next milestone: {stats.nextMilestone.title}</div>
              <Progress
                value={(stats.nextMilestone.currentProgress / stats.nextMilestone.hoursNeeded) * 100}
                className="h-3"
              />
              <div className="flex justify-between text-xs text-gray-500 mt-2">
                <span>{stats.nextMilestone.currentProgress} hours</span>
                <span>{stats.nextMilestone.hoursNeeded} hours needed</span>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="text-center p-4 bg-blue-50 rounded-lg">
                <div className="text-2xl font-bold text-blue-600">{stats.totalHours}</div>
                <div className="text-sm text-gray-600">Total Hours</div>
              </div>
              <div className="text-center p-4 bg-green-50 rounded-lg">
                <div className="text-2xl font-bold text-green-600">{stats.impactScore}</div>
                <div className="text-sm text-gray-600">Impact Score</div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <Button asChild className="w-full">
              <Link href="/volunteer/log-hours">
                <Clock className="w-4 h-4 mr teatrale-2" />
                Log Hours
              </Link>
            </Button>
            <Button asChild variant="outline" className="w-full">
              <Link href="/events">
                <Calendar className="w-4 h-4 mr-2" />
                Browse Events
              </Link>
            </Button>
            <Button asChild variant="outline" className="w-full">
              <Link href="/volunteer/opportunities">
                <Users className="w-4 h-4 mr-2" />
                Find Opportunities
              </Link>
            </Button>
            <Button asChild variant="outline" className="w-full">
              <Link href="/volunteer/profile">
                <Target className="w-4 h-4 mr-2" />
                Update Profile
              </Link>
            </Button>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Recent Activity</CardTitle>
          <CardDescription>Your latest volunteer activities</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {volunteerData?.recentActivity?.map((activity: any, index: number) => (
              <div key={index} className="flex items-center gap-4 p-4 border rounded-lg">
                <div
                  className={`p-2 rounded-full ${
                    activity.type === "event"
                      ? "bg-blue-100 text-blue-600"
                      : activity.type === "task"
                      ? "bg-green-100 text-green-600"
                      : "bg-purple-100 text-purple-600"
                  }`}
                >
                  {activity.type === "event" && <Calendar className="w-4 h-4" />}
                  {activity.type === "task" && <CheckCircle className="w-4 h-4" />}
                  {activity.type === "achievement" && <Award className="w-4 h-4" />}
                </div>
                <div className="flex-1">
                  <p className="font-medium">{activity.title}</p>
                  <p className="text-sm text-gray-600">{activity.description}</p>
                </div>
                <div className="text-sm text-gray-500">{new Date(activity.date).toLocaleDateString()}</div>
              </div>
            )) || (
              <div className="text-center py-8 text-gray-500">
                <Users className="w-12 h-12 mx-auto mb-4 text-gray-300" />
                <p>No recent activity</p>
                <p className="text-sm">Start volunteering to see your activity here!</p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
