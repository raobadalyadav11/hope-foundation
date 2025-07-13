"use client"

import type React from "react"

import { useState } from "react"
import { useSession } from "next-auth/react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { CheckCircle, Rocket, Users, TrendingUp, Share2, Heart } from "lucide-react"
import Image from "next/image"
import { toast } from "sonner"

export default function FundraisePage() {
  const { data: session } = useSession()
  const router = useRouter()
  const [activeTab, setActiveTab] = useState("individual")
  const [formData, setFormData] = useState({
    campaignTitle: "",
    category: "",
    goal: "",
    description: "",
    story: "",
    beneficiaries: "",
    timeline: "",
    organizerName: session?.user?.name || "",
    organizerEmail: session?.user?.email || "",
    organizerPhone: "",
    organizationType: "",
    registrationNumber: "",
    website: "",
  })

  const fundraisingTypes = [
    {
      type: "individual",
      title: "Individual Fundraiser",
      description: "Start a personal fundraising campaign for a cause you care about",
      icon: Heart,
      color: "bg-pink-100 text-pink-600",
      features: [
        "Easy campaign setup",
        "Social media integration",
        "Personal fundraising page",
        "Direct donation collection",
        "Progress tracking",
      ],
    },
    {
      type: "organization",
      title: "Organization Fundraiser",
      description: "Launch institutional fundraising campaigns with advanced features",
      icon: Users,
      color: "bg-blue-100 text-blue-600",
      features: [
        "Advanced campaign management",
        "Team collaboration tools",
        "Corporate partnership support",
        "Detailed analytics",
        "Custom branding options",
      ],
    },
  ]

  const successStories = [
    {
      title: "Education for Rural Children",
      organizer: "Priya Sharma",
      raised: "₹8,50,000",
      goal: "₹10,00,000",
      supporters: 245,
      image: "/event.png?height=200&width=300",
      description: "Building a school in rural Maharashtra",
    },
    {
      title: "Medical Treatment Fund",
      organizer: "Rajesh Kumar",
      raised: "₹15,75,000",
      goal: "₹20,00,000",
      supporters: 432,
      image: "/event.png?height=200&width=300",
      description: "Supporting cancer treatment for underprivileged patients",
    },
    {
      title: "Clean Water Initiative",
      organizer: "Green Earth Foundation",
      raised: "₹25,00,000",
      goal: "₹25,00,000",
      supporters: 678,
      image: "/event.png?height=200&width=300",
      description: "Installing water purification systems in villages",
    },
  ]

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!session) {
      toast.error("Please login to start a fundraiser")
      router.push("/auth/signin")
      return
    }

    try {
      const response = await fetch("/api/fundraisers/create", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...formData,
          type: activeTab,
          organizerId: session.user.id,
        }),
      })

      if (response.ok) {
        const data = await response.json()
        toast.success("Fundraiser created successfully! Redirecting to your campaign page...")
        router.push(`/fundraisers/${data.id}`)
      } else {
        const error = await response.json()
        toast.error(error.message || "Failed to create fundraiser")
      }
    } catch (error) {
      toast.error("An error occurred. Please try again.")
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-green-600 to-teal-700 text-white py-20">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-5xl font-bold mb-6">Start Your Fundraiser</h1>
            <p className="text-xl opacity-90 mb-8">
              Turn your passion into action. Create a fundraising campaign and mobilize your community to support the
              causes that matter most to you.
            </p>
            <div className="flex flex-wrap justify-center gap-6 text-lg">
              <div className="flex items-center gap-2">
                <Rocket className="w-6 h-6" />
                <span>Easy Setup</span>
              </div>
              <div className="flex items-center gap-2">
                <Share2 className="w-6 h-6" />
                <span>Social Sharing</span>
              </div>
              <div className="flex items-center gap-2">
                <TrendingUp className="w-6 h-6" />
                <span>Real-time Tracking</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      <div className="container mx-auto px-4 py-12">
        {/* How It Works */}
        <section className="mb-16">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">How Fundraising Works</h2>
            <p className="text-xl text-gray-600">Simple steps to launch your successful fundraising campaign</p>
          </div>

          <div className="grid md:grid-cols-4 gap-6">
            {[
              {
                step: "1",
                title: "Create Campaign",
                description: "Set up your fundraising page with compelling story and goal",
              },
              { step: "2", title: "Share & Promote", description: "Share with friends, family, and social networks" },
              {
                step: "3",
                title: "Collect Donations",
                description: "Receive secure donations directly to your campaign",
              },
              {
                step: "4",
                title: "Make Impact",
                description: "Use funds to create meaningful change in your community",
              },
            ].map((step, index) => (
              <Card key={index} className="text-center">
                <CardContent className="p-6">
                  <div className="w-12 h-12 bg-green-600 text-white rounded-full flex items-center justify-center mx-auto mb-4 text-xl font-bold">
                    {step.step}
                  </div>
                  <h3 className="font-semibold text-lg mb-2">{step.title}</h3>
                  <p className="text-sm text-gray-600">{step.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        {/* Fundraising Types */}
        <section className="mb-16">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">Choose Your Fundraising Type</h2>
            <p className="text-xl text-gray-600">Select the option that best fits your fundraising goals</p>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            {fundraisingTypes.map((type, index) => (
              <Card
                key={index}
                className={`hover:shadow-lg transition-shadow ${activeTab === type.type ? "ring-2 ring-green-500" : ""}`}
              >
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
                  <ul className="space-y-2 mb-4">
                    {type.features.map((feature, idx) => (
                      <li key={idx} className="flex items-start gap-2">
                        <CheckCircle className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
                        <span className="text-sm">{feature}</span>
                      </li>
                    ))}
                  </ul>
                  <Button
                    variant={activeTab === type.type ? "default" : "outline"}
                    className="w-full"
                    onClick={() => setActiveTab(type.type)}
                  >
                    {activeTab === type.type ? "Selected" : "Choose This Option"}
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        {/* Success Stories */}
        <section className="mb-16">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">Success Stories</h2>
            <p className="text-xl text-gray-600">See how others have made a difference through fundraising</p>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            {successStories.map((story, index) => (
              <Card key={index} className="hover:shadow-lg transition-shadow">
                <div className="relative h-48">
                  <Image
                    src={story.image || "/event.png"}
                    alt={story.title}
                    fill
                    className="object-cover rounded-t-lg"
                  />
                </div>
                <CardContent className="p-6">
                  <h3 className="font-semibold text-lg mb-2">{story.title}</h3>
                  <p className="text-sm text-gray-600 mb-3">{story.description}</p>
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>
                        Raised: <span className="font-semibold text-green-600">{story.raised}</span>
                      </span>
                      <span>Goal: {story.goal}</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div
                        className="bg-green-600 h-2 rounded-full"
                        style={{
                          width: `${(Number.parseInt(story.raised.replace(/[₹,]/g, "")) / Number.parseInt(story.goal.replace(/[₹,]/g, ""))) * 100}%`,
                        }}
                      ></div>
                    </div>
                    <div className="flex justify-between text-xs text-gray-500">
                      <span>By {story.organizer}</span>
                      <span>{story.supporters} supporters</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        {/* Create Fundraiser Form */}
        <section>
          <div className="max-w-4xl mx-auto">
            <Card>
              <CardHeader className="text-center">
                <CardTitle className="text-3xl">Create Your Fundraiser</CardTitle>
                <CardDescription className="text-lg">
                  Fill in the details below to launch your fundraising campaign
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
                  <TabsList className="grid w-full grid-cols-2">
                    <TabsTrigger value="individual">Individual Fundraiser</TabsTrigger>
                    <TabsTrigger value="organization">Organization Fundraiser</TabsTrigger>
                  </TabsList>

                  <TabsContent value="individual" className="mt-6">
                    <form onSubmit={handleSubmit} className="space-y-6">
                      {/* Campaign Details */}
                      <div className="space-y-4">
                        <h3 className="text-lg font-semibold">Campaign Details</h3>

                        <div>
                          <Label htmlFor="campaignTitle">Campaign Title *</Label>
                          <Input
                            id="campaignTitle"
                            value={formData.campaignTitle}
                            onChange={(e) => setFormData({ ...formData, campaignTitle: e.target.value })}
                            placeholder="Give your campaign a compelling title"
                            required
                          />
                        </div>

                        <div className="grid md:grid-cols-2 gap-4">
                          <div>
                            <Label htmlFor="category">Category *</Label>
                            <Select
                              value={formData.category}
                              onValueChange={(value) => setFormData({ ...formData, category: value })}
                            >
                              <SelectTrigger>
                                <SelectValue placeholder="Select category" />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="education">Education</SelectItem>
                                <SelectItem value="healthcare">Healthcare</SelectItem>
                                <SelectItem value="environment">Environment</SelectItem>
                                <SelectItem value="poverty">Poverty Alleviation</SelectItem>
                                <SelectItem value="disaster-relief">Disaster Relief</SelectItem>
                                <SelectItem value="women-empowerment">Women Empowerment</SelectItem>
                                <SelectItem value="child-welfare">Child Welfare</SelectItem>
                                <SelectItem value="elderly-care">Elderly Care</SelectItem>
                                <SelectItem value="other">Other</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>
                          <div>
                            <Label htmlFor="goal">Fundraising Goal (₹) *</Label>
                            <Input
                              id="goal"
                              type="number"
                              value={formData.goal}
                              onChange={(e) => setFormData({ ...formData, goal: e.target.value })}
                              placeholder="Enter target amount"
                              min="1000"
                              required
                            />
                          </div>
                        </div>

                        <div>
                          <Label htmlFor="description">Short Description *</Label>
                          <Textarea
                            id="description"
                            value={formData.description}
                            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                            placeholder="Brief description of your campaign (max 200 characters)"
                            maxLength={200}
                            rows={3}
                            required
                          />
                        </div>

                        <div>
                          <Label htmlFor="story">Your Story *</Label>
                          <Textarea
                            id="story"
                            value={formData.story}
                            onChange={(e) => setFormData({ ...formData, story: e.target.value })}
                            placeholder="Tell your story - why is this cause important to you? How will the funds be used?"
                            rows={6}
                            required
                          />
                        </div>

                        <div className="grid md:grid-cols-2 gap-4">
                          <div>
                            <Label htmlFor="beneficiaries">Number of Beneficiaries</Label>
                            <Input
                              id="beneficiaries"
                              type="number"
                              value={formData.beneficiaries}
                              onChange={(e) => setFormData({ ...formData, beneficiaries: e.target.value })}
                              placeholder="How many people will benefit?"
                              min="1"
                            />
                          </div>
                          <div>
                            <Label htmlFor="timeline">Campaign Duration</Label>
                            <Select
                              value={formData.timeline}
                              onValueChange={(value) => setFormData({ ...formData, timeline: value })}
                            >
                              <SelectTrigger>
                                <SelectValue placeholder="Select duration" />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="30">30 days</SelectItem>
                                <SelectItem value="60">60 days</SelectItem>
                                <SelectItem value="90">90 days</SelectItem>
                                <SelectItem value="120">120 days</SelectItem>
                                <SelectItem value="custom">Custom duration</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>
                        </div>
                      </div>

                      {/* Organizer Details */}
                      <div className="space-y-4">
                        <h3 className="text-lg font-semibold">Your Details</h3>

                        <div className="grid md:grid-cols-2 gap-4">
                          <div>
                            <Label htmlFor="organizerName">Full Name *</Label>
                            <Input
                              id="organizerName"
                              value={formData.organizerName}
                              onChange={(e) => setFormData({ ...formData, organizerName: e.target.value })}
                              required
                            />
                          </div>
                          <div>
                            <Label htmlFor="organizerEmail">Email Address *</Label>
                            <Input
                              id="organizerEmail"
                              type="email"
                              value={formData.organizerEmail}
                              onChange={(e) => setFormData({ ...formData, organizerEmail: e.target.value })}
                              required
                            />
                          </div>
                        </div>

                        <div>
                          <Label htmlFor="organizerPhone">Phone Number *</Label>
                          <Input
                            id="organizerPhone"
                            value={formData.organizerPhone}
                            onChange={(e) => setFormData({ ...formData, organizerPhone: e.target.value })}
                            required
                          />
                        </div>
                      </div>

                      <Button type="submit" className="w-full h-12 text-lg">
                        <Rocket className="w-5 h-5 mr-2" />
                        Launch My Fundraiser
                      </Button>
                    </form>
                  </TabsContent>

                  <TabsContent value="organization" className="mt-6">
                    <form onSubmit={handleSubmit} className="space-y-6">
                      {/* Campaign Details - Same as individual */}
                      <div className="space-y-4">
                        <h3 className="text-lg font-semibold">Campaign Details</h3>

                        <div>
                          <Label htmlFor="campaignTitle">Campaign Title *</Label>
                          <Input
                            id="campaignTitle"
                            value={formData.campaignTitle}
                            onChange={(e) => setFormData({ ...formData, campaignTitle: e.target.value })}
                            placeholder="Give your campaign a compelling title"
                            required
                          />
                        </div>

                        <div className="grid md:grid-cols-2 gap-4">
                          <div>
                            <Label htmlFor="category">Category *</Label>
                            <Select
                              value={formData.category}
                              onValueChange={(value) => setFormData({ ...formData, category: value })}
                            >
                              <SelectTrigger>
                                <SelectValue placeholder="Select category" />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="education">Education</SelectItem>
                                <SelectItem value="healthcare">Healthcare</SelectItem>
                                <SelectItem value="environment">Environment</SelectItem>
                                <SelectItem value="poverty">Poverty Alleviation</SelectItem>
                                <SelectItem value="disaster-relief">Disaster Relief</SelectItem>
                                <SelectItem value="women-empowerment">Women Empowerment</SelectItem>
                                <SelectItem value="child-welfare">Child Welfare</SelectItem>
                                <SelectItem value="elderly-care">Elderly Care</SelectItem>
                                <SelectItem value="other">Other</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>
                          <div>
                            <Label htmlFor="goal">Fundraising Goal (₹) *</Label>
                            <Input
                              id="goal"
                              type="number"
                              value={formData.goal}
                              onChange={(e) => setFormData({ ...formData, goal: e.target.value })}
                              placeholder="Enter target amount"
                              min="10000"
                              required
                            />
                          </div>
                        </div>

                        <div>
                          <Label htmlFor="description">Short Description *</Label>
                          <Textarea
                            id="description"
                            value={formData.description}
                            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                            placeholder="Brief description of your campaign (max 200 characters)"
                            maxLength={200}
                            rows={3}
                            required
                          />
                        </div>

                        <div>
                          <Label htmlFor="story">Campaign Story *</Label>
                          <Textarea
                            id="story"
                            value={formData.story}
                            onChange={(e) => setFormData({ ...formData, story: e.target.value })}
                            placeholder="Describe your organization's mission, the specific need, and how funds will be utilized"
                            rows={6}
                            required
                          />
                        </div>

                        <div className="grid md:grid-cols-2 gap-4">
                          <div>
                            <Label htmlFor="beneficiaries">Number of Beneficiaries</Label>
                            <Input
                              id="beneficiaries"
                              type="number"
                              value={formData.beneficiaries}
                              onChange={(e) => setFormData({ ...formData, beneficiaries: e.target.value })}
                              placeholder="How many people will benefit?"
                              min="1"
                            />
                          </div>
                          <div>
                            <Label htmlFor="timeline">Campaign Duration</Label>
                            <Select
                              value={formData.timeline}
                              onValueChange={(value) => setFormData({ ...formData, timeline: value })}
                            >
                              <SelectTrigger>
                                <SelectValue placeholder="Select duration" />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="60">60 days</SelectItem>
                                <SelectItem value="90">90 days</SelectItem>
                                <SelectItem value="120">120 days</SelectItem>
                                <SelectItem value="180">180 days</SelectItem>
                                <SelectItem value="365">1 year</SelectItem>
                                <SelectItem value="custom">Custom duration</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>
                        </div>
                      </div>

                      {/* Organization Details */}
                      <div className="space-y-4">
                        <h3 className="text-lg font-semibold">Organization Details</h3>

                        <div className="grid md:grid-cols-2 gap-4">
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
                                <SelectItem value="trust">Trust</SelectItem>
                                <SelectItem value="society">Society</SelectItem>
                                <SelectItem value="foundation">Foundation</SelectItem>
                                <SelectItem value="cooperative">Cooperative</SelectItem>
                                <SelectItem value="other">Other</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>
                          <div>
                            <Label htmlFor="registrationNumber">Registration Number</Label>
                            <Input
                              id="registrationNumber"
                              value={formData.registrationNumber}
                              onChange={(e) => setFormData({ ...formData, registrationNumber: e.target.value })}
                              placeholder="Organization registration number"
                            />
                          </div>
                        </div>

                        <div>
                          <Label htmlFor="website">Organization Website</Label>
                          <Input
                            id="website"
                            value={formData.website}
                            onChange={(e) => setFormData({ ...formData, website: e.target.value })}
                            placeholder="https://www.yourorganization.org"
                          />
                        </div>

                        <div className="grid md:grid-cols-2 gap-4">
                          <div>
                            <Label htmlFor="organizerName">Contact Person *</Label>
                            <Input
                              id="organizerName"
                              value={formData.organizerName}
                              onChange={(e) => setFormData({ ...formData, organizerName: e.target.value })}
                              required
                            />
                          </div>
                          <div>
                            <Label htmlFor="organizerEmail">Contact Email *</Label>
                            <Input
                              id="organizerEmail"
                              type="email"
                              value={formData.organizerEmail}
                              onChange={(e) => setFormData({ ...formData, organizerEmail: e.target.value })}
                              required
                            />
                          </div>
                        </div>

                        <div>
                          <Label htmlFor="organizerPhone">Contact Phone *</Label>
                          <Input
                            id="organizerPhone"
                            value={formData.organizerPhone}
                            onChange={(e) => setFormData({ ...formData, organizerPhone: e.target.value })}
                            required
                          />
                        </div>
                      </div>

                      <Button type="submit" className="w-full h-12 text-lg">
                        <Rocket className="w-5 h-5 mr-2" />
                        Launch Organization Fundraiser
                      </Button>
                    </form>
                  </TabsContent>
                </Tabs>
              </CardContent>
            </Card>
          </div>
        </section>
      </div>
    </div>
  )
}
