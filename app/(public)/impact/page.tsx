import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Users, Heart, BookOpen, Stethoscope, Home, Droplets, TreePine, Award } from "lucide-react"
import Image from "next/image"
import Link from "next/link"

export default function ImpactPage() {
  const impactStats = [
    { icon: Users, label: "Lives Directly Impacted", value: "50,000+", color: "text-blue-600" },
    { icon: Heart, label: "Active Volunteers", value: "2,500+", color: "text-red-600" },
    { icon: BookOpen, label: "Children Educated", value: "15,000+", color: "text-green-600" },
    { icon: Stethoscope, label: "Medical Treatments", value: "25,000+", color: "text-purple-600" },
    { icon: Home, label: "Families Housed", value: "1,200+", color: "text-orange-600" },
    { icon: Droplets, label: "Clean Water Access", value: "8,000+", color: "text-cyan-600" },
  ]

  const programs = [
    {
      title: "Education for All",
      description: "Building schools and providing quality education in underserved communities",
      impact: "15,000 children educated",
      progress: 85,
      image: "/placeholder.svg?height=200&width=300",
      stats: [
        { label: "Schools Built", value: "45" },
        { label: "Teachers Trained", value: "200+" },
        { label: "Scholarships Provided", value: "500+" },
      ],
    },
    {
      title: "Healthcare Access",
      description: "Mobile medical units and health centers serving remote areas",
      impact: "25,000 treatments provided",
      progress: 92,
      image: "/placeholder.svg?height=200&width=300",
      stats: [
        { label: "Medical Camps", value: "120" },
        { label: "Health Centers", value: "15" },
        { label: "Vaccinations", value: "8,000+" },
      ],
    },
    {
      title: "Clean Water Initiative",
      description: "Providing access to clean drinking water and sanitation",
      impact: "8,000 people with clean water access",
      progress: 78,
      image: "/placeholder.svg?height=200&width=300",
      stats: [
        { label: "Wells Constructed", value: "25" },
        { label: "Water Purification Systems", value: "40" },
        { label: "Sanitation Facilities", value: "60" },
      ],
    },
  ]

  const stories = [
    {
      name: "Priya's Education Journey",
      location: "Rural Maharashtra",
      story:
        "Thanks to our scholarship program, Priya became the first in her family to attend university. She's now studying to become a teacher.",
      image: "/placeholder.svg?height=150&width=150",
      category: "Education",
    },
    {
      name: "Village Health Transformation",
      location: "Remote Rajasthan",
      story: "Our mobile medical unit reduced infant mortality by 60% in this village of 500 families over two years.",
      image: "/placeholder.svg?height=150&width=150",
      category: "Healthcare",
    },
    {
      name: "Clean Water Changes Everything",
      location: "Drought-affected Gujarat",
      story: "After installing water purification systems, waterborne diseases dropped by 80% in this community.",
      image: "/placeholder.svg?height=150&width=150",
      category: "Water",
    },
  ]

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-green-600 to-blue-700 text-white py-20">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-5xl font-bold mb-6">Our Impact</h1>
            <p className="text-xl opacity-90 mb-8">
              See how your support is creating real, measurable change in communities across India and beyond. Every
              number represents a life touched, a future brightened.
            </p>
            <Button size="lg" className="bg-white text-green-600 hover:bg-gray-100">
              <Link href="/donate">Join Our Mission</Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Impact Statistics */}
      <section className="py-20 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">Impact by Numbers</h2>
            <p className="text-xl text-gray-600">Measurable change across multiple sectors</p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {impactStats.map((stat, index) => (
              <Card key={index} className="text-center hover:shadow-lg transition-shadow">
                <CardContent className="pt-8">
                  <stat.icon className={`w-12 h-12 mx-auto mb-4 ${stat.color}`} />
                  <div className="text-3xl font-bold text-gray-900 mb-2">{stat.value}</div>
                  <div className="text-gray-600">{stat.label}</div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Program Impact */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">Program Impact</h2>
            <p className="text-xl text-gray-600">Deep dive into our major initiatives and their outcomes</p>
          </div>

          <div className="space-y-12">
            {programs.map((program, index) => (
              <Card key={index} className="overflow-hidden">
                <div className={`grid lg:grid-cols-2 gap-0 ${index % 2 === 1 ? "lg:grid-flow-col-dense" : ""}`}>
                  <div className={`relative h-64 lg:h-auto ${index % 2 === 1 ? "lg:col-start-2" : ""}`}>
                    <Image
                      src={program.image || "/placeholder.svg"}
                      alt={program.title}
                      fill
                      className="object-cover"
                    />
                  </div>
                  <div className="p-8 flex flex-col justify-center">
                    <Badge className="w-fit mb-4">{program.impact}</Badge>
                    <h3 className="text-2xl font-bold text-gray-900 mb-4">{program.title}</h3>
                    <p className="text-gray-600 mb-6">{program.description}</p>

                    <div className="mb-6">
                      <div className="flex justify-between items-center mb-2">
                        <span className="text-sm font-medium">Program Progress</span>
                        <span className="text-sm font-bold">{program.progress}%</span>
                      </div>
                      <Progress value={program.progress} className="h-3" />
                    </div>

                    <div className="grid grid-cols-3 gap-4">
                      {program.stats.map((stat, statIndex) => (
                        <div key={statIndex} className="text-center">
                          <div className="text-2xl font-bold text-blue-600">{stat.value}</div>
                          <div className="text-xs text-gray-600">{stat.label}</div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Success Stories */}
      <section className="py-20 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">Success Stories</h2>
            <p className="text-xl text-gray-600">Real stories from the communities we serve</p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {stories.map((story, index) => (
              <Card key={index} className="hover:shadow-lg transition-shadow">
                <CardHeader className="text-center">
                  <div className="relative w-24 h-24 mx-auto mb-4">
                    <Image
                      src={story.image || "/placeholder.svg"}
                      alt={story.name}
                      fill
                      className="object-cover rounded-full"
                    />
                  </div>
                  <Badge variant="outline">{story.category}</Badge>
                  <CardTitle className="text-xl">{story.name}</CardTitle>
                  <CardDescription>{story.location}</CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-600 text-center">{story.story}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Geographic Impact */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">Geographic Reach</h2>
            <p className="text-xl text-gray-600">Our programs span across multiple countries and regions</p>
          </div>

          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <div className="space-y-6">
                <div className="flex items-center justify-between p-4 bg-blue-50 rounded-lg">
                  <span className="font-semibold">India</span>
                  <span className="text-blue-600 font-bold">8 states, 45 districts</span>
                </div>
                <div className="flex items-center justify-between p-4 bg-green-50 rounded-lg">
                  <span className="font-semibold">Nepal</span>
                  <span className="text-green-600 font-bold">3 provinces, 12 districts</span>
                </div>
                <div className="flex items-center justify-between p-4 bg-purple-50 rounded-lg">
                  <span className="font-semibold">Bangladesh</span>
                  <span className="text-purple-600 font-bold">2 divisions, 8 districts</span>
                </div>
                <div className="flex items-center justify-between p-4 bg-orange-50 rounded-lg">
                  <span className="font-semibold">Sri Lanka</span>
                  <span className="text-orange-600 font-bold">4 provinces, 15 districts</span>
                </div>
              </div>
            </div>

            <div className="relative h-96 bg-gray-100 rounded-lg flex items-center justify-center">
              <div className="text-center">
                <TreePine className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-600">Interactive Map Coming Soon</p>
                <p className="text-sm text-gray-500">Detailed geographic visualization of our impact</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Awards and Recognition */}
      <section className="py-20 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">Awards & Recognition</h2>
            <p className="text-xl text-gray-600">Our impact has been recognized by leading organizations</p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            <Card className="text-center">
              <CardContent className="pt-8">
                <Award className="w-12 h-12 mx-auto mb-4 text-yellow-600" />
                <h3 className="font-semibold mb-2">UN SDG Award</h3>
                <p className="text-sm text-gray-600">Outstanding contribution to Sustainable Development Goals</p>
                <Badge className="mt-2">2023</Badge>
              </CardContent>
            </Card>

            <Card className="text-center">
              <CardContent className="pt-8">
                <Award className="w-12 h-12 mx-auto mb-4 text-blue-600" />
                <h3 className="font-semibold mb-2">National NGO Excellence</h3>
                <p className="text-sm text-gray-600">Best NGO in Education Category</p>
                <Badge className="mt-2">2023</Badge>
              </CardContent>
            </Card>

            <Card className="text-center">
              <CardContent className="pt-8">
                <Award className="w-12 h-12 mx-auto mb-4 text-green-600" />
                <h3 className="font-semibold mb-2">Social Impact Award</h3>
                <p className="text-sm text-gray-600">Recognized for healthcare initiatives</p>
                <Badge className="mt-2">2022</Badge>
              </CardContent>
            </Card>

            <Card className="text-center">
              <CardContent className="pt-8">
                <Award className="w-12 h-12 mx-auto mb-4 text-purple-600" />
                <h3 className="font-semibold mb-2">Transparency Excellence</h3>
                <p className="text-sm text-gray-600">Outstanding financial transparency</p>
                <Badge className="mt-2">2022</Badge>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="py-20 bg-gradient-to-r from-green-600 to-blue-700 text-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-4xl font-bold mb-6">Be Part of Our Impact</h2>
          <p className="text-xl mb-8 opacity-90 max-w-2xl mx-auto">
            Every donation, every volunteer hour, every share makes a difference. Join us in creating positive change
            that lasts.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" className="bg-white text-green-600 hover:bg-gray-100">
              <Link href="/donate">Donate Now</Link>
            </Button>
            <Button size="lg" variant="outline" className="border-white text-white hover:bg-white hover:text-green-600">
              <Link href="/volunteer">Become a Volunteer</Link>
            </Button>
          </div>
        </div>
      </section>
    </div>
  )
}
