"use client"

import { useState, useEffect } from "react"
import { useSession } from "next-auth/react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { AlertCircle, Plus, Search, Edit, Eye, Trash2, Calendar, User } from "lucide-react"
import { toast } from "sonner"
import { Alert, AlertDescription } from "@/components/ui/alert"
import Link from "next/link"

interface BlogPost {
  _id: string
  title: string
  excerpt: string
  category: string
  status: "draft" | "pending" | "published" | "rejected"
  tags: string[]
  featuredImage?: string
  createdAt: string
  updatedAt: string
  adminFeedback?: string
  views?: number
}

export default function BlogListPage() {
  const { data: session } = useSession()
  const router = useRouter()
  const [blogs, setBlogs] = useState<BlogPost[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState<string>("all")
  const [categoryFilter, setCategoryFilter] = useState<string>("all")

  // Check if user has content creator role
  useEffect(() => {
    if (session?.user && !session.user.roles?.includes("content_creator")) {
      toast.error("You don't have permission to access blogs")
      router.push("/donor/dashboard")
    }
  }, [session, router])

  const fetchBlogs = async () => {
    try {
      setLoading(true)
      const params = new URLSearchParams()
      if (searchTerm) params.append("search", searchTerm)
      if (statusFilter !== "all") params.append("status", statusFilter)
      if (categoryFilter !== "all") params.append("category", categoryFilter)

      const response = await fetch(`/api/donor/blogs?${params.toString()}`)
      const data = await response.json()

      if (response.ok) {
        setBlogs(data.blogs)
      } else {
        toast.error(data.error || "Failed to fetch blogs")
      }
    } catch (error) {
      toast.error("Failed to fetch blogs")
    } finally {
      setLoading(false)
    }
  }

  const deleteBlog = async (blogId: string) => {
    if (!confirm("Are you sure you want to delete this blog?")) return

    try {
      const response = await fetch(`/api/donor/blogs/${blogId}`, {
        method: "DELETE",
      })

      if (response.ok) {
        toast.success("Blog deleted successfully")
        fetchBlogs()
      } else {
        const data = await response.json()
        toast.error(data.error || "Failed to delete blog")
      }
    } catch (error) {
      toast.error("Failed to delete blog")
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "published":
        return "bg-green-100 text-green-800"
      case "pending":
        return "bg-yellow-100 text-yellow-800"
      case "rejected":
        return "bg-red-100 text-red-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  useEffect(() => {
    if (session?.user?.roles?.includes("content_creator")) {
      fetchBlogs()
    }
  }, [session, searchTerm, statusFilter, categoryFilter])

  if (!session?.user?.roles?.includes("content_creator")) {
    return (
      <div className="flex items-center justify-center h-96">
        <Alert className="max-w-md">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>
            You don't have permission to access blogs. Please contact an administrator to request content creator
            access.
          </AlertDescription>
        </Alert>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">My Blogs</h1>
          <p className="text-muted-foreground">Manage your blog posts</p>
        </div>
        <Button asChild>
          <Link href="/donor/dashboard/blog-editor">
            <Plus className="h-4 w-4 mr-2" />
            New Blog
          </Link>
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Blog Posts</CardTitle>
          <CardDescription>Your authored blog posts and their status</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex gap-4 mb-6">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <Input
                  placeholder="Search blogs..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-40">
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
            <Select value={categoryFilter} onValueChange={setCategoryFilter}>
              <SelectTrigger className="w-48">
                <SelectValue placeholder="Category" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Categories</SelectItem>
                <SelectItem value="Impact Stories">Impact Stories</SelectItem>
                <SelectItem value="Fundraising Updates">Fundraising Updates</SelectItem>
                <SelectItem value="Community News">Community News</SelectItem>
                <SelectItem value="Educational Content">Educational Content</SelectItem>
                <SelectItem value="Event Coverage">Event Coverage</SelectItem>
                <SelectItem value="Volunteer Spotlights">Volunteer Spotlights</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {loading ? (
            <div className="flex items-center justify-center h-32">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
            </div>
          ) : blogs.length === 0 ? (
            <div className="text-center py-12">
              <div className="text-gray-400 mb-4">
                <User className="h-12 w-12 mx-auto" />
              </div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">No blogs found</h3>
              <p className="text-gray-500 mb-4">Start writing your first blog post!</p>
              <Button asChild>
                <Link href="/donor/dashboard/blog-editor">
                  <Plus className="h-4 w-4 mr-2" />
                  Create Blog
                </Link>
              </Button>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Title</TableHead>
                  <TableHead>Category</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Views</TableHead>
                  <TableHead>Updated</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {blogs.map((blog) => (
                  <TableRow key={blog._id}>
                    <TableCell>
                      <div>
                        <div className="font-medium">{blog.title}</div>
                        <div className="text-sm text-gray-500 truncate max-w-xs">{blog.excerpt}</div>
                        <div className="flex gap-1 mt-1">
                          {blog.tags.slice(0, 2).map((tag) => (
                            <Badge key={tag} variant="outline" className="text-xs">
                              #{tag}
                            </Badge>
                          ))}
                          {blog.tags.length > 2 && (
                            <Badge variant="outline" className="text-xs">
                              +{blog.tags.length - 2}
                            </Badge>
                          )}
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant="secondary">{blog.category}</Badge>
                    </TableCell>
                    <TableCell>
                      <Badge className={getStatusColor(blog.status)}>
                        {blog.status.charAt(0).toUpperCase() + blog.status.slice(1)}
                      </Badge>
                      {blog.status === "rejected" && blog.adminFeedback && (
                        <div className="text-xs text-red-600 mt-1 max-w-xs truncate">{blog.adminFeedback}</div>
                      )}
                    </TableCell>
                    <TableCell>{blog.views || 0}</TableCell>
                    <TableCell>
                      <div className="flex items-center text-sm text-gray-500">
                        <Calendar className="h-3 w-3 mr-1" />
                        {new Date(blog.updatedAt).toLocaleDateString()}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        {blog.status === "published" && (
                          <Button variant="ghost" size="sm" asChild>
                            <Link href={`/blogs/${blog._id}`}>
                              <Eye className="h-4 w-4" />
                            </Link>
                          </Button>
                        )}
                        {(blog.status === "draft" || blog.status === "rejected") && (
                          <Button variant="ghost" size="sm" asChild>
                            <Link href={`/donor/dashboard/blog-editor?id=${blog._id}`}>
                              <Edit className="h-4 w-4" />
                            </Link>
                          </Button>
                        )}
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => deleteBlog(blog._id)}
                          className="text-red-600 hover:text-red-700"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
