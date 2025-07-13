"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Heart, Users, Target, Globe, Award, Mail, Linkedin } from "lucide-react"
import Link from "next/link"
import Image from "next/image"

const teamMembers = [
  {
    name: "Dr. Sarah Johnson",
    role: "Founder & CEO",
    image: "/placeholder.svg?height=300&width=300",
    bio: "With over 15 years in humanitarian work, Dr. Johnson founded Hope Foundation to create sustainable change in underserved communities.",
    education: "PhD in International Development, Harvard University",
    experience: "Former UN Development Programme Director",
    email: "sarah@hopefoundation.org",
    linkedin: "#",
  },
  {
    name: "Michael Chen",
    role: "Director of Operations",
    image: "/placeholder.svg?height=300&width=300",
    bio: "Michael brings 12 years of operational excellence from the corporate sector, ensuring our programs run efficiently and effectively.",
    education: "MBA Operations Management, Stanford",
    experience: "Former McKinsey & Company Senior Partner",
    email: "michael@hopefoundation.org",
    linkedin: "#",
  },
  {
    name: "Dr. Priya Sharma",
    role: "Head of Programs",
    image: "/placeholder.svg?height=300&width=300",
    bio: "Dr. Sharma leads our program development and implementation, with expertise in community health and education initiatives.",
    education: "MD Public Health, AIIMS Delhi",
    experience: "Former WHO Regional Health Advisor",
    email: "priya@hopefoundation.org",
    linkedin: "#",
  },
  {
    name: "James Wilson",
    role: "Technology Director",
    image: "/placeholder.svg?height=300&width=300",
    bio: "James oversees our digital transformation initiatives, making our operations more efficient and transparent through technology.",
    education: "MS Computer Science, MIT",
    experience: "Former Google Senior Engineering Manager",
    email: "james@hopefoundation.org",
    linkedin: "#",
  },
  {
    name: "Maria Rodriguez",
    role: "Community Outreach Manager",
    image: "/placeholder.svg?height=300&width=300",
    bio: "Maria builds bridges between our organization and the communities we serve, ensuring our programs meet real needs.",
    education: "MA Social Work, Columbia University",
    experience: "10+ years in community development",
    email: "maria@hopefoundation.org",
    linkedin: "#",
  },
  {
    name: "David Kim",
    role: "Finance & Transparency Officer",
    image: "/placeholder.svg?height=300&width=300",
    bio: "David ensures complete financial transparency and accountability, managing our resources to maximize impact.",
    education: "CPA, MBA Finance, Wharton",
    experience: "Former Deloitte Senior Manager",
    email: "david@hopefoundation.org",
    linkedin: "#",
  },
]

const milestones = [
  {
    year: "2010",
    title: "Foundation Established",
    description: "Hope Foundation was founded with a mission to create sustainable change in underserved communities.",
    impact: "Started with 5 volunteers",
  },
  {
    year: "2012",
    title: "First International Program",
    description: "Launched our first international education program in rural India, reaching 500 children.",
    impact: "500 children educated",
  },
  {
    year: "2015",
    title: "Healthcare Initiative",
    description: "Expanded into healthcare with mobile medical units serving remote communities.",
    impact: "10,000 patients treated",
  },
  {
    year: "2018",
    title: "Technology Integration",
    description: "Implemented digital platforms for better program tracking and donor transparency.",
    impact: "100% transparency achieved",
  },
  {
    year: "2020",
    title: "COVID-19 Response",
    description: "Rapidly deployed emergency relief programs during the global pandemic.",
    impact: "25,000 families supported",
  },
  {
    year: "2023",
    title: "Global Expansion",
    description: "Reached our goal of operating in 12 countries with over 2,500 active volunteers.",
    impact: "50,000+ lives impacted",
  },
]

const values = [
  {
    icon: Heart,
    title: "Compassion",
    description:
      "We approach every situation with empathy and understanding, putting human dignity at the center of everything we do.",
  },
  {
    icon: Target,
    title: "Impact-Driven",
    description: "We measure our success by the tangible positive changes we create in the lives of those we serve.",
  },
  {
    icon: Users,
    title: "Community-Centered",
    description: "We work with communities, not for them, ensuring local ownership and sustainable solutions.",
  },
  {
    icon: Globe,
    title: "Global Perspective",
    description:
      "We think globally while acting locally, understanding that challenges are interconnected across borders.",
  },
  {
    icon: Award,
    title: "Excellence",
    description:
      "We strive for the highest standards in everything we do, continuously improving our methods and impact.",
  },
  {
    icon: Users,
    title: "Transparency",
    description:
      "We maintain complete openness about our operations, finances, and impact to build trust with our stakeholders.",
  },
]

const achievements = [
  {
    metric: "50,000+",
    label: "Lives Directly Impacted",
    description: "Through our various programs and initiatives",
  },
  {
    metric: "2,500+",
    label: "Active Volunteers",
    description: "Dedicated individuals making a difference",
  },
  {
    metric: "150+",
    label: "Projects Completed",
    description: "Successful initiatives across multiple sectors",
  },
  {
    metric: "12",
    label: "Countries Served",
    description: "Global reach with local impact",
  },
  {
    metric: "₹50M+",
    label: "Funds Raised",
    description: "Transparent allocation for maximum impact",
  },
  {
    metric: "95%",
    label: "Program Efficiency",
    description: "Of donations go directly to programs",
  },
]

export default function AboutPage() {
  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-blue-600 via-purple-700 to-blue-800 text-white py-20">
        <div className="absolute inset-0 bg-black/30"></div>
        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-4xl mx-auto text-center">
            <Badge className="bg-white/20 text-white border-white/30 hover:bg-white/30 mb-6">🌟 Our Story</Badge>
            <h1 className="text-5xl lg:text-6xl font-bold mb-6">About Hope Foundation</h1>
            <p className="text-xl lg:text-2xl opacity-90 leading-relaxed mb-8">
              For over a decade, we've been dedicated to creating sustainable change in communities worldwide. Our
              mission is simple: to provide hope, opportunity, and dignity to those who need it most.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" className="bg-white text-blue-600 hover:bg-gray-100 font-semibold">
                <Link href="/volunteer">Join Our Mission</Link>
              </Button>
              <Button
                size="lg"
                variant="destructive"
                className="border-white text-white hover:bg-white hover:text-blue-600 font-semibold"
              >
                <Link href="/contact">Get in Touch</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Mission, Vision, Values */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="grid lg:grid-cols-3 gap-12 mb-20">
            <Card className="text-center p-8 hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Target className="w-8 h-8 text-blue-600" />
                </div>
                <CardTitle className="text-2xl">Our Mission</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600 leading-relaxed">
                  To empower underserved communities through sustainable development programs that address education,
                  healthcare, and economic opportunities while preserving human dignity and promoting self-reliance.
                </p>
              </CardContent>
            </Card>

            <Card className="text-center p-8 hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Globe className="w-8 h-8 text-green-600" />
                </div>
                <CardTitle className="text-2xl">Our Vision</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600 leading-relaxed">
                  A world where every person has access to basic necessities, quality education, healthcare, and
                  opportunities to thrive, regardless of their circumstances or geographic location.
                </p>
              </CardContent>
            </Card>

            <Card className="text-center p-8 hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Heart className="w-8 h-8 text-purple-600" />
                </div>
                <CardTitle className="text-2xl">Our Impact</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600 leading-relaxed">
                  Through collaborative partnerships and evidence-based approaches, we've positively impacted over
                  50,000 lives across 12 countries, focusing on sustainable, long-term solutions.
                </p>
              </CardContent>
            </Card>
          </div>

          {/* Core Values */}
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">Our Core Values</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              These principles guide every decision we make and every action we take in our mission to create positive
              change.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {values.map((value, index) => (
              <div key={index} className="text-center group">
                <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:bg-blue-100 transition-colors">
                  <value.icon className="w-8 h-8 text-gray-600 group-hover:text-blue-600 transition-colors" />
                </div>
                <h3 className="text-xl font-semibold mb-3">{value.title}</h3>
                <p className="text-gray-600 leading-relaxed">{value.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Achievements */}
      <section className="py-20 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">Our Achievements</h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Numbers that reflect our commitment to transparency and measurable impact.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {achievements.map((achievement, index) => (
              <Card key={index} className="text-center p-6 hover:shadow-lg transition-shadow">
                <CardContent className="pt-6">
                  <div className="text-4xl font-bold text-blue-600 mb-2">{achievement.metric}</div>
                  <div className="text-xl font-semibold text-gray-900 mb-2">{achievement.label}</div>
                  <p className="text-gray-600">{achievement.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Timeline */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">Our Journey</h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Key milestones that have shaped our organization and expanded our impact over the years.
            </p>
          </div>

          <div className="max-w-4xl mx-auto">
            <div className="relative">
              <div className="absolute left-1/2 transform -translate-x-1/2 w-1 h-full bg-blue-200"></div>

              {milestones.map((milestone, index) => (
                <div
                  key={index}
                  className={`relative flex items-center mb-12 ${index % 2 === 0 ? "flex-row" : "flex-row-reverse"}`}
                >
                  <div className={`w-1/2 ${index % 2 === 0 ? "pr-8 text-right" : "pl-8 text-left"}`}>
                    <Card className="p-6 hover:shadow-lg transition-shadow">
                      <CardHeader className="pb-4">
                        <div className="flex items-center gap-2 mb-2">
                          <Badge variant="outline" className="text-blue-600 border-blue-200">
                            {milestone.year}
                          </Badge>
                        </div>
                        <CardTitle className="text-xl">{milestone.title}</CardTitle>
                      </CardHeader>
                      <CardContent className="pt-0">
                        <p className="text-gray-600 mb-3">{milestone.description}</p>
                        <div className="text-sm font-semibold text-blue-600">{milestone.impact}</div>
                      </CardContent>
                    </Card>
                  </div>

                  <div className="absolute left-1/2 transform -translate-x-1/2 w-4 h-4 bg-blue-600 rounded-full border-4 border-white shadow-lg"></div>

                  <div className="w-1/2"></div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Team Section */}
      <section className="py-20 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">Meet Our Team</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Our dedicated team of professionals brings together diverse expertise and shared passion for creating
              positive change.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {teamMembers.map((member, index) => (
              <Card key={index} className="overflow-hidden hover:shadow-xl transition-all duration-300 group">
                <div className="relative h-64 overflow-hidden">
                  <Image
                    src={member.image || "/placeholder.svg"}
                    alt={member.name}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                </div>
                <CardHeader>
                  <CardTitle className="text-xl">{member.name}</CardTitle>
                  <CardDescription className="text-blue-600 font-semibold">{member.role}</CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-600 mb-4 leading-relaxed">{member.bio}</p>

                  <div className="space-y-2 text-sm">
                    <div>
                      <span className="font-semibold text-gray-700">Education:</span>
                      <p className="text-gray-600">{member.education}</p>
                    </div>
                    <div>
                      <span className="font-semibold text-gray-700">Experience:</span>
                      <p className="text-gray-600">{member.experience}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 mt-4 pt-4 border-t">
                    <Button variant="ghost" size="sm" asChild>
                      <a href={`mailto:${member.email}`} className="flex items-center gap-1">
                        <Mail className="w-4 h-4" />
                        Email
                      </a>
                    </Button>
                    <Button variant="ghost" size="sm" asChild>
                      <a href={member.linkedin} className="flex items-center gap-1">
                        <Linkedin className="w-4 h-4" />
                        LinkedIn
                      </a>
                    </Button>
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
          <h2 className="text-4xl font-bold mb-6">Join Our Mission</h2>
          <p className="text-xl mb-8 opacity-90 max-w-2xl mx-auto">
            Whether through volunteering, donating, or spreading awareness, there are many ways to be part of our
            mission to create positive change.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" className="bg-white text-blue-600 hover:bg-gray-100 font-semibold">
              <Link href="/volunteer">Become a Volunteer</Link>
            </Button>
            <Button
              size="lg"
              variant="destructive"
              className="border-white text-white hover:bg-white hover:text-blue-600 font-semibold"
            >
              <Link href="/donate">Make a Donation</Link>
            </Button>
            <Button
              size="lg"
              variant="secondary"
              className="border-white text-white text-blue-600 hover:bg-white hover:text-blue-600 font-semibold"
            >
              <Link href="/contact">Contact Us</Link>
            </Button>
          </div>
        </div>
      </section>
    </div>
  )
}
