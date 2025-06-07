"use client"

import { useState } from "react"
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import { useSession } from "next-auth/react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { Calendar, MapPin, Users, Clock, Phone, Mail, User, CheckCircle } from "lucide-react"
import Image from "next/image"
import Link from "next/link"
import { toast } from "sonner"

interface Event {
  _id: string
  title: string
  description: string
  longDescription: string
  date: string
  endDate?: string
  location: string
  address: string
  image: string
  gallery: string[]
  category: string
  currentAttendees: number
  maxAttendees?: number
  isFree: boolean
  ticketPrice?: number
  requirements: string[]
  agenda: Array<{
    time: string
    activity: string
    speaker?: string
  }>
  contactPerson: {
    name: string
    email: string
    phone: string
  }
  attendees: Array<{
    userId: string
    status: string
  }>
  spotsLeft: number | null
  isFull: boolean
  daysUntil: number
}

export default function EventDetailsPage({ params }: { params: { id: string } }) {
  const { data: session } = useSession()
  const queryClient = useQueryClient()
  const [isRegistering, setIsRegistering] = useState(false)

  const { data: event, isLoading } = useQuery({
    queryKey: ["event", params.id],
    queryFn: async () => {
      const response = await fetch(`/api/events/${params.id}`)
      if (!response.ok) throw new Error("Failed to fetch event")
      return response.json() as Promise<Event>
    },
  })

  const registerMutation = useMutation({
    mutationFn: async () => {
      const response = await fetch(`/api/events/${params.id}/register`, {
        method: "POST",
      })
      if (!response.ok) throw new Error("Failed to register")
      return response.json()
    },
    onSuccess: () => {
      toast.success("Successfully registered for the event!")
      queryClient.invalidateQueries({ queryKey: ["event", params.id] })
    },
    onError: (error: any) => {
      toast.error(error.message || "Failed to register")
    },
  })

  const handleRegister = () => {
    if (!session) {
      toast.error("Please login to register for events")
      return
    }
    registerMutation.mutate()
  }

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
      </div>
    )
  }

  if (!event) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Event Not Found</h1>
          <Button asChild>
            <Link href="/events">Back to Events</Link>
          </Button>
        </div>
      </div>
    )
  }

  const isRegistered = event.attendees.some(
    (attendee) => attendee.userId === session?.user?.id && attendee.status === "registered",
  )

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative h-96 overflow-hidden">
        <Image
          src={event.image || "/placeholder.svg?height=400&width=800"}
          alt={event.title}
          fill
          className="object-cover"
        />
        <div className="absolute inset-0 bg-black/50"></div>
        <div className="absolute inset-0 flex items-center">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl">
              <div className="flex items-center gap-4 mb-4">
                <Badge className="bg-green-500">{event.category}</Badge>
                {event.isFree && <Badge variant="secondary">Free Event</Badge>}
                {event.isFull && <Badge variant="destructive">Event Full</Badge>}
              </div>
              <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">{event.title}</h1>
              <p className="text-xl text-white/90 mb-6">{event.description}</p>
              <div className="flex flex-wrap gap-6 text-white/80">
                <div className="flex items-center gap-2">
                  <Calendar className="w-5 h-5" />
                  <span>{new Date(event.date).toLocaleDateString()}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Clock className="w-5 h-5" />
                  <span>{new Date(event.date).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}</span>
                </div>
                <div className="flex items-center gap-2">
                  <MapPin className="w-5 h-5" />
                  <span>{event.location}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Users className="w-5 h-5" />
                  <span>
                    {event.currentAttendees} registered
                    {event.maxAttendees && ` / ${event.maxAttendees}`}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <div className="container mx-auto px-4 py-12">
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-8">
            {/* Description */}
            <Card>
              <CardHeader>
                <CardTitle>About This Event</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="prose max-w-none">
                  <p className="text-gray-700 leading-relaxed whitespace-pre-line">{event.longDescription}</p>
                </div>
              </CardContent>
            </Card>

            {/* Agenda */}
            {event.agenda && event.agenda.length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle>Event Agenda</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {event.agenda.map((item, index) => (
                      <div key={index} className="flex gap-4">
                        <div className="flex-shrink-0 w-20 text-sm font-medium text-gray-600">{item.time}</div>
                        <div className="flex-1">
                          <h4 className="font-medium">{item.activity}</h4>
                          {item.speaker && <p className="text-sm text-gray-600">Speaker: {item.speaker}</p>}
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Requirements */}
            {event.requirements && event.requirements.length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle>Requirements</CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2">
                    {event.requirements.map((requirement, index) => (
                      <li key={index} className="flex items-start gap-2">
                        <CheckCircle className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
                        <span className="text-sm">{requirement}</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            )}

            {/* Gallery */}
            {event.gallery && event.gallery.length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle>Event Gallery</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                    {event.gallery.map((image, index) => (
                      <div key={index} className="relative h-32 rounded-lg overflow-hidden">
                        <Image
                          src={image || "/placeholder.svg"}
                          alt={`Gallery ${index + 1}`}
                          fill
                          className="object-cover"
                        />
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Registration Card */}
            <Card>
              <CardHeader>
                <CardTitle>Event Registration</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="text-center">
                  {!event.isFree && event.ticketPrice && (
                    <div className="text-3xl font-bold text-green-600 mb-2">₹{event.ticketPrice}</div>
                  )}
                  {event.isFree && <div className="text-3xl font-bold text-green-600 mb-2">Free</div>}
                  <p className="text-sm text-gray-600">
                    {event.spotsLeft !== null ? `${event.spotsLeft} spots remaining` : "Unlimited spots"}
                  </p>
                </div>

                <Separator />

                <div className="space-y-3 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Date:</span>
                    <span className="font-medium">{new Date(event.date).toLocaleDateString()}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Time:</span>
                    <span className="font-medium">
                      {new Date(event.date).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Location:</span>
                    <span className="font-medium">{event.location}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Registered:</span>
                    <span className="font-medium">
                      {event.currentAttendees}
                      {event.maxAttendees && ` / ${event.maxAttendees}`}
                    </span>
                  </div>
                </div>

                <Separator />

                {isRegistered ? (
                  <div className="text-center">
                    <div className="flex items-center justify-center gap-2 text-green-600 mb-2">
                      <CheckCircle className="w-5 h-5" />
                      <span className="font-medium">You're registered!</span>
                    </div>
                    <p className="text-sm text-gray-600">We'll send you event updates via email.</p>
                  </div>
                ) : (
                  <Button
                    className="w-full"
                    onClick={handleRegister}
                    disabled={event.isFull || registerMutation.isPending}
                  >
                    {registerMutation.isPending
                      ? "Registering..."
                      : event.isFull
                        ? "Event Full"
                        : session
                          ? "Register Now"
                          : "Login to Register"}
                  </Button>
                )}

                {!session && (
                  <p className="text-xs text-center text-gray-500">
                    <Link href="/login" className="text-blue-600 hover:underline">
                      Login
                    </Link>{" "}
                    or{" "}
                    <Link href="/signup" className="text-blue-600 hover:underline">
                      sign up
                    </Link>{" "}
                    to register for this event
                  </p>
                )}
              </CardContent>
            </Card>

            {/* Contact Information */}
            <Card>
              <CardHeader>
                <CardTitle>Contact Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center gap-3">
                  <User className="w-5 h-5 text-gray-400" />
                  <div>
                    <p className="font-medium">{event.contactPerson.name}</p>
                    <p className="text-sm text-gray-600">Event Coordinator</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <Mail className="w-5 h-5 text-gray-400" />
                  <a href={`mailto:${event.contactPerson.email}`} className="text-blue-600 hover:underline text-sm">
                    {event.contactPerson.email}
                  </a>
                </div>
                <div className="flex items-center gap-3">
                  <Phone className="w-5 h-5 text-gray-400" />
                  <a href={`tel:${event.contactPerson.phone}`} className="text-blue-600 hover:underline text-sm">
                    {event.contactPerson.phone}
                  </a>
                </div>
              </CardContent>
            </Card>

            {/* Location */}
            <Card>
              <CardHeader>
                <CardTitle>Event Location</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <p className="font-medium">{event.location}</p>
                  <p className="text-sm text-gray-600">{event.address}</p>
                  <div className="bg-gray-100 rounded-lg h-32 flex items-center justify-center mt-4">
                    <div className="text-center text-gray-500">
                      <MapPin className="w-8 h-8 mx-auto mb-2" />
                      <p className="text-sm">Map integration would go here</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
