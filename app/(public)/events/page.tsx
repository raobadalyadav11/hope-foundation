"use client"

import { useState } from "react"
import { useQuery } from "@tanstack/react-query"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Calendar, MapPin, Users, Clock, Search } from "lucide-react"
import Image from "next/image"
import Link from "next/link"

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
  status: string
  spotsLeft: number | null
  isFull: boolean
  daysUntil: number
}

export default function EventsPage() {
  const [search, setSearch] = useState("")
  const [category, setCategory] = useState("all")
  const [page, setPage] = useState(1)

  const { data, isLoading, error } = useQuery({
    queryKey: ["events", search, category, page],
    queryFn: async () => {
      const params = new URLSearchParams({
        search: search || "",
        category: category === "all" ? "" : category,
        page: page.toString(),
        limit: "9",
      })
      const response = await fetch(`/api/events?${params}`)
      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || "Failed to fetch events")
      }
      return response.json()
    },
    retry: 2,
    staleTime: 5 * 60 * 1000, // 5 minutes
  })

  const events = data?.events || []
  const pagination = data?.pagination

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

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-green-600 to-blue-700 text-white py-20">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-5xl font-bold mb-6">Our Events</h1>
            <p className="text-xl opacity-90">
              Join us at our events and be part of the change you want to see in the world. Connect with like-minded
              individuals and make a real impact.
            </p>
          </div>
        </div>
      </section>

      {/* Filters */}
      <section className="py-8 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row gap-4 items-center">
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <Input
                placeholder="Search events..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pl-10"
              />
            </div>
            <Select value={category} onValueChange={setCategory}>
              <SelectTrigger className="w-full md:w-48">
                <SelectValue placeholder="Select category" />
              </SelectTrigger>
              <SelectContent>
                {categories.map((cat) => (
                  <SelectItem key={cat.value} value={cat.value}>
                    {cat.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
      </section>

      {/* Events Grid */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          {error ? (
            <div className="text-center py-12">
              <Calendar className="h-16 w-16 text-red-400 mx-auto mb-4" />
              <h2 className="text-2xl font-bold text-gray-900 mb-2">Error Loading Events</h2>
              <p className="text-gray-600 mb-4">{error.message}</p>
              <Button onClick={() => window.location.reload()}>Try Again</Button>
            </div>
          ) : isLoading ? (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {[...Array(6)].map((_, i) => (
                <div key={i} className="animate-pulse">
                  <div className="bg-gray-200 h-48 rounded-t-lg"></div>
                  <div className="bg-white p-6 rounded-b-lg border">
                    <div className="h-4 bg-gray-200 rounded mb-2"></div>
                    <div className="h-3 bg-gray-200 rounded mb-4"></div>
                    <div className="h-3 bg-gray-200 rounded w-1/2"></div>
                  </div>
                </div>
              ))}
            </div>
          ) : events.length === 0 ? (
            <div className="text-center py-12">
              <Calendar className="h-16 w-16 text-gray-400 mx-auto mb-4" />
              <h2 className="text-2xl font-bold text-gray-900 mb-2">No Events Found</h2>
              <p className="text-gray-600">Try adjusting your search criteria or check back later for new events.</p>
            </div>
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {events.map((event: Event) => (
                <Card key={event._id} className="overflow-hidden hover:shadow-xl transition-shadow group">
                  <div className="relative h-48 overflow-hidden">
                    <Image
                      src={event.image || "/event.png?height=200&width=300"}
                      alt={event.title}
                      fill
                      className="object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                    <div className="absolute top-4 left-4">
                      <Badge className="bg-green-500 hover:bg-green-600">
                        {event.daysUntil === 0
                          ? "Today"
                          : event.daysUntil === 1
                            ? "Tomorrow"
                            : `${event.daysUntil} days`}
                      </Badge>
                    </div>
                    <div className="absolute top-4 right-4">
                      <Badge variant="secondary">{event.category}</Badge>
                    </div>
                    {event.isFull && (
                      <div className="absolute bottom-4 left-4">
                        <Badge variant="destructive">Full</Badge>
                      </div>
                    )}
                  </div>
                  <CardHeader>
                    <CardTitle className="text-xl line-clamp-2">{event.title}</CardTitle>
                    <CardDescription className="line-clamp-3">{event.description}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      <div className="flex items-center gap-2 text-sm text-gray-600">
                        <Calendar className="w-4 h-4" />
                        <span>{new Date(event.date).toLocaleDateString()}</span>
                        {event.endDate && (
                          <>
                            <span>-</span>
                            <span>{new Date(event.endDate).toLocaleDateString()}</span>
                          </>
                        )}
                      </div>
                      <div className="flex items-center gap-2 text-sm text-gray-600">
                        <Clock className="w-4 h-4" />
                        <span>
                          {new Date(event.date).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                        </span>
                      </div>
                      <div className="flex items-center gap-2 text-sm text-gray-600">
                        <MapPin className="w-4 h-4" />
                        <span className="line-clamp-1">{event.location}</span>
                      </div>
                      <div className="flex items-center gap-2 text-sm text-gray-600">
                        <Users className="w-4 h-4" />
                        <span>
                          {event.currentAttendees} registered
                          {event.maxAttendees && ` / ${event.maxAttendees} max`}
                          {event.spotsLeft !== null && ` • ${event.spotsLeft} spots left`}
                        </span>
                      </div>
                      {!event.isFree && event.ticketPrice && (
                        <div className="text-lg font-semibold text-green-600">₹{event.ticketPrice}</div>
                      )}
                      {event.isFree && <div className="text-lg font-semibold text-green-600">Free Event</div>}
                    </div>
                    <Button className="w-full mt-4" disabled={event.isFull} asChild>
                      <Link href={`/events/${event._id}`}>{event.isFull ? "Event Full" : "Learn More & Register"}</Link>
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}

          {/* Pagination */}
          {pagination && pagination.pages > 1 && (
            <div className="flex justify-center items-center gap-2 mt-12">
              <Button variant="outline" onClick={() => setPage(page - 1)} disabled={page === 1} className="px-4 py-2">
                Previous
              </Button>
              <span className="px-4 py-2 text-sm text-gray-600">
                Page {page} of {pagination.pages}
              </span>
              <Button
                variant="outline"
                onClick={() => setPage(page + 1)}
                disabled={page === pagination.pages}
                className="px-4 py-2"
              >
                Next
              </Button>
            </div>
          )}
        </div>
      </section>

      {/* Call to Action */}
      <section className="py-16 bg-green-600 text-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-4xl font-bold mb-6">Want to Organize an Event?</h2>
          <p className="text-xl mb-8 opacity-90 max-w-2xl mx-auto">
            Have an idea for an event that could make a difference? Partner with us to organize impactful community
            events.
          </p>
          <Button size="lg" className="bg-white text-green-600 hover:bg-gray-100">
            <Link href="/contact">Get in Touch</Link>
          </Button>
        </div>
      </section>
    </div>
  )
}
