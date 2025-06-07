"use client"
import { useQuery } from "@tanstack/react-query"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import { Heart, Users, Target, ArrowRight, Globe, Handshake, BookOpen, Calendar, MapPin } from "lucide-react"
import Link from "next/link"
import Image from "next/image"

interface Campaign {
  _id: string
  title: string
  description: string
  goal: number
  raised: number
  image: string
  category: string
  progressPercentage: number
  daysLeft: number
  isExpired: boolean
}

interface Event {
  _id: string
  title: string
  description: string
  date: string
  location: string
  image: string
  category: string
  currentAttendees: number
  maxAttendees?: number
}

interface Stats {
  totalDonations: number
  totalVolunteers: number
  totalCampaigns: number
  totalBeneficiaries: number
  impactMetrics: {
    livesImpacted: number
    projectsCompleted: number
    countriesServed: number
    volunteersActive: number
  }
}

export default function HomePage() {
  const { data: campaigns, isLoading: campaignsLoading } = useQuery({
    queryKey: ["campaigns", "featured"],
    queryFn: async () => {
      const response = await fetch("/api/campaigns?featured=true&limit=3")
      if (!response.ok) throw new Error("Failed to fetch campaigns")
      const data = await response.json()
      return data.campaigns as Campaign[]
    },
  })

  const { data: events, isLoading: eventsLoading } = useQuery({
    queryKey: ["events", "upcoming"],
    queryFn: async () => {
      const response = await fetch("/api/events?upcoming=true&limit=3")
      if (!response.ok) throw new Error("Failed to fetch events")
      const data = await response.json()
      return data.events as Event[]
    },
  })

  const { data: stats, isLoading: statsLoading } = useQuery({
    queryKey: ["stats"],
    queryFn: async () => {
      const response = await fetch("/api/stats")
      if (!response.ok) throw new Error("Failed to fetch stats")
      return response.json() as Promise<Stats>
    },
  })

  const statsDisplay = [
    {
      label: "Lives Impacted",
      value: `${stats?.impactMetrics.livesImpacted?.toLocaleString() || "0"}+`,
      icon: Heart,
      color: "text-red-600",
    },
    {
      label: "Active Volunteers",
      value: `${stats?.impactMetrics.volunteersActive?.toLocaleString() || "0"}+`,
      icon: Users,
      color: "text-blue-600",
    },
    {
      label: "Projects Completed",
      value: `${stats?.impactMetrics.projectsCompleted?.toLocaleString() || "0"}+`,
      icon: Target,
      color: "text-green-600",
    },
    {
      label: "Countries Served",
      value: stats?.impactMetrics.countriesServed?.toString() || "12",
      icon: Globe,
      color: "text-purple-600",
    },
  ]

  if (campaignsLoading || eventsLoading || statsLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-r from-blue-600 to-purple-700 text-white py-20">
        <div className="absolute inset-0 bg-black/20"></div>
        <div className="container mx-auto px-4 relative z-10">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <h1 className="text-5xl font-bold mb-6 leading-tight">Making a Difference, One Life at a Time</h1>
              <p className="text-xl mb-8 opacity-90 leading-relaxed">
                Join us in our mission to create positive change in communities worldwide. Together, we can build a
                better tomorrow for everyone through sustainable development and humanitarian aid.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <Button size="lg" className="bg-white text-blue-600 hover:bg-gray-100 font-semibold">
                  <Link href="/donate" className="flex items-center gap-2">
                    Donate Now <Heart className="w-4 h-4" />
                  </Link>
                </Button>
                <Button
                  size="lg"
                  variant="outline"
                  className="border-white text-white hover:bg-white hover:text-blue-600 font-semibold"
                >
                  <Link href="/volunteer" className="flex items-center gap-2">
                    Volunteer <Users className="w-4 h-4" />
                  </Link>
                </Button>
              </div>
            </div>
            <div className="relative">
              <Image
                src="/placeholder.svg?height=400&width=500"
                alt="NGO Impact"
                width={500}
                height={400}
                className="rounded-lg shadow-2xl"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Our Impact in Numbers</h2>
            <p className="text-xl text-gray-600">See the difference we're making together</p>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {statsDisplay.map((stat, index) => (
              <div key={index} className="text-center">
                <div className="inline-flex items-center justify-center w-16 h-16 bg-white rounded-full mb-4 shadow-lg">
                  <stat.icon className={`w-8 h-8 ${stat.color}`} />
                </div>
                <div className="text-3xl font-bold text-gray-900 mb-2">{stat.value}</div>
                <div className="text-gray-600 font-medium">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Campaigns */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">Featured Campaigns</h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Support our most urgent initiatives that are creating meaningful change in communities worldwide.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {campaigns?.map((campaign) => (
              <Card key={campaign._id} className="overflow-hidden hover:shadow-xl transition-all duration-300 group">
                <div className="relative h-48 overflow-hidden">
                  <Image
                    src={campaign.image || "/placeholder.svg?height=200&width=300"}
                    alt={campaign.title}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  <div className="absolute top-4 left-4">
                    <Badge className="bg-red-500 hover:bg-red-600">Featured</Badge>
                  </div>
                  <div className="absolute top-4 right-4">
                    <Badge variant="secondary">{campaign.category}</Badge>
                  </div>
                </div>
                <CardHeader>
                  <CardTitle className="text-xl line-clamp-2">{campaign.title}</CardTitle>
                  <CardDescription className="line-clamp-3">{campaign.description}</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div>
                      <div className="flex justify-between text-sm mb-2">
                        <span className="font-semibold">₹{campaign.raised.toLocaleString()} raised</span>
                        <span className="text-gray-600">₹{campaign.goal.toLocaleString()} goal</span>
                      </div>
                      <Progress value={campaign.progressPercentage} className="h-3" />
                      <div className="flex justify-between text-xs text-gray-500 mt-1">
                        <span>{campaign.progressPercentage}% funded</span>
                        <span>{campaign.daysLeft} days left</span>
                      </div>
                    </div>
                    <Button className="w-full group-hover:bg-blue-700 transition-colors">
                      <Link href={`/campaigns/${campaign._id}`} className="flex items-center gap-2">
                        Support This Cause <ArrowRight className="w-4 h-4" />
                      </Link>
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          <div className="text-center mt-12">
            <Button variant="outline" size="lg" className="font-semibold">
              <Link href="/campaigns">View All Campaigns</Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Upcoming Events */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">Upcoming Events</h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Join us at our upcoming events and be part of the change you want to see in the world.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {events?.map((event) => (
              <Card key={event._id} className="overflow-hidden hover:shadow-lg transition-shadow">
                <div className="relative h-48">
                  <Image
                    src={event.image || "/placeholder.svg?height=200&width=300"}
                    alt={event.title}
                    fill
                    className="object-cover"
                  />
                  <div className="absolute top-4 right-4">
                    <Badge variant="secondary">{event.category}</Badge>
                  </div>
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
                    </div>
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <MapPin className="w-4 h-4" />
                      <span>{event.location}</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <Users className="w-4 h-4" />
                      <span>
                        {event.currentAttendees} registered
                        {event.maxAttendees && ` / ${event.maxAttendees} max`}
                      </span>
                    </div>
                    <Button className="w-full">
                      <Link href={`/events/${event._id}`}>Learn More</Link>
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          <div className="text-center mt-12">
            <Button variant="outline" size="lg">
              <Link href="/events">View All Events</Link>
            </Button>
          </div>
        </div>
      </section>

      {/* How We Help */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">How We Make an Impact</h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Our comprehensive approach ensures sustainable change in the communities we serve through proven
              methodologies.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center group">
              <div className="inline-flex items-center justify-center w-20 h-20 bg-blue-100 rounded-full mb-6 group-hover:bg-blue-200 transition-colors">
                <Heart className="w-10 h-10 text-blue-600" />
              </div>
              <h3 className="text-2xl font-semibold mb-4">Direct Aid</h3>
              <p className="text-gray-600 leading-relaxed">
                Providing immediate relief and support to those in urgent need through our emergency response programs
                and direct assistance initiatives.
              </p>
            </div>

            <div className="text-center group">
              <div className="inline-flex items-center justify-center w-20 h-20 bg-green-100 rounded-full mb-6 group-hover:bg-green-200 transition-colors">
                <Handshake className="w-10 h-10 text-green-600" />
              </div>
              <h3 className="text-2xl font-semibold mb-4">Community Building</h3>
              <p className="text-gray-600 leading-relaxed">
                Empowering local communities through skill development, infrastructure projects, and sustainable
                programs that create lasting change.
              </p>
            </div>

            <div className="text-center group">
              <div className="inline-flex items-center justify-center w-20 h-20 bg-purple-100 rounded-full mb-6 group-hover:bg-purple-200 transition-colors">
                <BookOpen className="w-10 h-10 text-purple-600" />
              </div>
              <h3 className="text-2xl font-semibold mb-4">Education & Awareness</h3>
              <p className="text-gray-600 leading-relaxed">
                Creating lasting change through education, training, and awareness programs that promote sustainable
                development and social progress.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="py-16 bg-blue-600 text-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-4xl font-bold mb-6">Ready to Make a Difference?</h2>
          <p className="text-xl mb-8 opacity-90 max-w-2xl mx-auto leading-relaxed">
            Join thousands of supporters who are helping us create positive change. Every contribution, big or small,
            makes a meaningful impact in someone's life.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" className="bg-white text-blue-600 hover:bg-gray-100 font-semibold">
              <Link href="/donate">Start Donating</Link>
            </Button>
            <Button
              size="lg"
              variant="outline"
              className="border-white text-white hover:bg-white hover:text-blue-600 font-semibold"
            >
              <Link href="/volunteer">Become a Volunteer</Link>
            </Button>
            <Button
              size="lg"
              variant="outline"
              className="border-white text-white hover:bg-white hover:text-blue-600 font-semibold"
            >
              <Link href="/about">Learn More</Link>
            </Button>
          </div>
        </div>
      </section>
    </div>
  )
}
