"use client"

import { useState } from "react"
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Progress } from "@/components/ui/progress"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { toast } from "@/components/ui/use-toast"
import { Plus, Search, MoreHorizontal, Edit, Trash2, Eye, Users, Calendar, MapPin, Target } from "lucide-react"
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
  location: string
  beneficiaries: number
  startDate: string
  endDate: string
  status: "draft" | "active" | "completed" | "paused"
  featured: boolean
  progressPercentage: number
  daysLeft: number
  isExpired: boolean
  createdBy: {
    name: string
    email: string
  }
  createdAt: string
}

const statusColors = {
  draft: "bg-gray-100 text-gray-800",
  active: "bg-green-100 text-green-800",
  completed: "bg-blue-100 text-blue-800",
  paused: "bg-yellow-100 text-yellow-800",
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

export default function AdminCampaignsPage() {
  const queryClient = useQueryClient()
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedCategory, setSelectedCategory] = useState("all")
  const [selectedStatus, setSelectedStatus] = useState("all")
  const [currentPage, setCurrentPage] = useState(1)

  const { data: campaignsData, isLoading } = useQuery({
    queryKey: ["admin-campaigns", searchTerm, selectedCategory, selectedStatus, currentPage],
    queryFn: async () => {
      const params = new URLSearchParams({
        search: searchTerm,
        category: selectedCategory,
        status: selectedStatus,
        page: currentPage.toString(),
        limit: "10",
        admin: "true",
      })

      const response = await fetch(`/api/campaigns?${params}`)
      if (!response.ok) throw new Error("Failed to fetch campaigns")
      return response.json()
    },
  })

  const deleteMutation = useMutation({
    mutationFn: async (campaignId: string) => {
      const response = await fetch(`/api/campaigns/${campaignId}`, {
        method: "DELETE",
      })
      if (!response.ok) throw new Error("Failed to delete campaign")
      return response.json()
    },
    onSuccess: () => {
      toast({
        title: "Campaign deleted",
        description: "The campaign has been successfully deleted.",
      })
      queryClient.invalidateQueries({ queryKey: ["admin-campaigns"] })
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to delete campaign. Please try again.",
        variant: "destructive",
      })
    },
  })

  const toggleFeaturedMutation = useMutation({
    mutationFn: async ({ campaignId, featured }: { campaignId: string; featured: boolean }) => {
      const response = await fetch(`/api/campaigns/${campaignId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ featured }),
      })
      if (!response.ok) throw new Error("Failed to update campaign")
      return response.json()
    },
    onSuccess: () => {
      toast({
        title: "Campaign updated",
        description: "Featured status has been updated.",
      })
      queryClient.invalidateQueries({ queryKey: ["admin-campaigns"] })
    },
  })

  const updateStatusMutation = useMutation({
    mutationFn: async ({ campaignId, status }: { campaignId: string; status: string }) => {
      const response = await fetch(`/api/campaigns/${campaignId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status }),
      })
      if (!response.ok) throw new Error("Failed to update campaign")
      return response.json()
    },
    onSuccess: () => {
      toast({
        title: "Campaign updated",
        description: "Campaign status has been updated.",
      })
      queryClient.invalidateQueries({ queryKey: ["admin-campaigns"] })
    },
  })

  const campaigns = campaignsData?.campaigns || []
  const pagination = campaignsData?.pagination || {}

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Campaign Management</h1>
          <p className="text-gray-600 mt-2">Manage all campaigns and track their progress</p>
        </div>
        <Button asChild>
          <Link href="/admin/campaigns/new">
            <Plus className="w-4 h-4 mr-2" />
            New Campaign
          </Link>
        </Button>
      </div>

      {/* Filters */}
      <Card>
        <CardHeader>
          <CardTitle>Filters</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col lg:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <Input
                  placeholder="Search campaigns..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
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
            <Select value={selectedStatus} onValueChange={setSelectedStatus}>
              <SelectTrigger className="w-48">
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="draft">Draft</SelectItem>
                <SelectItem value="active">Active</SelectItem>
                <SelectItem value="completed">Completed</SelectItem>
                <SelectItem value="paused">Paused</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Campaigns List */}
      <div className="space-y-4">
        {campaigns.length === 0 ? (
          <Card>
            <CardContent className="text-center py-12">
              <Target className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-gray-900 mb-2">No campaigns found</h3>
              <p className="text-gray-600 mb-6">Get started by creating your first campaign.</p>
              <Button asChild>
                <Link href="/admin/campaigns/new">Create Campaign</Link>
              </Button>
            </CardContent>
          </Card>
        ) : (
          campaigns.map((campaign: Campaign) => (
            <Card key={campaign._id} className="hover:shadow-lg transition-shadow">
              <CardContent className="p-6">
                <div className="flex gap-6">
                  {/* Campaign Image */}
                  <div className="relative w-32 h-24 rounded-lg overflow-hidden flex-shrink-0">
                    <Image
                      src={campaign.image || "/placeholder.svg?height=96&width=128"}
                      alt={campaign.title}
                      fill
                      className="object-cover"
                    />
                  </div>

                  {/* Campaign Details */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between mb-2">
                      <div className="flex-1">
                        <h3 className="text-lg font-semibold text-gray-900 line-clamp-1">{campaign.title}</h3>
                        <p className="text-gray-600 text-sm line-clamp-2 mt-1">{campaign.description}</p>
                      </div>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="sm">
                            <MoreHorizontal className="w-4 h-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem asChild>
                            <Link href={`/campaigns/${campaign._id}`}>
                              <Eye className="w-4 h-4 mr-2" />
                              View
                            </Link>
                          </DropdownMenuItem>
                          <DropdownMenuItem asChild>
                            <Link href={`/admin/campaigns/${campaign._id}/edit`}>
                              <Edit className="w-4 h-4 mr-2" />
                              Edit
                            </Link>
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            onClick={() =>
                              toggleFeaturedMutation.mutate({
                                campaignId: campaign._id,
                                featured: !campaign.featured,
                              })
                            }
                          >
                            {campaign.featured ? "Remove from Featured" : "Mark as Featured"}
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            onClick={() => deleteMutation.mutate(campaign._id)}
                            className="text-red-600"
                          >
                            <Trash2 className="w-4 h-4 mr-2" />
                            Delete
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>

                    {/* Campaign Meta */}
                    <div className="flex items-center gap-4 text-sm text-gray-600 mb-3">
                      <div className="flex items-center gap-1">
                        <MapPin className="w-4 h-4" />
                        <span>{campaign.location}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Users className="w-4 h-4" />
                        <span>{campaign.beneficiaries} beneficiaries</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Calendar className="w-4 h-4" />
                        <span>{campaign.daysLeft} days left</span>
                      </div>
                    </div>

                    {/* Progress */}
                    <div className="mb-3">
                      <div className="flex justify-between text-sm mb-1">
                        <span className="font-medium">₹{campaign.raised.toLocaleString()} raised</span>
                        <span className="text-gray-600">₹{campaign.goal.toLocaleString()} goal</span>
                      </div>
                      <Progress value={campaign.progressPercentage} className="h-2" />
                      <div className="flex justify-between text-xs text-gray-500 mt-1">
                        <span>{campaign.progressPercentage}% funded</span>
                        <span>Created by {campaign.createdBy.name}</span>
                      </div>
                    </div>

                    {/* Badges */}
                    <div className="flex items-center gap-2">
                      <Badge className={statusColors[campaign.status]}>{campaign.status}</Badge>
                      <Badge variant="outline">{campaign.category}</Badge>
                      {campaign.featured && <Badge className="bg-yellow-100 text-yellow-800">Featured</Badge>}
                      {campaign.isExpired && <Badge variant="destructive">Expired</Badge>}
                    </div>
                  </div>

                  {/* Quick Actions */}
                  <div className="flex flex-col gap-2">
                    <Select
                      value={campaign.status}
                      onValueChange={(status) =>
                        updateStatusMutation.mutate({
                          campaignId: campaign._id,
                          status,
                        })
                      }
                    >
                      <SelectTrigger className="w-32">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="draft">Draft</SelectItem>
                        <SelectItem value="active">Active</SelectItem>
                        <SelectItem value="completed">Completed</SelectItem>
                        <SelectItem value="paused">Paused</SelectItem>
                      </SelectContent>
                    </Select>
                    <Button asChild size="sm" variant="outline">
                      <Link href={`/admin/campaigns/${campaign._id}/analytics`}>View Analytics</Link>
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>

      {/* Pagination */}
      {pagination.pages > 1 && (
        <div className="flex justify-center items-center gap-4">
          <Button
            variant="outline"
            onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
            disabled={currentPage === 1}
          >
            Previous
          </Button>
          <span className="text-sm text-gray-600">
            Page {pagination.page} of {pagination.pages}
          </span>
          <Button
            variant="outline"
            onClick={() => setCurrentPage(Math.min(pagination.pages, currentPage + 1))}
            disabled={currentPage === pagination.pages}
          >
            Next
          </Button>
        </div>
      )}
    </div>
  )
}
