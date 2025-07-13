"use client"

import { useState } from "react"
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { toast } from "@/components/ui/use-toast"
import {
  Search,
  MoreHorizontal,
  Edit,
  Trash2,
  Eye,
  CheckCircle,
  XCircle,
  MessageSquare,
  FileText,
  Plus,
} from "lucide-react"
import Link from "next/link"
import Image from "next/image"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"

interface Blog {
  _id: string
  title: string
  content: string
  excerpt: string
  featuredImage?: string
  status: "draft" | "pending" | "published" | "rejected"
  category: string
  tags: string[]
  author: {
    _id: string
    name: string
    email: string
    role: string
  }
  views: number
  likes: number
  comments: number
  publishedAt?: string
  createdAt: string
  updatedAt: string
  adminFeedback?: string
}

const statusColors = {
  draft: "bg-gray-100 text-gray-800",
  pending: "bg-yellow-100 text-yellow-800",
  published: "bg-green-100 text-green-800",
  rejected: "bg-red-100 text-red-800",
}

const categories = [
  { value: "all", label: "All Categories" },
  { value: "impact-stories", label: "Impact Stories" },
  { value: "volunteer-spotlight", label: "Volunteer Spotlight" },
  { value: "campaign-updates", label: "Campaign Updates" },
  { value: "community-news", label: "Community News" },
  { value: "fundraising-tips", label: "Fundraising Tips" },
  { value: "educational", label: "Educational" },
  { value: "events", label: "Events" },
]

export default function AdminBlogPage() {
  const queryClient = useQueryClient()
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedCategory, setSelectedCategory] = useState("all")
  const [selectedStatus, setSelectedStatus] = useState("all")
  const [selectedAuthor, setSelectedAuthor] = useState("all")
  const [currentPage, setCurrentPage] = useState(1)
  const [reviewDialog, setReviewDialog] = useState<{
    open: boolean
    blog: Blog | null
    action: "approve" | "reject" | null
  }>({
    open: false,
    blog: null,
    action: null,
  })
  const [adminFeedback, setAdminFeedback] = useState("")

  const { data: blogsData, isLoading } = useQuery({
    queryKey: ["admin-blogs", searchTerm, selectedCategory, selectedStatus, selectedAuthor, currentPage],
    queryFn: async () => {
      const params = new URLSearchParams({
        search: searchTerm,
        category: selectedCategory,
        status: selectedStatus,
        author: selectedAuthor,
        page: currentPage.toString(),
        limit: "10",
        admin: "true",
      })

      const response = await fetch(`/api/blogs?${params}`)
      if (!response.ok) throw new Error("Failed to fetch blogs")
      return response.json()
    },
  })

  const { data: authorsData } = useQuery({
    queryKey: ["blog-authors"],
    queryFn: async () => {
      const response = await fetch("/api/admin/blog-authors")
      if (!response.ok) throw new Error("Failed to fetch authors")
      return response.json()
    },
  })

  const reviewBlogMutation = useMutation({
    mutationFn: async ({
      blogId,
      action,
      feedback,
    }: { blogId: string; action: "approve" | "reject"; feedback?: string }) => {
      const response = await fetch(`/api/admin/blogs/${blogId}/review`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action, feedback }),
      })
      if (!response.ok) throw new Error("Failed to review blog")
      return response.json()
    },
    onSuccess: (_, { action }) => {
      toast({
        title: "Blog reviewed",
        description: `Blog has been ${action === "approve" ? "approved" : "rejected"} successfully.`,
      })
      queryClient.invalidateQueries({ queryKey: ["admin-blogs"] })
      setReviewDialog({ open: false, blog: null, action: null })
      setAdminFeedback("")
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to review blog. Please try again.",
        variant: "destructive",
      })
    },
  })

  const deleteBlogMutation = useMutation({
    mutationFn: async (blogId: string) => {
      const response = await fetch(`/api/blogs/${blogId}`, {
        method: "DELETE",
      })
      if (!response.ok) throw new Error("Failed to delete blog")
      return response.json()
    },
    onSuccess: () => {
      toast({
        title: "Blog deleted",
        description: "The blog has been successfully deleted.",
      })
      queryClient.invalidateQueries({ queryKey: ["admin-blogs"] })
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to delete blog. Please try again.",
        variant: "destructive",
      })
    },
  })

  const blogs = blogsData?.blogs || []
  const pagination = blogsData?.pagination || {}
  const authors = authorsData?.authors || []

  const handleReview = () => {
    if (!reviewDialog.blog || !reviewDialog.action) return

    reviewBlogMutation.mutate({
      blogId: reviewDialog.blog._id,
      action: reviewDialog.action,
      feedback: adminFeedback,
    })
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 p-6">
        <div className="max-w-7xl mx-auto">
          <div className="animate-pulse space-y-6">
            <div className="h-8 bg-gray-200 rounded w-1/4"></div>
            <div className="h-96 bg-gray-200 rounded-xl"></div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 p-6">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 bg-clip-text text-transparent">
              Blog Management
            </h1>
            <p className="text-gray-600 mt-2">Review, approve, and manage all blog content</p>
          </div>
          <Button
            asChild
            className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white shadow-lg"
          >
            <Link href="/admin/blog/new">
              <Plus className="w-4 h-4 mr-2" />
              New Blog Post
            </Link>
          </Button>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <Card className="bg-white/80 backdrop-blur-sm border-gray-200 shadow-xl hover:shadow-2xl transition-all duration-300">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-gray-700">Total Blogs</CardTitle>
              <FileText className="h-4 w-4 text-blue-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-gray-900">{pagination.total || 0}</div>
              <p className="text-xs text-gray-600">All blog posts</p>
            </CardContent>
          </Card>

          <Card className="bg-white/80 backdrop-blur-sm border-gray-200 shadow-xl hover:shadow-2xl transition-all duration-300">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-gray-700">Pending Review</CardTitle>
              <MessageSquare className="h-4 w-4 text-yellow-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-gray-900">
                {blogs.filter((blog: Blog) => blog.status === "pending").length}
              </div>
              <p className="text-xs text-gray-600">Awaiting approval</p>
            </CardContent>
          </Card>

          <Card className="bg-white/80 backdrop-blur-sm border-gray-200 shadow-xl hover:shadow-2xl transition-all duration-300">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-gray-700">Published</CardTitle>
              <CheckCircle className="h-4 w-4 text-green-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-gray-900">
                {blogs.filter((blog: Blog) => blog.status === "published").length}
              </div>
              <p className="text-xs text-gray-600">Live blog posts</p>
            </CardContent>
          </Card>

          <Card className="bg-white/80 backdrop-blur-sm border-gray-200 shadow-xl hover:shadow-2xl transition-all duration-300">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-gray-700">Total Views</CardTitle>
              <Eye className="h-4 w-4 text-purple-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-gray-900">
                {blogs.reduce((total: number, blog: Blog) => total + (blog.views || 0), 0).toLocaleString()}
              </div>
              <p className="text-xs text-gray-600">All time views</p>
            </CardContent>
          </Card>
        </div>

        {/* Filters */}
        <Card className="bg-white/80 backdrop-blur-sm border-gray-200 shadow-xl">
          <CardHeader>
            <CardTitle className="text-xl font-bold text-gray-900">Filters</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <Input
                  placeholder="Search blogs..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 bg-white/80 border-gray-300 focus:border-blue-500 focus:ring-blue-500"
                />
              </div>

              <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                <SelectTrigger className="bg-white/80 border-gray-300">
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
                <SelectTrigger className="bg-white/80 border-gray-300">
                  <SelectValue placeholder="Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="draft">Draft</SelectItem>
                  <SelectItem value="pending">Pending</SelectItem>
                  <SelectItem value="published">Published</SelectItem>
                  <SelectItem value="rejected">Rejected</SelectItem>
                </SelectContent>
              </Select>

              <Select value={selectedAuthor} onValueChange={setSelectedAuthor}>
                <SelectTrigger className="bg-white/80 border-gray-300">
                  <SelectValue placeholder="Author" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Authors</SelectItem>
                  {authors.map((author: any) => (
                    <SelectItem key={author._id} value={author._id}>
                      {author.name} ({author.role})
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <Button
                onClick={() => {
                  setSearchTerm("")
                  setSelectedCategory("all")
                  setSelectedStatus("all")
                  setSelectedAuthor("all")
                }}
                variant="outline"
                className="bg-white/80 border-gray-300 hover:bg-gray-50"
              >
                Clear Filters
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Blogs List */}
        <div className="space-y-4">
          {blogs.length === 0 ? (
            <Card className="bg-white/80 backdrop-blur-sm border-gray-200 shadow-xl">
              <CardContent className="text-center py-12">
                <FileText className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-gray-900 mb-2">No blogs found</h3>
                <p className="text-gray-600 mb-6">Try adjusting your search criteria or create a new blog post.</p>
                <Button asChild>
                  <Link href="/admin/blog/new">Create Blog Post</Link>
                </Button>
              </CardContent>
            </Card>
          ) : (
            blogs.map((blog: Blog) => (
              <Card
                key={blog._id}
                className="bg-white/80 backdrop-blur-sm border-gray-200 shadow-xl hover:shadow-2xl transition-all duration-300"
              >
                <CardContent className="p-6">
                  <div className="flex gap-6">
                    {/* Blog Image */}
                    <div className="relative w-32 h-24 rounded-lg overflow-hidden flex-shrink-0">
                      <Image
                        src={blog.featuredImage || "/event.png?height=96&width=128"}
                        alt={blog.title}
                        fill
                        className="object-cover"
                      />
                    </div>

                    {/* Blog Details */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between mb-2">
                        <div className="flex-1">
                          <h3 className="text-lg font-semibold text-gray-900 line-clamp-1">{blog.title}</h3>
                          <p className="text-gray-600 text-sm line-clamp-2 mt-1">{blog.excerpt}</p>
                        </div>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="sm">
                              <MoreHorizontal className="w-4 h-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem asChild>
                              <Link href={`/blogs/${blog._id}`}>
                                <Eye className="w-4 h-4 mr-2" />
                                View
                              </Link>
                            </DropdownMenuItem>
                            <DropdownMenuItem asChild>
                              <Link href={`/admin/blog/${blog._id}/edit`}>
                                <Edit className="w-4 h-4 mr-2" />
                                Edit
                              </Link>
                            </DropdownMenuItem>
                            {blog.status === "pending" && (
                              <>
                                <DropdownMenuItem
                                  onClick={() => setReviewDialog({ open: true, blog, action: "approve" })}
                                  className="text-green-600"
                                >
                                  <CheckCircle className="w-4 h-4 mr-2" />
                                  Approve
                                </DropdownMenuItem>
                                <DropdownMenuItem
                                  onClick={() => setReviewDialog({ open: true, blog, action: "reject" })}
                                  className="text-red-600"
                                >
                                  <XCircle className="w-4 h-4 mr-2" />
                                  Reject
                                </DropdownMenuItem>
                              </>
                            )}
                            <DropdownMenuItem
                              onClick={() => deleteBlogMutation.mutate(blog._id)}
                              className="text-red-600"
                            >
                              <Trash2 className="w-4 h-4 mr-2" />
                              Delete
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </div>

                      {/* Blog Meta */}
                      <div className="flex items-center gap-4 text-sm text-gray-600 mb-3">
                        <span>
                          By {blog.author.name} ({blog.author.role})
                        </span>
                        <span>{new Date(blog.createdAt).toLocaleDateString()}</span>
                        <span>{blog.views || 0} views</span>
                        <span>{blog.likes || 0} likes</span>
                        <span>{blog.comments || 0} comments</span>
                      </div>

                      {/* Tags */}
                      <div className="flex items-center gap-2 mb-3">
                        {blog.tags.slice(0, 3).map((tag) => (
                          <Badge key={tag} variant="outline" className="text-xs">
                            {tag}
                          </Badge>
                        ))}
                        {blog.tags.length > 3 && (
                          <Badge variant="outline" className="text-xs">
                            +{blog.tags.length - 3} more
                          </Badge>
                        )}
                      </div>

                      {/* Status and Category */}
                      <div className="flex items-center gap-2">
                        <Badge className={statusColors[blog.status]}>{blog.status}</Badge>
                        <Badge variant="outline">{blog.category}</Badge>
                        {blog.publishedAt && (
                          <Badge variant="outline">Published {new Date(blog.publishedAt).toLocaleDateString()}</Badge>
                        )}
                      </div>

                      {/* Admin Feedback */}
                      {blog.adminFeedback && (
                        <div className="mt-3 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
                          <p className="text-sm text-yellow-800">
                            <strong>Admin Feedback:</strong> {blog.adminFeedback}
                          </p>
                        </div>
                      )}
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
              className="bg-white/80 border-gray-300"
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
              className="bg-white/80 border-gray-300"
            >
              Next
            </Button>
          </div>
        )}

        {/* Review Dialog */}
        <Dialog
          open={reviewDialog.open}
          onOpenChange={(open) => !open && setReviewDialog({ open: false, blog: null, action: null })}
        >
          <DialogContent className="bg-white/95 backdrop-blur-sm">
            <DialogHeader>
              <DialogTitle>{reviewDialog.action === "approve" ? "Approve Blog Post" : "Reject Blog Post"}</DialogTitle>
              <DialogDescription>
                {reviewDialog.action === "approve"
                  ? "This blog post will be published and visible to all users."
                  : "This blog post will be rejected and the author will be notified."}
              </DialogDescription>
            </DialogHeader>

            {reviewDialog.blog && (
              <div className="space-y-4">
                <div>
                  <h4 className="font-semibold text-gray-900">{reviewDialog.blog.title}</h4>
                  <p className="text-sm text-gray-600">By {reviewDialog.blog.author.name}</p>
                </div>

                <div>
                  <Label htmlFor="feedback">
                    {reviewDialog.action === "approve" ? "Approval Message (Optional)" : "Rejection Reason"}
                  </Label>
                  <Textarea
                    id="feedback"
                    value={adminFeedback}
                    onChange={(e) => setAdminFeedback(e.target.value)}
                    placeholder={
                      reviewDialog.action === "approve"
                        ? "Add any comments for the author..."
                        : "Please provide a reason for rejection..."
                    }
                    className="mt-1 bg-white/80 border-gray-300"
                    rows={3}
                  />
                </div>

                <div className="flex justify-end gap-2">
                  <Button variant="outline" onClick={() => setReviewDialog({ open: false, blog: null, action: null })}>
                    Cancel
                  </Button>
                  <Button
                    onClick={handleReview}
                    disabled={reviewBlogMutation.isPending}
                    className={
                      reviewDialog.action === "approve"
                        ? "bg-green-600 hover:bg-green-700 text-white"
                        : "bg-red-600 hover:bg-red-700 text-white"
                    }
                  >
                    {reviewBlogMutation.isPending
                      ? "Processing..."
                      : reviewDialog.action === "approve"
                        ? "Approve"
                        : "Reject"}
                  </Button>
                </div>
              </div>
            )}
          </DialogContent>
        </Dialog>
      </div>
    </div>
  )
}
