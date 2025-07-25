"use client"

import { useQuery } from "@tanstack/react-query"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import {
  Heart,
  Users,
  Target,
  ArrowRight,
  Globe,
  Handshake,
  BookOpen,
  Calendar,
  MapPin,
  Star,
  CheckCircle,
  Play,
  TrendingUp,
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
  progressPercentage: number
  daysLeft: number
  isExpired: boolean
  location: string
  beneficiaries: number
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
  isFree: boolean
  ticketPrice?: number
}

interface BlogPost {
  _id: string
  title: string
  excerpt: string
  image: string
  author: {
    name: string
    image: string
  }
  publishedAt: string
  readTime: number
  category: string
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
  const { data: campaignsData, isLoading: campaignsLoading } = useQuery({
    queryKey: ["campaigns", "featured"],
    queryFn: async () => {
      const response = await fetch("/api/campaigns?featured=true&limit=3&status=active")
      if (!response.ok) throw new Error("Failed to fetch featured campaigns")
      return response.json()
    },
  })
  
  const campaigns = campaignsData?.campaigns || []

  const { data: eventsData, isLoading: eventsLoading } = useQuery({
    queryKey: ["events", "upcoming"],
    queryFn: async () => {
      const params = new URLSearchParams({
        upcoming: "true",
        limit: "3"
      })
      const response = await fetch(`/api/events?${params}`)
      if (!response.ok) throw new Error("Failed to fetch upcoming events")
      return response.json()
    },
  })
  
  const events = eventsData?.events || []

  const { data: blogsData, isLoading: blogsLoading } = useQuery({
    queryKey: ["blogs", "recent"],
    queryFn: async () => {
      const params = new URLSearchParams({
        status: "published",
        limit: "3",
        sort: "publishedAt",
        order: "desc"
      })
      const response = await fetch(`/api/blogs?${params}`)
      if (!response.ok) throw new Error("Failed to fetch recent blogs")
      return response.json()
    },
  })
  
  const blogs = blogsData?.blogs?.map((blog: any) => ({
    ...blog,
    image: blog.featuredImage,
    author: {
      name: blog.authorName,
      image: blog.authorId?.profileImage || "/placeholder-user.jpg"
    },
    readTime: blog.readTime || "5 min read"
  })) || []

  const { data: stats, isLoading: statsLoading } = useQuery({
    queryKey: ["stats"],
    queryFn: async () => {
      try {
        const response = await fetch("/api/stats")
        if (response.ok) {
          return await response.json()
        }
      } catch (error) {
        console.error("Error fetching stats:", error)
      }
      
      // Fallback stats if API fails
      return {
        totalDonations: 5000000,
        totalVolunteers: 2500,
        totalCampaigns: 45,
        totalBeneficiaries: 50000,
        impactMetrics: {
          livesImpacted: 50000,
          projectsCompleted: 150,
          countriesServed: 12,
          volunteersActive: 2500,
        },
      } as Stats
    },
  })

  const statsDisplay = [
    {
      label: "Lives Impacted",
      value: `${stats?.impactMetrics.livesImpacted?.toLocaleString() || "50,000"}+`,
      icon: Heart,
      color: "text-rose-600",
      bgColor: "bg-rose-50",
      borderColor: "border-rose-200",
      gradient: "from-rose-500 to-pink-500",
    },
    {
      label: "Active Volunteers",
      value: `${stats?.impactMetrics.volunteersActive?.toLocaleString() || "2,500"}+`,
      icon: Users,
      color: "text-blue-600",
      bgColor: "bg-blue-50",
      borderColor: "border-blue-200",
      gradient: "from-blue-500 to-cyan-500",
    },
    {
      label: "Projects Completed",
      value: `${stats?.impactMetrics.projectsCompleted?.toLocaleString() || "150"}+`,
      icon: Target,
      color: "text-green-600",
      bgColor: "bg-green-50",
      borderColor: "border-green-200",
      gradient: "from-green-500 to-emerald-500",
    },
    {
      label: "Countries Served",
      value: stats?.impactMetrics.countriesServed?.toString() || "12",
      icon: Globe,
      color: "text-purple-600",
      bgColor: "bg-purple-50",
      borderColor: "border-purple-200",
      gradient: "from-purple-500 to-violet-500",
    },
  ]

  const testimonials = [
    {
      name: "Sarah Johnson",
      role: "Volunteer Coordinator",
      content:
        "Being part of Hope Foundation has been life-changing. The impact we make together is incredible and inspiring.",
      image: "/event.png?height=60&width=60",
      rating: 5,
    },
    {
      name: "Michael Chen",
      role: "Monthly Donor",
      content:
        "I love how transparent they are with donations. I can see exactly how my money is being used to help communities.",
      image: "/event.png?height=60&width=60",
      rating: 5,
    },
    {
      name: "Dr. Priya Sharma",
      role: "Community Leader",
      content:
        "The education program changed my community. Now our children have access to quality education and a brighter future.",
      image: "/event.png?height=60&width=60",
      rating: 5,
    },
  ]

  if (campaignsLoading || eventsLoading || statsLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100">
        <div className="text-center space-y-6">
          <div className="relative">
            <div className="animate-spin rounded-full h-20 w-20 border-4 border-blue-200 border-t-blue-600 mx-auto"></div>
            <div className="absolute inset-0 rounded-full bg-gradient-to-r from-blue-400 to-purple-500 opacity-20 animate-pulse"></div>
          </div>
          <div className="space-y-2">
            <p className="text-gray-700 text-xl font-semibold">Loading amazing content...</p>
            <p className="text-gray-500">Preparing inspiring stories for you</p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-blue-600 via-blue-700 to-indigo-800 text-white overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-blue-600/90 to-indigo-700/90"></div>
        <div className="absolute inset-0 bg-[url('/event.png?height=800&width=1200')] bg-cover bg-center opacity-10"></div>

        {/* Floating Elements */}
        <div className="absolute top-20 left-10 w-20 h-20 bg-white/10 rounded-full animate-bounce delay-1000"></div>
        <div className="absolute top-40 right-20 w-16 h-16 bg-yellow-300/20 rounded-full animate-pulse"></div>
        <div className="absolute bottom-20 left-1/4 w-12 h-12 bg-green-400/20 rounded-full animate-bounce delay-500"></div>

        <div className="relative container mx-auto px-4 py-24 lg:py-32">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-8">
              <div className="space-y-6">
                <Badge className="bg-white/20 text-white border-white/30 hover:bg-white/30 text-sm px-6 py-3 rounded-full backdrop-blur-sm">
                  🌟 Making a Difference Since 2010
                </Badge>
                <h1 className="text-5xl lg:text-7xl font-bold leading-tight">
                  Creating Hope,
                  <span className="text-transparent bg-clip-text bg-gradient-to-r from-yellow-300 to-orange-400 block">
                    Changing Lives
                  </span>
                </h1>
                <p className="text-xl lg:text-2xl opacity-90 leading-relaxed max-w-2xl">
                  Join us in our mission to create positive change in communities worldwide. Together, we can build a
                  better tomorrow through sustainable development and humanitarian aid.
                </p>
              </div>

              <div className="flex flex-col sm:flex-row gap-4">
                <Button
                  size="lg"
                  className="bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white font-semibold text-lg px-8 py-6 h-auto rounded-full shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300"
                >
                  <Link href="/donate" className="flex items-center gap-2">
                    <Heart className="w-5 h-5" />
                    Donate Now
                  </Link>
                </Button>
                <Button
                  size="lg"
                  variant="outline"
                  className="border-2 border-white text-white hover:bg-white hover:text-blue-600 font-semibold text-lg px-8 py-6 h-auto rounded-full bg-transparent backdrop-blur-sm hover:shadow-lg transform hover:scale-105 transition-all duration-300"
                >
                  <Link href="/volunteer" className="flex items-center gap-2">
                    <Users className="w-5 h-5" />
                    Volunteer
                  </Link>
                </Button>
              </div>

              <div className="grid grid-cols-3 gap-6 pt-8">
                <div className="text-center p-4 bg-white/10 rounded-2xl backdrop-blur-sm">
                  <div className="text-3xl font-bold">₹{(stats?.totalDonations || 5000000).toLocaleString()}</div>
                  <div className="text-sm opacity-80">Raised This Year</div>
                </div>
                <div className="text-center p-4 bg-white/10 rounded-2xl backdrop-blur-sm">
                  <div className="text-3xl font-bold">{(stats?.totalVolunteers || 2500).toLocaleString()}</div>
                  <div className="text-sm opacity-80">Active Volunteers</div>
                </div>
                <div className="text-center p-4 bg-white/10 rounded-2xl backdrop-blur-sm">
                  <div className="text-3xl font-bold">{(stats?.totalCampaigns || 45).toLocaleString()}</div>
                  <div className="text-sm opacity-80">Active Campaigns</div>
                </div>
              </div>
            </div>

            <div className="relative">
              <div className="relative z-10">
                <div className="relative overflow-hidden rounded-3xl">
                  <Image
                    src="/event.png?height=500&width=600"
                    alt="NGO Impact"
                    width={600}
                    height={500}
                    className="w-full h-auto"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-blue-900/50 to-transparent"></div>
                </div>

                {/* Floating Stats Card */}
                <div className="absolute -bottom-8 -left-8 bg-white text-gray-900 p-6 rounded-2xl shadow-2xl max-w-xs">
                  <div className="flex items-center gap-4">
                    <div className="w-14 h-14 bg-gradient-to-r from-green-400 to-emerald-500 rounded-full flex items-center justify-center">
                      <CheckCircle className="w-7 h-7 text-white" />
                    </div>
                    <div>
                      <div className="font-bold text-3xl text-gray-900">50,000+</div>
                      <div className="text-sm text-gray-600">Lives Impacted</div>
                    </div>
                  </div>
                </div>

                {/* Play Button Overlay */}
                <div className="absolute inset-0 flex items-center justify-center">
                  <Button className="w-20 h-20 rounded-full bg-white/20 hover:bg-white/30 backdrop-blur-sm border-2 border-white/50">
                    <Play className="w-8 h-8 text-white ml-1" />
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-20 bg-gradient-to-r from-gray-50 to-blue-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <Badge className="bg-blue-100 text-blue-800 px-4 py-2 rounded-full mb-4">📊 Our Impact</Badge>
            <h2 className="text-4xl font-bold text-gray-900 mb-4">Our Impact in Numbers</h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              See the tangible difference we're making together in communities around the world
            </p>
          </div>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
            {statsDisplay.map((stat, index) => (
              <Card
                key={index}
                className={`text-center group hover:shadow-2xl transition-all duration-500 ${stat.bgColor} ${stat.borderColor} border-2 hover:scale-105 transform`}
              >
                <CardContent className="pt-8 pb-6">
                  <div
                    className={`inline-flex items-center justify-center w-20 h-20 rounded-full mb-6 group-hover:scale-110 transition-transform duration-300 bg-gradient-to-r ${stat.gradient} shadow-lg`}
                  >
                    <stat.icon className="w-10 h-10 text-white" />
                  </div>
                  <div className="text-4xl font-bold text-gray-900 mb-2">{stat.value}</div>
                  <div className="text-gray-600 font-medium text-lg">{stat.label}</div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Campaigns */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <Badge className="bg-orange-100 text-orange-800 px-4 py-2 rounded-full mb-4">🎯 Featured Campaigns</Badge>
            <h2 className="text-4xl font-bold text-gray-900 mb-4">Support Our Campaigns</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Support our most urgent initiatives that are creating meaningful change in communities worldwide. Every
              contribution brings us closer to our goals.
            </p>
          </div>

          <div className="grid lg:grid-cols-3 gap-8">
            {campaigns?.map((campaign, index) => (
              <Card
                key={campaign._id}
                className="overflow-hidden hover:shadow-2xl transition-all duration-500 group border-0 shadow-lg hover:scale-105 transform"
              >
                <div className="relative h-64 overflow-hidden">
                  <Image
                    src={campaign.image || "/event.png?height=250&width=400"}
                    alt={campaign.title}
                    fill
                    className="object-cover group-hover:scale-110 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-gray-900/60 to-transparent"></div>
                  <div className="absolute top-4 left-4">
                    <Badge className="bg-gradient-to-r from-red-500 to-pink-500 text-white border-0 shadow-lg">
                      Featured
                    </Badge>
                  </div>
                  <div className="absolute top-4 right-4">
                    <Badge variant="secondary" className="bg-white/95 text-gray-900 shadow-lg">
                      {campaign.category}
                    </Badge>
                  </div>
                  <div className="absolute bottom-4 left-4 text-white">
                    <div className="flex items-center gap-2 text-sm">
                      <MapPin className="w-4 h-4" />
                      <span>{campaign.location}</span>
                    </div>
                  </div>
                </div>
                <CardHeader className="pb-4">
                  <CardTitle className="text-xl line-clamp-2 group-hover:text-blue-600 transition-colors">
                    {campaign.title}
                  </CardTitle>
                  <CardDescription className="line-clamp-3 text-base">{campaign.description}</CardDescription>
                </CardHeader>
                <CardContent className="pt-0">
                  <div className="space-y-4">
                    <div className="flex items-center justify-between text-sm text-gray-600">
                      <span className="flex items-center gap-1">
                        <Users className="w-4 h-4" />
                        {campaign.beneficiaries} beneficiaries
                      </span>
                      <span className="flex items-center gap-1">
                        <Calendar className="w-4 h-4" />
                        {campaign.daysLeft} days left
                      </span>
                    </div>

                    <div>
                      <div className="flex justify-between text-sm mb-2">
                        <span className="font-semibold text-gray-900">₹{campaign.raised.toLocaleString()} raised</span>
                        <span className="text-gray-600">₹{campaign.goal.toLocaleString()} goal</span>
                      </div>
                      <Progress value={campaign.progressPercentage} className="h-3 bg-gray-200" />
                      <div className="flex justify-between text-xs text-gray-500 mt-2">
                        <span className="font-medium">{campaign.progressPercentage}% funded</span>
                        <span>{((campaign.goal - campaign.raised) / 1000).toFixed(0)}k needed</span>
                      </div>
                    </div>

                    <Button className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white text-lg py-6 h-auto rounded-xl shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300">
                      <Link href={`/campaigns/${campaign._id}`} className="flex items-center gap-2">
                        Support This Cause <ArrowRight className="w-5 h-5" />
                      </Link>
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          <div className="text-center mt-12">
            <Button
              variant="outline"
              size="lg"
              className="font-semibold text-lg px-8 py-4 h-auto rounded-full border-2 hover:shadow-lg transform hover:scale-105 transition-all duration-300 bg-transparent"
            >
              <Link href="/campaigns">View All Campaigns</Link>
            </Button>
          </div>
        </div>
      </section>

      {/* How We Help */}
      <section className="py-20 bg-gradient-to-br from-blue-50 to-indigo-100">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <Badge className="bg-green-100 text-green-800 px-4 py-2 rounded-full mb-4">🤝 Our Approach</Badge>
            <h2 className="text-4xl font-bold text-gray-900 mb-4">How We Make an Impact</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Our comprehensive approach ensures sustainable change in the communities we serve through proven
              methodologies and dedicated partnerships.
            </p>
          </div>

          <div className="grid lg:grid-cols-3 gap-12">
            <Card className="text-center group hover:shadow-2xl transition-all duration-500 border-0 bg-white hover:scale-105 transform">
              <CardContent className="pt-8">
                <div className="inline-flex items-center justify-center w-24 h-24 bg-gradient-to-br from-red-400 to-pink-500 rounded-full mb-8 group-hover:scale-110 transition-transform duration-300 shadow-xl">
                  <Heart className="w-12 h-12 text-white" />
                </div>
                <h3 className="text-2xl font-semibold mb-4 text-gray-900">Direct Aid & Relief</h3>
                <p className="text-gray-600 leading-relaxed text-lg mb-6">
                  Providing immediate relief and support to those in urgent need through our emergency response programs
                  and direct assistance initiatives.
                </p>
                <Badge variant="outline" className="text-red-600 border-red-200 bg-red-50">
                  Emergency Response
                </Badge>
              </CardContent>
            </Card>

            <Card className="text-center group hover:shadow-2xl transition-all duration-500 border-0 bg-white hover:scale-105 transform">
              <CardContent className="pt-8">
                <div className="inline-flex items-center justify-center w-24 h-24 bg-gradient-to-br from-green-400 to-emerald-500 rounded-full mb-8 group-hover:scale-110 transition-transform duration-300 shadow-xl">
                  <Handshake className="w-12 h-12 text-white" />
                </div>
                <h3 className="text-2xl font-semibold mb-4 text-gray-900">Community Building</h3>
                <p className="text-gray-600 leading-relaxed text-lg mb-6">
                  Empowering local communities through skill development, infrastructure projects, and sustainable
                  programs that create lasting change.
                </p>
                <Badge variant="outline" className="text-green-600 border-green-200 bg-green-50">
                  Sustainable Development
                </Badge>
              </CardContent>
            </Card>

            <Card className="text-center group hover:shadow-2xl transition-all duration-500 border-0 bg-white hover:scale-105 transform">
              <CardContent className="pt-8">
                <div className="inline-flex items-center justify-center w-24 h-24 bg-gradient-to-br from-purple-400 to-violet-500 rounded-full mb-8 group-hover:scale-110 transition-transform duration-300 shadow-xl">
                  <BookOpen className="w-12 h-12 text-white" />
                </div>
                <h3 className="text-2xl font-semibold mb-4 text-gray-900">Education & Awareness</h3>
                <p className="text-gray-600 leading-relaxed text-lg mb-6">
                  Creating lasting change through education, training, and awareness programs that promote sustainable
                  development and social progress.
                </p>
                <Badge variant="outline" className="text-purple-600 border-purple-200 bg-purple-50">
                  Knowledge Transfer
                </Badge>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Upcoming Events */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <Badge className="bg-purple-100 text-purple-800 px-4 py-2 rounded-full mb-4">📅 Upcoming Events</Badge>
            <h2 className="text-4xl font-bold text-gray-900 mb-4">Join Our Events</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Join us at our upcoming events and be part of the change you want to see in the world. Connect with
              like-minded individuals and make a real impact.
            </p>
          </div>

          <div className="grid lg:grid-cols-3 gap-8">
            {events?.map((event) => (
              <Card
                key={event._id}
                className="overflow-hidden hover:shadow-2xl transition-all duration-500 group hover:scale-105 transform"
              >
                <div className="relative h-48">
                  <Image
                    src={event.image || "/event.png?height=200&width=400"}
                    alt={event.title}
                    fill
                    className="object-cover group-hover:scale-110 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-gray-900/50 to-transparent"></div>
                  <div className="absolute top-4 right-4">
                    <Badge variant="secondary" className="bg-white/95 text-gray-900 shadow-lg">
                      {event.category}
                    </Badge>
                  </div>
                  <div className="absolute bottom-4 left-4 text-white">
                    <div className="text-sm font-medium bg-white/20 backdrop-blur-sm px-3 py-1 rounded-full">
                      {event.isFree ? "Free Event" : `₹${event.ticketPrice}`}
                    </div>
                  </div>
                </div>
                <CardHeader>
                  <CardTitle className="text-xl line-clamp-2 group-hover:text-blue-600 transition-colors">
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
                          weekday: "long",
                          year: "numeric",
                          month: "long",
                          day: "numeric",
                        })}
                      </span>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <MapPin className="w-4 h-4 text-green-600" />
                      <span>{event.location}</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <Users className="w-4 h-4 text-purple-600" />
                      <span>
                        {event.currentAttendees} registered
                        {event.maxAttendees && ` / ${event.maxAttendees} max`}
                      </span>
                    </div>
                    <Button className="w-full mt-4 h-auto py-3 bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 rounded-xl shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300">
                      <Link href={`/events/${event._id}`}>Learn More & Register</Link>
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          <div className="text-center mt-12">
            <Button
              variant="outline"
              size="lg"
              className="font-semibold text-lg px-8 py-4 h-auto rounded-full border-2 hover:shadow-lg transform hover:scale-105 transition-all duration-300 bg-transparent"
            >
              <Link href="/events">View All Events</Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Recent Blog Posts */}
      {blogs && blogs.length > 0 && (
        <section className="py-20 bg-gradient-to-br from-gray-50 to-blue-50">
          <div className="container mx-auto px-4">
            <div className="text-center mb-16">
              <Badge className="bg-yellow-100 text-yellow-800 px-4 py-2 rounded-full mb-4">📖 Latest Stories</Badge>
              <h2 className="text-4xl font-bold text-gray-900 mb-4">Inspiring Stories</h2>
              <p className="text-xl text-gray-600 max-w-2xl mx-auto">
                Read inspiring stories from the field and stay updated with our latest initiatives and impact.
              </p>
            </div>

            <div className="grid lg:grid-cols-3 gap-8">
              {blogs.map((blog) => (
                <Card
                  key={blog._id}
                  className="overflow-hidden hover:shadow-2xl transition-all duration-500 group hover:scale-105 transform"
                >
                  <div className="relative h-48">
                    <Image
                      src={blog.image || "/event.png?height=200&width=400"}
                      alt={blog.title}
                      fill
                      className="object-cover group-hover:scale-110 transition-transform duration-500"
                    />
                    <div className="absolute top-4 right-4">
                      <Badge variant="secondary" className="bg-white/95 text-gray-900 shadow-lg">
                        {blog.category}
                      </Badge>
                    </div>
                  </div>
                  <CardHeader>
                    <CardTitle className="text-xl line-clamp-2 group-hover:text-blue-600 transition-colors">
                      {blog.title}
                    </CardTitle>
                    <CardDescription className="line-clamp-3">{blog.excerpt}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-center justify-between text-sm text-gray-500 mb-4">
                      <div className="flex items-center gap-2">
                        <Image
                          src={blog.author.image || "/event.png?height=24&width=24"}
                          alt={blog.author.name}
                          width={24}
                          height={24}
                          className="rounded-full"
                        />
                        <span>{blog.author.name}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span>{blog.readTime} min read</span>
                        <span>•</span>
                        <span>{new Date(blog.publishedAt).toLocaleDateString()}</span>
                      </div>
                    </div>
                    <Button
                      variant="ghost"
                      className="w-full group-hover:bg-blue-50 h-auto py-3 rounded-xl hover:shadow-lg transform hover:scale-105 transition-all duration-300"
                      asChild
                    >
                      <Link href={`/blog/${blog.slug}`}>Read More</Link>
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>

            <div className="text-center mt-12">
              <Button
                variant="outline"
                size="lg"
                className="font-semibold text-lg px-8 py-4 h-auto rounded-full border-2 hover:shadow-lg transform hover:scale-105 transition-all duration-300 bg-transparent"
              >
                <Link href="/blog">Read All Stories</Link>
              </Button>
            </div>
          </div>
        </section>
      )}

      {/* Testimonials */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <Badge className="bg-indigo-100 text-indigo-800 px-4 py-2 rounded-full mb-4">💬 Testimonials</Badge>
            <h2 className="text-4xl font-bold text-gray-900 mb-4">What People Say</h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Hear from the people whose lives have been touched by our work and community.
            </p>
          </div>

          <div className="grid lg:grid-cols-3 gap-8 bg-white">
            {testimonials.map((testimonial, index) => (
              <Card key={index} className="p-6 hover:shadow-2xl transition-all duration-500 hover:scale-105 transform">
                <CardContent className="pt-0">
                  <div className="flex items-center gap-1 mb-4">
                    {[...Array(testimonial.rating)].map((_, i) => (
                      <Star key={i} className="w-5 h-5 fill-yellow-400 text-yellow-400" />
                    ))}
                  </div>
                  <p className=" mb-6 italic text-lg leading-relaxed">"{testimonial.content}"</p>
                  <div className="flex items-center gap-3">
                    <Image
                      src={testimonial.image || "/event.png"}
                      alt={testimonial.name}
                      width={48}
                      height={48}
                      className="rounded-full"
                    />
                    <div>
                      <div className="font-semibold text-gray-900">{testimonial.name}</div>
                      <div className="text-sm text-gray-500">{testimonial.role}</div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="py-20 bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-700 text-white relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-blue-600/90 to-purple-700/90"></div>
        <div className="absolute top-10 left-10 w-32 h-32 bg-white/10 rounded-full animate-pulse"></div>
        <div className="absolute bottom-10 right-10 w-24 h-24 bg-yellow-300/20 rounded-full animate-bounce"></div>

        <div className="container mx-auto px-4 text-center relative z-10">
          <Badge className="bg-white/20 text-white px-4 py-2 rounded-full mb-6 backdrop-blur-sm">
            🚀 Join Our Mission
          </Badge>
          <h2 className="text-4xl lg:text-6xl font-bold mb-6">Ready to Make a Difference?</h2>
          <p className="text-xl lg:text-2xl mb-12 opacity-90 max-w-3xl mx-auto leading-relaxed">
            Join thousands of supporters who are helping us create positive change. Every contribution, big or small,
            makes a meaningful impact in someone's life. Start your journey with us today.
          </p>
          <div className="flex flex-col sm:flex-row gap-6 justify-center">
            <Button
              size="lg"
              className="bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white font-semibold text-lg px-8 py-6 h-auto rounded-full shadow-xl hover:shadow-2xl transform hover:scale-110 transition-all duration-300"
            >
              <Link href="/donate" className="flex items-center gap-2">
                <Heart className="w-5 h-5" />
                Start Donating
              </Link>
            </Button>
            <Button
              size="lg"
              variant="outline"
              className="border-2 border-white text-white hover:bg-white hover:text-blue-600 font-semibold text-lg px-8 py-6 h-auto rounded-full bg-transparent backdrop-blur-sm shadow-xl hover:shadow-2xl transform hover:scale-110 transition-all duration-300"
            >
              <Link href="/volunteer" className="flex items-center gap-2">
                <Users className="w-5 h-5" />
                Become a Volunteer
              </Link>
            </Button>
            <Button
              size="lg"
              variant="outline"
              className="border-2 border-white text-white hover:bg-white hover:text-blue-600 font-semibold text-lg px-8 py-6 h-auto rounded-full bg-transparent backdrop-blur-sm shadow-xl hover:shadow-2xl transform hover:scale-110 transition-all duration-300"
            >
              <Link href="/about" className="flex items-center gap-2">
                <TrendingUp className="w-5 h-5" />
                Learn More
              </Link>
            </Button>
          </div>
        </div>
      </section>
    </div>
  )
}
