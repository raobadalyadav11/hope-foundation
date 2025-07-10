"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Input } from "@/components/ui/input"
import {
  Heart,
  Users,
  Target,
  Calendar,
  ArrowRight,
  Globe,
  Star,
  TrendingUp,
  Award,
  BookOpen,
  Mail,
} from "lucide-react"
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
  progressPercentage: number
  beneficiaries: number
}

interface BlogPost {
  _id: string
  title: string
  excerpt: string
  image: string
  author: { name: string }
  createdAt: string
  readTime: string
}

interface Event {
  _id: string
  title: string
  description: string
  date: string
  location: string
  image: string
  currentAttendees: number
  maxAttendees: number
}

export default function HomePage() {
  const [campaigns, setCampaigns] = useState<Campaign[]>([])
  const [blogs, setBlogs] = useState<BlogPost[]>([])
  const [events, setEvents] = useState<Event[]>([])
  const [stats, setStats] = useState({
    totalDonations: 0,
    totalVolunteers: 0,
    activeCampaigns: 0,
    beneficiaries: 0,
  })
  const [email, setEmail] = useState("")
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchData()
  }, [])

  const fetchData = async () => {
    try {
      const [campaignsRes, blogsRes, eventsRes, statsRes] = await Promise.all([
        fetch("/api/campaigns?featured=true&limit=3"),
        fetch("/api/blogs?featured=true&limit=3"),
        fetch("/api/events?upcoming=true&limit=3"),
        fetch("/api/stats"),
      ])

      const [campaignsData, blogsData, eventsData, statsData] = await Promise.all([
        campaignsRes.json(),
        blogsRes.json(),
        eventsRes.json(),
        statsRes.json(),
      ])

      setCampaigns(campaignsData.campaigns || [])
      setBlogs(blogsData.blogs || [])
      setEvents(eventsData.events || [])
      setStats(statsData || stats)
    } catch (error) {
      console.error("Error fetching data:", error)
    } finally {
      setLoading(false)
    }
  }

  const handleNewsletterSignup = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      const response = await fetch("/api/newsletter/subscribe", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      })

      if (response.ok) {
        setEmail("")
        // Show success message
      }
    } catch (error) {
      console.error("Newsletter signup error:", error)
    }
  }

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
        {/* Animated Background */}
        <div className="absolute inset-0 bg-gradient-to-br from-blue-600 via-purple-700 to-pink-600">
          <div className="absolute inset-0 bg-black/20"></div>
          <div className="absolute inset-0 bg-[url('/grid.svg')] opacity-10"></div>
        </div>

        {/* Floating Elements */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute top-20 left-20 w-32 h-32 bg-white/10 rounded-full blur-xl animate-pulse"></div>
          <div className="absolute top-40 right-32 w-24 h-24 bg-yellow-400/20 rounded-full blur-lg animate-bounce"></div>
          <div className="absolute bottom-32 left-1/4 w-40 h-40 bg-green-400/10 rounded-full blur-2xl animate-pulse delay-1000"></div>
        </div>

        <div className="relative z-10 container mx-auto px-4 text-center text-white">
          <div className="max-w-4xl mx-auto">
            <Badge className="mb-6 bg-white/20 text-white border-white/30 hover:bg-white/30 transition-all duration-300">
              <Star className="w-4 h-4 mr-2" />
              Transforming Lives Since 2020
            </Badge>

            <h1 className="text-5xl md:text-7xl font-bold mb-6 bg-gradient-to-r from-white to-blue-100 bg-clip-text text-transparent leading-tight">
              Building Hope,
              <br />
              <span className="text-yellow-300">Creating Change</span>
            </h1>

            <p className="text-xl md:text-2xl mb-8 text-blue-100 max-w-3xl mx-auto leading-relaxed">
              Join thousands of changemakers in our mission to create lasting impact through education, healthcare, and
              community development across the globe.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
              <Button
                size="lg"
                className="bg-gradient-to-r from-yellow-400 to-orange-500 hover:from-yellow-500 hover:to-orange-600 text-black font-semibold px-8 py-4 rounded-full shadow-2xl hover:shadow-yellow-500/25 transition-all duration-300 transform hover:scale-105"
                asChild
              >
                <Link href="/donate">
                  <Heart className="w-5 h-5 mr-2" />
                  Donate Now
                </Link>
              </Button>

              <Button
                size="lg"
                variant="outline"
                className="border-white/30 text-white hover:bg-white/10 backdrop-blur-sm px-8 py-4 rounded-full transition-all duration-300 bg-transparent"
                asChild
              >
                <Link href="/campaigns">
                  <Target className="w-5 h-5 mr-2" />
                  View Campaigns
                </Link>
              </Button>
            </div>

            {/* Stats Preview */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 max-w-3xl mx-auto">
              {[
                { label: "Lives Impacted", value: stats.beneficiaries.toLocaleString(), icon: Users },
                { label: "Donations", value: `₹${(stats.totalDonations / 100000).toFixed(1)}L`, icon: Heart },
                { label: "Volunteers", value: stats.totalVolunteers.toLocaleString(), icon: Award },
                { label: "Active Campaigns", value: stats.activeCampaigns.toString(), icon: Target },
              ].map((stat, index) => (
                <div
                  key={index}
                  className="text-center p-4 rounded-2xl bg-white/10 backdrop-blur-sm border border-white/20"
                >
                  <stat.icon className="w-8 h-8 mx-auto mb-2 text-yellow-300" />
                  <div className="text-2xl font-bold">{stat.value}</div>
                  <div className="text-sm text-blue-100">{stat.label}</div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Scroll Indicator */}
        <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce">
          <div className="w-6 h-10 border-2 border-white/50 rounded-full flex justify-center">
            <div className="w-1 h-3 bg-white/70 rounded-full mt-2 animate-pulse"></div>
          </div>
        </div>
      </section>

      {/* Featured Campaigns */}
      <section className="py-20 bg-gradient-to-b from-gray-50 to-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <Badge className="mb-4 bg-blue-100 text-blue-700 hover:bg-blue-200">
              <TrendingUp className="w-4 h-4 mr-2" />
              Featured Campaigns
            </Badge>
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
              Make a <span className="text-blue-600">Difference</span> Today
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Support our ongoing campaigns and help us reach our goals to create meaningful change in communities
              worldwide.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {campaigns.map((campaign) => (
              <Card
                key={campaign._id}
                className="group hover:shadow-2xl transition-all duration-500 border-0 shadow-lg overflow-hidden bg-white hover:scale-105"
              >
                <div className="relative overflow-hidden">
                  <Image
                    src={campaign.image || "/placeholder.svg?height=200&width=400"}
                    alt={campaign.title}
                    width={400}
                    height={200}
                    className="w-full h-48 object-cover group-hover:scale-110 transition-transform duration-500"
                  />
                  <div className="absolute top-4 left-4">
                    <Badge className="bg-gradient-to-r from-green-500 to-emerald-600 text-white">
                      {campaign.category}
                    </Badge>
                  </div>
                  <div className="absolute top-4 right-4">
                    <Badge variant="secondary" className="bg-white/90 text-gray-700">
                      {campaign.daysLeft} days left
                    </Badge>
                  </div>
                </div>

                <CardHeader className="pb-4">
                  <CardTitle className="text-xl group-hover:text-blue-600 transition-colors line-clamp-2">
                    {campaign.title}
                  </CardTitle>
                  <CardDescription className="text-gray-600 line-clamp-2">{campaign.description}</CardDescription>
                </CardHeader>

                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="font-semibold text-green-600">₹{campaign.raised.toLocaleString()}</span>
                      <span className="text-gray-500">₹{campaign.goal.toLocaleString()}</span>
                    </div>
                    <Progress value={campaign.progressPercentage} className="h-2" />
                    <div className="flex justify-between text-xs text-gray-500">
                      <span>{campaign.progressPercentage}% funded</span>
                      <span>{campaign.beneficiaries} beneficiaries</span>
                    </div>
                  </div>

                  <Button
                    className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white rounded-full transition-all duration-300"
                    asChild
                  >
                    <Link href={`/campaigns/${campaign._id}`}>
                      Support Campaign
                      <ArrowRight className="w-4 h-4 ml-2" />
                    </Link>
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>

          <div className="text-center mt-12">
            <Button
              size="lg"
              variant="outline"
              className="border-blue-200 text-blue-600 hover:bg-blue-50 rounded-full px-8 bg-transparent"
              asChild
            >
              <Link href="/campaigns">
                View All Campaigns
                <ArrowRight className="w-5 h-5 ml-2" />
              </Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Impact Section */}
      <section className="py-20 bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 relative overflow-hidden">
        <div className="absolute inset-0 bg-black/10"></div>
        <div className="absolute inset-0 bg-[url('/pattern.svg')] opacity-10"></div>

        <div className="relative z-10 container mx-auto px-4 text-white">
          <div className="text-center mb-16">
            <Badge className="mb-4 bg-white/20 text-white border-white/30">
              <Globe className="w-4 h-4 mr-2" />
              Our Impact
            </Badge>
            <h2 className="text-4xl md:text-5xl font-bold mb-6">
              Creating <span className="text-yellow-300">Real Change</span>
            </h2>
            <p className="text-xl text-blue-100 max-w-3xl mx-auto">
              See how your contributions are making a tangible difference in communities around the world.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              {
                icon: Users,
                title: "Lives Transformed",
                value: "50,000+",
                description: "People directly impacted by our programs",
                color: "from-yellow-400 to-orange-500",
              },
              {
                icon: BookOpen,
                title: "Education Access",
                value: "15,000+",
                description: "Children provided with quality education",
                color: "from-green-400 to-emerald-500",
              },
              {
                icon: Heart,
                title: "Healthcare Support",
                value: "25,000+",
                description: "Medical treatments and health checkups",
                color: "from-pink-400 to-rose-500",
              },
              {
                icon: Globe,
                title: "Communities Served",
                value: "200+",
                description: "Villages and urban areas reached",
                color: "from-blue-400 to-cyan-500",
              },
            ].map((item, index) => (
              <Card
                key={index}
                className="bg-white/10 backdrop-blur-sm border-white/20 text-white hover:bg-white/20 transition-all duration-300 hover:scale-105"
              >
                <CardContent className="p-6 text-center">
                  <div
                    className={`w-16 h-16 mx-auto mb-4 rounded-full bg-gradient-to-r ${item.color} flex items-center justify-center`}
                  >
                    <item.icon className="w-8 h-8 text-white" />
                  </div>
                  <h3 className="text-3xl font-bold mb-2">{item.value}</h3>
                  <h4 className="text-lg font-semibold mb-2">{item.title}</h4>
                  <p className="text-blue-100 text-sm">{item.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Upcoming Events */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <Badge className="mb-4 bg-purple-100 text-purple-700 hover:bg-purple-200">
              <Calendar className="w-4 h-4 mr-2" />
              Upcoming Events
            </Badge>
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
              Join Our <span className="text-purple-600">Community</span>
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Participate in our events and connect with like-minded individuals who are passionate about making a
              difference.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {events.map((event) => (
              <Card
                key={event._id}
                className="group hover:shadow-2xl transition-all duration-500 border-0 shadow-lg overflow-hidden bg-white hover:scale-105"
              >
                <div className="relative overflow-hidden">
                  <Image
                    src={event.image || "/placeholder.svg?height=200&width=400"}
                    alt={event.title}
                    width={400}
                    height={200}
                    className="w-full h-48 object-cover group-hover:scale-110 transition-transform duration-500"
                  />
                  <div className="absolute top-4 right-4">
                    <Badge className="bg-gradient-to-r from-purple-500 to-pink-600 text-white">
                      {new Date(event.date).toLocaleDateString()}
                    </Badge>
                  </div>
                </div>

                <CardHeader className="pb-4">
                  <CardTitle className="text-xl group-hover:text-purple-600 transition-colors line-clamp-2">
                    {event.title}
                  </CardTitle>
                  <CardDescription className="text-gray-600 line-clamp-2">{event.description}</CardDescription>
                </CardHeader>

                <CardContent className="space-y-4">
                  <div className="flex items-center text-sm text-gray-500">
                    <Calendar className="w-4 h-4 mr-2" />
                    {new Date(event.date).toLocaleDateString("en-US", {
                      weekday: "long",
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                    })}
                  </div>

                  <div className="flex items-center text-sm text-gray-500">
                    <Users className="w-4 h-4 mr-2" />
                    {event.currentAttendees} / {event.maxAttendees} attendees
                  </div>

                  <Button
                    className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white rounded-full transition-all duration-300"
                    asChild
                  >
                    <Link href={`/events/${event._id}`}>
                      Register Now
                      <ArrowRight className="w-4 h-4 ml-2" />
                    </Link>
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>

          <div className="text-center mt-12">
            <Button
              size="lg"
              variant="outline"
              className="border-purple-200 text-purple-600 hover:bg-purple-50 rounded-full px-8 bg-transparent"
              asChild
            >
              <Link href="/events">
                View All Events
                <ArrowRight className="w-5 h-5 ml-2" />
              </Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Latest Blogs */}
      <section className="py-20 bg-gradient-to-b from-gray-50 to-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <Badge className="mb-4 bg-green-100 text-green-700 hover:bg-green-200">
              <BookOpen className="w-4 h-4 mr-2" />
              Latest Stories
            </Badge>
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
              Stories of <span className="text-green-600">Impact</span>
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Read inspiring stories from the field and stay updated with our latest initiatives and achievements.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {blogs.map((blog) => (
              <Card
                key={blog._id}
                className="group hover:shadow-2xl transition-all duration-500 border-0 shadow-lg overflow-hidden bg-white hover:scale-105"
              >
                <div className="relative overflow-hidden">
                  <Image
                    src={blog.image || "/placeholder.svg?height=200&width=400"}
                    alt={blog.title}
                    width={400}
                    height={200}
                    className="w-full h-48 object-cover group-hover:scale-110 transition-transform duration-500"
                  />
                </div>

                <CardHeader className="pb-4">
                  <CardTitle className="text-xl group-hover:text-green-600 transition-colors line-clamp-2">
                    {blog.title}
                  </CardTitle>
                  <CardDescription className="text-gray-600 line-clamp-3">{blog.excerpt}</CardDescription>
                </CardHeader>

                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between text-sm text-gray-500">
                    <span>By {blog.author.name}</span>
                    <span>{blog.readTime}</span>
                  </div>

                  <Button
                    variant="outline"
                    className="w-full border-green-200 text-green-600 hover:bg-green-50 rounded-full transition-all duration-300 bg-transparent"
                    asChild
                  >
                    <Link href={`/blog/${blog._id}`}>
                      Read More
                      <ArrowRight className="w-4 h-4 ml-2" />
                    </Link>
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>

          <div className="text-center mt-12">
            <Button
              size="lg"
              variant="outline"
              className="border-green-200 text-green-600 hover:bg-green-50 rounded-full px-8 bg-transparent"
              asChild
            >
              <Link href="/blog">
                View All Stories
                <ArrowRight className="w-5 h-5 ml-2" />
              </Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Newsletter Section */}
      <section className="py-20 bg-gradient-to-r from-indigo-600 via-blue-600 to-purple-600 relative overflow-hidden">
        <div className="absolute inset-0 bg-black/10"></div>
        <div className="absolute inset-0 bg-[url('/waves.svg')] opacity-20"></div>

        <div className="relative z-10 container mx-auto px-4 text-center text-white">
          <div className="max-w-3xl mx-auto">
            <Badge className="mb-6 bg-white/20 text-white border-white/30">
              <Mail className="w-4 h-4 mr-2" />
              Stay Connected
            </Badge>

            <h2 className="text-4xl md:text-5xl font-bold mb-6">
              Get <span className="text-yellow-300">Updates</span> & Stories
            </h2>

            <p className="text-xl text-blue-100 mb-8">
              Subscribe to our newsletter and be the first to know about new campaigns, events, and impact stories.
            </p>

            <form onSubmit={handleNewsletterSignup} className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto">
              <Input
                type="email"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="flex-1 bg-white/10 border-white/30 text-white placeholder:text-white/70 rounded-full px-6"
                required
              />
              <Button
                type="submit"
                className="bg-gradient-to-r from-yellow-400 to-orange-500 hover:from-yellow-500 hover:to-orange-600 text-black font-semibold rounded-full px-8"
              >
                Subscribe
              </Button>
            </form>

            <p className="text-sm text-blue-200 mt-4">Join 10,000+ subscribers. Unsubscribe anytime.</p>
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4 text-center">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
              Ready to Make a <span className="text-blue-600">Difference</span>?
            </h2>

            <p className="text-xl text-gray-600 mb-12 max-w-3xl mx-auto">
              Whether you want to donate, volunteer, or start your own campaign, there are many ways to get involved and
              create positive change.
            </p>

            <div className="grid md:grid-cols-3 gap-8 mb-12">
              {[
                {
                  icon: Heart,
                  title: "Donate",
                  description: "Support our causes with a one-time or recurring donation",
                  action: "Start Donating",
                  href: "/donate",
                  color: "from-red-500 to-pink-600",
                },
                {
                  icon: Users,
                  title: "Volunteer",
                  description: "Join our team and contribute your time and skills",
                  action: "Become a Volunteer",
                  href: "/volunteer",
                  color: "from-blue-500 to-indigo-600",
                },
                {
                  icon: Target,
                  title: "Start Campaign",
                  description: "Create your own fundraising campaign for a cause you care about",
                  action: "Create Campaign",
                  href: "/fundraise",
                  color: "from-green-500 to-emerald-600",
                },
              ].map((item, index) => (
                <Card
                  key={index}
                  className="group hover:shadow-2xl transition-all duration-500 border-0 shadow-lg hover:scale-105"
                >
                  <CardContent className="p-8 text-center">
                    <div
                      className={`w-16 h-16 mx-auto mb-6 rounded-full bg-gradient-to-r ${item.color} flex items-center justify-center group-hover:scale-110 transition-transform duration-300`}
                    >
                      <item.icon className="w-8 h-8 text-white" />
                    </div>
                    <h3 className="text-2xl font-bold text-gray-900 mb-4">{item.title}</h3>
                    <p className="text-gray-600 mb-6">{item.description}</p>
                    <Button
                      className={`bg-gradient-to-r ${item.color} hover:scale-105 text-white rounded-full px-6 transition-all duration-300`}
                      asChild
                    >
                      <Link href={item.href}>
                        {item.action}
                        <ArrowRight className="w-4 h-4 ml-2" />
                      </Link>
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
