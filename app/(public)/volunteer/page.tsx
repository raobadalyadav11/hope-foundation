"use client"

import type React from "react"

import { useState } from "react"
import { useSession } from "next-auth/react"
import { useMutation } from "@tanstack/react-query"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Checkbox } from "@/components/ui/checkbox"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Heart, Users, Clock, Award, ArrowRight } from "lucide-react"
import Link from "next/link"
import { toast } from "sonner"
import { z } from "zod"

const volunteerSchema = z.object({
  skills: z.array(z.string()).min(1, "Please select at least one skill"),
  availability: z.string().min(1, "Please select your availability"),
  experience: z.string().optional(),
  motivation: z.string().min(10, "Please provide more details about your motivation"),
  preferredCauses: z.array(z.string()).optional(),
  emergencyContact: z.object({
    name: z.string().min(1, "Emergency contact name is required"),
    relationship: z.string().min(1, "Relationship is required"),
    phone: z.string().min(10, "Valid phone number is required"),
  }),
})

export default function VolunteerPage() {
  const { data: session } = useSession()
  const [formData, setFormData] = useState({
    skills: [] as string[],
    availability: "",
    experience: "",
    motivation: "",
    preferredCauses: [] as string[],
    emergencyContact: {
      name: "",
      relationship: "",
      phone: "",
    },
  })

  const availableSkills = [
    "Teaching",
    "Healthcare",
    "Technology",
    "Marketing",
    "Event Management",
    "Fundraising",
    "Social Media",
    "Photography",
    "Writing",
    "Translation",
    "Counseling",
    "Construction",
    "Cooking",
    "Transportation",
    "Administration",
  ]

  const causes = [
    { value: "education", label: "Education" },
    { value: "healthcare", label: "Healthcare" },
    { value: "environment", label: "Environment" },
    { value: "poverty", label: "Poverty Alleviation" },
    { value: "disaster-relief", label: "Disaster Relief" },
    { value: "women-empowerment", label: "Women Empowerment" },
    { value: "child-welfare", label: "Child Welfare" },
    { value: "elderly-care", label: "Elderly Care" },
  ]

  const applyMutation = useMutation({
    mutationFn: async (data: any) => {
      const response = await fetch("/api/volunteers/apply", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      })
      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.error || "Failed to submit application")
      }
      return response.json()
    },
    onSuccess: () => {
      toast.success("Volunteer application submitted successfully!")
      // Reset form or redirect
    },
    onError: (error: any) => {
      toast.error(error.message)
    },
  })

  const handleSkillToggle = (skill: string) => {
    setFormData((prev) => ({
      ...prev,
      skills: prev.skills.includes(skill) ? prev.skills.filter((s) => s !== skill) : [...prev.skills, skill],
    }))
  }

  const handleCauseToggle = (cause: string) => {
    setFormData((prev) => ({
      ...prev,
      preferredCauses: prev.preferredCauses.includes(cause)
        ? prev.preferredCauses.filter((c) => c !== cause)
        : [...prev.preferredCauses, cause],
    }))
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    if (!session) {
      toast.error("Please login to apply as a volunteer")
      return
    }

    try {
      volunteerSchema.parse(formData)
      applyMutation.mutate(formData)
    } catch (error) {
      if (error instanceof z.ZodError) {
        toast.error(error.errors[0].message)
      }
    }
  }

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-purple-600 to-pink-700 text-white py-20">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-5xl font-bold mb-6">Become a Volunteer</h1>
            <p className="text-xl opacity-90 mb-8">
              Join our community of dedicated volunteers and make a real difference in people's lives. Your time and
              skills can transform communities and create lasting impact.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" className="bg-white text-purple-600 hover:bg-gray-100">
                <a href="#application" className="flex items-center gap-2">
                  Apply Now <ArrowRight className="w-4 h-4" />
                </a>
              </Button>
              <Button
                size="lg"
                variant="outline"
                className="border-white text-white hover:bg-white hover:text-purple-600"
              >
                <Link href="/events">View Volunteer Events</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Why Volunteer */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">Why Volunteer With Us?</h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Volunteering with us offers meaningful opportunities to create positive change while developing new skills
              and connections.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="text-center">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-purple-100 rounded-full mb-4">
                <Heart className="w-8 h-8 text-purple-600" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Make an Impact</h3>
              <p className="text-gray-600">
                Directly contribute to meaningful causes and see the tangible results of your efforts in communities.
              </p>
            </div>

            <div className="text-center">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-100 rounded-full mb-4">
                <Users className="w-8 h-8 text-blue-600" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Build Community</h3>
              <p className="text-gray-600">
                Connect with like-minded individuals and build lasting friendships while working toward common goals.
              </p>
            </div>

            <div className="text-center">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-green-100 rounded-full mb-4">
                <Award className="w-8 h-8 text-green-600" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Develop Skills</h3>
              <p className="text-gray-600">
                Gain valuable experience, learn new skills, and enhance your resume while helping others.
              </p>
            </div>

            <div className="text-center">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-orange-100 rounded-full mb-4">
                <Clock className="w-8 h-8 text-orange-600" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Flexible Schedule</h3>
              <p className="text-gray-600">
                Choose volunteer opportunities that fit your schedule and availability preferences.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Volunteer Opportunities */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">Volunteer Opportunities</h2>
            <p className="text-xl text-gray-600">
              Find the perfect way to contribute based on your skills and interests
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {causes.map((cause) => (
              <Card key={cause.value} className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <CardTitle className="text-xl">{cause.label}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-600 mb-4">
                    Join our {cause.label.toLowerCase()} initiatives and help create lasting change in communities.
                  </p>
                  <Button variant="outline" className="w-full">
                    Learn More
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Application Form */}
      <section id="application" className="py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-4xl font-bold text-gray-900 mb-4">Volunteer Application</h2>
              <p className="text-xl text-gray-600">Fill out the form below to start your volunteer journey with us</p>
            </div>

            {!session ? (
              <Card className="text-center py-12">
                <CardContent>
                  <Users className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-2xl font-bold mb-4">Login Required</h3>
                  <p className="text-gray-600 mb-6">Please login or create an account to apply as a volunteer.</p>
                  <div className="flex gap-4 justify-center">
                    <Button asChild>
                      <Link href="/login">Login</Link>
                    </Button>
                    <Button variant="outline" asChild>
                      <Link href="/signup">Sign Up</Link>
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ) : (
              <Card>
                <CardHeader>
                  <CardTitle>Volunteer Application Form</CardTitle>
                  <CardDescription>
                    Tell us about yourself and how you'd like to contribute to our mission
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <form onSubmit={handleSubmit} className="space-y-6">
                    {/* Skills */}
                    <div>
                      <Label className="text-base font-semibold mb-3 block">
                        Skills & Expertise <span className="text-red-500">*</span>
                      </Label>
                      <p className="text-sm text-gray-600 mb-3">Select all skills that apply to you</p>
                      <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                        {availableSkills.map((skill) => (
                          <div key={skill} className="flex items-center space-x-2">
                            <Checkbox
                              id={skill}
                              checked={formData.skills.includes(skill)}
                              onCheckedChange={() => handleSkillToggle(skill)}
                            />
                            <Label htmlFor={skill} className="text-sm">
                              {skill}
                            </Label>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Availability */}
                    <div>
                      <Label htmlFor="availability" className="text-base font-semibold">
                        Availability <span className="text-red-500">*</span>
                      </Label>
                      <Select
                        value={formData.availability}
                        onValueChange={(value) => setFormData((prev) => ({ ...prev, availability: value }))}
                      >
                        <SelectTrigger className="mt-2">
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

                    {/* Experience */}
                    <div>
                      <Label htmlFor="experience" className="text-base font-semibold">
                        Previous Volunteer Experience
                      </Label>
                      <Textarea
                        id="experience"
                        placeholder="Tell us about any previous volunteer work or relevant experience..."
                        value={formData.experience}
                        onChange={(e) => setFormData((prev) => ({ ...prev, experience: e.target.value }))}
                        className="mt-2"
                        rows={3}
                      />
                    </div>

                    {/* Motivation */}
                    <div>
                      <Label htmlFor="motivation" className="text-base font-semibold">
                        Why do you want to volunteer? <span className="text-red-500">*</span>
                      </Label>
                      <Textarea
                        id="motivation"
                        placeholder="Share your motivation for volunteering and what you hope to achieve..."
                        value={formData.motivation}
                        onChange={(e) => setFormData((prev) => ({ ...prev, motivation: e.target.value }))}
                        className="mt-2"
                        rows={4}
                        required
                      />
                    </div>

                    {/* Preferred Causes */}
                    <div>
                      <Label className="text-base font-semibold mb-3 block">Preferred Causes</Label>
                      <p className="text-sm text-gray-600 mb-3">Select the causes you're most passionate about</p>
                      <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                        {causes.map((cause) => (
                          <div key={cause.value} className="flex items-center space-x-2">
                            <Checkbox
                              id={cause.value}
                              checked={formData.preferredCauses.includes(cause.value)}
                              onCheckedChange={() => handleCauseToggle(cause.value)}
                            />
                            <Label htmlFor={cause.value} className="text-sm">
                              {cause.label}
                            </Label>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Emergency Contact */}
                    <div>
                      <Label className="text-base font-semibold mb-3 block">
                        Emergency Contact <span className="text-red-500">*</span>
                      </Label>
                      <div className="grid md:grid-cols-3 gap-4">
                        <div>
                          <Label htmlFor="emergencyName">Name</Label>
                          <Input
                            id="emergencyName"
                            value={formData.emergencyContact.name}
                            onChange={(e) =>
                              setFormData((prev) => ({
                                ...prev,
                                emergencyContact: { ...prev.emergencyContact, name: e.target.value },
                              }))
                            }
                            required
                          />
                        </div>
                        <div>
                          <Label htmlFor="emergencyRelationship">Relationship</Label>
                          <Input
                            id="emergencyRelationship"
                            value={formData.emergencyContact.relationship}
                            onChange={(e) =>
                              setFormData((prev) => ({
                                ...prev,
                                emergencyContact: { ...prev.emergencyContact, relationship: e.target.value },
                              }))
                            }
                            required
                          />
                        </div>
                        <div>
                          <Label htmlFor="emergencyPhone">Phone Number</Label>
                          <Input
                            id="emergencyPhone"
                            type="tel"
                            value={formData.emergencyContact.phone}
                            onChange={(e) =>
                              setFormData((prev) => ({
                                ...prev,
                                emergencyContact: { ...prev.emergencyContact, phone: e.target.value },
                              }))
                            }
                            required
                          />
                        </div>
                      </div>
                    </div>

                    <Button type="submit" className="w-full h-12 text-lg" disabled={applyMutation.isPending}>
                      {applyMutation.isPending ? "Submitting Application..." : "Submit Application"}
                    </Button>
                  </form>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </section>
    </div>
  )
}
