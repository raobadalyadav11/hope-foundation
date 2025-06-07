"use client"

import { useState } from "react"
import { useSession } from "next-auth/react"
import { useQuery } from "@tanstack/react-query"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Clock, Calendar, Users, Award, MapPin, CheckCircle, Star, Target, TrendingUp } from "lucide-react"
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

interface Assignment {
  _id: string
  title: string
  description: string
  type: "event" | "campaign" | "task"
  status: "assigned" | "in-progress" | "completed"
  dueDate: string
  estimatedHours: number
  location?: string
  priority: "low" | "medium" | "high"
}

interface Achievement {
  _id: string
  title: string
  description: string
  icon: string
  earnedAt: string
  category: string
}

export default function VolunteerDashboard() {
  const { data: session } = useSession()
  const [activeTab, setActiveTab] = useState("overview")

  const { data: volunteerData, isLoading } = useQuery({
    queryKey: ["volunteer-dashboard", session?.user?.id],
    queryFn: async () => {
      const response = await fetch("/api/volunteer/dashboard")
      if (!response.ok) throw new Error("Failed to fetch volunteer data")
      return response.json()
    },
    enabled: !!session?.user?.id,
  })

  const { data: assignments } = useQuery({
    queryKey: ["volunteer-assignments", session?.user?.id],
    queryFn: async () => {
      const response = await fetch("/api/volunteer/assignments")
      if (!response.ok) throw new Error("Failed to fetch assignments")
      return response.json()
    },
    enabled: !!session?.user?.id,
  })

  const { data: achievements } = useQuery({
    queryKey: ["volunteer-achievements", session?.user?.id],
    queryFn: async () => {
      const response = await fetch("/api/volunteer/achievements")
      if (!response.ok) throw new Error("Failed to fetch achievements")
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

  const priorityColors = {
    low: "bg-green-100 text-green-800",
    medium: "bg-yellow-100 text-yellow-800",
    high: "bg-red-100 text-red-800",
  }

  const statusColors = {
    assigned: "bg-blue-100 text-blue-800",
    "in-progress": "bg-orange-100 text-orange-800",
    completed: "bg-green-100 text-green-800",
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Volunteer Dashboard</h1>
          <p className="text-gray-600 mt-2">Welcome back, {session?.user?.name}!</p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
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

        {/* Main Content */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="assignments">Assignments</TabsTrigger>
            <TabsTrigger value="achievements">Achievements</TabsTrigger>
            <TabsTrigger value="profile">Profile</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Progress Card */}
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

              {/* Quick Actions */}
              <Card>
                <CardHeader>
                  <CardTitle>Quick Actions</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <Button asChild className="w-full">
                    <Link href="/volunteer/log-hours">
                      <Clock className="w-4 h-4 mr-2" />
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

            {/* Recent Activity */}
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
          </TabsContent>

          <TabsContent value="assignments" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Your Assignments</CardTitle>
                <CardDescription>Current and upcoming volunteer assignments</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {assignments?.map((assignment: Assignment) => (
                    <div key={assignment._id} className="border rounded-lg p-4">
                      <div className="flex items-start justify-between mb-3">
                        <div>
                          <h3 className="font-semibold text-lg">{assignment.title}</h3>
                          <p className="text-gray-600 text-sm">{assignment.description}</p>
                        </div>
                        <div className="flex gap-2">
                          <Badge className={priorityColors[assignment.priority]}>{assignment.priority}</Badge>
                          <Badge className={statusColors[assignment.status]}>{assignment.status}</Badge>
                        </div>
                      </div>

                      <div className="flex items-center gap-4 text-sm text-gray-600 mb-3">
                        <div className="flex items-center gap-1">
                          <Calendar className="w-4 h-4" />
                          <span>Due: {new Date(assignment.dueDate).toLocaleDateString()}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <Clock className="w-4 h-4" />
                          <span>{assignment.estimatedHours} hours</span>
                        </div>
                        {assignment.location && (
                          <div className="flex items-center gap-1">
                            <MapPin className="w-4 h-4" />
                            <span>{assignment.location}</span>
                          </div>
                        )}
                      </div>

                      <div className="flex gap-2">
                        {assignment.status === "assigned" && <Button size="sm">Start Assignment</Button>}
                        {assignment.status === "in-progress" && <Button size="sm">Mark Complete</Button>}
                        <Button size="sm" variant="outline">
                          View Details
                        </Button>
                      </div>
                    </div>
                  )) || (
                    <div className="text-center py-8 text-gray-500">
                      <Target className="w-12 h-12 mx-auto mb-4 text-gray-300" />
                      <p>No assignments yet</p>
                      <p className="text-sm">Check back later for new opportunities!</p>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="achievements" className="space-y-6">
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
          </TabsContent>

          <TabsContent value="profile" className="space-y-6">
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
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
