"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Heart, Users, Calendar, ArrowRight, Play, CheckCircle, Star, Globe, Award } from "lucide-react"
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
  daysLeft: number
  supporters: number
}

interface Event {
  _id: string
  title: string
  description: string
  date: string
  location: string
  image: string
  attendees: number
  maxAttendees: number
}

interface Stats {
  totalDonations: number
  totalVolunteers: number
  totalCampaigns: number
  totalBeneficiaries: number
}

export default function HomePage() {
  const [featuredCampaigns, setFeaturedCampaigns] = useState<Campaign[]>([])
  const [upcomingEvents, setUpcomingEvents] = useState<Event[]>([])
  const [stats, setStats] = useState<Stats>({
    totalDonations: 0,
    totalVolunteers: 0,
    totalCampaigns: 0,
    totalBeneficiaries: 0,
  })
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchHomeData()
  }, [])

  const fetchHomeData = async () => {
    try {
      const [campaignsRes, eventsRes, statsRes] = await Promise.all([
        fetch("/api/campaigns?featured=true&limit=3"),
        fetch("/api/events?upcoming=true&limit=3"),
        fetch("/api/stats"),
      ])

      const [campaignsData, eventsData, statsData] = await Promise.all([
        campaignsRes.json(),
        eventsRes.json(),
        statsRes.json(),
      ])

      setFeaturedCampaigns(campaignsData.campaigns || [])
      setUpcomingEvents(eventsData.events || [])
      setStats(statsData)
    } catch (error) {
      console.error("Error fetching home data:", error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-blue-600 via-blue-700 to-blue-800 text-white">
        <div className="absolute inset-0 bg-black/20"></div>
        <div className="relative container mx-auto px-4 py-24 lg:py-32">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-8">
              <div className="space-y-4">
                <Badge className="bg-white/20 text-white border-white/30">
                  <Heart className="w-4 h-4 mr-2" />
                  Making a Difference Since 2020
                </Badge>
                <h1 className="text-4xl lg:text-6xl font-bold leading-tight">
                  Together We Can
                  <span className="block text-yellow-300">Change Lives</span>
                </h1>
                <p className="text-xl text-blue-100 max-w-lg">
                  Join our mission to create positive change in communities worldwide. Every donation, every volunteer
                  hour, every act of kindness matters.
                </p>
              </div>

              <div className="flex flex-col sm:flex-row gap-4">
                <Button size="lg" className="bg-yellow-500 hover:bg-yellow-600 text-black font-semibold">
                  <Link href="/donate" className="flex items-center">
                    <Heart className="w-5 h-5 mr-2" />
                    Donate Now
                  </Link>
                </Button>
                <Button
                  size="lg"
                  variant="outline"
                  className="border-white text-white hover:bg-white hover:text-blue-600"
                >
                  <Link href="/volunteer" className="flex items-center">
                    <Users className="w-5 h-5 mr-2" />
                    Become a Volunteer
                  </Link>
                </Button>
              </div>

              {/* Quick Stats */}
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 pt-8">
                <div className="text-center">
                  <div className="text-2xl lg:text-3xl font-bold">₹{stats.totalDonations.toLocaleString()}</div>
                  <div className="text-blue-200 text-sm">Raised</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl lg:text-3xl font-bold">{stats.totalVolunteers.toLocaleString()}</div>
                  <div className="text-blue-200 text-sm">Volunteers</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl lg:text-3xl font-bold">{stats.totalCampaigns}</div>
                  <div className="text-blue-200 text-sm">Campaigns</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl lg:text-3xl font-bold">{stats.totalBeneficiaries.toLocaleString()}</div>
                  <div className="text-blue-200 text-sm">Lives Impacted</div>
                </div>
              </div>
            </div>

            <div className="relative">
              <div className="aspect-video bg-white/10 rounded-2xl backdrop-blur-sm border border-white/20 flex items-center justify-center">
                <Button size="lg" className="bg-white/20 hover:bg-white/30 border-white/30">
                  <Play className="w-6 h-6 mr-2" />
                  Watch Our Story
                </Button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Campaigns */}
      <section className="py-16 lg:py-24 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <Badge className="mb-4">Featured Campaigns</Badge>
            <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">Urgent Causes That Need Your Help</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Every donation brings us closer to our goal. Join thousands of supporters making a real difference.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {featuredCampaigns.map((campaign) => (
              <Card key={campaign._id} className="overflow-hidden hover:shadow-xl transition-shadow group">
                <div className="aspect-video bg-gray-200 relative overflow-hidden">
                  <Image
                    src={campaign.image || "/placeholder.svg?height=200&width=400"}
                    alt={campaign.title}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  <Badge className="absolute top-4 left-4 bg-blue-600">{campaign.category}</Badge>
                </div>
                <CardContent className="p-6">
                  <h3 className="text-xl font-semibold mb-2 line-clamp-2">{campaign.title}</h3>
                  <p className="text-gray-600 mb-4 line-clamp-3">{campaign.description}</p>

                  <div className="space-y-3">
                    <div className="flex justify-between text-sm">
                      <span className="font-semibold">₹{campaign.raised.toLocaleString()}</span>
                      <span className="text-gray-500">₹{campaign.goal.toLocaleString()}</span>
                    </div>
                    <Progress value={(campaign.raised / campaign.goal) * 100} className="h-2" />
                    <div className="flex justify-between text-sm text-gray-500">
                      <span>{Math.round((campaign.raised / campaign.goal) * 100)}% funded</span>
                      <span>{campaign.daysLeft} days left</span>
                    </div>
                  </div>

                  <div className="flex items-center justify-between mt-6">
                    <div className="flex items-center text-sm text-gray-500">
                      <Users className="w-4 h-4 mr-1" />
                      {campaign.supporters} supporters
                    </div>
                    <Button asChild>
                      <Link href={`/campaigns/${campaign._id}`}>
                        Donate Now
                        <ArrowRight className="w-4 h-4 ml-2" />
                      </Link>
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          <div className="text-center mt-12">
            <Button asChild size="lg" variant="outline">
              <Link href="/campaigns">
                View All Campaigns
                <ArrowRight className="w-5 h-5 ml-2" />
              </Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Impact Section */}
      <section className="py-16 lg:py-24">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <Badge className="mb-4">Our Impact</Badge>
              <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-6">
                Creating Lasting Change in Communities
              </h2>
              <p className="text-lg text-gray-600 mb-8">
                Through the dedication of our volunteers and the generosity of our donors, we've been able to make a
                significant impact across multiple areas of community development.
              </p>

              <div className="grid grid-cols-2 gap-6">
                <div className="text-center p-6 bg-blue-50 rounded-xl">
                  <Globe className="w-8 h-8 text-blue-600 mx-auto mb-2" />
                  <div className="text-2xl font-bold text-blue-600">50+</div>
                  <div className="text-sm text-gray-600">Communities Served</div>
                </div>
                <div className="text-center p-6 bg-green-50 rounded-xl">
                  <Award className="w-8 h-8 text-green-600 mx-auto mb-2" />
                  <div className="text-2xl font-bold text-green-600">25+</div>
                  <div className="text-sm text-gray-600">Awards Received</div>
                </div>
              </div>
            </div>

            <div className="space-y-6">
              <div className="flex items-start gap-4">
                <div className="bg-blue-100 p-3 rounded-full">
                  <CheckCircle className="w-6 h-6 text-blue-600" />
                </div>
                <div>
                  <h3 className="text-xl font-semibold mb-2">Education for All</h3>
                  <p className="text-gray-600">
                    Providing quality education and learning resources to underprivileged children in rural and urban
                    areas.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="bg-green-100 p-3 rounded-full">
                  <CheckCircle className="w-6 h-6 text-green-600" />
                </div>
                <div>
                  <h3 className="text-xl font-semibold mb-2">Healthcare Access</h3>
                  <p className="text-gray-600">
                    Organizing medical camps and providing healthcare services to communities with limited access to
                    medical facilities.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="bg-purple-100 p-3 rounded-full">
                  <CheckCircle className="w-6 h-6 text-purple-600" />
                </div>
                <div>
                  <h3 className="text-xl font-semibold mb-2">Environmental Conservation</h3>
                  <p className="text-gray-600">
                    Leading initiatives for environmental protection, tree plantation, and sustainable development
                    practices.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Upcoming Events */}
      <section className="py-16 lg:py-24 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <Badge className="mb-4">Upcoming Events</Badge>
            <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">Join Our Community Events</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Participate in our events and connect with like-minded individuals working towards positive change.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {upcomingEvents.map((event) => (
              <Card key={event._id} className="overflow-hidden hover:shadow-xl transition-shadow">
                <div className="aspect-video bg-gray-200 relative">
                  <Image
                    src={event.image || "/placeholder.svg?height=200&width=400"}
                    alt={event.title}
                    fill
                    className="object-cover"
                  />
                </div>
                <CardContent className="p-6">
                  <div className="flex items-center gap-2 mb-3">
                    <Calendar className="w-4 h-4 text-blue-600" />
                    <span className="text-sm text-blue-600 font-medium">
                      {new Date(event.date).toLocaleDateString()}
                    </span>
                  </div>
                  <h3 className="text-xl font-semibold mb-2">{event.title}</h3>
                  <p className="text-gray-600 mb-4 line-clamp-3">{event.description}</p>
                  <div className="flex items-center justify-between">
                    <div className="text-sm text-gray-500">
                      {event.attendees}/{event.maxAttendees} attending
                    </div>
                    <Button asChild size="sm">
                      <Link href={`/events/${event._id}`}>Join Event</Link>
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          <div className="text-center mt-12">
            <Button asChild size="lg" variant="outline">
              <Link href="/events">
                View All Events
                <ArrowRight className="w-5 h-5 ml-2" />
              </Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-16 lg:py-24">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <Badge className="mb-4">Testimonials</Badge>
            <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">What People Say About Us</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <Card className="p-6">
              <div className="flex items-center mb-4">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-5 h-5 text-yellow-400 fill-current" />
                ))}
              </div>
              <p className="text-gray-600 mb-4">
                "Hope Foundation has been instrumental in transforming our community. Their dedication and transparency
                in operations is commendable."
              </p>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-gray-200 rounded-full"></div>
                <div>
                  <div className="font-semibold">Sarah Johnson</div>
                  <div className="text-sm text-gray-500">Community Leader</div>
                </div>
              </div>
            </Card>

            <Card className="p-6">
              <div className="flex items-center mb-4">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-5 h-5 text-yellow-400 fill-current" />
                ))}
              </div>
              <p className="text-gray-600 mb-4">
                "Volunteering with Hope Foundation has been one of the most rewarding experiences of my life. Highly
                recommend!"
              </p>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-gray-200 rounded-full"></div>
                <div>
                  <div className="font-semibold">Michael Chen</div>
                  <div className="text-sm text-gray-500">Volunteer</div>
                </div>
              </div>
            </Card>

            <Card className="p-6">
              <div className="flex items-center mb-4">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-5 h-5 text-yellow-400 fill-current" />
                ))}
              </div>
              <p className="text-gray-600 mb-4">
                "The impact they create is visible and measurable. I'm proud to be a regular donor to their causes."
              </p>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-gray-200 rounded-full"></div>
                <div>
                  <div className="font-semibold">Emily Rodriguez</div>
                  <div className="text-sm text-gray-500">Donor</div>
                </div>
              </div>
            </Card>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 lg:py-24 bg-blue-600 text-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl lg:text-4xl font-bold mb-4">Ready to Make a Difference?</h2>
          <p className="text-xl text-blue-100 mb-8 max-w-2xl mx-auto">
            Join our community of changemakers and help us create a better world for everyone.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" className="bg-white text-blue-600 hover:bg-gray-100">
              <Link href="/donate">Start Donating</Link>
            </Button>
            <Button size="lg" variant="outline" className="border-white text-white hover:bg-white hover:text-blue-600">
              <Link href="/volunteer">Become a Volunteer</Link>
            </Button>
          </div>
        </div>
      </section>
    </div>
  )
}
