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
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { CheckCircle, Building, Users, Target, Award, TrendingUp, Globe, Heart } from "lucide-react"
import Image from "next/image"
import { toast } from "sonner"

export default function CorporateCSRPage() {
  const [formData, setFormData] = useState({
    companyName: "",
    industry: "",
    contactPerson: "",
    designation: "",
    email: "",
    phone: "",
    website: "",
    employeeCount: "",
    csrBudget: "",
    focusAreas: "",
    timeline: "",
    message: "",
  })

  const csrPrograms = [
    {
      title: "Education Excellence",
      description: "Transform lives through quality education and skill development",
      icon: Target,
      color: "bg-blue-100 text-blue-600",
      impact: "50,000+ students benefited",
      programs: [
        "Digital literacy programs",
        "Scholarship initiatives",
        "Teacher training programs",
        "Infrastructure development",
        "Vocational skill training",
      ],
    },
    {
      title: "Healthcare Access",
      description: "Ensure healthcare reaches every corner of society",
      icon: Heart,
      color: "bg-red-100 text-red-600",
      impact: "1,00,000+ patients served",
      programs: [
        "Mobile health clinics",
        "Preventive healthcare camps",
        "Medical equipment donation",
        "Health awareness campaigns",
        "Telemedicine initiatives",
      ],
    },
    {
      title: "Environmental Sustainability",
      description: "Build a greener future for generations to come",
      icon: Globe,
      color: "bg-green-100 text-green-600",
      impact: "2,50,000+ trees planted",
      programs: [
        "Reforestation projects",
        "Waste management systems",
        "Renewable energy initiatives",
        "Water conservation projects",
        "Climate awareness programs",
      ],
    },
    {
      title: "Women Empowerment",
      description: "Empower women through skills and opportunities",
      icon: Users,
      color: "bg-purple-100 text-purple-600",
      impact: "25,000+ women empowered",
      programs: [
        "Skill development workshops",
        "Microfinance programs",
        "Leadership training",
        "Entrepreneurship support",
        "Digital inclusion initiatives",
      ],
    },
  ]

  const csrBenefits = [
    {
      title: "Tax Benefits",
      description: "Avail tax deductions up to 2% of average net profit under Section 135",
      icon: TrendingUp,
    },
    {
      title: "Brand Enhancement",
      description: "Strengthen brand reputation and stakeholder trust through social impact",
      icon: Award,
    },
    {
      title: "Employee Engagement",
      description: "Boost employee morale and retention through purpose-driven initiatives",
      icon: Users,
    },
    {
      title: "Compliance",
      description: "Meet CSR compliance requirements with transparent reporting",
      icon: CheckCircle,
    },
  ]

  const corporatePartners = [
    {
      name: "Tata Consultancy Services",
      logo: "/placeholder.svg?height=80&width=120",
      program: "Digital Education Initiative",
      investment: "₹5 Crores",
      impact: "Trained 10,000+ students in digital skills",
    },
    {
      name: "Infosys Foundation",
      logo: "/placeholder.svg?height=80&width=120",
      program: "Healthcare Access Program",
      investment: "₹3 Crores",
      impact: "Established 15 health centers",
    },
    {
      name: "Wipro Cares",
      logo: "/placeholder.svg?height=80&width=120",
      program: "Environmental Conservation",
      investment: "₹2 Crores",
      impact: "Planted 50,000+ trees",
    },
    {
      name: "HCL Foundation",
      logo: "/placeholder.svg?height=80&width=120",
      program: "Women Empowerment",
      investment: "₹4 Crores",
      impact: "Empowered 5,000+ women",
    },
  ]

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    try {
      const response = await fetch("/api/corporate/csr-inquiry", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      })

      if (response.ok) {
        toast.success("CSR inquiry submitted successfully! Our team will contact you within 24 hours.")
        setFormData({
          companyName: "",
          industry: "",
          contactPerson: "",
          designation: "",
          email: "",
          phone: "",
          website: "",
          employeeCount: "",
          csrBudget: "",
          focusAreas: "",
          timeline: "",
          message: "",
        })
      } else {
        toast.error("Failed to submit inquiry. Please try again.")
      }
    } catch (error) {
      toast.error("An error occurred. Please try again.")
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-purple-600 to-blue-700 text-white py-20">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-5xl font-bold mb-6">Corporate CSR Partnership</h1>
            <p className="text-xl opacity-90 mb-8">
              Transform your CSR obligations into meaningful impact. Partner with Hope Foundation to create sustainable
              change while meeting compliance requirements and enhancing your brand value.
            </p>
            <div className="flex flex-wrap justify-center gap-6 text-lg">
              <div className="flex items-center gap-2">
                <Building className="w-6 h-6" />
                <span>100+ Corporate Partners</span>
              </div>
              <div className="flex items-center gap-2">
                <Target className="w-6 h-6" />
                <span>₹50Cr+ CSR Deployed</span>
              </div>
              <div className="flex items-center gap-2">
                <Award className="w-6 h-6" />
                <span>100% Compliance</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      <div className="container mx-auto px-4 py-12">
        {/* CSR Benefits */}
        <section className="mb-16">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">Why Choose Our CSR Partnership?</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              We help you maximize your CSR impact while ensuring full compliance and transparency.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {csrBenefits.map((benefit, index) => (
              <Card key={index} className="text-center hover:shadow-lg transition-shadow">
                <CardContent className="p-6">
                  <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <benefit.icon className="w-8 h-8 text-blue-600" />
                  </div>
                  <h3 className="font-semibold text-lg mb-2">{benefit.title}</h3>
                  <p className="text-sm text-gray-600">{benefit.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        {/* CSR Programs */}
        <section className="mb-16">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">Our CSR Focus Areas</h2>
            <p className="text-xl text-gray-600">Choose from our proven programs or co-create custom initiatives</p>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            {csrPrograms.map((program, index) => (
              <Card key={index} className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="flex items-center gap-4">
                    <div className={`w-12 h-12 rounded-lg flex items-center justify-center ${program.color}`}>
                      <program.icon className="w-6 h-6" />
                    </div>
                    <div>
                      <CardTitle className="text-xl">{program.title}</CardTitle>
                      <CardDescription className="text-base">{program.description}</CardDescription>
                      <Badge variant="secondary" className="mt-2">
                        {program.impact}
                      </Badge>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2">
                    {program.programs.map((item, idx) => (
                      <li key={idx} className="flex items-start gap-2">
                        <CheckCircle className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
                        <span className="text-sm">{item}</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        {/* CSR Process */}
        <section className="mb-16">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">Our CSR Implementation Process</h2>
            <p className="text-xl text-gray-600">Structured approach ensuring maximum impact and compliance</p>
          </div>

          <Tabs defaultValue="planning" className="w-full">
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="planning">Planning</TabsTrigger>
              <TabsTrigger value="implementation">Implementation</TabsTrigger>
              <TabsTrigger value="monitoring">Monitoring</TabsTrigger>
              <TabsTrigger value="reporting">Reporting</TabsTrigger>
            </TabsList>

            <TabsContent value="planning" className="mt-8">
              <Card>
                <CardHeader>
                  <CardTitle>Strategic Planning & Design</CardTitle>
                  <CardDescription>Collaborative approach to design impactful CSR programs</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid md:grid-cols-2 gap-6">
                    <div>
                      <h4 className="font-semibold mb-2">Needs Assessment</h4>
                      <ul className="space-y-1 text-sm text-gray-600">
                        <li>• Community needs analysis</li>
                        <li>• Stakeholder consultation</li>
                        <li>• Impact potential evaluation</li>
                        <li>• Resource requirement mapping</li>
                      </ul>
                    </div>
                    <div>
                      <h4 className="font-semibold mb-2">Program Design</h4>
                      <ul className="space-y-1 text-sm text-gray-600">
                        <li>• Objective setting and KPIs</li>
                        <li>• Implementation timeline</li>
                        <li>• Budget allocation</li>
                        <li>• Risk assessment</li>
                      </ul>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="implementation" className="mt-8">
              <Card>
                <CardHeader>
                  <CardTitle>Program Implementation</CardTitle>
                  <CardDescription>Efficient execution with regular stakeholder engagement</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid md:grid-cols-2 gap-6">
                    <div>
                      <h4 className="font-semibold mb-2">Execution</h4>
                      <ul className="space-y-1 text-sm text-gray-600">
                        <li>• Project team deployment</li>
                        <li>• Community mobilization</li>
                        <li>• Resource allocation</li>
                        <li>• Quality assurance</li>
                      </ul>
                    </div>
                    <div>
                      <h4 className="font-semibold mb-2">Stakeholder Engagement</h4>
                      <ul className="space-y-1 text-sm text-gray-600">
                        <li>• Regular progress updates</li>
                        <li>• Employee volunteer programs</li>
                        <li>• Community feedback sessions</li>
                        <li>• Media and communications</li>
                      </ul>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="monitoring" className="mt-8">
              <Card>
                <CardHeader>
                  <CardTitle>Monitoring & Evaluation</CardTitle>
                  <CardDescription>Continuous tracking and course correction for optimal results</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid md:grid-cols-2 gap-6">
                    <div>
                      <h4 className="font-semibold mb-2">Performance Tracking</h4>
                      <ul className="space-y-1 text-sm text-gray-600">
                        <li>• Real-time dashboard monitoring</li>
                        <li>• KPI measurement</li>
                        <li>• Beneficiary feedback</li>
                        <li>• Financial tracking</li>
                      </ul>
                    </div>
                    <div>
                      <h4 className="font-semibold mb-2">Quality Assurance</h4>
                      <ul className="space-y-1 text-sm text-gray-600">
                        <li>• Third-party evaluations</li>
                        <li>• Impact assessments</li>
                        <li>• Process improvements</li>
                        <li>• Risk mitigation</li>
                      </ul>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="reporting" className="mt-8">
              <Card>
                <CardHeader>
                  <CardTitle>Reporting & Compliance</CardTitle>
                  <CardDescription>Comprehensive reporting ensuring full CSR compliance</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid md:grid-cols-2 gap-6">
                    <div>
                      <h4 className="font-semibold mb-2">Compliance Reporting</h4>
                      <ul className="space-y-1 text-sm text-gray-600">
                        <li>• Annual CSR reports</li>
                        <li>• Board presentation materials</li>
                        <li>• Regulatory compliance</li>
                        <li>• Audit documentation</li>
                      </ul>
                    </div>
                    <div>
                      <h4 className="font-semibold mb-2">Impact Communication</h4>
                      <ul className="space-y-1 text-sm text-gray-600">
                        <li>• Impact stories and case studies</li>
                        <li>• Media coverage reports</li>
                        <li>• Stakeholder presentations</li>
                        <li>• Digital content creation</li>
                      </ul>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </section>

        {/* Corporate Partners */}
        <section className="mb-16">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">Our Corporate Partners</h2>
            <p className="text-xl text-gray-600">Trusted by leading companies for their CSR initiatives</p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {corporatePartners.map((partner, index) => (
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
                  <p className="text-sm text-gray-600 mb-2">{partner.program}</p>
                  <Badge variant="outline" className="mb-2">
                    {partner.investment}
                  </Badge>
                  <p className="text-xs text-green-600 font-medium">{partner.impact}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        {/* CSR Inquiry Form */}
        <section>
          <div className="max-w-4xl mx-auto">
            <Card>
              <CardHeader className="text-center">
                <CardTitle className="text-3xl">CSR Partnership Inquiry</CardTitle>
                <CardDescription className="text-lg">
                  Let's discuss how we can help you achieve your CSR goals with maximum impact.
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
                      <Label htmlFor="industry">Industry *</Label>
                      <Select
                        value={formData.industry}
                        onValueChange={(value) => setFormData({ ...formData, industry: value })}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select industry" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="technology">Technology</SelectItem>
                          <SelectItem value="finance">Finance & Banking</SelectItem>
                          <SelectItem value="healthcare">Healthcare</SelectItem>
                          <SelectItem value="manufacturing">Manufacturing</SelectItem>
                          <SelectItem value="retail">Retail</SelectItem>
                          <SelectItem value="energy">Energy</SelectItem>
                          <SelectItem value="telecommunications">Telecommunications</SelectItem>
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
                      <Label htmlFor="designation">Designation *</Label>
                      <Input
                        id="designation"
                        value={formData.designation}
                        onChange={(e) => setFormData({ ...formData, designation: e.target.value })}
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
                      <Label htmlFor="employeeCount">Employee Count</Label>
                      <Select
                        value={formData.employeeCount}
                        onValueChange={(value) => setFormData({ ...formData, employeeCount: value })}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select range" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="1-50">1-50</SelectItem>
                          <SelectItem value="51-200">51-200</SelectItem>
                          <SelectItem value="201-500">201-500</SelectItem>
                          <SelectItem value="501-1000">501-1000</SelectItem>
                          <SelectItem value="1000+">1000+</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <Label htmlFor="csrBudget">Annual CSR Budget</Label>
                      <Select
                        value={formData.csrBudget}
                        onValueChange={(value) => setFormData({ ...formData, csrBudget: value })}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select range" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="1-10L">₹1-10 Lakhs</SelectItem>
                          <SelectItem value="10-50L">₹10-50 Lakhs</SelectItem>
                          <SelectItem value="50L-1Cr">₹50 Lakhs - 1 Crore</SelectItem>
                          <SelectItem value="1-5Cr">₹1-5 Crores</SelectItem>
                          <SelectItem value="5Cr+">₹5+ Crores</SelectItem>
                          <SelectItem value="discuss">Prefer to discuss</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="focusAreas">CSR Focus Areas of Interest</Label>
                    <Input
                      id="focusAreas"
                      value={formData.focusAreas}
                      onChange={(e) => setFormData({ ...formData, focusAreas: e.target.value })}
                      placeholder="e.g., Education, Healthcare, Environment, Women Empowerment"
                    />
                  </div>

                  <div>
                    <Label htmlFor="timeline">Implementation Timeline</Label>
                    <Select
                      value={formData.timeline}
                      onValueChange={(value) => setFormData({ ...formData, timeline: value })}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select timeline" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="immediate">Immediate (1-3 months)</SelectItem>
                        <SelectItem value="current-fy">Current Financial Year</SelectItem>
                        <SelectItem value="next-fy">Next Financial Year</SelectItem>
                        <SelectItem value="multi-year">Multi-year Program</SelectItem>
                        <SelectItem value="flexible">Flexible</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <Label htmlFor="message">CSR Goals & Requirements</Label>
                    <Textarea
                      id="message"
                      value={formData.message}
                      onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                      placeholder="Tell us about your CSR objectives, compliance requirements, and any specific programs you're interested in..."
                      rows={4}
                    />
                  </div>

                  <Button type="submit" className="w-full h-12 text-lg">
                    <Building className="w-5 h-5 mr-2" />
                    Submit CSR Inquiry
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
