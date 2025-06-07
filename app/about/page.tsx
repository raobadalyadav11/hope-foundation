import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Heart, Users, Globe, Award, Target, Handshake } from "lucide-react"
import Image from "next/image"

export default function AboutPage() {
  const values = [
    {
      icon: Heart,
      title: "Compassion",
      description:
        "We approach every situation with empathy and understanding, putting human dignity at the center of our work.",
    },
    {
      icon: Handshake,
      title: "Integrity",
      description: "We maintain the highest standards of transparency and accountability in all our operations.",
    },
    {
      icon: Users,
      title: "Collaboration",
      description: "We believe in the power of partnerships and community-driven solutions for lasting impact.",
    },
    {
      icon: Target,
      title: "Impact",
      description: "We focus on measurable outcomes and sustainable change that transforms lives and communities.",
    },
  ]

  const team = [
    {
      name: "Dr. Sarah Johnson",
      role: "Executive Director",
      image: "/placeholder.svg?height=300&width=300",
      bio: "20+ years in international development and humanitarian work.",
    },
    {
      name: "Michael Chen",
      role: "Program Director",
      image: "/placeholder.svg?height=300&width=300",
      bio: "Expert in community development and sustainable programs.",
    },
    {
      name: "Priya Sharma",
      role: "Operations Manager",
      image: "/placeholder.svg?height=300&width=300",
      bio: "Specialist in NGO operations and volunteer coordination.",
    },
    {
      name: "David Rodriguez",
      role: "Finance Director",
      image: "/placeholder.svg?height=300&width=300",
      bio: "Ensures transparent financial management and accountability.",
    },
  ]

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-blue-600 to-purple-700 text-white py-20">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-5xl font-bold mb-6">About Hope Foundation</h1>
            <p className="text-xl opacity-90">
              For over two decades, we've been dedicated to creating positive change in communities around the world
              through sustainable development, education, and humanitarian aid.
            </p>
          </div>
        </div>
      </section>

      {/* Mission & Vision */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-4xl font-bold text-gray-900 mb-6">Our Mission</h2>
              <p className="text-lg text-gray-600 mb-6">
                To empower communities worldwide by providing sustainable solutions to poverty, inequality, and social
                injustice. We work hand-in-hand with local partners to create lasting change that transforms lives and
                builds stronger communities.
              </p>
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <Globe className="w-6 h-6 text-blue-600" />
                  <span className="text-gray-700">Global reach with local impact</span>
                </div>
                <div className="flex items-center gap-3">
                  <Users className="w-6 h-6 text-blue-600" />
                  <span className="text-gray-700">Community-centered approach</span>
                </div>
                <div className="flex items-center gap-3">
                  <Award className="w-6 h-6 text-blue-600" />
                  <span className="text-gray-700">Evidence-based solutions</span>
                </div>
              </div>
            </div>
            <div>
              <Image
                src="/placeholder.svg?height=400&width=500"
                alt="Our Mission"
                width={500}
                height={400}
                className="rounded-lg shadow-lg"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Our Values */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">Our Values</h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              These core values guide everything we do and shape how we approach our work in communities worldwide.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {values.map((value, index) => (
              <Card key={index} className="text-center hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-100 rounded-full mx-auto mb-4">
                    <value.icon className="w-8 h-8 text-blue-600" />
                  </div>
                  <CardTitle className="text-xl">{value.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-600">{value.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Impact Stats */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">Our Impact</h2>
            <p className="text-xl text-gray-600">Numbers that tell our story of positive change</p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            <div className="text-center">
              <div className="text-4xl font-bold text-blue-600 mb-2">50,000+</div>
              <div className="text-gray-600">Lives Impacted</div>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold text-green-600 mb-2">150+</div>
              <div className="text-gray-600">Projects Completed</div>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold text-purple-600 mb-2">12</div>
              <div className="text-gray-600">Countries Served</div>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold text-orange-600 mb-2">2,500+</div>
              <div className="text-gray-600">Active Volunteers</div>
            </div>
          </div>
        </div>
      </section>

      {/* Leadership Team */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">Leadership Team</h2>
            <p className="text-xl text-gray-600">
              Meet the dedicated professionals leading our mission for positive change.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {team.map((member, index) => (
              <Card key={index} className="text-center hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="relative w-32 h-32 mx-auto mb-4">
                    <Image
                      src={member.image || "/placeholder.svg"}
                      alt={member.name}
                      fill
                      className="rounded-full object-cover"
                    />
                  </div>
                  <CardTitle className="text-xl">{member.name}</CardTitle>
                  <CardDescription>
                    <Badge variant="secondary">{member.role}</Badge>
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-600 text-sm">{member.bio}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* History Timeline */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">Our Journey</h2>
            <p className="text-xl text-gray-600">Key milestones in our mission to create positive change</p>
          </div>

          <div className="max-w-4xl mx-auto">
            <div className="space-y-8">
              <div className="flex items-center gap-6">
                <div className="flex-shrink-0 w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center">
                  <span className="text-blue-600 font-bold">2000</span>
                </div>
                <div>
                  <h3 className="text-xl font-semibold mb-2">Foundation Established</h3>
                  <p className="text-gray-600">
                    Hope Foundation was founded with a mission to address poverty and inequality in underserved
                    communities.
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-6">
                <div className="flex-shrink-0 w-16 h-16 bg-green-100 rounded-full flex items-center justify-center">
                  <span className="text-green-600 font-bold">2005</span>
                </div>
                <div>
                  <h3 className="text-xl font-semibold mb-2">International Expansion</h3>
                  <p className="text-gray-600">
                    Expanded operations to 5 countries, focusing on education and healthcare initiatives.
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-6">
                <div className="flex-shrink-0 w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center">
                  <span className="text-purple-600 font-bold">2010</span>
                </div>
                <div>
                  <h3 className="text-xl font-semibold mb-2">Major Milestone</h3>
                  <p className="text-gray-600">
                    Reached 10,000 lives impacted and launched our sustainable development programs.
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-6">
                <div className="flex-shrink-0 w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center">
                  <span className="text-orange-600 font-bold">2020</span>
                </div>
                <div>
                  <h3 className="text-xl font-semibold mb-2">Digital Transformation</h3>
                  <p className="text-gray-600">
                    Launched our digital platform to enhance donor engagement and volunteer coordination.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
