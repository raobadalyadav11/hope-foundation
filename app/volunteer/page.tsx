"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import { Badge } from "@/components/ui/badge"
import { Heart, Users, Globe, Clock, MapPin, Calendar } from "lucide-react"
import Image from "next/image"

export default function VolunteerPage() {
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    location: "",
    skills: [],
    availability: "",
    experience: "",
    motivation: "",
  })

  const opportunities = [
    {
      id: 1,
      title: "Education Program Coordinator",
      location: "Mumbai, India",
      type: "On-site",
      duration: "6 months",
      commitment: "20 hours/week",
      description: "Help coordinate our education programs in local schools and communities.",
      skills: ["Project Management", "Education", "Communication"],
      urgent: true,
    },
    {
      id: 2,
      title: "Digital Marketing Volunteer",
      location: "Remote",
      type: "Remote",
      duration: "3 months",
      commitment: "10 hours/week",
      description: "Support our digital marketing efforts to increase awareness and engagement.",
      skills: ["Social Media", "Content Creation", "Marketing"],
      urgent: false,
    },
    {
      id: 3,
      title: "Healthcare Support Volunteer",
      location: "Delhi, India",
      type: "On-site",
      duration: "4 months",
      commitment: "15 hours/week",
      description: "Assist healthcare professionals in our mobile medical units.",
      skills: ["Healthcare", "First Aid", "Communication"],
      urgent: true,
    },
    {
      id: 4,
      title: "Grant Writing Specialist",
      location: "Remote",
      type: "Remote",
      duration: "Ongoing",
      commitment: "5 hours/week",
      description: "Help write grant proposals to secure funding for our programs.",
      skills: ["Writing", "Research", "Grant Writing"],
      urgent: false,
    },
  ]

  const skillOptions = [
    "Project Management",
    "Education",
    "Healthcare",
    "Marketing",
    "Writing",
    "Social Media",
    "Photography",
    "Translation",
    "IT Support",
    "Fundraising",
    "Event Planning",
    "Research",
    "First Aid",
    "Teaching",
    "Counseling",
  ]

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    // Handle form submission
    alert("Thank you for your interest in volunteering! We will contact you soon.")
  }

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-green-600 to-blue-700 text-white py-20">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <h1 className="text-5xl font-bold mb-6">Volunteer With Us</h1>
              <p className="text-xl mb-8 opacity-90">
                Join our community of passionate volunteers and make a meaningful impact in the lives of those who need
                it most. Your skills and time can change the world.
              </p>
              <div className="flex gap-4">
                <Button size="lg" className="bg-white text-green-600 hover:bg-gray-100">
                  Apply Now
                </Button>
                <Button
                  size="lg"
                  variant="outline"
                  className="border-white text-white hover:bg-white hover:text-green-600"
                >
                  Learn More
                </Button>
              </div>
            </div>
            <div className="relative">
              <Image
                src="/placeholder.svg?height=400&width=500"
                alt="Volunteers in action"
                width={500}
                height={400}
                className="rounded-lg shadow-2xl"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Why Volunteer */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">Why Volunteer With Hope Foundation?</h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Discover the benefits of volunteering and how you can make a difference while growing personally and
              professionally.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="inline-flex items-center justify-center w-20 h-20 bg-green-100 rounded-full mb-6">
                <Heart className="w-10 h-10 text-green-600" />
              </div>
              <h3 className="text-2xl font-semibold mb-4">Make Real Impact</h3>
              <p className="text-gray-600">
                Your contributions directly improve lives and create lasting change in communities worldwide.
              </p>
            </div>

            <div className="text-center">
              <div className="inline-flex items-center justify-center w-20 h-20 bg-blue-100 rounded-full mb-6">
                <Users className="w-10 h-10 text-blue-600" />
              </div>
              <h3 className="text-2xl font-semibold mb-4">Build Community</h3>
              <p className="text-gray-600">
                Connect with like-minded individuals and build meaningful relationships while working toward common
                goals.
              </p>
            </div>

            <div className="text-center">
              <div className="inline-flex items-center justify-center w-20 h-20 bg-purple-100 rounded-full mb-6">
                <Globe className="w-10 h-10 text-purple-600" />
              </div>
              <h3 className="text-2xl font-semibold mb-4">Gain Experience</h3>
              <p className="text-gray-600">
                Develop new skills, gain valuable experience, and enhance your resume while contributing to meaningful
                causes.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Current Opportunities */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">Current Opportunities</h2>
            <p className="text-xl text-gray-600">
              Find volunteer opportunities that match your skills, interests, and availability.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            {opportunities.map((opportunity) => (
              <Card key={opportunity.id} className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="flex justify-between items-start">
                    <div>
                      <CardTitle className="text-xl">{opportunity.title}</CardTitle>
                      <CardDescription className="mt-2">{opportunity.description}</CardDescription>
                    </div>
                    {opportunity.urgent && <Badge className="bg-red-500 hover:bg-red-600">Urgent</Badge>}
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div className="flex items-center gap-2">
                        <MapPin className="w-4 h-4 text-gray-500" />
                        <span>{opportunity.location}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Clock className="w-4 h-4 text-gray-500" />
                        <span>{opportunity.commitment}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Calendar className="w-4 h-4 text-gray-500" />
                        <span>{opportunity.duration}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Users className="w-4 h-4 text-gray-500" />
                        <span>{opportunity.type}</span>
                      </div>
                    </div>

                    <div>
                      <Label className="text-sm font-semibold">Required Skills:</Label>
                      <div className="flex flex-wrap gap-2 mt-2">
                        {opportunity.skills.map((skill) => (
                          <Badge key={skill} variant="outline">
                            {skill}
                          </Badge>
                        ))}
                      </div>
                    </div>

                    <Button className="w-full">Apply for This Position</Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Volunteer Application Form */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-2xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-4xl font-bold text-gray-900 mb-4">Volunteer Application</h2>
              <p className="text-xl text-gray-600">
                Ready to make a difference? Fill out our application form and we'll match you with the perfect
                opportunity.
              </p>
            </div>

            <Card>
              <CardHeader>
                <CardTitle>General Application</CardTitle>
                <CardDescription>
                  Tell us about yourself and your interests. We'll contact you with suitable opportunities.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="firstName">First Name *</Label>
                      <Input
                        id="firstName"
                        value={formData.firstName}
                        onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                        required
                      />
                    </div>
                    <div>
                      <Label htmlFor="lastName">Last Name *</Label>
                      <Input
                        id="lastName"
                        value={formData.lastName}
                        onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                        required
                      />
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="email">Email Address *</Label>
                    <Input
                      id="email"
                      type="email"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      required
                    />
                  </div>

                  <div>
                    <Label htmlFor="phone">Phone Number *</Label>
                    <Input
                      id="phone"
                      type="tel"
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      required
                    />
                  </div>

                  <div>
                    <Label htmlFor="location">Location *</Label>
                    <Input
                      id="location"
                      placeholder="City, Country"
                      value={formData.location}
                      onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                      required
                    />
                  </div>

                  <div>
                    <Label>Skills & Expertise</Label>
                    <div className="grid grid-cols-3 gap-2 mt-2">
                      {skillOptions.map((skill) => (
                        <div key={skill} className="flex items-center space-x-2">
                          <Checkbox id={skill} />
                          <Label htmlFor={skill} className="text-sm">
                            {skill}
                          </Label>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="availability">Availability</Label>
                    <Select>
                      <SelectTrigger>
                        <SelectValue placeholder="Select your availability" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="weekdays">Weekdays</SelectItem>
                        <SelectItem value="weekends">Weekends</SelectItem>
                        <SelectItem value="evenings">Evenings</SelectItem>
                        <SelectItem value="flexible">Flexible</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <Label htmlFor="experience">Previous Volunteer Experience</Label>
                    <Textarea
                      id="experience"
                      placeholder="Tell us about your previous volunteer experience..."
                      value={formData.experience}
                      onChange={(e) => setFormData({ ...formData, experience: e.target.value })}
                    />
                  </div>

                  <div>
                    <Label htmlFor="motivation">Why do you want to volunteer with us?</Label>
                    <Textarea
                      id="motivation"
                      placeholder="Share your motivation and what you hope to achieve..."
                      value={formData.motivation}
                      onChange={(e) => setFormData({ ...formData, motivation: e.target.value })}
                    />
                  </div>

                  <div className="flex items-center space-x-2">
                    <Checkbox id="terms" required />
                    <Label htmlFor="terms" className="text-sm">
                      I agree to the terms and conditions and privacy policy *
                    </Label>
                  </div>

                  <Button type="submit" className="w-full h-12 text-lg">
                    Submit Application
                  </Button>
                </form>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Volunteer Testimonials */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">What Our Volunteers Say</h2>
            <p className="text-xl text-gray-600">
              Hear from our amazing volunteers about their experiences and the impact they've made.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center gap-4 mb-4">
                  <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                    <span className="font-semibold text-blue-600">AS</span>
                  </div>
                  <div>
                    <div className="font-semibold">Anita Sharma</div>
                    <div className="text-sm text-gray-600">Education Volunteer</div>
                  </div>
                </div>
                <p className="text-gray-600">
                  "Volunteering with Hope Foundation has been incredibly rewarding. I've helped establish three schools
                  and seen firsthand how education transforms communities."
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center gap-4 mb-4">
                  <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                    <span className="font-semibold text-green-600">RK</span>
                  </div>
                  <div>
                    <div className="font-semibold">Raj Kumar</div>
                    <div className="text-sm text-gray-600">Healthcare Volunteer</div>
                  </div>
                </div>
                <p className="text-gray-600">
                  "Working with the mobile medical units has been life-changing. We've provided healthcare to over 1,000
                  people in remote villages."
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center gap-4 mb-4">
                  <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center">
                    <span className="font-semibold text-purple-600">MP</span>
                  </div>
                  <div>
                    <div className="font-semibold">Maria Patel</div>
                    <div className="text-sm text-gray-600">Digital Marketing Volunteer</div>
                  </div>
                </div>
                <p className="text-gray-600">
                  "As a remote volunteer, I've helped increase our social media engagement by 300%. It's amazing how
                  digital skills can create real-world impact."
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>
    </div>
  )
}
