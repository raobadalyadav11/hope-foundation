import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Calendar, User, Search, ArrowRight, BookOpen } from "lucide-react"
import Image from "next/image"
import Link from "next/link"

export default function BlogPage() {
  const featuredPost = {
    id: 1,
    title: "Transforming Lives Through Clean Water: A Year in Review",
    excerpt:
      "Discover how our clean water initiative has impacted over 10,000 lives across 50 villages in the past year. From well construction to community education, see the remarkable transformation happening in rural communities.",
    content: "Our clean water initiative has been one of our most successful programs...",
    author: "Dr. Sarah Johnson",
    date: "2024-01-15",
    readTime: "8 min read",
    category: "Impact Stories",
    image: "/placeholder.svg?height=400&width=600",
    featured: true,
  }

  const blogPosts = [
    {
      id: 2,
      title: "The Power of Education: Building Schools in Remote Areas",
      excerpt:
        "Learn about our education program that has established 25 new schools and trained over 200 teachers in underserved communities.",
      author: "Michael Chen",
      date: "2024-01-10",
      readTime: "6 min read",
      category: "Education",
      image: "/placeholder.svg?height=250&width=350",
    },
    {
      id: 3,
      title: "Healthcare Heroes: Mobile Medical Units Making a Difference",
      excerpt:
        "Meet the dedicated medical professionals bringing healthcare to remote villages through our mobile medical unit program.",
      author: "Dr. Priya Sharma",
      date: "2024-01-08",
      readTime: "5 min read",
      category: "Healthcare",
      image: "/placeholder.svg?height=250&width=350",
    },
    {
      id: 4,
      title: "Volunteer Spotlight: Stories from the Field",
      excerpt:
        "Hear inspiring stories from our volunteers who are making a difference in communities around the world.",
      author: "David Rodriguez",
      date: "2024-01-05",
      readTime: "4 min read",
      category: "Volunteers",
      image: "/placeholder.svg?height=250&width=350",
    },
    {
      id: 5,
      title: "Sustainable Development: Building for the Future",
      excerpt: "Explore our approach to sustainable development and how we're creating lasting change in communities.",
      author: "Dr. Sarah Johnson",
      date: "2024-01-03",
      readTime: "7 min read",
      category: "Sustainability",
      image: "/placeholder.svg?height=250&width=350",
    },
    {
      id: 6,
      title: "Emergency Response: Lessons from Recent Disasters",
      excerpt:
        "Learn about our emergency response protocols and how we've helped communities recover from recent natural disasters.",
      author: "Michael Chen",
      date: "2023-12-28",
      readTime: "6 min read",
      category: "Emergency Relief",
      image: "/placeholder.svg?height=250&width=350",
    },
    {
      id: 7,
      title: "Women Empowerment: Creating Economic Opportunities",
      excerpt:
        "Discover how our women empowerment programs are creating economic opportunities and fostering leadership in communities.",
      author: "Dr. Priya Sharma",
      date: "2023-12-25",
      readTime: "5 min read",
      category: "Women's Rights",
      image: "/placeholder.svg?height=250&width=350",
    },
  ]

  const categories = [
    "All Posts",
    "Impact Stories",
    "Education",
    "Healthcare",
    "Volunteers",
    "Sustainability",
    "Emergency Relief",
    "Women's Rights",
  ]

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-blue-600 to-purple-700 text-white py-20">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-5xl font-bold mb-6">Our Blog</h1>
            <p className="text-xl opacity-90">
              Stay updated with our latest stories, impact reports, and insights from the field. Discover how we're
              making a difference and get inspired by the communities we serve.
            </p>
          </div>
        </div>
      </section>

      <div className="container mx-auto px-4 py-12">
        {/* Search and Filter */}
        <div className="flex flex-col md:flex-row gap-4 mb-12">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <Input placeholder="Search blog posts..." className="pl-10" />
          </div>
          <div className="flex gap-2 flex-wrap">
            {categories.map((category) => (
              <Button key={category} variant="outline" size="sm" className="hover:bg-blue-50 hover:border-blue-300">
                {category}
              </Button>
            ))}
          </div>
        </div>

        {/* Featured Post */}
        <div className="mb-16">
          <h2 className="text-3xl font-bold text-gray-900 mb-8">Featured Story</h2>
          <Card className="overflow-hidden hover:shadow-xl transition-shadow">
            <div className="grid md:grid-cols-2 gap-0">
              <div className="relative h-64 md:h-auto">
                <Image
                  src={featuredPost.image || "/placeholder.svg"}
                  alt={featuredPost.title}
                  fill
                  className="object-cover"
                />
                <div className="absolute top-4 left-4">
                  <Badge className="bg-red-500 hover:bg-red-600">Featured</Badge>
                </div>
              </div>
              <div className="p-8 flex flex-col justify-center">
                <div className="mb-4">
                  <Badge variant="secondary">{featuredPost.category}</Badge>
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-4">{featuredPost.title}</h3>
                <p className="text-gray-600 mb-6">{featuredPost.excerpt}</p>
                <div className="flex items-center gap-4 text-sm text-gray-500 mb-6">
                  <div className="flex items-center gap-1">
                    <User className="w-4 h-4" />
                    {featuredPost.author}
                  </div>
                  <div className="flex items-center gap-1">
                    <Calendar className="w-4 h-4" />
                    {new Date(featuredPost.date).toLocaleDateString()}
                  </div>
                  <div className="flex items-center gap-1">
                    <BookOpen className="w-4 h-4" />
                    {featuredPost.readTime}
                  </div>
                </div>
                <Button>
                  <Link href={`/blog/${featuredPost.id}`} className="flex items-center gap-2">
                    Read Full Story <ArrowRight className="w-4 h-4" />
                  </Link>
                </Button>
              </div>
            </div>
          </Card>
        </div>

        {/* Blog Posts Grid */}
        <div>
          <h2 className="text-3xl font-bold text-gray-900 mb-8">Latest Posts</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {blogPosts.map((post) => (
              <Card key={post.id} className="overflow-hidden hover:shadow-lg transition-shadow">
                <div className="relative h-48">
                  <Image src={post.image || "/placeholder.svg"} alt={post.title} fill className="object-cover" />
                  <div className="absolute top-4 right-4">
                    <Badge variant="secondary">{post.category}</Badge>
                  </div>
                </div>
                <CardHeader>
                  <CardTitle className="text-xl line-clamp-2">{post.title}</CardTitle>
                  <CardDescription className="line-clamp-3">{post.excerpt}</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center gap-4 text-sm text-gray-500 mb-4">
                    <div className="flex items-center gap-1">
                      <User className="w-4 h-4" />
                      {post.author}
                    </div>
                    <div className="flex items-center gap-1">
                      <Calendar className="w-4 h-4" />
                      {new Date(post.date).toLocaleDateString()}
                    </div>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-500">{post.readTime}</span>
                    <Button variant="outline" size="sm">
                      <Link href={`/blog/${post.id}`}>Read More</Link>
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Load More */}
        <div className="text-center mt-12">
          <Button variant="outline" size="lg">
            Load More Posts
          </Button>
        </div>
      </div>

      {/* Newsletter Signup */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">Stay Updated</h2>
          <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
            Subscribe to our newsletter to receive the latest stories, impact reports, and updates directly in your
            inbox.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto">
            <Input placeholder="Enter your email address" className="flex-1" />
            <Button>Subscribe</Button>
          </div>
        </div>
      </section>
    </div>
  )
}
