"use client"

import { useQuery } from "@tanstack/react-query"
import { useSession } from "next-auth/react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Calendar, Clock, MapPin, Users, Award, Activity } from "lucide-react"
import Link from "next/link"

interface Assignment {
  _id: string
  campaignId?: {
    _id: string
    title: string
  }
  eventId?: {
    _id: string
    title: string
    date: string
    location: string
  }
  role: string
  startDate: string
  endDate?: string
  status: "active" | "completed" | "cancelled"
  hoursLogged: number
}

interface VolunteerData {
  _id: string
  applicationStatus: string
  totalHours: number
  rating: number
  assignments: Assignment[]
  skills: string[]
  preferredCauses: string[]
}

export default function VolunteerDashboard() {
  const { data: session } = useSession()

  const { data: volunteerData, isLoading } = useQuery({
    queryKey: ["volunteer-profile", session?.user?.id],
    queryFn: async () => {
      const response = await fetch(`/api/volunteers/profile/${session?.user?.id}`)
      if (!response.ok) throw new Error("Failed to fetch volunteer data")
      return response.json() as Promise<VolunteerData>
    },
    enabled: !!session?.user?.id,
  })

  const { data: upcomingEvents } = useQuery({
    queryKey: ["volunteer-events"],
    queryFn: async () => {
      const response = await fetch("/api/events?upcoming=true&limit=5")
      if (!response.ok) throw new Error("Failed to fetch events")
      const data = await response.json()
      return data.events
    },
  })

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
      </div>
    )
  }

  if (!volunteerData) {
    return (
      <div className="text-center py-12">
        <h2 className="text-2xl font-bold mb-4">Welcome to Volunteer Dashboard</h2>
        <p className="text-gray-600 mb-6">You haven't applied to become a volunteer yet.</p>
        <Button asChild>
          <Link href="/volunteer">Apply Now</Link>
        </Button>
      </div>
    )
  }

  const activeAssignments = volunteerData.assignments.filter((a) => a.status === "active")
  const completedAssignments = volunteerData.assignments.filter((a) => a.status === "completed")

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Volunteer Dashboard</h1>
        <p className="text-gray-600">Track your volunteer activities and impact</p>
      </div>

      {/* Status Alert */}
      {volunteerData.applicationStatus === "pending" && (
        <Card className="border-yellow-200 bg-yellow-50">
          <CardContent className="pt-6">
            <div className="flex items-center gap-2">
              <Clock className="h-5 w-5 text-yellow-600" />
              <span className="font-medium text-yellow-800">Application Under Review</span>
            </div>
            <p className="text-yellow-700 mt-2">
              Your volunteer application is being reviewed. You'll receive an email once it's approved.
            </p>
          </CardContent>
        </Card>
      )}

      {/* Overview Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Hours</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{volunteerData.totalHours}</div>
            <p className="text-xs text-muted-foreground">Hours volunteered</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Tasks</CardTitle>
            <Activity className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{activeAssignments.length}</div>
            <p className="text-xs text-muted-foreground">Current assignments</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Completed</CardTitle>
            <Award className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{completedAssignments.length}</div>
            <p className="text-xs text-muted-foreground">Tasks completed</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Rating</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{volunteerData.rating.toFixed(1)}</div>
            <p className="text-xs text-muted-foreground">Average rating</p>
          </CardContent>
        </Card>
      </div>

      {/* Active Assignments */}
      {activeAssignments.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Active Assignments</CardTitle>
            <CardDescription>Your current volunteer tasks and responsibilities</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {activeAssignments.map((assignment) => (
                <div key={assignment._id} className="border rounded-lg p-4">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <h3 className="font-semibold">{assignment.campaignId?.title || assignment.eventId?.title}</h3>
                      <p className="text-sm text-gray-600 mb-2">Role: {assignment.role}</p>
                      <div className="flex items-center gap-4 text-sm text-gray-500">
                        <div className="flex items-center gap-1">
                          <Calendar className="h-4 w-4" />
                          <span>Started: {new Date(assignment.startDate).toLocaleDateString()}</span>
                        </div>
                        {assignment.eventId && (
                          <div className="flex items-center gap-1">
                            <MapPin className="h-4 w-4" />
                            <span>{assignment.eventId.location}</span>
                          </div>
                        )}
                      </div>
                    </div>
                    <div className="text-right">
                      <Badge variant="secondary">{assignment.status}</Badge>
                      <p className="text-sm text-gray-600 mt-1">{assignment.hoursLogged} hours logged</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Upcoming Events */}
      {upcomingEvents && upcomingEvents.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Upcoming Events</CardTitle>
            <CardDescription>Events you can volunteer for</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {upcomingEvents.slice(0, 3).map((event: any) => (
                <div key={event._id} className="border rounded-lg p-4">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <h3 className="font-semibold">{event.title}</h3>
                      <p className="text-sm text-gray-600 mb-2 line-clamp-2">{event.description}</p>
                      <div className="flex items-center gap-4 text-sm text-gray-500">
                        <div className="flex items-center gap-1">
                          <Calendar className="h-4 w-4" />
                          <span>{new Date(event.date).toLocaleDateString()}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <MapPin className="h-4 w-4" />
                          <span>{event.location}</span>
                        </div>
                      </div>
                    </div>
                    <Button variant="outline" size="sm" asChild>
                      <Link href={`/events/${event._id}`}>View Details</Link>
                    </Button>
                  </div>
                </div>
              ))}
            </div>
            <div className="mt-4 text-center">
              <Button variant="outline" asChild>
                <Link href="/events">View All Events</Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Skills and Preferences */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Your Skills</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-2">
              {volunteerData.skills.map((skill) => (
                <Badge key={skill} variant="secondary">
                  {skill}
                </Badge>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Preferred Causes</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-2">
              {volunteerData.preferredCauses.map((cause) => (
                <Badge key={cause} variant="outline">
                  {cause}
                </Badge>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
