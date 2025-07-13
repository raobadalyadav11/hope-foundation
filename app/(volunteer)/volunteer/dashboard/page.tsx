"use client"

import { useSession } from "next-auth/react"
import { useQuery } from "@tanstack/react-query"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Clock, Calendar, Users, CheckCircle, Star, Target, TrendingUp, Award, Bell, BookOpen } from "lucide-react"
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

interface RecentActivity {
  id: string
  type: "task" | "event" | "blog" | "achievement"
  title: string
  description: string
  date: string
  status?: string
}

interface Notification {
  id: string
  message: string
  type: "info" | "success" | "warning" | "error"
  createdAt: string
  read: boolean
}

export default function VolunteerDashboard() {
  const { data: session } = useSession()

  const { data: dashboardData, isLoading, error } = useQuery({
    queryKey: ["volunteer-dashboard", session?.user?.id],
    queryFn: async () => {
      const response = await fetch("/api/volunteer/dashboard")
      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || "Failed to fetch volunteer data")
      }
      return response.json()
    },
    enabled: !!session?.user?.id,
    retry: 2,
  })

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <h2 className="text-xl font-semibold text-gray-900 mb-2">Error Loading Dashboard</h2>
          <p className="text-gray-600 mb-4">{error.message}</p>
          <Button onClick={() => window.location.reload()}>Try Again</Button>
        </div>
      </div>
    )
  }

  const stats: VolunteerStats = dashboardData?.stats || {
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

  const recentActivities: RecentActivity[] = dashboardData?.recentActivity || []
  const notifications: Notification[] = dashboardData?.notifications || []
  const upcomingTasks = dashboardData?.upcomingTasks || []
  const upcomingEvents = dashboardData?.upcomingEvents || []

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Welcome back, {session?.user?.name}!</h1>
          <p className="text-gray-600">Here's your volunteer dashboard overview</p>
        </div>
        <Badge className="bg-blue-100 text-blue-800 px-3 py-1">
          <Star className="w-4 h-4 mr-1" />
          {stats.rank} Volunteer
        </Badge>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="hover:shadow-lg transition-shadow border-l-4 border-l-blue-500">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Hours</CardTitle>
            <Clock className="h-4 w-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">{stats.totalHours}</div>
            <p className="text-xs text-muted-foreground">
              <span className="text-green-600">+5</span> this month
            </p>
          </CardContent>
        </Card>

        <Card className="hover:shadow-lg transition-shadow border-l-4 border-l-green-500">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Events Attended</CardTitle>
            <Calendar className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">{stats.eventsAttended}</div>
            <p className="text-xs text-muted-foreground">
              <span className="text-green-600">+2</span> this month
            </p>
          </CardContent>
        </Card>

        <Card className="hover:shadow-lg transition-shadow border-l-4 border-l-purple-500">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Tasks Completed</CardTitle>
            <CheckCircle className="h-4 w-4 text-purple-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-purple-600">{stats.tasksCompleted}</div>
            <p className="text-xs text-muted-foreground">
              <span className="text-green-600">+3</span> this month
            </p>
          </CardContent>
        </Card>

        <Card className="hover:shadow-lg transition-shadow border-l-4 border-l-orange-500">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Impact Score</CardTitle>
            <TrendingUp className="h-4 w-4 text-orange-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-orange-600">{stats.impactScore}</div>
            <p className="text-xs text-muted-foreground">
              <span className="text-green-600">+15</span> this month
            </p>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Progress Card */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Target className="w-5 h-5" />
              Your Progress
            </CardTitle>
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
              <Link href="/volunteer/dashboard/tasks">
                <CheckCircle className="w-4 h-4 mr-2" />
                View Tasks
              </Link>
            </Button>
            <Button asChild variant="outline" className="w-full bg-transparent">
              <Link href="/volunteer/dashboard/events">
                <Calendar className="w-4 h-4 mr-2" />
                Browse Events
              </Link>
            </Button>
            <Button asChild variant="outline" className="w-full bg-transparent">
              <Link href="/volunteer/dashboard/blogs">
                <BookOpen className="w-4 h-4 mr-2" />
                My Blogs
              </Link>
            </Button>
            <Button asChild variant="outline" className="w-full bg-transparent">
              <Link href="/volunteer/dashboard/profile">
                <Users className="w-4 h-4 mr-2" />
                Update Profile
              </Link>
            </Button>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Upcoming Tasks */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <span>Upcoming Tasks</span>
              <Link href="/volunteer/dashboard/tasks">
                <Button variant="ghost" size="sm">
                  View All
                </Button>
              </Link>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {upcomingTasks.length > 0 ? (
                upcomingTasks.slice(0, 3).map((task: any) => (
                  <div key={task._id} className="flex items-center gap-4 p-3 border rounded-lg">
                    <div className="p-2 bg-purple-100 rounded-full">
                      <CheckCircle className="w-4 h-4 text-purple-600" />
                    </div>
                    <div className="flex-1">
                      <p className="font-medium">{task.title}</p>
                      <p className="text-sm text-gray-600">Due: {new Date(task.dueDate).toLocaleDateString()}</p>
                    </div>
                    <Badge
                      variant={
                        task.priority === "high" ? "destructive" : task.priority === "medium" ? "default" : "secondary"
                      }
                    >
                      {task.priority}
                    </Badge>
                  </div>
                ))
              ) : (
                <div className="text-center py-8 text-gray-500">
                  <CheckCircle className="w-12 h-12 mx-auto mb-4 text-gray-300" />
                  <p>No upcoming tasks</p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Upcoming Events */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <span>Upcoming Events</span>
              <Link href="/volunteer/dashboard/events">
                <Button variant="ghost" size="sm">
                  View All
                </Button>
              </Link>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {upcomingEvents.length > 0 ? (
                upcomingEvents.slice(0, 3).map((event: any) => (
                  <div key={event._id} className="flex items-center gap-4 p-3 border rounded-lg">
                    <div className="p-2 bg-green-100 rounded-full">
                      <Calendar className="w-4 h-4 text-green-600" />
                    </div>
                    <div className="flex-1">
                      <p className="font-medium">{event.title}</p>
                      <p className="text-sm text-gray-600">{new Date(event.date).toLocaleDateString()}</p>
                    </div>
                    <Badge variant="outline">{event.rsvpStatus || "Not RSVP'd"}</Badge>
                  </div>
                ))
              ) : (
                <div className="text-center py-8 text-gray-500">
                  <Calendar className="w-12 h-12 mx-auto mb-4 text-gray-300" />
                  <p>No upcoming events</p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Notifications */}
      {notifications.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Bell className="w-5 h-5" />
              Recent Notifications
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {notifications.slice(0, 5).map((notification) => (
                <div
                  key={notification.id}
                  className={`p-3 rounded-lg border-l-4 ${
                    notification.type === "success"
                      ? "border-l-green-500 bg-green-50"
                      : notification.type === "warning"
                        ? "border-l-yellow-500 bg-yellow-50"
                        : notification.type === "error"
                          ? "border-l-red-500 bg-red-50"
                          : "border-l-blue-500 bg-blue-50"
                  }`}
                >
                  <p className="text-sm">{notification.message}</p>
                  <p className="text-xs text-gray-500 mt-1">{new Date(notification.createdAt).toLocaleDateString()}</p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Recent Activity */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Activity</CardTitle>
          <CardDescription>Your latest volunteer activities</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {recentActivities.length > 0 ? (
              recentActivities.map((activity) => (
                <div key={activity.id} className="flex items-center gap-4 p-4 border rounded-lg">
                  <div
                    className={`p-2 rounded-full ${
                      activity.type === "event"
                        ? "bg-blue-100 text-blue-600"
                        : activity.type === "task"
                          ? "bg-green-100 text-green-600"
                          : activity.type === "blog"
                            ? "bg-purple-100 text-purple-600"
                            : "bg-orange-100 text-orange-600"
                    }`}
                  >
                    {activity.type === "event" && <Calendar className="w-4 h-4" />}
                    {activity.type === "task" && <CheckCircle className="w-4 h-4" />}
                    {activity.type === "blog" && <BookOpen className="w-4 h-4" />}
                    {activity.type === "achievement" && <Award className="w-4 h-4" />}
                  </div>
                  <div className="flex-1">
                    <p className="font-medium">{activity.title}</p>
                    <p className="text-sm text-gray-600">{activity.description}</p>
                  </div>
                  <div className="text-sm text-gray-500">{new Date(activity.date).toLocaleDateString()}</div>
                </div>
              ))
            ) : (
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
