"use client"

import { JSXElementConstructor, Key, ReactElement, ReactNode, ReactPortal, useState } from "react"
import { useQuery } from "@tanstack/react-query"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Users, Target, ArrowRight, Calendar, MapPin, Search, Filter } from "lucide-react"
import Link from "next/link"
import Image from "next/image"

interface Campaign {
  _id: string
  title: string
  description: string
  goal: number
  raised: number
  image: string
  category: string
  progressPercentage: number
  daysLeft: number
  isExpired: boolean
  location: string
  beneficiaries: number
  featured: boolean
  status: string
  createdAt: string
}

const categories = [
  { value: "all", label: "All Categories" },
  { value: "education", label: "Education" },
  { value: "healthcare", label: "Healthcare" },
  { value: "environment", label: "Environment" },
  { value: "poverty", label: "Poverty Alleviation" },
  { value: "disaster-relief", label: "Disaster Relief" },
  { value: "women-empowerment", label: "Women Empowerment" },
  { value: "child-welfare", label: "Child Welfare" },
  { value: "elderly-care", label: "Elderly Care" },
]

const sortOptions = [
  { value: "createdAt", label: "Newest First" },
  { value: "goal", label: "Goal Amount" },
  { value: "raised", label: "Amount Raised" },
  { value: "progressPercentage", label: "Progress" },
  { value: "daysLeft", label: "Urgency" },
]

export default function CampaignsPage() {
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedCategory, setSelectedCategory] = useState("all")
  const [sortBy, setSortBy] = useState("createdAt")
  const [currentPage, setCurrentPage] = useState(1)
  const [showFilters, setShowFilters] = useState(false)

  const { data: campaignsData, isLoading } = useQuery({
    queryKey: ["campaigns", selectedCategory, searchTerm, sortBy, currentPage],
    queryFn: async () => {
      const params = new URLSearchParams({
        category: selectedCategory,
        search: searchTerm,
        sort: sortBy,
        page: currentPage.toString(),
        limit: "12",
        status: "active",
      })

      const response = await fetch(`/api/campaigns?${params}`)
      if (!response.ok) throw new Error("Failed to fetch campaigns")
      return response.json()
    },
  })

  const { data: featuredCampaigns } = useQuery({
    queryKey: ["campaigns", "featured"],
    queryFn: async () => {
      const response = await fetch("/api/campaigns?featured=true&limit=3&status=active")
      if (!response.ok) throw new Error("Failed to fetch featured campaigns")
      const data = await response.json()
      return data.campaigns as Campaign[]
    },
  })

  const campaigns = campaignsData?.campaigns || []
  const pagination = campaignsData?.pagination || {}

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading campaigns...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-blue-600 via-purple-700 to-blue-800 text-white py-20">
        <div className="absolute inset-0 bg-black/30"></div>
        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-4xl mx-auto text-center">
            <Badge className="bg-white/20 text-white border-white/30 hover:bg-white/30 mb-6">🎯 Active Campaigns</Badge>
            <h1 className="text-5xl lg:text-6xl font-bold mb-6">Support Our Campaigns</h1>
            <p className="text-xl lg:text-2xl opacity-90 leading-relaxed mb-8">
              Discover meaningful ways to make a difference. Every campaign represents real people with real needs, and
              your support can transform lives and communities.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" className="bg-white text-blue-600 hover:bg-gray-100 font-semibold">
                <Link href="#campaigns">Browse Campaigns</Link>
              </Button>
              <Button
                size="lg"
                variant="outline"
                className="border-white text-white hover:bg-white hover:text-blue-600 font-semibold"
              >
                <Link href="/donate">Make General Donation</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Campaigns */}
      {featuredCampaigns && featuredCampaigns.length > 0 && (
        <section className="py-20 bg-gray-50">
          <div className="container mx-auto px-4">
            <div className="text-center mb-16">
              <h2 className="text-4xl font-bold text-gray-900 mb-4">Featured Campaigns</h2>
              <p className="text-xl text-gray-600 max-w-2xl mx-auto">
                Our most urgent and impactful campaigns that need your immediate support.
              </p>
            </div>

            <div className="grid lg:grid-cols-3 gap-8">
              {featuredCampaigns.map((campaign) => (
                <Card
                  key={campaign._id}
                  className="overflow-hidden hover:shadow-2xl transition-all duration-300 group border-0 shadow-lg"
                >
                  <div className="relative h-64 overflow-hidden">
                    <Image
                      src={campaign.image || "/placeholder.svg?height=250&width=400"}
                      alt={campaign.title}
                      fill
                      className="object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
                    <div className="absolute top-4 left-4">
                      <Badge className="bg-red-500 hover:bg-red-600 text-white">Featured</Badge>
                    </div>
                    <div className="absolute top-4 right-4">
                      <Badge variant="secondary" className="bg-white/90 text-gray-900">
                        {campaign.category}
                      </Badge>
                    </div>
                    <div className="absolute bottom-4 left-4 text-white">
                      <div className="flex items-center gap-2 text-sm">
                        <MapPin className="w-4 h-4" />
                        <span>{campaign.location}</span>
                      </div>
                    </div>
                  </div>
                  <CardHeader className="pb-4">
                    <CardTitle className="text-xl line-clamp-2 group-hover:text-blue-600 transition-colors">
                      {campaign.title}
                    </CardTitle>
                    <CardDescription className="line-clamp-3 text-base">{campaign.description}</CardDescription>
                  </CardHeader>
                  <CardContent className="pt-0">
                    <div className="space-y-4">
                      <div className="flex items-center justify-between text-sm text-gray-600">
                        <span className="flex items-center gap-1">
                          <Users className="w-4 h-4" />
                          {campaign.beneficiaries} beneficiaries
                        </span>
                        <span className="flex items-center gap-1">
                          <Calendar className="w-4 h-4" />
                          {campaign.daysLeft} days left
                        </span>
                      </div>

                      <div>
                        <div className="flex justify-between text-sm mb-2">
                          <span className="font-semibold text-gray-900">
                            ₹{campaign.raised.toLocaleString()} raised
                          </span>
                          <span className="text-gray-600">₹{campaign.goal.toLocaleString()} goal</span>
                        </div>
                        <Progress value={campaign.progressPercentage} className="h-3" />
                        <div className="flex justify-between text-xs text-gray-500 mt-2">
                          <span className="font-medium">{campaign.progressPercentage}% funded</span>
                          <span>{((campaign.goal - campaign.raised) / 1000).toFixed(0)}k needed</span>
                        </div>
                      </div>

                      <Button className="w-full group-hover:bg-blue-700 transition-colors text-lg py-6">
                        <Link href={`/campaigns/${campaign._id}`} className="flex items-center gap-2">
                          Support This Cause <ArrowRight className="w-5 h-5" />
                        </Link>
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Search and Filter Section */}
      <section id="campaigns" className="py-12 bg-white border-b">
        <div className="container mx-auto px-4">
          <div className="flex flex-col lg:flex-row gap-4 items-center justify-between">
            <div className="flex-1 max-w-md">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <Input
                  placeholder="Search campaigns..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>

            <div className="flex gap-4 items-center">
              <Button variant="outline" onClick={() => setShowFilters(!showFilters)} className="lg:hidden">
                <Filter className="w-4 h-4 mr-2" />
                Filters
              </Button>

              <div className={`flex gap-4 ${showFilters ? "flex" : "hidden lg:flex"}`}>
                <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                  <SelectTrigger className="w-48">
                    <SelectValue placeholder="Category" />
                  </SelectTrigger>
                  <SelectContent>
                    {categories.map((category) => (
                      <SelectItem key={category.value} value={category.value}>
                        {category.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>

                <Select value={sortBy} onValueChange={setSortBy}>
                  <SelectTrigger className="w-48">
                    <SelectValue placeholder="Sort by" />
                  </SelectTrigger>
                  <SelectContent>
                    {sortOptions.map((option) => (
                      <SelectItem key={option.value} value={option.value}>
                        {option.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Campaigns Grid */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          {campaigns.length === 0 ? (
            <div className="text-center py-20">
              <Target className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-2xl font-semibold text-gray-900 mb-2">No campaigns found</h3>
              <p className="text-gray-600 mb-6">Try adjusting your search criteria or browse all campaigns.</p>
              <Button
                onClick={() => {
                  setSearchTerm("")
                  setSelectedCategory("all")
                }}
              >
                Clear Filters
              </Button>
            </div>
          ) : (
            <>
              <div className="flex items-center justify-between mb-8">
                <div>
                  <h2 className="text-3xl font-bold text-gray-900">All Campaigns</h2>
                  <p className="text-gray-600">
                    Showing {campaigns.length} of {pagination.total} campaigns
                  </p>
                </div>
                <div className="text-sm text-gray-500">
                  Page {pagination.page} of {pagination.pages}
                </div>
              </div>

              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                {campaigns.map((campaign: { _id: Key | null | undefined; image: any; title: string | number | bigint | boolean | ReactElement<unknown, string | JSXElementConstructor<any>> | Iterable<ReactNode> | Promise<string | number | bigint | boolean | ReactPortal | ReactElement<unknown, string | JSXElementConstructor<any>> | Iterable<ReactNode> | null | undefined> | null | undefined; featured: any; category: string | number | bigint | boolean | ReactElement<unknown, string | JSXElementConstructor<any>> | Iterable<ReactNode> | ReactPortal | Promise<string | number | bigint | boolean | ReactPortal | ReactElement<unknown, string | JSXElementConstructor<any>> | Iterable<ReactNode> | null | undefined> | null | undefined; location: string | number | bigint | boolean | ReactElement<unknown, string | JSXElementConstructor<any>> | Iterable<ReactNode> | ReactPortal | Promise<string | number | bigint | boolean | ReactPortal | ReactElement<unknown, string | JSXElementConstructor<any>> | Iterable<ReactNode> | null | undefined> | null | undefined; description: string | number | bigint | boolean | ReactElement<unknown, string | JSXElementConstructor<any>> | Iterable<ReactNode> | ReactPortal | Promise<string | number | bigint | boolean | ReactPortal | ReactElement<unknown, string | JSXElementConstructor<any>> | Iterable<ReactNode> | null | undefined> | null | undefined; beneficiaries: string | number | bigint | boolean | ReactElement<unknown, string | JSXElementConstructor<any>> | Iterable<ReactNode> | ReactPortal | Promise<string | number | bigint | boolean | ReactPortal | ReactElement<unknown, string | JSXElementConstructor<any>> | Iterable<ReactNode> | null | undefined> | null | undefined; daysLeft: string | number | bigint | boolean | ReactElement<unknown, string | JSXElementConstructor<any>> | Iterable<ReactNode> | Promise<string | number | bigint | boolean | ReactPortal | ReactElement<unknown, string | JSXElementConstructor<any>> | Iterable<ReactNode> | null | undefined> | null | undefined; raised: { toLocaleString: () => string | number | bigint | boolean | ReactElement<unknown, string | JSXElementConstructor<any>> | Iterable<ReactNode> | ReactPortal | Promise<string | number | bigint | boolean | ReactPortal | ReactElement<unknown, string | JSXElementConstructor<any>> | Iterable<ReactNode> | null | undefined> | null | undefined }; goal: { toLocaleString: () => string | number | bigint | boolean | ReactElement<unknown, string | JSXElementConstructor<any>> | Iterable<ReactNode> | ReactPortal | Promise<string | number | bigint | boolean | ReactPortal | ReactElement<unknown, string | JSXElementConstructor<any>> | Iterable<ReactNode> | null | undefined> | null | undefined }; progressPercentage: string | number | bigint | boolean | ReactElement<unknown, string | JSXElementConstructor<any>> | Iterable<ReactNode> | Promise<string | number | bigint | boolean | ReactPortal | ReactElement<unknown, string | JSXElementConstructor<any>> | Iterable<ReactNode> | null | undefined> | null | undefined }) => (
                  <Card
                    key={campaign._id}
                    className="overflow-hidden hover:shadow-xl transition-all duration-300 group"
                  >
                    <div className="relative h-48 overflow-hidden">
                      <Image
                        src={campaign.image || "/placeholder.svg?height=200&width=400"}
                        alt={campaign.title}
                        fill
                        className="object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent"></div>
                      {campaign.featured && (
                        <div className="absolute top-4 left-4">
                          <Badge className="bg-red-500 hover:bg-red-600 text-white">Featured</Badge>
                        </div>
                      )}
                      <div className="absolute top-4 right-4">
                        <Badge variant="secondary" className="bg-white/90 text-gray-900">
                          {campaign.category}
                        </Badge>
                      </div>
                      <div className="absolute bottom-4 left-4 text-white">
                        <div className="flex items-center gap-2 text-sm">
                          <MapPin className="w-4 h-4" />
                          <span>{campaign.location}</span>
                        </div>
                      </div>
                    </div>
                    <CardHeader className="pb-4">
                      <CardTitle className="text-lg line-clamp-2 group-hover:text-blue-600 transition-colors">
                        {campaign.title}
                      </CardTitle>
                      <CardDescription className="line-clamp-3">{campaign.description}</CardDescription>
                    </CardHeader>
                    <CardContent className="pt-0">
                      <div className="space-y-4">
                        <div className="flex items-center justify-between text-sm text-gray-600">
                          <span className="flex items-center gap-1">
                            <Users className="w-4 h-4" />
                            {campaign.beneficiaries} beneficiaries
                          </span>
                          <span className="flex items-center gap-1">
                            <Calendar className="w-4 h-4" />
                            {campaign.daysLeft} days left
                          </span>
                        </div>

                        <div>
                          <div className="flex justify-between text-sm mb-2">
                            <span className="font-semibold">₹{campaign.raised.toLocaleString()}</span>
                            <span className="text-gray-600">₹{campaign.goal.toLocaleString()}</span>
                          </div>
                          <Progress value={campaign.progressPercentage} className="h-2" />
                          <div className="flex justify-between text-xs text-gray-500 mt-1">
                            <span>{campaign.progressPercentage}% funded</span>
                            <span>{campaign.daysLeft} days left</span>
                          </div>
                        </div>

                        <Button className="w-full group-hover:bg-blue-700 transition-colors">
                          <Link href={`/campaigns/${campaign._id}`} className="flex items-center gap-2">
                            Support Now <ArrowRight className="w-4 h-4" />
                          </Link>
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>

              {/* Pagination */}
              {pagination.pages > 1 && (
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
      </section>

      {/* Call to Action */}
      <section className="py-20 bg-gradient-to-r from-blue-600 to-purple-700 text-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-4xl font-bold mb-6">Can't Find What You're Looking For?</h2>
          <p className="text-xl mb-8 opacity-90 max-w-2xl mx-auto">
            Make a general donation to support all our causes, or get in touch to learn about other ways to help.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" className="bg-white text-blue-600 hover:bg-gray-100 font-semibold">
              <Link href="/donate">Make General Donation</Link>
            </Button>
            <Button
              size="lg"
              variant="outline"
              className="border-white text-white hover:bg-white hover:text-blue-600 font-semibold"
            >
              <Link href="/contact">Contact Us</Link>
            </Button>
          </div>
        </div>
      </section>
    </div>
  )
}
