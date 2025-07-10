"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import {
  Heart,
  Users,
  Target,
  Globe,
  Award,
  BookOpen,
  Zap,
  Shield,
  TrendingUp,
  CheckCircle,
  ArrowRight,
  Star,
  Calendar,
  MapPin,
} from "lucide-react"
import Link from "next/link"
import Image from "next/image"

export default function AboutPage() {
  const teamMembers = [
    {
      name: "Sarah Johnson",
      role: "Founder & CEO",
      image: "/placeholder.svg?height=300&width=300",
      bio: "Passionate about creating sustainable change in underserved communities.",
      experience: "15+ years in nonprofit leadership",
    },
    {
      name: "Dr. Michael Chen",
      role: "Director of Programs",
      image: "/placeholder.svg?height=300&width=300",
      bio: "Leading our healthcare and education initiatives with evidence-based approaches.",
      experience: "PhD in Public Health",
    },
    {
      name: "Priya Sharma",
      role: "Community Outreach Manager",
      image: "/placeholder.svg?height=300&width=300",
      bio: "Building bridges between communities and creating lasting partnerships.",
      experience: "10+ years in community development",
    },
    {
      name: "James Wilson",
      role: "Technology Director",
      image: "/placeholder.svg?height=300&width=300",
      bio: "Leveraging technology to amplify our impact and reach more people.",
      experience: "Former tech executive",
    },
  ]

  const milestones = [
    {
      year: "2020",
      title: "Foundation Established",
      description: "Started with a vision to create meaningful change in education and healthcare.",
      icon: Star,
    },
    {
      year: "2021",
      title: "First 1000 Lives Impacted",
      description: "Reached our first major milestone by providing education to 1000 children.",
      icon: Users,
    },
    {
      year: "2022",
      title: "Healthcare Initiative Launch",
      description: "Expanded our mission to include comprehensive healthcare programs.",
      icon: Heart,
    },
    {
      year: "2023",
      title: "International Expansion",
      description: "Extended our reach to serve communities across multiple countries.",
      icon: Globe,
    },
    {
      year: "2024",
      title: "50,000 Lives Transformed",
      description: "Achieved our goal of positively impacting 50,000 lives worldwide.",
      icon: Award,
    },
  ]

  const values = [
    {
      icon: Heart,
      title: "Compassion",
      description:
        "We approach every situation with empathy and understanding, putting people first in everything we do.",
      color: "from-red-500 to-pink-600",
    },
    {
      icon: Shield,
      title: "Transparency",
      description:
        "We maintain complete transparency in our operations, ensuring donors know exactly how their contributions are used.",
      color: "from-blue-500 to-indigo-600",
    },
    {
      icon: TrendingUp,
      title: "Impact",
      description: "We focus on creating measurable, sustainable impact that creates lasting change in communities.",
      color: "from-green-500 to-emerald-600",
    },
    {
      icon: Users,
      title: "Collaboration",
      description:
        "We believe in the power of partnership and work closely with communities, volunteers, and other organizations.",
      color: "from-purple-500 to-violet-600",
    },
    {
      icon: Zap,
      title: "Innovation",
      description: "We embrace innovative approaches and technologies to maximize our effectiveness and reach.",
      color: "from-yellow-500 to-orange-600",
    },
    {
      icon: CheckCircle,
      title: "Accountability",
      description: "We hold ourselves accountable to the highest standards and continuously measure our progress.",
      color: "from-teal-500 to-cyan-600",
    },
  ]

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative py-20 bg-gradient-to-br from-blue-600 via-purple-700 to-pink-600 overflow-hidden">
        <div className="absolute inset-0 bg-black/20"></div>
        <div className="absolute inset-0 bg-[url('/grid.svg')] opacity-10"></div>

        {/* Floating Elements */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute top-20 left-20 w-32 h-32 bg-white/10 rounded-full blur-xl animate-pulse"></div>
          <div className="absolute bottom-32 right-32 w-40 h-40 bg-yellow-400/20 rounded-full blur-2xl animate-pulse delay-1000"></div>
        </div>

        <div className="relative z-10 container mx-auto px-4 text-center text-white">
          <Badge className="mb-6 bg-white/20 text-white border-white/30">
            <BookOpen className="w-4 h-4 mr-2" />
            Our Story
          </Badge>

          <h1 className="text-5xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-white to-blue-100 bg-clip-text text-transparent">
            About Hope Foundation
          </h1>

          <p className="text-xl md:text-2xl text-blue-100 max-w-4xl mx-auto leading-relaxed">
            We are a global nonprofit organization dedicated to creating lasting change through education, healthcare,
            and community development. Since 2020, we've been working tirelessly to build a better world for everyone.
          </p>
        </div>
      </section>

      {/* Mission & Vision */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <div>
              <Badge className="mb-6 bg-blue-100 text-blue-700">
                <Target className="w-4 h-4 mr-2" />
                Our Purpose
              </Badge>

              <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-8">
                Our <span className="text-blue-600">Mission</span> & Vision
              </h2>

              <div className="space-y-8">
                <div className="p-6 rounded-2xl bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-100">
                  <h3 className="text-2xl font-bold text-gray-900 mb-4 flex items-center">
                    <Target className="w-6 h-6 mr-3 text-blue-600" />
                    Mission
                  </h3>
                  <p className="text-gray-700 text-lg leading-relaxed">
                    To empower underserved communities worldwide by providing access to quality education, healthcare,
                    and sustainable development opportunities that create lasting positive change.
                  </p>
                </div>

                <div className="p-6 rounded-2xl bg-gradient-to-r from-purple-50 to-pink-50 border border-purple-100">
                  <h3 className="text-2xl font-bold text-gray-900 mb-4 flex items-center">
                    <Globe className="w-6 h-6 mr-3 text-purple-600" />
                    Vision
                  </h3>
                  <p className="text-gray-700 text-lg leading-relaxed">
                    A world where every person has equal access to opportunities for growth, health, and prosperity,
                    regardless of their background or circumstances.
                  </p>
                </div>
              </div>
            </div>

            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-r from-blue-400 to-purple-600 rounded-3xl transform rotate-3"></div>
              <Image
                src="/placeholder.svg?height=500&width=600"
                alt="Our mission in action"
                width={600}
                height={500}
                className="relative z-10 rounded-3xl shadow-2xl"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Our Values */}
      <section className="py-20 bg-gradient-to-b from-gray-50 to-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <Badge className="mb-6 bg-green-100 text-green-700">
              <Heart className="w-4 h-4 mr-2" />
              Our Values
            </Badge>

            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
              What <span className="text-green-600">Drives</span> Us
            </h2>

            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Our core values guide every decision we make and every action we take in our mission to create positive
              change.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {values.map((value, index) => (
              <Card
                key={index}
                className="group hover:shadow-2xl transition-all duration-500 border-0 shadow-lg hover:scale-105 bg-white"
              >
                <CardContent className="p-8 text-center">
                  <div
                    className={`w-16 h-16 mx-auto mb-6 rounded-full bg-gradient-to-r ${value.color} flex items-center justify-center group-hover:scale-110 transition-transform duration-300`}
                  >
                    <value.icon className="w-8 h-8 text-white" />
                  </div>
                  <h3 className="text-2xl font-bold text-gray-900 mb-4">{value.title}</h3>
                  <p className="text-gray-600 leading-relaxed">{value.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Our Journey */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <Badge className="mb-6 bg-purple-100 text-purple-700">
              <Calendar className="w-4 h-4 mr-2" />
              Our Journey
            </Badge>

            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
              Key <span className="text-purple-600">Milestones</span>
            </h2>

            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              From our humble beginnings to becoming a global force for change, here are the key moments that shaped our
              journey.
            </p>
          </div>

          <div className="relative">
            {/* Timeline Line */}
            <div className="absolute left-1/2 transform -translate-x-1/2 w-1 h-full bg-gradient-to-b from-purple-400 to-pink-600 rounded-full"></div>

            <div className="space-y-16">
              {milestones.map((milestone, index) => (
                <div key={index} className={`flex items-center ${index % 2 === 0 ? "flex-row" : "flex-row-reverse"}`}>
                  <div className={`w-1/2 ${index % 2 === 0 ? "pr-8 text-right" : "pl-8 text-left"}`}>
                    <Card className="hover:shadow-2xl transition-all duration-500 border-0 shadow-lg hover:scale-105">
                      <CardContent className="p-6">
                        <Badge className="mb-4 bg-gradient-to-r from-purple-500 to-pink-600 text-white">
                          {milestone.year}
                        </Badge>
                        <h3 className="text-2xl font-bold text-gray-900 mb-3">{milestone.title}</h3>
                        <p className="text-gray-600">{milestone.description}</p>
                      </CardContent>
                    </Card>
                  </div>

                  {/* Timeline Node */}
                  <div className="relative z-10 w-16 h-16 bg-gradient-to-r from-purple-500 to-pink-600 rounded-full flex items-center justify-center shadow-lg">
                    <milestone.icon className="w-8 h-8 text-white" />
                  </div>

                  <div className="w-1/2"></div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Team Section */}
      <section className="py-20 bg-gradient-to-b from-gray-50 to-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <Badge className="mb-6 bg-blue-100 text-blue-700">
              <Users className="w-4 h-4 mr-2" />
              Our Team
            </Badge>

            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
              Meet Our <span className="text-blue-600">Leaders</span>
            </h2>

            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Our dedicated team of professionals brings together diverse expertise and a shared passion for creating
              positive change.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {teamMembers.map((member, index) => (
              <Card
                key={index}
                className="group hover:shadow-2xl transition-all duration-500 border-0 shadow-lg hover:scale-105 bg-white overflow-hidden"
              >
                <div className="relative overflow-hidden">
                  <Image
                    src={member.image || "/placeholder.svg"}
                    alt={member.name}
                    width={300}
                    height={300}
                    className="w-full h-64 object-cover group-hover:scale-110 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                </div>

                <CardContent className="p-6 text-center">
                  <h3 className="text-xl font-bold text-gray-900 mb-2">{member.name}</h3>
                  <p className="text-blue-600 font-semibold mb-3">{member.role}</p>
                  <p className="text-gray-600 text-sm mb-3">{member.bio}</p>
                  <Badge variant="outline" className="text-xs">
                    {member.experience}
                  </Badge>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Impact Stats */}
      <section className="py-20 bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 relative overflow-hidden">
        <div className="absolute inset-0 bg-black/10"></div>
        <div className="absolute inset-0 bg-[url('/pattern.svg')] opacity-10"></div>

        <div className="relative z-10 container mx-auto px-4 text-white">
          <div className="text-center mb-16">
            <Badge className="mb-6 bg-white/20 text-white border-white/30">
              <TrendingUp className="w-4 h-4 mr-2" />
              Our Impact
            </Badge>

            <h2 className="text-4xl md:text-5xl font-bold mb-6">
              Making a <span className="text-yellow-300">Real Difference</span>
            </h2>

            <p className="text-xl text-blue-100 max-w-3xl mx-auto">
              Numbers that showcase the tangible impact we've made in communities worldwide.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              { number: "50,000+", label: "Lives Impacted", icon: Users },
              { number: "₹2.5Cr+", label: "Funds Raised", icon: Heart },
              { number: "200+", label: "Communities Served", icon: MapPin },
              { number: "1,500+", label: "Active Volunteers", icon: Award },
            ].map((stat, index) => (
              <Card
                key={index}
                className="bg-white/10 backdrop-blur-sm border-white/20 text-white hover:bg-white/20 transition-all duration-300 hover:scale-105"
              >
                <CardContent className="p-8 text-center">
                  <stat.icon className="w-12 h-12 mx-auto mb-4 text-yellow-300" />
                  <div className="text-4xl font-bold mb-2">{stat.number}</div>
                  <div className="text-blue-100">{stat.label}</div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4 text-center">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
              Join Our <span className="text-blue-600">Mission</span>
            </h2>

            <p className="text-xl text-gray-600 mb-12 max-w-3xl mx-auto">
              Whether you want to donate, volunteer, or partner with us, there are many ways to get involved and help us
              create positive change.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button
                size="lg"
                className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-8 py-4 rounded-full shadow-2xl hover:shadow-blue-500/25 transition-all duration-300 transform hover:scale-105"
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
                className="border-blue-200 text-blue-600 hover:bg-blue-50 px-8 py-4 rounded-full transition-all duration-300 bg-transparent"
                asChild
              >
                <Link href="/volunteer">
                  <Users className="w-5 h-5 mr-2" />
                  Become a Volunteer
                </Link>
              </Button>

              <Button
                size="lg"
                variant="outline"
                className="border-purple-200 text-purple-600 hover:bg-purple-50 px-8 py-4 rounded-full transition-all duration-300 bg-transparent"
                asChild
              >
                <Link href="/contact">
                  <ArrowRight className="w-5 h-5 mr-2" />
                  Contact Us
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
