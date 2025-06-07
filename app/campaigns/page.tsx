import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Calendar, MapPin, Users, ArrowRight } from "lucide-react"
import Image from "next/image"
import Link from "next/link"

export default function CampaignsPage() {
  const campaigns = [
    {
      id: 1,
      title: "Clean Water Initiative",
      description:
        "Providing clean drinking water access to rural communities through well construction and water purification systems.",
      longDescription:
        "This comprehensive program focuses on establishing sustainable water sources in remote villages across India and Africa. We work with local communities to build wells, install purification systems, and provide education on water conservation and hygiene practices.",
      goal: 500000,
      raised: 325000,
      donors: 1250,
      daysLeft: 45,
      location: "Rural India & Africa",
      category: "Water & Sanitation",
      image: "/placeholder.svg?height=300&width=400",
      featured: true,
    },
    {
      id: 2,
      title: "Education for All",
      description: "Building schools and providing educational resources to underserved communities worldwide.",
      longDescription:
        "Our education initiative focuses on creating learning opportunities for children in underserved areas. We build schools, train teachers, provide learning materials, and offer scholarship programs to ensure every child has access to quality education.",
      goal: 750000,
      raised: 450000,
      donors: 890,
      daysLeft: 60,
      location: "Southeast Asia",
      category: "Education",
      image: "/placeholder.svg?height=300&width=400",
      featured: true,
    },
    {
      id: 3,
      title: "Healthcare Access Program",
      description: "Mobile medical units and healthcare infrastructure for remote communities.",
      longDescription:
        "This program brings essential healthcare services to remote areas through mobile medical units, telemedicine, and the establishment of community health centers. We focus on preventive care, maternal health, and treatment of common diseases.",
      goal: 1000000,
      raised: 680000,
      donors: 2100,
      daysLeft: 30,
      location: "Sub-Saharan Africa",
      category: "Healthcare",
      image: "/placeholder.svg?height=300&width=400",
      featured: false,
    },
    {
      id: 4,
      title: "Emergency Relief Fund",
      description: "Rapid response to natural disasters and humanitarian crises worldwide.",
      longDescription:
        "Our emergency relief fund enables us to respond quickly to natural disasters, conflicts, and humanitarian crises. We provide immediate aid including food, shelter, medical supplies, and long-term recovery support.",
      goal: 300000,
      raised: 180000,
      donors: 650,
      daysLeft: 90,
      location: "Global",
      category: "Emergency Relief",
      image: "/placeholder.svg?height=300&width=400",
      featured: false,
    },
    {
      id: 5,
      title: "Women Empowerment Initiative",
      description: "Skills training and microfinance programs for women in developing communities.",
      longDescription:
        "This program empowers women through vocational training, microfinance opportunities, and leadership development. We help women start small businesses, gain financial independence, and become leaders in their communities.",
      goal: 400000,
      raised: 240000,
      donors: 780,
      daysLeft: 75,
      location: "South America",
      category: "Women's Rights",
      image: "/placeholder.svg?height=300&width=400",
      featured: false,
    },
    {
      id: 6,
      title: "Child Nutrition Program",
      description: "Combating malnutrition and providing healthy meals to children in need.",
      longDescription:
        "Our nutrition program addresses child malnutrition through school feeding programs, nutrition education, and support for families. We work to ensure children receive the nutrients they need for healthy growth and development.",
      goal: 600000,
      raised: 420000,
      donors: 1500,
      daysLeft: 40,
      location: "Central Africa",
      category: "Nutrition",
      image: "/placeholder.svg?height=300&width=400",
      featured: false,
    },
  ]

  const featuredCampaigns = campaigns.filter((campaign) => campaign.featured)
  const regularCampaigns = campaigns.filter((campaign) => !campaign.featured)

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-blue-600 to-purple-700 text-white py-20">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-5xl font-bold mb-6">Our Campaigns</h1>
            <p className="text-xl opacity-90">
              Support our active campaigns that are creating meaningful change in communities worldwide. Every
              contribution brings us closer to our goals and transforms lives.
            </p>
          </div>
        </div>
      </section>

      {/* Featured Campaigns */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">Featured Campaigns</h2>
            <p className="text-xl text-gray-600">
              Our most urgent and impactful campaigns that need your immediate support.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8 mb-16">
            {featuredCampaigns.map((campaign) => (
              <Card key={campaign.id} className="overflow-hidden hover:shadow-xl transition-shadow">
                <div className="relative h-64">
                  <Image
                    src={campaign.image || "/placeholder.svg"}
                    alt={campaign.title}
                    fill
                    className="object-cover"
                  />
                  <div className="absolute top-4 left-4">
                    <Badge className="bg-red-500 hover:bg-red-600">Featured</Badge>
                  </div>
                  <div className="absolute top-4 right-4">
                    <Badge variant="secondary">{campaign.category}</Badge>
                  </div>
                </div>
                <CardHeader>
                  <CardTitle className="text-2xl">{campaign.title}</CardTitle>
                  <CardDescription className="text-base">{campaign.longDescription}</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-center gap-4 text-sm text-gray-600">
                      <div className="flex items-center gap-1">
                        <MapPin className="w-4 h-4" />
                        {campaign.location}
                      </div>
                      <div className="flex items-center gap-1">
                        <Calendar className="w-4 h-4" />
                        {campaign.daysLeft} days left
                      </div>
                    </div>

                    <div>
                      <div className="flex justify-between text-sm mb-2">
                        <span className="font-semibold">₹{campaign.raised.toLocaleString()} raised</span>
                        <span className="text-gray-600">₹{campaign.goal.toLocaleString()} goal</span>
                      </div>
                      <Progress value={(campaign.raised / campaign.goal) * 100} className="h-3" />
                    </div>

                    <div className="flex justify-between items-center">
                      <div className="flex items-center gap-1 text-sm text-gray-600">
                        <Users className="w-4 h-4" />
                        {campaign.donors} donors
                      </div>
                      <div className="text-sm font-semibold text-green-600">
                        {Math.round((campaign.raised / campaign.goal) * 100)}% funded
                      </div>
                    </div>

                    <div className="flex gap-3">
                      <Button className="flex-1">
                        <Link href={`/campaigns/${campaign.id}`} className="flex items-center gap-2">
                          Learn More <ArrowRight className="w-4 h-4" />
                        </Link>
                      </Button>
                      <Button variant="outline">
                        <Link href="/donate">Donate Now</Link>
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* All Campaigns */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">All Active Campaigns</h2>
            <p className="text-xl text-gray-600">
              Explore all our ongoing campaigns and find a cause that resonates with you.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {regularCampaigns.map((campaign) => (
              <Card key={campaign.id} className="overflow-hidden hover:shadow-lg transition-shadow">
                <div className="relative h-48">
                  <Image
                    src={campaign.image || "/placeholder.svg"}
                    alt={campaign.title}
                    fill
                    className="object-cover"
                  />
                  <div className="absolute top-4 right-4">
                    <Badge variant="secondary">{campaign.category}</Badge>
                  </div>
                </div>
                <CardHeader>
                  <CardTitle className="text-xl">{campaign.title}</CardTitle>
                  <CardDescription>{campaign.description}</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-center gap-4 text-sm text-gray-600">
                      <div className="flex items-center gap-1">
                        <MapPin className="w-4 h-4" />
                        {campaign.location}
                      </div>
                      <div className="flex items-center gap-1">
                        <Calendar className="w-4 h-4" />
                        {campaign.daysLeft} days left
                      </div>
                    </div>

                    <div>
                      <div className="flex justify-between text-sm mb-2">
                        <span>₹{campaign.raised.toLocaleString()}</span>
                        <span className="text-gray-600">₹{campaign.goal.toLocaleString()}</span>
                      </div>
                      <Progress value={(campaign.raised / campaign.goal) * 100} className="h-2" />
                    </div>

                    <div className="flex justify-between items-center">
                      <div className="flex items-center gap-1 text-sm text-gray-600">
                        <Users className="w-4 h-4" />
                        {campaign.donors} donors
                      </div>
                      <div className="text-sm font-semibold text-green-600">
                        {Math.round((campaign.raised / campaign.goal) * 100)}%
                      </div>
                    </div>

                    <Button className="w-full">
                      <Link href={`/campaigns/${campaign.id}`} className="flex items-center gap-2">
                        View Campaign <ArrowRight className="w-4 h-4" />
                      </Link>
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="py-16 bg-blue-600 text-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-4xl font-bold mb-6">Start Your Own Campaign</h2>
          <p className="text-xl mb-8 opacity-90 max-w-2xl mx-auto">
            Have an idea for a campaign that could make a difference? Partner with us to launch your own fundraising
            initiative.
          </p>
          <Button size="lg" className="bg-white text-blue-600 hover:bg-gray-100">
            <Link href="/contact">Get in Touch</Link>
          </Button>
        </div>
      </section>
    </div>
  )
}
