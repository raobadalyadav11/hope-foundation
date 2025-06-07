"use client"

import { useState } from "react"
import { useQuery } from "@tanstack/react-query"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Calendar, MapPin, Users, Clock, Search, Filter, ArrowRight } from "lucide-react"
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
  status: string
  tags: string[]
  spotsLeft: number | null
  isFull: boolean
  daysUntil: number
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

const sortOptions = [
  { value: "date", label: "Date (Earliest First)" },
  { value: "-date", label: "Date (Latest First)" },
  { value: "currentAttendees", label: "Most Popular" },
  { value: "title", label: "Alphabetical" },
]

export default function EventsPage() {
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedCategory, setSelectedCategory] = useState("all")
  const [sortBy, setSortBy] = useState("date")
  const [currentPage, setCurrentPage] = useState(1)
  const [showFilters, setShowFilters] = useState(false)

  const { data: eventsData, isLoading } = useQuery({
    queryKey: ["events", selectedCategory, searchTerm, sortBy, currentPage],
    queryFn: async () => {
      const params = new URLSearchParams({
        category: selectedCategory,
        search: searchTerm,
        sort: sortBy,
        page: currentPage.toString(),
        limit: "12",
        upcoming: "true",
      })

      const response = await fetch(`/api/events?${params}`)
      if (!response.ok) throw new Error("Failed to fetch events")
      return response.json()
    },
  })

  const { data: featuredEvents } = useQuery({
    queryKey: ["events", "featured"],
    queryFn: async () => {
      const response = await fetch("/api/events?featured=true&limit=3&upcoming=true")
      if (!response.ok) throw new Error("Failed to fetch featured events")
      const data = await response.json()
      return data.events as Event[]
    },
  })

  const events = eventsData?.events || []
  const pagination = eventsData?.pagination || {}

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading events...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-blue-600 via-purple-700 to-blue-800 text-white py-20">
        <div className="absolute inset-0 bg-black/30"></div>
        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-4xl mx-auto text-center">
            <Badge className="bg-white/20 text-white border-white/30 hover:bg-white/30 mb-6">📅 Upcoming Events</Badge>
            <h1 className="text-5xl lg:text-6xl font-bold mb-6">Join Our Events</h1>
            <p className="text-xl lg:text-2xl opacity-90 leading-relaxed mb-8">
              Connect with like-minded individuals, learn new skills, and make a positive impact in your community.
              Discover events that inspire, educate, and bring people together for meaningful causes.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" className="bg-white text-blue-600 hover:bg-gray-100 font-semibold">
                <Link href="#events">Browse Events</Link>
              </Button>
              <Button
                size="lg"
                variant="outline"
                className="border-white text-white hover:bg-white hover:text-blue-600 font-semibold"
              >
                <Link href="/volunteer">Become a Volunteer</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Events */}
      {featuredEvents && featuredEvents.length > 0 && (
        <section className="py-20 bg-gray-50">
          <div className="container mx-auto px-4">
            <div className="text-center mb-16">
              <h2 className="text-4xl font-bold text-gray-900 mb-4">Featured Events</h2>
              <p className="text-xl text-gray-600 max-w-2xl mx-auto">
                Don't miss these special events that are making a significant impact in our community.
              </p>
            </div>

            <div className="grid lg:grid-cols-3 gap-8">
              {featuredEvents.map((event) => (
                <Card
                  key={event._id}
                  className="overflow-hidden hover:shadow-2xl transition-all duration-300 group border-0 shadow-lg"
                >
                  <div className="relative h-64 overflow-hidden">
                    <Image
                      src={event.image || "/placeholder.svg?height=250&width=400"}
                      alt={event.title}
                      fill
                      className="object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
                    <div className="absolute top-4 left-4">
                      <Badge className="bg-blue-500 hover:bg-blue-600 text-white">Featured</Badge>
                    </div>
                    <div className="absolute top-4 right-4">
                      <Badge variant="secondary" className="bg-white/90 text-gray-900">
                        {event.category}
                      </Badge>
                    </div>
                    <div className="absolute bottom-4 left-4 text-white">
                      <div className="text-sm font-medium">{event.isFree ? "Free Event" : `₹${event.ticketPrice}`}</div>
                    </div>
                  </div>
                  <CardHeader className="pb-4">
                    <CardTitle className="text-xl line-clamp-2 group-hover:text-blue-600 transition-colors">
                      {event.title}
                    </CardTitle>
                    <CardDescription className="line-clamp-3 text-base">{event.description}</CardDescription>
                  </CardHeader>
                  <CardContent className="pt-0">
                    <div className="space-y-4">
                      <div className="space-y-2">
                        <div className="flex items-center gap-2 text-sm text-gray-600">
                          <Calendar className="w-4 h-4 text-blue-600" />
                          <span className="font-medium">
                            {new Date(event.date).toLocaleDateString("en-US", {
                              weekday: "long",
                              year: "numeric",
                              month: "long",
                              day: "numeric",
                            })}
                          </span>
                        </div>
                        <div className="flex items-center gap-2 text-sm text-gray-600">
                          <Clock className="w-4 h-4 text-green-600" />
                          <span>
                            {new Date(event.date).toLocaleTimeString("en-US", {
                              hour: "2-digit",
                              minute: "2-digit",
                            })}
                          </span>
                        </div>
                        <div className="flex items-center gap-2 text-sm text-gray-600">
                          <MapPin className="w-4 h-4 text-red-600" />
                          <span className="line-clamp-1">{event.location}</span>
                        </div>
                        <div className="flex items-center gap-2 text-sm text-gray-600">
                          <Users className="w-4 h-4 text-purple-600" />
                          <span>
                            {event.currentAttendees} registered
                            {event.maxAttendees && ` / ${event.maxAttendees} max`}
                            {event.spotsLeft !== null && event.spotsLeft > 0 && (
                              <span className="text-green-600 ml-1">({event.spotsLeft} spots left)</span>
                            )}
                          </span>
                        </div>
                      </div>

                      <Button
                        className="w-full group-hover:bg-blue-700 transition-colors text-lg py-6"
                        disabled={event.isFull}
                      >
                        <Link href={`/events/${event._id}`} className="flex items-center gap-2">
                          {event.isFull ? "Event Full" : "Register Now"}
                          {!event.isFull && <ArrowRight className="w-5 h-5" />}
                        </Link>
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Search and Filter Section */}
      <section id="events" className="py-12 bg-white border-b">
        <div className="container mx-auto px-4">
          <div className="flex flex-col lg:flex-row gap-4 items-center justify-between">
            <div className="flex-1 max-w-md">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <Input
                  placeholder="Search events..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>

            <div className="flex gap-4 items-center">
              <Button variant="outline" onClick={() => setShowFilters(!showFilters)} className="lg:hidden">
                <Filter className="w-4 h-4 mr-2" />
                Filters
              </Button>

              <div className={`flex gap-4 ${showFilters ? "flex" : "hidden lg:flex"}`}>
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

                <Select value={sortBy} onValueChange={setSortBy}>
                  <SelectTrigger className="w-48">
                    <SelectValue placeholder="Sort by" />
                  </SelectTrigger>
                  <SelectContent>
                    {sortOptions.map((option) => (
                      <SelectItem key={option.value} value={option.value}>
                        {option.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Events Grid */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          {events.length === 0 ? (
            <div className="text-center py-20">
              <Calendar className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-2xl font-semibold text-gray-900 mb-2">No events found</h3>
              <p className="text-gray-600 mb-6">Try adjusting your search criteria or browse all events.</p>
              <Button
                onClick={() => {
                  setSearchTerm("")
                  setSelectedCategory("all")
                }}
              >
                Clear Filters
              </Button>
            </div>
          ) : (
            <>
              <div className="flex items-center justify-between mb-8">
                <div>
                  <h2 className="text-3xl font-bold text-gray-900">Upcoming Events</h2>
                  <p className="text-gray-600">
                    Showing {events.length} of {pagination.total} events
                  </p>
                </div>
                <div className="text-sm text-gray-500">
                  Page {pagination.page} of {pagination.pages}
                </div>
              </div>

              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                {events.map((event) => (
                  <Card key={event._id} className="overflow-hidden hover:shadow-xl transition-all duration-300 group">
                    <div className="relative h-48 overflow-hidden">
                      <Image
                        src={event.image || "/placeholder.svg?height=200&width=400"}
                        alt={event.title}
                        fill
                        className="object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent"></div>
                      <div className="absolute top-4 right-4">
                        <Badge variant="secondary" className="bg-white/90 text-gray-900">
                          {event.category}
                        </Badge>
                      </div>
                      <div className="absolute bottom-4 left-4 text-white">
                        <div className="text-sm font-medium">
                          {event.isFree ? "Free Event" : `₹${event.ticketPrice}`}
                        </div>
                      </div>
                      {event.isFull && (
                        <div className="absolute inset-0 bg-black/70 flex items-center justify-center">
                          <Badge className="bg-red-500 text-white text-lg px-4 py-2">Event Full</Badge>
                        </div>
                      )}
                    </div>
                    <CardHeader>
                      <CardTitle className="text-lg line-clamp-2 group-hover:text-blue-600 transition-colors">
                        {event.title}
                      </CardTitle>
                      <CardDescription className="line-clamp-3">{event.description}</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-3">
                        <div className="flex items-center gap-2 text-sm text-gray-600">
                          <Calendar className="w-4 h-4 text-blue-600" />
                          <span className="font-medium">
                            {new Date(event.date).toLocaleDateString("en-US", {
                              month: "short",
                              day: "numeric",
                              year: "numeric",
                            })}
                          </span>
                        </div>
                        <div className="flex items-center gap-2 text-sm text-gray-600">
                          <Clock className="w-4 h-4 text-green-600" />
                          <span>
                            {new Date(event.date).toLocaleTimeString("en-US", {
                              hour: "2-digit",
                              minute: "2-digit",
                            })}
                          </span>
                        </div>
                        <div className="flex items-center gap-2 text-sm text-gray-600">
                          <MapPin className="w-4 h-4 text-red-600" />
                          <span className="line-clamp-1">{event.location}</span>
                        </div>
                        <div className="flex items-center gap-2 text-sm text-gray-600">
                          <Users className="w-4 h-4 text-purple-600" />
                          <span>
                            {event.currentAttendees} registered
                            {event.maxAttendees && ` / ${event.maxAttendees}`}
                          </span>
                        </div>

                        {event.spotsLeft !== null && event.spotsLeft <= 5 && event.spotsLeft > 0 && (
                          <div className="text-sm text-orange-600 font-medium">Only {event.spotsLeft} spots left!</div>
                        )}

                        <Button className="w-full mt-4" disabled={event.isFull} asChild={!event.isFull}>
                          {event.isFull ? "Event Full" : <Link href={`/events/${event._id}`}>Register Now</Link>}
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>

              {/* Pagination */}
              {pagination.pages > 1 && (
                <div className="flex justify-center items-center gap-4 mt-12">
                  <Button
                    variant="outline"
                    onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                    disabled={currentPage === 1}
                  >
                    Previous
                  </Button>

                  <div className="flex gap-2">
                    {Array.from({ length: Math.min(5, pagination.pages) }, (_, i) => {
                      const page = i + 1
                      return (
                        <Button
                          key={page}
                          variant={currentPage === page ? "default" : "outline"}
                          onClick={() => setCurrentPage(page)}
                          className="w-10"
                        >
                          {page}
                        </Button>
                      )
                    })}
                  </div>

                  <Button
                    variant="outline"
                    onClick={() => setCurrentPage(Math.min(pagination.pages, currentPage + 1))}
                    disabled={currentPage === pagination.pages}
                  >
                    Next
                  </Button>
                </div>
              )}
            </>
          )}
        </div>
      </section>

      {/* Call to Action */}
      <section className="py-20 bg-gradient-to-r from-blue-600 to-purple-700 text-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-4xl font-bold mb-6">Want to Organize an Event?</h2>
          <p className="text-xl mb-8 opacity-90 max-w-2xl mx-auto">
            Have an idea for a community event? We'd love to help you bring it to life and make a positive impact
            together.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" className="bg-white text-blue-600 hover:bg-gray-100 font-semibold">
              <Link href="/contact">Propose an Event</Link>
            </Button>
            <Button
              size="lg"
              variant="outline"
              className="border-white text-white hover:bg-white hover:text-blue-600 font-semibold"
            >
              <Link href="/volunteer">Become a Volunteer</Link>
            </Button>
          </div>
        </div>
      </section>
    </div>
  )
}
