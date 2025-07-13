"use client"

import { useState } from "react"
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { toast } from "@/components/ui/use-toast"
import { Plus, Search, MoreHorizontal, Edit, Trash2, Eye, Users, Calendar, MapPin, Clock } from "lucide-react"
import Link from "next/link"
import Image from "next/image"

interface Event {
  _id: string
  title: string
  description: string
  date: string
  endDate?: string
  location: string
  address: string
  image: string
  category: string
  currentAttendees: number
  maxAttendees?: number
  isFree: boolean
  ticketPrice?: number
  status: "upcoming" | "ongoing" | "completed" | "cancelled"
  spotsLeft: number | null
  isFull: boolean
  daysUntil: number
  createdBy: {
    name: string
    email: string
  }
  createdAt: string
}

const statusColors = {
  upcoming: "bg-blue-100 text-blue-800",
  ongoing: "bg-green-100 text-green-800",
  completed: "bg-gray-100 text-gray-800",
  cancelled: "bg-red-100 text-red-800",
}

const categories = [
  { value: "all", label: "All Categories" },
  { value: "workshop", label: "Workshop" },
  { value: "fundraiser", label: "Fundraiser" },
  { value: "awareness", label: "Awareness" },
  { value: "volunteer-drive", label: "Volunteer Drive" },
  { value: "community-service", label: "Community Service" },
  { value: "training", label: "Training" },
  { value: "conference", label: "Conference" },
]

export default function AdminEventsPage() {
  const queryClient = useQueryClient()
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedCategory, setSelectedCategory] = useState("all")
  const [selectedStatus, setSelectedStatus] = useState("all")
  const [currentPage, setCurrentPage] = useState(1)

  const { data: eventsData, isLoading } = useQuery({
    queryKey: ["admin-events", searchTerm, selectedCategory, selectedStatus, currentPage],
    queryFn: async () => {
      const params = new URLSearchParams({
        search: searchTerm,
        category: selectedCategory,
        status: selectedStatus,
        page: currentPage.toString(),
        limit: "10",
        admin: "true",
      })

      const response = await fetch(`/api/events?${params}`)
      if (!response.ok) throw new Error("Failed to fetch events")
      return response.json()
    },
  })

  const deleteEventMutation = useMutation({
    mutationFn: async (eventId: string) => {
      const response = await fetch(`/api/events/${eventId}`, {
        method: "DELETE",
      })
      if (!response.ok) throw new Error("Failed to delete event")
      return response.json()
    },
    onSuccess: () => {
      toast({
        title: "Event deleted",
        description: "The event has been successfully deleted.",
      })
      queryClient.invalidateQueries({ queryKey: ["admin-events"] })
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to delete event. Please try again.",
        variant: "destructive",
      })
    },
  })

  const updateEventStatusMutation = useMutation({
    mutationFn: async ({ eventId, status }: { eventId: string; status: string }) => {
      const response = await fetch(`/api/events/${eventId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status }),
      })
      if (!response.ok) throw new Error("Failed to update event")
      return response.json()
    },
    onSuccess: () => {
      toast({
        title: "Event updated",
        description: "Event status has been updated.",
      })
      queryClient.invalidateQueries({ queryKey: ["admin-events"] })
    },
  })

  const events = eventsData?.events || []
  const pagination = eventsData?.pagination || {}

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Event Management</h1>
          <p className="text-gray-600 mt-2">Manage all events and track attendance</p>
        </div>
        <Button asChild>
          <Link href="/admin/events/new">
            <Plus className="w-4 h-4 mr-2" />
            New Event
          </Link>
        </Button>
      </div>

      {/* Filters */}
      <Card>
        <CardHeader>
          <CardTitle>Filters</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col lg:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <Input
                  placeholder="Search events..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            <Select value={selectedCategory} onValueChange={setSelectedCategory}>
              <SelectTrigger className="w-48">
                <SelectValue placeholder="Category" />
              </SelectTrigger>
              <SelectContent>
                {categories.map((category) => (
                  <SelectItem key={category.value} value={category.value}>
                    {category.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Select value={selectedStatus} onValueChange={setSelectedStatus}>
              <SelectTrigger className="w-48">
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="upcoming">Upcoming</SelectItem>
                <SelectItem value="ongoing">Ongoing</SelectItem>
                <SelectItem value="completed">Completed</SelectItem>
                <SelectItem value="cancelled">Cancelled</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Events List */}
      <div className="space-y-4">
        {events.length === 0 ? (
          <Card>
            <CardContent className="text-center py-12">
              <Calendar className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-gray-900 mb-2">No events found</h3>
              <p className="text-gray-600 mb-6">Get started by creating your first event.</p>
              <Button asChild>
                <Link href="/admin/events/new">Create Event</Link>
              </Button>
            </CardContent>
          </Card>
        ) : (
          events.map((event: Event) => (
            <Card key={event._id} className="hover:shadow-lg transition-shadow">
              <CardContent className="p-6">
                <div className="flex gap-6">
                  {/* Event Image */}
                  <div className="relative w-32 h-24 rounded-lg overflow-hidden flex-shrink-0">
                    <Image
                      src={event.image || "/event.png?height=96&width=128"}
                      alt={event.title}
                      fill
                      className="object-cover"
                    />
                  </div>

                  {/* Event Details */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between mb-2">
                      <div className="flex-1">
                        <h3 className="text-lg font-semibold text-gray-900 line-clamp-1">{event.title}</h3>
                        <p className="text-gray-600 text-sm line-clamp-2 mt-1">{event.description}</p>
                      </div>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="sm">
                            <MoreHorizontal className="w-4 h-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem asChild>
                            <Link href={`/events/${event._id}`}>
                              <Eye className="w-4 h-4 mr-2" />
                              View
                            </Link>
                          </DropdownMenuItem>
                          <DropdownMenuItem asChild>
                            <Link href={`/admin/events/${event._id}/edit`}>
                              <Edit className="w-4 h-4 mr-2" />
                              Edit
                            </Link>
                          </DropdownMenuItem>
                          <DropdownMenuItem asChild>
                            <Link href={`/admin/events/${event._id}/attendees`}>
                              <Users className="w-4 h-4 mr-2" />
                              View Attendees
                            </Link>
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            onClick={() => deleteEventMutation.mutate(event._id)}
                            className="text-red-600"
                          >
                            <Trash2 className="w-4 h-4 mr-2" />
                            Delete
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>

                    {/* Event Meta */}
                    <div className="flex items-center gap-4 text-sm text-gray-600 mb-3">
                      <div className="flex items-center gap-1">
                        <Calendar className="w-4 h-4" />
                        <span>{new Date(event.date).toLocaleDateString()}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Clock className="w-4 h-4" />
                        <span>
                          {new Date(event.date).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                        </span>
                      </div>
                      <div className="flex items-center gap-1">
                        <MapPin className="w-4 h-4" />
                        <span>{event.location}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Users className="w-4 h-4" />
                        <span>{event.currentAttendees} registered</span>
                        {event.maxAttendees && <span>/ {event.maxAttendees} max</span>}
                      </div>
                    </div>

                    {/* Attendance Progress */}
                    {event.maxAttendees && (
                      <div className="mb-3">
                        <div className="flex justify-between text-sm mb-1">
                          <span className="font-medium">{event.currentAttendees} attendees</span>
                          <span className="text-gray-600">{event.maxAttendees} capacity</span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2">
                          <div
                            className="bg-blue-600 h-2 rounded-full"
                            style={{ width: `${Math.min((event.currentAttendees / event.maxAttendees) * 100, 100)}%` }}
                          ></div>
                        </div>
                        <div className="flex justify-between text-xs text-gray-500 mt-1">
                          <span>{Math.round((event.currentAttendees / event.maxAttendees) * 100)}% full</span>
                          {event.spotsLeft !== null && event.spotsLeft > 0 && <span>{event.spotsLeft} spots left</span>}
                        </div>
                      </div>
                    )}

                    {/* Badges */}
                    <div className="flex items-center gap-2">
                      <Badge className={statusColors[event.status]}>{event.status}</Badge>
                      <Badge variant="outline">{event.category}</Badge>
                      <Badge variant="outline">{event.isFree ? "Free" : `₹${event.ticketPrice}`}</Badge>
                      {event.isFull && <Badge variant="destructive">Full</Badge>}
                      {event.daysUntil <= 7 && event.daysUntil > 0 && (
                        <Badge className="bg-orange-100 text-orange-800">{event.daysUntil} days left</Badge>
                      )}
                    </div>
                  </div>

                  {/* Quick Actions */}
                  <div className="flex flex-col gap-2">
                    <Select
                      value={event.status}
                      onValueChange={(status) =>
                        updateEventStatusMutation.mutate({
                          eventId: event._id,
                          status,
                        })
                      }
                    >
                      <SelectTrigger className="w-32">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="upcoming">Upcoming</SelectItem>
                        <SelectItem value="ongoing">Ongoing</SelectItem>
                        <SelectItem value="completed">Completed</SelectItem>
                        <SelectItem value="cancelled">Cancelled</SelectItem>
                      </SelectContent>
                    </Select>
                    <Button asChild size="sm" variant="outline">
                      <Link href={`/admin/events/${event._id}/analytics`}>View Analytics</Link>
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>

      {/* Pagination */}
      {pagination.pages > 1 && (
        <div className="flex justify-center items-center gap-4">
          <Button
            variant="outline"
            onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
            disabled={currentPage === 1}
          >
            Previous
          </Button>
          <span className="text-sm text-gray-600">
            Page {pagination.page} of {pagination.pages}
          </span>
          <Button
            variant="outline"
            onClick={() => setCurrentPage(Math.min(pagination.pages, currentPage + 1))}
            disabled={currentPage === pagination.pages}
          >
            Next
          </Button>
        </div>
      )}
    </div>
  )
}
