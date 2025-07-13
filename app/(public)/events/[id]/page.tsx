"use client"

import { useState } from "react"
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import { useSession } from "next-auth/react"
import { useParams } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { 
  Calendar, 
  MapPin, 
  Users, 
  Clock, 
  ArrowLeft, 
  CheckCircle,
  Phone,
  Mail,
  User
} from "lucide-react"
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
  maxAttendees?: number
  currentAttendees: number
  image: string
  category: string
  tags: string[]
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
  spotsLeft: number | null
  isFull: boolean
  daysUntil: number
  attendees: Array<{
    userId: {
      _id: string
      name: string
    }
    status: string
    registeredAt: string
  }>
}

export default function EventDetailPage() {
  const params = useParams()
  const { data: session } = useSession()
  const queryClient = useQueryClient()
  const [isRegistered, setIsRegistered] = useState(false)

  const { data: event, isLoading } = useQuery({
    queryKey: ["event", params.id],
    queryFn: async (): Promise<Event> => {
      const response = await fetch(`/api/events/${params.id}`)
      if (!response.ok) throw new Error("Failed to fetch event")
      const data = await response.json()
      
      // Check if user is registered
      if (session) {
        const registered = data.attendees?.some(
          (attendee: any) => attendee.userId._id === session.user.id
        )
        setIsRegistered(registered)
      }
      
      return data
    },
  })

  const registerMutation = useMutation({
    mutationFn: async () => {
      const response = await fetch(`/api/events/${params.id}/register`, {
        method: "POST",
      })
      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.error || "Failed to register")
      }
      return response.json()
    },
    onSuccess: () => {
      setIsRegistered(true)
      toast.success("Successfully registered for event!")
      queryClient.invalidateQueries({ queryKey: ["event", params.id] })
    },
    onError: (error: Error) => {
      toast.error(error.message)
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
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-green-600"></div>
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

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        {/* Back Button */}
        <div className="mb-6">
          <Button variant="ghost" asChild>
            <Link href="/events">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Events
            </Link>
          </Button>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2">
            <Card className="overflow-hidden">
              {/* Hero Image */}
              <div className="relative h-96">
                <Image
                  src={event.image || "/event.png?height=400&width=800"}
                  alt={event.title}
                  fill
                  className="object-cover"
                />
                <div className="absolute top-4 left-4">
                  <Badge className="bg-green-600 text-white">{event.category}</Badge>
                </div>
                {event.isFull && (
                  <div className="absolute top-4 right-4">
                    <Badge variant="destructive">Event Full</Badge>
                  </div>
                )}
              </div>

              <div className="p-8">
                <h1 className="text-4xl font-bold text-gray-900 mb-4">{event.title}</h1>
                <p className="text-xl text-gray-600 mb-6">{event.description}</p>

                {/* Tags */}
                <div className="flex flex-wrap gap-2 mb-8">
                  {event.tags.map((tag) => (
                    <Badge key={tag} variant="secondary">
                      {tag}
                    </Badge>
                  ))}
                </div>

                {/* Event Details */}
                <div className="grid md:grid-cols-2 gap-6 mb-8">
                  <div className="flex items-center gap-3">
                    <Calendar className="w-5 h-5 text-green-600" />
                    <div>
                      <p className="font-semibold">Date</p>
                      <p className="text-gray-600">
                        {new Date(event.date).toLocaleDateString()}
                        {event.endDate && ` - ${new Date(event.endDate).toLocaleDateString()}`}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <Clock className="w-5 h-5 text-green-600" />
                    <div>
                      <p className="font-semibold">Time</p>
                      <p className="text-gray-600">
                        {new Date(event.date).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <MapPin className="w-5 h-5 text-green-600" />
                    <div>
                      <p className="font-semibold">Location</p>
                      <p className="text-gray-600">{event.location}</p>
                      <p className="text-sm text-gray-500">{event.address}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <Users className="w-5 h-5 text-green-600" />
                    <div>
                      <p className="font-semibold">Attendees</p>
                      <p className="text-gray-600">
                        {event.currentAttendees} registered
                        {event.maxAttendees && ` / ${event.maxAttendees} max`}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Price */}
                {!event.isFree && event.ticketPrice && (
                  <div className="mb-8">
                    <div className="text-2xl font-bold text-green-600">₹{event.ticketPrice}</div>
                  </div>
                )}
                {event.isFree && (
                  <div className="mb-8">
                    <div className="text-2xl font-bold text-green-600">Free Event</div>
                  </div>
                )}

                {/* Description */}
                <div className="prose max-w-none mb-8">
                  <div dangerouslySetInnerHTML={{ __html: event.longDescription }} />
                </div>

                {/* Requirements */}
                {event.requirements.length > 0 && (
                  <div className="mb-8">
                    <h3 className="text-xl font-semibold mb-4">Requirements</h3>
                    <ul className="list-disc list-inside space-y-2">
                      {event.requirements.map((req, index) => (
                        <li key={index} className="text-gray-600">{req}</li>
                      ))}
                    </ul>
                  </div>
                )}

                {/* Agenda */}
                {event.agenda.length > 0 && (
                  <div className="mb-8">
                    <h3 className="text-xl font-semibold mb-4">Agenda</h3>
                    <div className="space-y-4">
                      {event.agenda.map((item, index) => (
                        <div key={index} className="flex gap-4 p-4 bg-gray-50 rounded-lg">
                          <div className="font-semibold text-green-600 min-w-20">
                            {item.time}
                          </div>
                          <div className="flex-1">
                            <p className="font-medium">{item.activity}</p>
                            {item.speaker && (
                              <p className="text-sm text-gray-600">Speaker: {item.speaker}</p>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Registration Button */}
                <div className="flex gap-4">
                  {isRegistered ? (
                    <div className="flex items-center gap-2 text-green-600">
                      <CheckCircle className="w-5 h-5" />
                      <span className="font-semibold">You're registered!</span>
                    </div>
                  ) : (
                    <Button
                      size="lg"
                      onClick={handleRegister}
                      disabled={event.isFull || registerMutation.isPending}
                      className="px-8"
                    >
                      {registerMutation.isPending ? "Registering..." : 
                       event.isFull ? "Event Full" : "Register Now"}
                    </Button>
                  )}
                </div>
              </div>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Contact Person */}
            <Card>
              <CardHeader>
                <CardTitle>Contact Person</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center gap-3">
                    <User className="w-5 h-5 text-gray-400" />
                    <span className="font-medium">{event.contactPerson.name}</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <Mail className="w-5 h-5 text-gray-400" />
                    <a href={`mailto:${event.contactPerson.email}`} className="text-blue-600 hover:underline">
                      {event.contactPerson.email}
                    </a>
                  </div>
                  <div className="flex items-center gap-3">
                    <Phone className="w-5 h-5 text-gray-400" />
                    <a href={`tel:${event.contactPerson.phone}`} className="text-blue-600 hover:underline">
                      {event.contactPerson.phone}
                    </a>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Event Stats */}
            <Card>
              <CardHeader>
                <CardTitle>Event Stats</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex justify-between">
                    <span>Days Until Event</span>
                    <span className="font-semibold">
                      {event.daysUntil > 0 ? `${event.daysUntil} days` : 
                       event.daysUntil === 0 ? "Today" : "Past Event"}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span>Registered</span>
                    <span className="font-semibold">{event.currentAttendees}</span>
                  </div>
                  {event.spotsLeft !== null && (
                    <div className="flex justify-between">
                      <span>Spots Left</span>
                      <span className="font-semibold">{event.spotsLeft}</span>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}