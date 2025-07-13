"use client"

import { useState } from "react"
import { useQuery } from "@tanstack/react-query"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Calendar, User, Search, ArrowRight, BookOpen, Eye } from "lucide-react"
import Image from "next/image"
import Link from "next/link"

interface Blog {
  _id: string
  title: string
  slug: string
  excerpt: string
  featuredImage: string
  authorId: {
    _id: string
    name: string
    profileImage?: string
  }
  authorName: string
  category: string
  tags: string[]
  views: number
  likes: number
  publishedAt: string
  createdAt: string
}

interface BlogsResponse {
  blogs: Blog[]
  pagination: {
    page: number
    limit: number
    total: number
    pages: number
  }
}

export default function BlogPage() {
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedCategory, setSelectedCategory] = useState("all")
  const [currentPage, setCurrentPage] = useState(1)

  const { data: blogsData, isLoading } = useQuery({
    queryKey: ["blogs", selectedCategory, searchTerm, currentPage],
    queryFn: async (): Promise<BlogsResponse> => {
      const params = new URLSearchParams({
        category: selectedCategory === "all" ? "" : selectedCategory,
        search: searchTerm,
        page: currentPage.toString(),
        limit: "9",
        status: "published",
      })

      const response = await fetch(`/api/blogs?${params}`)
      if (!response.ok) throw new Error("Failed to fetch blogs")
      return response.json()
    },
  })

  const { data: featuredBlogs } = useQuery({
    queryKey: ["blogs", "featured"],
    queryFn: async (): Promise<Blog[]> => {
      const response = await fetch("/api/blogs?featured=true&limit=1&status=published")
      if (!response.ok) throw new Error("Failed to fetch featured blogs")
      const data = await response.json()
      return data.blogs
    },
  })

  const blogs = blogsData?.blogs || []
  const pagination = blogsData?.pagination
  const featuredPost = featuredBlogs?.[0]

  const categories = [
    { value: "all", label: "All Posts" },
    { value: "Impact Stories", label: "Impact Stories" },
    { value: "Educational Content", label: "Educational Content" },
    { value: "Community News", label: "Community News" },
    { value: "Volunteer Spotlights", label: "Volunteer Spotlights" },
    { value: "Fundraising Updates", label: "Fundraising Updates" },
    { value: "Event Coverage", label: "Event Coverage" },
  ]

  const calculateReadTime = (content: string) => {
    const wordsPerMinute = 200
    const wordCount = content.split(' ').length
    const readTime = Math.ceil(wordCount / wordsPerMinute)
    return `${readTime} min read`
  }

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
            <Input 
              placeholder="Search blog posts..." 
              className="pl-10" 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <div className="flex gap-2 flex-wrap">
            {categories.map((category) => (
              <Button 
                key={category.value} 
                variant={selectedCategory === category.value ? "default" : "outline"} 
                size="sm" 
                className="hover:bg-blue-50 hover:border-blue-300"
                onClick={() => setSelectedCategory(category.value)}
              >
                {category.label}
              </Button>
            ))}
          </div>
        </div>

        {/* Featured Post */}
        {featuredPost && (
          <div className="mb-16">
            <h2 className="text-3xl font-bold text-gray-900 mb-8">Featured Story</h2>
            <Card className="overflow-hidden hover:shadow-xl transition-shadow">
              <div className="grid md:grid-cols-2 gap-0">
                <div className="relative h-64 md:h-auto">
                  <Image
                    src={featuredPost.featuredImage || "/event.png"}
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
                      {featuredPost.authorName}
                    </div>
                    <div className="flex items-center gap-1">
                      <Calendar className="w-4 h-4" />
                      {new Date(featuredPost.publishedAt).toLocaleDateString()}
                    </div>
                    <div className="flex items-center gap-1">
                      <Eye className="w-4 h-4" />
                      {featuredPost.views} views
                    </div>
                  </div>
                  <Button>
                    <Link href={`/blog/${featuredPost.slug}`} className="flex items-center gap-2">
                      Read Full Story <ArrowRight className="w-4 h-4" />
                    </Link>
                  </Button>
                </div>
              </div>
            </Card>
          </div>
        )}

        {/* Blog Posts Grid */}
        <div>
          <h2 className="text-3xl font-bold text-gray-900 mb-8">Latest Posts</h2>
          
          {isLoading ? (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {[...Array(6)].map((_, i) => (
                <div key={i} className="animate-pulse">
                  <div className="bg-gray-200 h-48 rounded-t-lg"></div>
                  <div className="bg-white p-6 rounded-b-lg border">
                    <div className="h-4 bg-gray-200 rounded mb-2"></div>
                    <div className="h-3 bg-gray-200 rounded mb-4"></div>
                    <div className="h-3 bg-gray-200 rounded w-1/2"></div>
                  </div>
                </div>
              ))}
            </div>
          ) : blogs.length === 0 ? (
            <div className="text-center py-12">
              <BookOpen className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-2xl font-semibold text-gray-900 mb-2">No blog posts found</h3>
              <p className="text-gray-600">Try adjusting your search criteria or check back later for new posts.</p>
            </div>
          ) : (
            <>
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                {blogs.map((post) => (
                  <Card key={post._id} className="overflow-hidden hover:shadow-lg transition-shadow">
                    <div className="relative h-48">
                      <Image 
                        src={post.featuredImage || "/event.png"} 
                        alt={post.title} 
                        fill 
                        className="object-cover" 
                      />
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
                          {post.authorName}
                        </div>
                        <div className="flex items-center gap-1">
                          <Calendar className="w-4 h-4" />
                          {new Date(post.publishedAt).toLocaleDateString()}
                        </div>
                      </div>
                      <div className="flex justify-between items-center">
                        <div className="flex items-center gap-4 text-sm text-gray-500">
                          <div className="flex items-center gap-1">
                            <Eye className="w-4 h-4" />
                            {post.views}
                          </div>
                          <span>{post.likes} likes</span>
                        </div>
                        <Button variant="outline" size="sm">
                          <Link href={`/blog/${post.slug}`}>Read More</Link>
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>

              {/* Pagination */}
              {pagination && pagination.pages > 1 && (
                <div className="flex justify-center items-center gap-4 mt-12">
                  <Button
                    variant="outline"
                    onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                    disabled={currentPage === 1}
                  >
                    Previous
                  </Button>
                  
                  <div className="flex gap-2">
                    {Array.from({ length: Math.min(5, pagination.pages) }, (_, i) => {
                      const page = i + 1
                      return (
                        <Button
                          key={page}
                          variant={currentPage === page ? "default" : "outline"}
                          onClick={() => setCurrentPage(page)}
                          className="w-10"
                        >
                          {page}
                        </Button>
                      )
                    })}
                  </div>

                  <Button
                    variant="outline"
                    onClick={() => setCurrentPage(Math.min(pagination.pages, currentPage + 1))}
                    disabled={currentPage === pagination.pages}
                  >
                    Next
                  </Button>
                </div>
              )}
            </>
          )}
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
