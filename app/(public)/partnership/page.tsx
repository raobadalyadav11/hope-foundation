"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { CheckCircle, Handshake, Globe, Users, Target, Building2, School, Heart } from "lucide-react"
import Image from "next/image"
import { toast } from "sonner"

export default function PartnershipPage() {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [formData, setFormData] = useState({
    organizationName: "",
    organizationType: "",
    contactPerson: "",
    email: "",
    phone: "",
    website: "",
    partnershipType: "",
    description: "",
    resources: "",
    timeline: "",
    message: "",
  })

  const partnershipTypes = [
    {
      title: "NGO Partnerships",
      description: "Collaborate with other NGOs to amplify impact and share resources",
      icon: Handshake,
      color: "bg-blue-100 text-blue-600",
      benefits: [
        "Shared expertise and knowledge",
        "Joint program implementation",
        "Resource pooling",
        "Expanded reach and impact",
        "Cost-effective operations",
      ],
    },
    {
      title: "Government Partnerships",
      description: "Work with government agencies to implement large-scale programs",
      icon: Building2,
      color: "bg-green-100 text-green-600",
      benefits: [
        "Policy advocacy support",
        "Access to government resources",
        "Scalable program implementation",
        "Regulatory compliance assistance",
        "Community-wide impact",
      ],
    },
    {
      title: "Educational Institutions",
      description: "Partner with schools and universities for research and programs",
      icon: School,
      color: "bg-purple-100 text-purple-600",
      benefits: [
        "Research collaboration",
        "Student volunteer programs",
        "Academic expertise access",
        "Innovation in program design",
        "Knowledge sharing",
      ],
    },
    {
      title: "Healthcare Partners",
      description: "Collaborate with medical institutions and healthcare providers",
      icon: Heart,
      color: "bg-red-100 text-red-600",
      benefits: [
        "Medical expertise access",
        "Healthcare service delivery",
        "Health awareness programs",
        "Emergency response support",
        "Community health initiatives",
      ],
    },
  ]

  const currentPartners = [
    {
      name: "United Nations Development Programme",
      type: "International Organization",
      logo: "/placeholder.svg?height=80&width=120",
      partnership: "Sustainable Development Goals Implementation",
      since: "2020",
      impact: "Reached 50,000+ beneficiaries",
    },
    {
      name: "Ministry of Rural Development",
      type: "Government Agency",
      logo: "/placeholder.svg?height=80&width=120",
      partnership: "Rural Education Initiative",
      since: "2021",
      impact: "Established 25 learning centers",
    },
    {
      name: "Mumbai University",
      type: "Educational Institution",
      logo: "/placeholder.svg?height=80&width=120",
      partnership: "Research & Development",
      since: "2022",
      impact: "Published 15 research papers",
    },
    {
      name: "Apollo Hospitals",
      type: "Healthcare Partner",
      logo: "/placeholder.svg?height=80&width=120",
      partnership: "Mobile Health Clinics",
      since: "2021",
      impact: "Served 30,000+ patients",
    },
  ]

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    try {
      const response = await fetch("/api/partnerships/apply", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      })

      const data = await response.json()

      if (response.ok) {
        toast.success("Partnership application submitted successfully! We'll review and contact you soon.")
        setFormData({
          organizationName: "",
          organizationType: "",
          contactPerson: "",
          email: "",
          phone: "",
          website: "",
          partnershipType: "",
          description: "",
          resources: "",
          timeline: "",
          message: "",
        })
      } else {
        toast.error(data.error || "Failed to submit application. Please try again.")
      }
    } catch (error) {
      toast.error("An error occurred. Please try again.")
      console.error("Partnership application error:", error)
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-green-600 to-blue-700 text-white py-20">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-5xl font-bold mb-6">Strategic Partnerships</h1>
            <p className="text-xl opacity-90 mb-8">
              Join forces with Hope Foundation to create sustainable impact through collaborative partnerships.
              Together, we can achieve more than we ever could alone.
            </p>
            <div className="flex flex-wrap justify-center gap-6 text-lg">
              <div className="flex items-center gap-2">
                <Globe className="w-6 h-6" />
                <span>Global Network</span>
              </div>
              <div className="flex items-center gap-2">
                <Users className="w-6 h-6" />
                <span>100+ Partners</span>
              </div>
              <div className="flex items-center gap-2">
                <Target className="w-6 h-6" />
                <span>Shared Impact</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      <div className="container mx-auto px-4 py-12">
        {/* Why Partner With Us */}
        <section className="mb-16">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">Why Partner With Us?</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Our collaborative approach ensures mutual growth, shared resources, and amplified impact for all partners.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <Card className="text-center">
              <CardHeader>
                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Target className="w-8 h-8 text-green-600" />
                </div>
                <CardTitle>Shared Vision</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600">
                  Align with organizations that share our commitment to sustainable development and social impact.
                </p>
              </CardContent>
            </Card>

            <Card className="text-center">
              <CardHeader>
                <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Users className="w-8 h-8 text-blue-600" />
                </div>
                <CardTitle>Resource Synergy</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600">
                  Combine resources, expertise, and networks to create more efficient and effective programs.
                </p>
              </CardContent>
            </Card>

            <Card className="text-center">
              <CardHeader>
                <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Globe className="w-8 h-8 text-purple-600" />
                </div>
                <CardTitle>Global Reach</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600">
                  Expand your impact through our extensive network of partners and beneficiaries worldwide.
                </p>
              </CardContent>
            </Card>
          </div>
        </section>

        {/* Partnership Types */}
        <section className="mb-16">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">Partnership Opportunities</h2>
            <p className="text-xl text-gray-600">Explore different ways to collaborate and create lasting impact</p>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            {partnershipTypes.map((type, index) => (
              <Card key={index} className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="flex items-center gap-4">
                    <div className={`w-12 h-12 rounded-lg flex items-center justify-center ${type.color}`}>
                      <type.icon className="w-6 h-6" />
                    </div>
                    <div>
                      <CardTitle className="text-xl">{type.title}</CardTitle>
                      <CardDescription className="text-base">{type.description}</CardDescription>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2">
                    {type.benefits.map((benefit, idx) => (
                      <li key={idx} className="flex items-start gap-2">
                        <CheckCircle className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
                        <span className="text-sm">{benefit}</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        {/* Current Partners */}
        <section className="mb-16">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">Our Valued Partners</h2>
            <p className="text-xl text-gray-600">Working together to create meaningful change</p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {currentPartners.map((partner, index) => (
              <Card key={index} className="text-center hover:shadow-lg transition-shadow">
                <CardContent className="p-6">
                  <div className="relative h-20 mb-4">
                    <Image
                      src={partner.logo || "/placeholder.svg"}
                      alt={partner.name}
                      fill
                      className="object-contain"
                    />
                  </div>
                  <h3 className="font-semibold text-lg mb-2">{partner.name}</h3>
                  <Badge variant="outline" className="mb-3">
                    {partner.type}
                  </Badge>
                  <p className="text-sm text-gray-600 mb-2">{partner.partnership}</p>
                  <p className="text-xs text-gray-500 mb-1">Partner since {partner.since}</p>
                  <p className="text-xs font-medium text-green-600">{partner.impact}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        {/* Partnership Process */}
        <section className="mb-16">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">Partnership Process</h2>
            <p className="text-xl text-gray-600">How we build successful partnerships</p>
          </div>

          <div className="grid md:grid-cols-4 gap-6">
            {[
              {
                step: "1",
                title: "Initial Contact",
                description: "Submit partnership proposal and initial discussion",
              },
              { step: "2", title: "Assessment", description: "Evaluate alignment, resources, and potential impact" },
              { step: "3", title: "Agreement", description: "Develop formal partnership agreement and terms" },
              { step: "4", title: "Implementation", description: "Launch collaborative programs and monitor progress" },
            ].map((process, index) => (
              <Card key={index} className="text-center">
                <CardContent className="p-6">
                  <div className="w-12 h-12 bg-blue-600 text-white rounded-full flex items-center justify-center mx-auto mb-4 text-xl font-bold">
                    {process.step}
                  </div>
                  <h3 className="font-semibold text-lg mb-2">{process.title}</h3>
                  <p className="text-sm text-gray-600">{process.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        {/* Application Form */}
        <section>
          <div className="max-w-4xl mx-auto">
            <Card>
              <CardHeader className="text-center">
                <CardTitle className="text-3xl">Partnership Application</CardTitle>
                <CardDescription className="text-lg">
                  Ready to collaborate? Tell us about your organization and partnership goals.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="grid md:grid-cols-2 gap-6">
                    <div>
                      <Label htmlFor="organizationName">Organization Name *</Label>
                      <Input
                        id="organizationName"
                        value={formData.organizationName}
                        onChange={(e) => setFormData({ ...formData, organizationName: e.target.value })}
                        required
                      />
                    </div>
                    <div>
                      <Label htmlFor="organizationType">Organization Type *</Label>
                      <Select
                        value={formData.organizationType}
                        onValueChange={(value) => setFormData({ ...formData, organizationType: value })}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select type" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="ngo">NGO/Non-Profit</SelectItem>
                          <SelectItem value="government">Government Agency</SelectItem>
                          <SelectItem value="educational">Educational Institution</SelectItem>
                          <SelectItem value="healthcare">Healthcare Organization</SelectItem>
                          <SelectItem value="corporate">Corporate Foundation</SelectItem>
                          <SelectItem value="international">International Organization</SelectItem>
                          <SelectItem value="other">Other</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div className="grid md:grid-cols-2 gap-6">
                    <div>
                      <Label htmlFor="contactPerson">Contact Person *</Label>
                      <Input
                        id="contactPerson"
                        value={formData.contactPerson}
                        onChange={(e) => setFormData({ ...formData, contactPerson: e.target.value })}
                        required
                      />
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
                  </div>

                  <div className="grid md:grid-cols-2 gap-6">
                    <div>
                      <Label htmlFor="phone">Phone Number *</Label>
                      <Input
                        id="phone"
                        value={formData.phone}
                        onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                        required
                      />
                    </div>
                    <div>
                      <Label htmlFor="website">Website</Label>
                      <Input
                        id="website"
                        value={formData.website}
                        onChange={(e) => setFormData({ ...formData, website: e.target.value })}
                        placeholder="https://www.yourorganization.org"
                      />
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="partnershipType">Partnership Type *</Label>
                    <Select
                      value={formData.partnershipType}
                      onValueChange={(value) => setFormData({ ...formData, partnershipType: value })}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select partnership type" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="program-collaboration">Program Collaboration</SelectItem>
                        <SelectItem value="resource-sharing">Resource Sharing</SelectItem>
                        <SelectItem value="research-development">Research & Development</SelectItem>
                        <SelectItem value="advocacy">Advocacy Partnership</SelectItem>
                        <SelectItem value="capacity-building">Capacity Building</SelectItem>
                        <SelectItem value="funding">Funding Partnership</SelectItem>
                        <SelectItem value="other">Other</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <Label htmlFor="description">Organization Description *</Label>
                    <Textarea
                      id="description"
                      value={formData.description}
                      onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                      placeholder="Tell us about your organization, mission, and current programs..."
                      rows={3}
                      required
                    />
                  </div>

                  <div>
                    <Label htmlFor="resources">Resources & Expertise</Label>
                    <Textarea
                      id="resources"
                      value={formData.resources}
                      onChange={(e) => setFormData({ ...formData, resources: e.target.value })}
                      placeholder="What resources, expertise, or capabilities can you bring to the partnership?"
                      rows={3}
                    />
                  </div>

                  <div>
                    <Label htmlFor="timeline">Proposed Timeline</Label>
                    <Select
                      value={formData.timeline}
                      onValueChange={(value) => setFormData({ ...formData, timeline: value })}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select timeline" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="immediate">Immediate (1-3 months)</SelectItem>
                        <SelectItem value="short-term">Short-term (3-6 months)</SelectItem>
                        <SelectItem value="medium-term">Medium-term (6-12 months)</SelectItem>
                        <SelectItem value="long-term">Long-term (1+ years)</SelectItem>
                        <SelectItem value="flexible">Flexible</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <Label htmlFor="message">Partnership Goals & Message</Label>
                    <Textarea
                      id="message"
                      value={formData.message}
                      onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                      placeholder="Describe your partnership goals and how you envision working together..."
                      rows={4}
                    />
                  </div>

                  <Button type="submit" className="w-full h-12 text-lg" disabled={isSubmitting}>
                    <Handshake className="w-5 h-5 mr-2" />
                    {isSubmitting ? "Submitting..." : "Submit Partnership Application"}
                  </Button>
                </form>
              </CardContent>
            </Card>
          </div>
        </section>
      </div>
    </div>
  )
}
