"use client"

import { useState, useEffect } from "react"
import { useSession } from "next-auth/react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Calendar, MapPin, Users, CheckCircle, X, RefreshCw } from "lucide-react"
import { toast } from "sonner"
import Link from "next/link"

interface Event {
  _id: string
  title: string
  description: string
  date: string
  location: string
  maxAttendees: number
  currentAttendees: number
  requirements: string[]
  rsvpStatus: "attending" | "not_attending" | "pending" | null
  category: string
  organizer: {
    name: string
    email: string
  }
  createdAt: string
}

export default function VolunteerEventsPage() {
  const { data: session } = useSession()
  const [events, setEvents] = useState<Event[]>([])
  const [loading, setLoading] = useState(true)
  const [filters, setFilters] = useState({
    search: "",
    category: "all",
    status: "all",
    date: "all",
  })
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 10,
    total: 0,
    pages: 0,
  })

  const fetchEvents = async () => {
    try {
      setLoading(true)
      const params = new URLSearchParams({
        ...filters,
        page: pagination.page.toString(),
        limit: pagination.limit.toString(),
      })

      const response = await fetch(`/api/volunteer/events?${params}`)
      const data = await response.json()

      if (response.ok) {
        setEvents(data.events)
        setPagination(data.pagination)
      } else {
        toast.error(data.error || "Failed to fetch events")
      }
    } catch (error) {
      toast.error("Failed to fetch events")
    } finally {
      setLoading(false)
    }
  }

  const handleRSVP = async (eventId: string, status: "attending" | "not_attending") => {
    try {
      const response = await fetch(`/api/events/${eventId}/rsvp`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status }),
      })

      if (response.ok) {
        toast.success(`RSVP updated successfully`)
        fetchEvents()
      } else {
        const data = await response.json()
        toast.error(data.error || "Failed to update RSVP")
      }
    } catch (error) {
      toast.error("Failed to update RSVP")
    }
  }

  const getStatusBadge = (status: string | null) => {
    if (!status) return <Badge variant="outline">No RSVP</Badge>

    const variants: Record<string, "default" | "secondary" | "destructive" | "outline"> = {
      attending: "default",
      not_attending: "destructive",
      pending: "secondary",
    }

    const labels: Record<string, string> = {
      attending: "Attending",
      not_attending: "Not Attending",
      pending: "Pending",
    }

    return <Badge variant={variants[status] || "outline"}>{labels[status] || status}</Badge>
  }

  const getCategoryBadge = (category: string) => {
    const colors: Record<string, string> = {
      fundraising: "bg-green-100 text-green-800",
      awareness: "bg-blue-100 text-blue-800",
      community: "bg-purple-100 text-purple-800",
      education: "bg-orange-100 text-orange-800",
      health: "bg-red-100 text-red-800",
    }

    return <Badge className={colors[category] || "bg-gray-100 text-gray-800"}>{category}</Badge>
  }

  useEffect(() => {
    if (session) {
      fetchEvents()
    }
  }, [session, filters, pagination.page])

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Events</h1>
          <p className="text-muted-foreground">Discover and participate in volunteer events</p>
        </div>
        <Button onClick={fetchEvents} disabled={loading} variant="outline">
          <RefreshCw className={`h-4 w-4 mr-2 ${loading ? "animate-spin" : ""}`} />
          Refresh
        </Button>
      </div>

      {/* Filters */}
      <Card>
        <CardHeader>
          <CardTitle>Filters</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-4">
            <Input
              placeholder="Search events..."
              value={filters.search}
              onChange={(e) => setFilters({ ...filters, search: e.target.value })}
            />
            <Select value={filters.category} onValueChange={(value) => setFilters({ ...filters, category: value })}>
              <SelectTrigger>
                <SelectValue placeholder="Category" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Categories</SelectItem>
                <SelectItem value="fundraising">Fundraising</SelectItem>
                <SelectItem value="awareness">Awareness</SelectItem>
                <SelectItem value="community">Community</SelectItem>
                <SelectItem value="education">Education</SelectItem>
                <SelectItem value="health">Health</SelectItem>
              </SelectContent>
            </Select>
            <Select value={filters.status} onValueChange={(value) => setFilters({ ...filters, status: value })}>
              <SelectTrigger>
                <SelectValue placeholder="RSVP Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="attending">Attending</SelectItem>
                <SelectItem value="not_attending">Not Attending</SelectItem>
                <SelectItem value="pending">Pending</SelectItem>
                <SelectItem value="no_rsvp">No RSVP</SelectItem>
              </SelectContent>
            </Select>
            <Select value={filters.date} onValueChange={(value) => setFilters({ ...filters, date: value })}>
              <SelectTrigger>
                <SelectValue placeholder="Date" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Dates</SelectItem>
                <SelectItem value="upcoming">Upcoming</SelectItem>
                <SelectItem value="this_week">This Week</SelectItem>
                <SelectItem value="this_month">This Month</SelectItem>
                <SelectItem value="past">Past Events</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Events Grid */}
      {loading ? (
        <div className="flex items-center justify-center h-96">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
        </div>
      ) : events.length === 0 ? (
        <Card className="text-center py-12">
          <CardContent>
            <Calendar className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h2 className="text-2xl font-bold mb-2">No Events Found</h2>
            <p className="text-gray-600 mb-6">No events match your current filters.</p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-6">
          {events.map((event) => (
            <Card key={event._id} className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <CardTitle className="text-xl">{event.title}</CardTitle>
                      {getCategoryBadge(event.category)}
                      {getStatusBadge(event.rsvpStatus)}
                    </div>
                    <CardDescription className="text-base">{event.description}</CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                  <div className="flex items-center gap-2">
                    <Calendar className="h-4 w-4 text-blue-600" />
                    <span className="text-sm font-medium">
                      {new Date(event.date).toLocaleDateString()} at{" "}
                      {new Date(event.date).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <MapPin className="h-4 w-4 text-green-600" />
                    <span className="text-sm font-medium">{event.location}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Users className="h-4 w-4 text-purple-600" />
                    <span className="text-sm font-medium">
                      {event.currentAttendees}/{event.maxAttendees} attendees
                    </span>
                  </div>
                </div>

                {event.requirements.length > 0 && (
                  <div className="mb-4">
                    <h4 className="font-semibold mb-2">Requirements:</h4>
                    <div className="flex flex-wrap gap-2">
                      {event.requirements.map((req, index) => (
                        <Badge key={index} variant="outline">
                          {req}
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}

                <div className="flex items-center justify-between">
                  <div className="text-sm text-gray-600">Organized by: {event.organizer.name}</div>
                  <div className="flex gap-2">
                    <Button asChild variant="outline" size="sm">
                      <Link href={`/events/${event._id}`}>View Details</Link>
                    </Button>
                    {new Date(event.date) > new Date() && (
                      <>
                        {event.rsvpStatus !== "attending" && (
                          <Button
                            size="sm"
                            onClick={() => handleRSVP(event._id, "attending")}
                            disabled={event.currentAttendees >= event.maxAttendees}
                          >
                            <CheckCircle className="h-4 w-4 mr-1" />
                            {event.currentAttendees >= event.maxAttendees ? "Full" : "RSVP Yes"}
                          </Button>
                        )}
                        {event.rsvpStatus === "attending" && (
                          <Button
                            size="sm"
                            variant="destructive"
                            onClick={() => handleRSVP(event._id, "not_attending")}
                          >
                            <X className="h-4 w-4 mr-1" />
                            Cancel RSVP
                          </Button>
                        )}
                      </>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Pagination */}
      {pagination.pages > 1 && (
        <div className="flex items-center justify-center gap-2">
          <Button
            variant="outline"
            onClick={() => setPagination({ ...pagination, page: pagination.page - 1 })}
            disabled={pagination.page === 1}
          >
            Previous
          </Button>
          <span className="text-sm text-gray-600">
            Page {pagination.page} of {pagination.pages}
          </span>
          <Button
            variant="outline"
            onClick={() => setPagination({ ...pagination, page: pagination.page + 1 })}
            disabled={pagination.page === pagination.pages}
          >
            Next
          </Button>
        </div>
      )}
    </div>
  )
}
