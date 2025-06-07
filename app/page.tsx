import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Heart, Users, Target, ArrowRight, Globe, Handshake, BookOpen } from "lucide-react"
import Link from "next/link"
import Image from "next/image"

export default function HomePage() {
  const campaigns = [
    {
      id: 1,
      title: "Clean Water Initiative",
      description: "Providing clean drinking water to rural communities",
      goal: 50000,
      raised: 32500,
      image: "/placeholder.svg?height=200&width=300",
    },
    {
      id: 2,
      title: "Education for All",
      description: "Building schools and providing educational resources",
      goal: 75000,
      raised: 45000,
      image: "/placeholder.svg?height=200&width=300",
    },
    {
      id: 3,
      title: "Healthcare Access",
      description: "Mobile medical units for remote areas",
      goal: 100000,
      raised: 68000,
      image: "/placeholder.svg?height=200&width=300",
    },
  ]

  const stats = [
    { label: "Lives Impacted", value: "50,000+", icon: Heart },
    { label: "Active Volunteers", value: "2,500+", icon: Users },
    { label: "Projects Completed", value: "150+", icon: Target },
    { label: "Countries Served", value: "12", icon: Globe },
  ]

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-r from-blue-600 to-purple-700 text-white py-20">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <h1 className="text-5xl font-bold mb-6">Making a Difference, One Life at a Time</h1>
              <p className="text-xl mb-8 opacity-90">
                Join us in our mission to create positive change in communities worldwide. Together, we can build a
                better tomorrow for everyone.
              </p>
              <div className="flex gap-4">
                <Button size="lg" className="bg-white text-blue-600 hover:bg-gray-100">
                  <Link href="/donate" className="flex items-center gap-2">
                    Donate Now <Heart className="w-4 h-4" />
                  </Link>
                </Button>
                <Button
                  size="lg"
                  variant="outline"
                  className="border-white text-white hover:bg-white hover:text-blue-600"
                >
                  <Link href="/volunteer" className="flex items-center gap-2">
                    Volunteer <Users className="w-4 h-4" />
                  </Link>
                </Button>
              </div>
            </div>
            <div className="relative">
              <Image
                src="/placeholder.svg?height=400&width=500"
                alt="NGO Impact"
                width={500}
                height={400}
                className="rounded-lg shadow-2xl"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <div key={index} className="text-center">
                <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-100 rounded-full mb-4">
                  <stat.icon className="w-8 h-8 text-blue-600" />
                </div>
                <div className="text-3xl font-bold text-gray-900 mb-2">{stat.value}</div>
                <div className="text-gray-600">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Active Campaigns */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">Active Campaigns</h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Support our ongoing initiatives that are making a real difference in communities around the world.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {campaigns.map((campaign) => (
              <Card key={campaign.id} className="overflow-hidden hover:shadow-lg transition-shadow">
                <div className="relative h-48">
                  <Image
                    src={campaign.image || "/placeholder.svg"}
                    alt={campaign.title}
                    fill
                    className="object-cover"
                  />
                </div>
                <CardHeader>
                  <CardTitle className="text-xl">{campaign.title}</CardTitle>
                  <CardDescription>{campaign.description}</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div>
                      <div className="flex justify-between text-sm mb-2">
                        <span>Raised: ₹{campaign.raised.toLocaleString()}</span>
                        <span>Goal: ₹{campaign.goal.toLocaleString()}</span>
                      </div>
                      <Progress value={(campaign.raised / campaign.goal) * 100} className="h-2" />
                    </div>
                    <Button className="w-full">
                      <Link href={`/campaigns/${campaign.id}`} className="flex items-center gap-2">
                        Support This Cause <ArrowRight className="w-4 h-4" />
                      </Link>
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          <div className="text-center mt-12">
            <Button variant="outline" size="lg">
              <Link href="/campaigns">View All Campaigns</Link>
            </Button>
          </div>
        </div>
      </section>

      {/* How We Help */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">How We Make an Impact</h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Our comprehensive approach ensures sustainable change in the communities we serve.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="inline-flex items-center justify-center w-20 h-20 bg-blue-100 rounded-full mb-6">
                <Heart className="w-10 h-10 text-blue-600" />
              </div>
              <h3 className="text-2xl font-semibold mb-4">Direct Aid</h3>
              <p className="text-gray-600">
                Providing immediate relief and support to those in urgent need through our emergency response programs.
              </p>
            </div>

            <div className="text-center">
              <div className="inline-flex items-center justify-center w-20 h-20 bg-green-100 rounded-full mb-6">
                <Handshake className="w-10 h-10 text-green-600" />
              </div>
              <h3 className="text-2xl font-semibold mb-4">Community Building</h3>
              <p className="text-gray-600">
                Empowering local communities through skill development, infrastructure, and sustainable programs.
              </p>
            </div>

            <div className="text-center">
              <div className="inline-flex items-center justify-center w-20 h-20 bg-purple-100 rounded-full mb-6">
                <BookOpen className="w-10 h-10 text-purple-600" />
              </div>
              <h3 className="text-2xl font-semibold mb-4">Education & Awareness</h3>
              <p className="text-gray-600">
                Creating lasting change through education, training, and awareness programs for sustainable development.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="py-16 bg-blue-600 text-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-4xl font-bold mb-6">Ready to Make a Difference?</h2>
          <p className="text-xl mb-8 opacity-90 max-w-2xl mx-auto">
            Join thousands of supporters who are helping us create positive change. Every contribution, big or small,
            makes a meaningful impact.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" className="bg-white text-blue-600 hover:bg-gray-100">
              <Link href="/donate">Start Donating</Link>
            </Button>
            <Button size="lg" variant="outline" className="border-white text-white hover:bg-white hover:text-blue-600">
              <Link href="/volunteer">Become a Volunteer</Link>
            </Button>
            <Button size="lg" variant="outline" className="border-white text-white hover:bg-white hover:text-blue-600">
              <Link href="/about">Learn More</Link>
            </Button>
          </div>
        </div>
      </section>
    </div>
  )
}
