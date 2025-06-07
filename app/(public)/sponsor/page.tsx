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
import { CheckCircle, Users, Target, Award, Building, Mail, Phone } from "lucide-react"
import Image from "next/image"
import { toast } from "sonner"

export default function SponsorPage() {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [formData, setFormData] = useState({
    companyName: "",
    contactPerson: "",
    email: "",
    phone: "",
    website: "",
    sponsorshipType: "",
    budget: "",
    interests: "",
    message: "",
  })

  const sponsorshipTiers = [
    {
      name: "Platinum Sponsor",
      amount: "₹10,00,000+",
      color: "bg-gradient-to-r from-gray-400 to-gray-600",
      benefits: [
        "Logo on all marketing materials",
        "Dedicated campaign naming rights",
        "VIP event access and speaking opportunities",
        "Quarterly impact reports",
        "Custom CSR program development",
        "Media coverage and press releases",
        "Employee volunteer programs",
        "Tax benefits up to 50% under 80G",
      ],
    },
    {
      name: "Gold Sponsor",
      amount: "₹5,00,000 - ₹9,99,999",
      color: "bg-gradient-to-r from-yellow-400 to-yellow-600",
      benefits: [
        "Logo on website and annual report",
        "Event sponsorship opportunities",
        "Bi-annual impact reports",
        "Employee engagement programs",
        "Social media recognition",
        "Certificate of appreciation",
        "Tax benefits under 80G",
      ],
    },
    {
      name: "Silver Sponsor",
      amount: "₹2,00,000 - ₹4,99,999",
      color: "bg-gradient-to-r from-gray-300 to-gray-500",
      benefits: [
        "Website logo placement",
        "Annual impact report",
        "Event invitations",
        "Social media mentions",
        "Certificate of recognition",
        "Tax benefits under 80G",
      ],
    },
    {
      name: "Bronze Sponsor",
      amount: "₹50,000 - ₹1,99,999",
      color: "bg-gradient-to-r from-orange-400 to-orange-600",
      benefits: [
        "Website acknowledgment",
        "Annual report mention",
        "Certificate of appreciation",
        "Tax benefits under 80G",
      ],
    },
  ]

  const currentSponsors = [
    {
      name: "TechCorp Solutions",
      logo: "/placeholder.svg?height=80&width=120",
      tier: "Platinum",
      since: "2022",
      contribution: "Education Technology Program",
    },
    {
      name: "Green Energy Ltd",
      logo: "/placeholder.svg?height=80&width=120",
      tier: "Gold",
      since: "2023",
      contribution: "Renewable Energy Initiative",
    },
    {
      name: "Healthcare Plus",
      logo: "/placeholder.svg?height=80&width=120",
      tier: "Gold",
      since: "2021",
      contribution: "Mobile Health Clinics",
    },
    {
      name: "EduFoundation",
      logo: "/placeholder.svg?height=80&width=120",
      tier: "Silver",
      since: "2023",
      contribution: "Scholarship Program",
    },
  ]

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    try {
      const response = await fetch("/api/sponsors/apply", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      })

      const data = await response.json()

      if (response.ok) {
        toast.success("Sponsorship application submitted successfully! We'll contact you soon.")
        setFormData({
          companyName: "",
          contactPerson: "",
          email: "",
          phone: "",
          website: "",
          sponsorshipType: "",
          budget: "",
          interests: "",
          message: "",
        })
      } else {
        toast.error(data.error || "Failed to submit application. Please try again.")
      }
    } catch (error) {
      toast.error("An error occurred. Please try again.")
      console.error("Sponsor application error:", error)
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-blue-600 to-purple-700 text-white py-20">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-5xl font-bold mb-6">Become a Sponsor</h1>
            <p className="text-xl opacity-90 mb-8">
              Partner with us to create lasting impact and build a better future for communities in need. Your
              sponsorship drives meaningful change while enhancing your brand's social responsibility.
            </p>
            <div className="flex flex-wrap justify-center gap-6 text-lg">
              <div className="flex items-center gap-2">
                <Users className="w-6 h-6" />
                <span>50+ Corporate Partners</span>
              </div>
              <div className="flex items-center gap-2">
                <Target className="w-6 h-6" />
                <span>₹2.5Cr+ Raised</span>
              </div>
              <div className="flex items-center gap-2">
                <Award className="w-6 h-6" />
                <span>100% Transparency</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      <div className="container mx-auto px-4 py-12">
        {/* Why Sponsor Us */}
        <section className="mb-16">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">Why Sponsor Hope Foundation?</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Join leading companies in making a difference while achieving your CSR goals and building brand value.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <Card className="text-center">
              <CardHeader>
                <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Target className="w-8 h-8 text-blue-600" />
                </div>
                <CardTitle>Measurable Impact</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600">
                  Track your contribution's impact with detailed reports, metrics, and success stories from
                  beneficiaries.
                </p>
              </CardContent>
            </Card>

            <Card className="text-center">
              <CardHeader>
                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Award className="w-8 h-8 text-green-600" />
                </div>
                <CardTitle>Brand Recognition</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600">
                  Enhance your brand reputation through association with meaningful social causes and community impact.
                </p>
              </CardContent>
            </Card>

            <Card className="text-center">
              <CardHeader>
                <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Users className="w-8 h-8 text-purple-600" />
                </div>
                <CardTitle>Employee Engagement</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600">
                  Boost employee morale and engagement through volunteer opportunities and purpose-driven initiatives.
                </p>
              </CardContent>
            </Card>
          </div>
        </section>

        {/* Sponsorship Tiers */}
        <section className="mb-16">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">Sponsorship Tiers</h2>
            <p className="text-xl text-gray-600">Choose the sponsorship level that aligns with your goals and budget</p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {sponsorshipTiers.map((tier, index) => (
              <Card key={index} className="relative overflow-hidden">
                <div className={`h-2 ${tier.color}`}></div>
                <CardHeader className="text-center">
                  <CardTitle className="text-lg">{tier.name}</CardTitle>
                  <CardDescription className="text-2xl font-bold text-gray-900">{tier.amount}</CardDescription>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2">
                    {tier.benefits.map((benefit, idx) => (
                      <li key={idx} className="flex items-start gap-2 text-sm">
                        <CheckCircle className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
                        <span>{benefit}</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        {/* Current Sponsors */}
        <section className="mb-16">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">Our Valued Sponsors</h2>
            <p className="text-xl text-gray-600">Proud to partner with these amazing organizations</p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {currentSponsors.map((sponsor, index) => (
              <Card key={index} className="text-center hover:shadow-lg transition-shadow">
                <CardContent className="p-6">
                  <div className="relative h-20 mb-4">
                    <Image
                      src={sponsor.logo || "/placeholder.svg"}
                      alt={sponsor.name}
                      fill
                      className="object-contain"
                    />
                  </div>
                  <h3 className="font-semibold text-lg mb-2">{sponsor.name}</h3>
                  <Badge variant="secondary" className="mb-2">
                    {sponsor.tier} Sponsor
                  </Badge>
                  <p className="text-sm text-gray-600 mb-1">Partner since {sponsor.since}</p>
                  <p className="text-xs text-gray-500">{sponsor.contribution}</p>
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
                <CardTitle className="text-3xl">Apply for Sponsorship</CardTitle>
                <CardDescription className="text-lg">
                  Ready to make a difference? Fill out the form below and we'll get in touch with you.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="grid md:grid-cols-2 gap-6">
                    <div>
                      <Label htmlFor="companyName">Company Name *</Label>
                      <Input
                        id="companyName"
                        value={formData.companyName}
                        onChange={(e) => setFormData({ ...formData, companyName: e.target.value })}
                        required
                      />
                    </div>
                    <div>
                      <Label htmlFor="contactPerson">Contact Person *</Label>
                      <Input
                        id="contactPerson"
                        value={formData.contactPerson}
                        onChange={(e) => setFormData({ ...formData, contactPerson: e.target.value })}
                        required
                      />
                    </div>
                  </div>

                  <div className="grid md:grid-cols-2 gap-6">
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
                        value={formData.phone}
                        onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                        required
                      />
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="website">Company Website</Label>
                    <Input
                      id="website"
                      value={formData.website}
                      onChange={(e) => setFormData({ ...formData, website: e.target.value })}
                      placeholder="https://www.yourcompany.com"
                    />
                  </div>

                  <div className="grid md:grid-cols-2 gap-6">
                    <div>
                      <Label htmlFor="sponsorshipType">Preferred Sponsorship Tier</Label>
                      <Select
                        value={formData.sponsorshipType}
                        onValueChange={(value) => setFormData({ ...formData, sponsorshipType: value })}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select tier" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="platinum">Platinum Sponsor</SelectItem>
                          <SelectItem value="gold">Gold Sponsor</SelectItem>
                          <SelectItem value="silver">Silver Sponsor</SelectItem>
                          <SelectItem value="bronze">Bronze Sponsor</SelectItem>
                          <SelectItem value="custom">Custom Package</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <Label htmlFor="budget">Estimated Budget Range</Label>
                      <Select
                        value={formData.budget}
                        onValueChange={(value) => setFormData({ ...formData, budget: value })}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select budget" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="50k-200k">₹50,000 - ₹2,00,000</SelectItem>
                          <SelectItem value="200k-500k">₹2,00,000 - ₹5,00,000</SelectItem>
                          <SelectItem value="500k-1000k">₹5,00,000 - ₹10,00,000</SelectItem>
                          <SelectItem value="1000k+">₹10,00,000+</SelectItem>
                          <SelectItem value="discuss">Prefer to discuss</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="interests">Areas of Interest</Label>
                    <Input
                      id="interests"
                      value={formData.interests}
                      onChange={(e) => setFormData({ ...formData, interests: e.target.value })}
                      placeholder="e.g., Education, Healthcare, Environment, Women Empowerment"
                    />
                  </div>

                  <div>
                    <Label htmlFor="message">Message</Label>
                    <Textarea
                      id="message"
                      value={formData.message}
                      onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                      placeholder="Tell us about your CSR goals and how you'd like to partner with us..."
                      rows={4}
                    />
                  </div>

                  <Button type="submit" className="w-full h-12 text-lg" disabled={isSubmitting}>
                    <Building className="w-5 h-5 mr-2" />
                    {isSubmitting ? "Submitting..." : "Submit Sponsorship Application"}
                  </Button>
                </form>
              </CardContent>
            </Card>
          </div>
        </section>

        {/* Contact Information */}
        <section className="mt-16">
          <Card className="bg-blue-50">
            <CardContent className="p-8">
              <div className="text-center mb-8">
                <h3 className="text-2xl font-bold text-gray-900 mb-4">Have Questions?</h3>
                <p className="text-gray-600">
                  Our partnership team is here to help you find the perfect sponsorship opportunity.
                </p>
              </div>
              <div className="grid md:grid-cols-2 gap-8">
                <div className="text-center">
                  <Mail className="w-8 h-8 text-blue-600 mx-auto mb-4" />
                  <h4 className="font-semibold mb-2">Email Us</h4>
                  <p className="text-gray-600">partnerships@hopefoundation.org</p>
                </div>
                <div className="text-center">
                  <Phone className="w-8 h-8 text-blue-600 mx-auto mb-4" />
                  <h4 className="font-semibold mb-2">Call Us</h4>
                  <p className="text-gray-600">+91 98765 43210</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </section>
      </div>
    </div>
  )
}
