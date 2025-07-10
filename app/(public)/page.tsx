"use client"

import { useQuery } from "@tanstack/react-query"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import { Heart, Users, Target, ArrowRight, Globe, Handshake, BookOpen, Calendar, MapPin, Star } from "lucide-react"
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
  const { data: campaigns, isLoading: campaignsLoading } = useQuery({
    queryKey: ["campaigns", "featured"],
    queryFn: async () => {
      const response = await fetch("/api/campaigns?featured=true&limit=3&status=active")
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

  const { data: blogs, isLoading: blogsLoading } = useQuery({
    queryKey: ["blogs", "recent"],
    queryFn: async () => {
      const response = await fetch("/api/blogs?status=published&limit=3")
      if (!response.ok) throw new Error("Failed to fetch blogs")
      const data = await response.json()
      return data.blogs as BlogPost[]
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
      value: `${stats?.impactMetrics.livesImpacted?.toLocaleString() || "50,000"}+`,
      icon: Heart,
      color: "text-red-600",
      bgColor: "bg-red-100",
    },
    {
      label: "Active Volunteers",
      value: `${stats?.impactMetrics.volunteersActive?.toLocaleString() || "2,500"}+`,
      icon: Users,
      color: "text-blue-600",
      bgColor: "bg-blue-100",
    },
    {
      label: "Projects Completed",
      value: `${stats?.impactMetrics.projectsCompleted?.toLocaleString() || "150"}+`,
      icon: Target,
      color: "text-green-600",
      bgColor: "bg-green-100",
    },
    {
      label: "Countries Served",
      value: stats?.impactMetrics.countriesServed?.toString() || "12",
      icon: Globe,
      color: "text-purple-600",
      bgColor: "bg-purple-100",
    },
  ]

  const testimonials = [
    {
      name: "Sarah Johnson",
      role: "Volunteer",
      content: "Being part of Hope Foundation has been life-changing. The impact we make together is incredible.",
      image: "/placeholder.svg?height=60&width=60",
      rating: 5,
    },
    {
      name: "Michael Chen",
      role: "Donor",
      content: "I love how transparent they are with donations. I can see exactly how my money is being used.",
      image: "/placeholder.svg?height=60&width=60",
      rating: 5,
    },
    {
      name: "Dr. Priya Sharma",
      role: "Beneficiary",
      content: "The education program changed my community. Now our children have access to quality education.",
      image: "/placeholder.svg?height=60&width=60",
      rating: 5,
    },
  ]

  if (campaignsLoading || eventsLoading || statsLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading amazing content...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-blue-600 via-purple-700 to-blue-800 text-white py-20 overflow-hidden">
        <div className="absolute inset-0 bg-black/30"></div>
        <div className="absolute inset-0 bg-[url('/placeholder.svg?height=800&width=1200')] bg-cover bg-center opacity-20"></div>
        <div className="container mx-auto px-4 relative z-10">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-8">
              <div className="space-y-4">
                <Badge className="bg-white/20 text-white border-white/30 hover:bg-white/30">
                  🌟 Making a Difference Since 2010
                </Badge>
                <h1 className="text-5xl lg:text-6xl font-bold leading-tight">
                  Creating Hope,
                  <span className="text-yellow-300"> Changing Lives</span>
                </h1>
                <p className="text-xl lg:text-2xl opacity-90 leading-relaxed max-w-2xl">
                  Join us in our mission to create positive change in communities worldwide. Together, we can build a
                  better tomorrow through sustainable development and humanitarian aid.
                </p>
              </div>

              <div className="flex flex-col sm:flex-row gap-4">
                <Button size="lg" className="bg-white text-blue-600 hover:bg-gray-100 font-semibold text-lg px-8 py-4">
                  <Link href="/donate" className="flex items-center gap-2">
                    Donate Now <Heart className="w-5 h-5" />
                  </Link>
                </Button>
                <Button
                  size="lg"
                  variant="outline"
                  className="border-white text-white hover:bg-white hover:text-blue-600 font-semibold text-lg px-8 py-4"
                >
                  <Link href="/volunteer" className="flex items-center gap-2">
                    Volunteer <Users className="w-5 h-5" />
                  </Link>
                </Button>
              </div>

              <div className="flex items-center gap-8 pt-4">
                <div className="text-center">
                  <div className="text-2xl font-bold">₹{(stats?.totalDonations || 5000000).toLocaleString()}</div>
                  <div className="text-sm opacity-80">Raised This Year</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold">{(stats?.totalVolunteers || 2500).toLocaleString()}</div>
                  <div className="text-sm opacity-80">Active Volunteers</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold">{(stats?.totalCampaigns || 45).toLocaleString()}</div>
                  <div className="text-sm opacity-80">Active Campaigns</div>
                </div>
              </div>
            </div>

            <div className="relative">
              <div className="relative z-10">
                <Image
                  src="/placeholder.svg?height=500&width=600"
                  alt="NGO Impact"
                  width={600}
                  height={500}
                  className="rounded-2xl shadow-2xl"
                />
                <div className="absolute -bottom-6 -left-6 bg-white text-gray-900 p-4 rounded-xl shadow-lg">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                      <Heart className="w-6 h-6 text-green-600" />
                    </div>
                    <div>
                      <div className="font-bold text-lg">50,000+</div>
                      <div className="text-sm text-gray-600">Lives Impacted</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-20 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">Our Impact in Numbers</h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              See the tangible difference we're making together in communities around the world
            </p>
          </div>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
            {statsDisplay.map((stat, index) => (
              <div key={index} className="text-center group">
                <div
                  className={`inline-flex items-center justify-center w-20 h-20 ${stat.bgColor} rounded-full mb-6 group-hover:scale-110 transition-transform duration-300 shadow-lg`}
                >
                  <stat.icon className={`w-10 h-10 ${stat.color}`} />
                </div>
                <div className="text-4xl font-bold text-gray-900 mb-2">{stat.value}</div>
                <div className="text-gray-600 font-medium text-lg">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Campaigns */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">Featured Campaigns</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Support our most urgent initiatives that are creating meaningful change in communities worldwide. Every
              contribution brings us closer to our goals.
            </p>
          </div>

          <div className="grid lg:grid-cols-3 gap-8">
            {campaigns?.map((campaign) => (
              <Card
                key={campaign._id}
                className="overflow-hidden hover:shadow-2xl transition-all duration-300 group border-0 shadow-lg"
              >
                <div className="relative h-64 overflow-hidden">
                  <Image
                    src={campaign.image || "/placeholder.svg?height=250&width=400"}
                    alt={campaign.title}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
                  <div className="absolute top-4 left-4">
                    <Badge className="bg-red-500 hover:bg-red-600 text-white">Featured</Badge>
                  </div>
                  <div className="absolute top-4 right-4">
                    <Badge variant="secondary" className="bg-white/90 text-gray-900">
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
                      <Progress value={campaign.progressPercentage} className="h-3" />
                      <div className="flex justify-between text-xs text-gray-500 mt-2">
                        <span className="font-medium">{campaign.progressPercentage}% funded</span>
                        <span>{((campaign.goal - campaign.raised) / 1000).toFixed(0)}k needed</span>
                      </div>
                    </div>

                    <Button className="w-full group-hover:bg-blue-700 transition-colors text-lg py-6">
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
            <Button variant="outline" size="lg" className="font-semibold text-lg px-8 py-4">
              <Link href="/campaigns">View All Campaigns</Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Upcoming Events */}
      <section className="py-20 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">Upcoming Events</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Join us at our upcoming events and be part of the change you want to see in the world. Connect with
              like-minded individuals and make a real impact.
            </p>
          </div>

          <div className="grid lg:grid-cols-3 gap-8">
            {events?.map((event) => (
              <Card key={event._id} className="overflow-hidden hover:shadow-xl transition-all duration-300 group">
                <div className="relative h-48">
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
                    <div className="text-sm font-medium">{event.isFree ? "Free Event" : `₹${event.ticketPrice}`}</div>
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
                    <Button className="w-full mt-4">
                      <Link href={`/events/${event._id}`}>Learn More & Register</Link>
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          <div className="text-center mt-12">
            <Button variant="outline" size="lg" className="font-semibold text-lg px-8 py-4">
              <Link href="/events">View All Events</Link>
            </Button>
          </div>
        </div>
      </section>

      {/* How We Help */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">How We Make an Impact</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Our comprehensive approach ensures sustainable change in the communities we serve through proven
              methodologies and dedicated partnerships.
            </p>
          </div>

          <div className="grid lg:grid-cols-3 gap-12">
            <div className="text-center group">
              <div className="inline-flex items-center justify-center w-24 h-24 bg-gradient-to-br from-red-100 to-red-200 rounded-full mb-8 group-hover:scale-110 transition-transform duration-300 shadow-lg">
                <Heart className="w-12 h-12 text-red-600" />
              </div>
              <h3 className="text-2xl font-semibold mb-4">Direct Aid & Relief</h3>
              <p className="text-gray-600 leading-relaxed text-lg">
                Providing immediate relief and support to those in urgent need through our emergency response programs
                and direct assistance initiatives. We ensure help reaches those who need it most.
              </p>
              <div className="mt-6">
                <Badge variant="outline" className="text-red-600 border-red-200">
                  Emergency Response
                </Badge>
              </div>
            </div>

            <div className="text-center group">
              <div className="inline-flex items-center justify-center w-24 h-24 bg-gradient-to-br from-green-100 to-green-200 rounded-full mb-8 group-hover:scale-110 transition-transform duration-300 shadow-lg">
                <Handshake className="w-12 h-12 text-green-600" />
              </div>
              <h3 className="text-2xl font-semibold mb-4">Community Building</h3>
              <p className="text-gray-600 leading-relaxed text-lg">
                Empowering local communities through skill development, infrastructure projects, and sustainable
                programs that create lasting change and self-sufficiency.
              </p>
              <div className="mt-6">
                <Badge variant="outline" className="text-green-600 border-green-200">
                  Sustainable Development
                </Badge>
              </div>
            </div>

            <div className="text-center group">
              <div className="inline-flex items-center justify-center w-24 h-24 bg-gradient-to-br from-purple-100 to-purple-200 rounded-full mb-8 group-hover:scale-110 transition-transform duration-300 shadow-lg">
                <BookOpen className="w-12 h-12 text-purple-600" />
              </div>
              <h3 className="text-2xl font-semibold mb-4">Education & Awareness</h3>
              <p className="text-gray-600 leading-relaxed text-lg">
                Creating lasting change through education, training, and awareness programs that promote sustainable
                development and social progress for future generations.
              </p>
              <div className="mt-6">
                <Badge variant="outline" className="text-purple-600 border-purple-200">
                  Knowledge Transfer
                </Badge>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Recent Blog Posts */}
      {blogs && blogs.length > 0 && (
        <section className="py-20 bg-gray-50">
          <div className="container mx-auto px-4">
            <div className="text-center mb-16">
              <h2 className="text-4xl font-bold text-gray-900 mb-4">Latest Stories</h2>
              <p className="text-xl text-gray-600 max-w-2xl mx-auto">
                Read inspiring stories from the field and stay updated with our latest initiatives and impact.
              </p>
            </div>

            <div className="grid lg:grid-cols-3 gap-8">
              {blogs.map((blog) => (
                <Card key={blog._id} className="overflow-hidden hover:shadow-xl transition-all duration-300 group">
                  <div className="relative h-48">
                    <Image
                      src={blog.image || "/placeholder.svg?height=200&width=400"}
                      alt={blog.title}
                      fill
                      className="object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                    <div className="absolute top-4 right-4">
                      <Badge variant="secondary" className="bg-white/90 text-gray-900">
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
                    <div className="flex items-center justify-between text-sm text-gray-500">
                      <div className="flex items-center gap-2">
                        <Image
                          src={blog.author.image || "/placeholder.svg?height=24&width=24"}
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
                    <Button variant="ghost" className="w-full mt-4 group-hover:bg-blue-50" asChild>
                      <Link href={`/blog/${blog._id}`}>Read More</Link>
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>

            <div className="text-center mt-12">
              <Button variant="outline" size="lg" className="font-semibold text-lg px-8 py-4">
                <Link href="/blog">Read All Stories</Link>
              </Button>
            </div>
          </div>
        </section>
      )}

      {/* Testimonials */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">What People Say</h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Hear from the people whose lives have been touched by our work and community.
            </p>
          </div>

          <div className="grid lg:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <Card key={index} className="p-6 hover:shadow-lg transition-shadow">
                <CardContent className="pt-0">
                  <div className="flex items-center gap-1 mb-4">
                    {[...Array(testimonial.rating)].map((_, i) => (
                      <Star key={i} className="w-5 h-5 fill-yellow-400 text-yellow-400" />
                    ))}
                  </div>
                  <p className="text-gray-600 mb-6 italic text-lg leading-relaxed">"{testimonial.content}"</p>
                  <div className="flex items-center gap-3">
                    <Image
                      src={testimonial.image || "/placeholder.svg"}
                      alt={testimonial.name}
                      width={48}
                      height={48}
                      className="rounded-full"
                    />
                    <div>
                      <div className="font-semibold">{testimonial.name}</div>
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
      <section className="py-20 bg-gradient-to-r from-blue-600 to-purple-700 text-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-4xl lg:text-5xl font-bold mb-6">Ready to Make a Difference?</h2>
          <p className="text-xl lg:text-2xl mb-12 opacity-90 max-w-3xl mx-auto leading-relaxed">
            Join thousands of supporters who are helping us create positive change. Every contribution, big or small,
            makes a meaningful impact in someone's life. Start your journey with us today.
          </p>
          <div className="flex flex-col sm:flex-row gap-6 justify-center">
            <Button size="lg" className="bg-white text-blue-600 hover:bg-gray-100 font-semibold text-lg px-8 py-4">
              <Link href="/donate" className="flex items-center gap-2">
                Start Donating <Heart className="w-5 h-5" />
              </Link>
            </Button>
            <Button
              size="lg"
              variant="outline"
              className="border-white text-white hover:bg-white hover:text-blue-600 font-semibold text-lg px-8 py-4"
            >
              <Link href="/volunteer" className="flex items-center gap-2">
                Become a Volunteer <Users className="w-5 h-5" />
              </Link>
            </Button>
            <Button
              size="lg"
              variant="outline"
              className="border-white text-white hover:bg-white hover:text-blue-600 font-semibold text-lg px-8 py-4"
            >
              <Link href="/about" className="flex items-center gap-2">
                Learn More <ArrowRight className="w-5 h-5" />
              </Link>
            </Button>
          </div>
        </div>
      </section>
    </div>
  )
}
