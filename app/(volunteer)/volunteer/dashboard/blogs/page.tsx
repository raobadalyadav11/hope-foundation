"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Plus, Edit, Trash2, Eye, RefreshCw } from "lucide-react"
import { toast } from "sonner"
import Link from "next/link"

interface Blog {
  _id: string
  title: string
  excerpt: string
  status: string
  views: number
  readTime: string
  createdAt: string
  updatedAt: string
}

export default function VolunteerBlogsPage() {
  const [blogs, setBlogs] = useState<Blog[]>([])
  const [loading, setLoading] = useState(true)
  const [filters, setFilters] = useState({
    status: "all",
  })
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 10,
    total: 0,
    pages: 0,
  })
  const [blogDialog, setBlogDialog] = useState<{
    open: boolean
    blog: Blog | null
    mode: "create" | "edit"
  }>({
    open: false,
    blog: null,
    mode: "create",
  })
  const [blogData, setBlogData] = useState({
    title: "",
    content: "",
    excerpt: "",
    image: "",
    tags: [] as string[],
    readTime: "",
  })

  const fetchBlogs = async () => {
    try {
      setLoading(true)
      const params = new URLSearchParams({
        ...filters,
        page: pagination.page.toString(),
        limit: pagination.limit.toString(),
      })

      const response = await fetch(`/api/volunteer/blogs?${params}`)
      const data = await response.json()

      if (response.ok) {
        setBlogs(data.blogs)
        setPagination(data.pagination)
      } else {
        toast.error(data.error || "Failed to fetch blogs")
      }
    } catch (error) {
      toast.error("Failed to fetch blogs")
    } finally {
      setLoading(false)
    }
  }

  const handleCreateBlog = async () => {
    try {
      const response = await fetch("/api/volunteer/blogs", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(blogData),
      })

      const data = await response.json()

      if (response.ok) {
        toast.success("Blog created successfully")
        setBlogDialog({ open: false, blog: null, mode: "create" })
        setBlogData({
          title: "",
          content: "",
          excerpt: "",
          image: "",
          tags: [],
          readTime: "",
        })
        fetchBlogs()
      } else {
        toast.error(data.error || "Failed to create blog")
      }
    } catch (error) {
      toast.error("Failed to create blog")
    }
  }

  const handleUpdateBlog = async () => {
    if (!blogDialog.blog) return

    try {
      const response = await fetch(`/api/volunteer/blogs/${blogDialog.blog._id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(blogData),
      })

      const data = await response.json()

      if (response.ok) {
        toast.success("Blog updated successfully")
        setBlogDialog({ open: false, blog: null, mode: "create" })
        setBlogData({
          title: "",
          content: "",
          excerpt: "",
          image: "",
          tags: [],
          readTime: "",
        })
        fetchBlogs()
      } else {
        toast.error(data.error || "Failed to update blog")
      }
    } catch (error) {
      toast.error("Failed to update blog")
    }
  }

  const handleDeleteBlog = async (blogId: string) => {
    if (!confirm("Are you sure you want to delete this blog?")) return

    try {
      const response = await fetch(`/api/volunteer/blogs/${blogId}`, {
        method: "DELETE",
      })

      const data = await response.json()

      if (response.ok) {
        toast.success("Blog deleted successfully")
        fetchBlogs()
      } else {
        toast.error(data.error || "Failed to delete blog")
      }
    } catch (error) {
      toast.error("Failed to delete blog")
    }
  }

  const openEditDialog = (blog: Blog) => {
    setBlogData({
      title: blog.title,
      content: "",
      excerpt: blog.excerpt,
      image: "",
      tags: [],
      readTime: blog.readTime,
    })
    setBlogDialog({ open: true, blog, mode: "edit" })
  }

  const getStatusBadge = (status: string) => {
    const variants: Record<string, "default" | "secondary" | "destructive" | "outline"> = {
      published: "default",
      draft: "secondary",
      archived: "outline",
    }

    return <Badge variant={variants[status] || "outline"}>{status.charAt(0).toUpperCase() + status.slice(1)}</Badge>
  }

  useEffect(() => {
    fetchBlogs()
  }, [filters, pagination.page])

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">My Blogs</h1>
          <p className="text-muted-foreground">Share your volunteer experiences and stories</p>
        </div>
        <div className="flex gap-2">
          <Button onClick={fetchBlogs} disabled={loading} variant="outline">
            <RefreshCw className={`h-4 w-4 mr-2 ${loading ? "animate-spin" : ""}`} />
            Refresh
          </Button>
          <Dialog
            open={blogDialog.open && blogDialog.mode === "create"}
            onOpenChange={(open) =>
              setBlogDialog({
                open,
                blog: null,
                mode: "create",
              })
            }
          >
            <DialogTrigger asChild>
              <Button>
                <Plus className="h-4 w-4 mr-2" />
                New Blog
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl">
              <DialogHeader>
                <DialogTitle>Create New Blog</DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                <div>
                  <Label htmlFor="title">Title</Label>
                  <Input
                    id="title"
                    value={blogData.title}
                    onChange={(e) => setBlogData({ ...blogData, title: e.target.value })}
                    placeholder="Enter blog title..."
                  />
                </div>
                <div>
                  <Label htmlFor="excerpt">Excerpt</Label>
                  <Textarea
                    id="excerpt"
                    value={blogData.excerpt}
                    onChange={(e) => setBlogData({ ...blogData, excerpt: e.target.value })}
                    placeholder="Brief description of your blog..."
                    rows={3}
                  />
                </div>
                <div>
                  <Label htmlFor="content">Content</Label>
                  <Textarea
                    id="content"
                    value={blogData.content}
                    onChange={(e) => setBlogData({ ...blogData, content: e.target.value })}
                    placeholder="Write your blog content..."
                    rows={10}
                  />
                </div>
                <div>
                  <Label htmlFor="image">Featured Image URL</Label>
                  <Input
                    id="image"
                    value={blogData.image}
                    onChange={(e) => setBlogData({ ...blogData, image: e.target.value })}
                    placeholder="https://example.com/image.jpg"
                  />
                </div>
                <div>
                  <Label htmlFor="readTime">Read Time</Label>
                  <Input
                    id="readTime"
                    value={blogData.readTime}
                    onChange={(e) => setBlogData({ ...blogData, readTime: e.target.value })}
                    placeholder="5 min read"
                  />
                </div>
                <Button onClick={handleCreateBlog} className="w-full">
                  Create Blog
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {/* Filters */}
      <Card>
        <CardHeader>
          <CardTitle>Filters</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-1">
            <Select value={filters.status} onValueChange={(value) => setFilters({ ...filters, status: value })}>
              <SelectTrigger>
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="draft">Draft</SelectItem>
                <SelectItem value="published">Published</SelectItem>
                <SelectItem value="archived">Archived</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Blogs Table */}
      <Card>
        <CardHeader>
          <CardTitle>Your Blogs</CardTitle>
          <CardDescription>Manage your volunteer blog posts</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Title</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Views</TableHead>
                <TableHead>Read Time</TableHead>
                <TableHead>Created</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {blogs.map((blog) => (
                <TableRow key={blog._id}>
                  <TableCell>
                    <div>
                      <div className="font-medium">{blog.title}</div>
                      <div className="text-sm text-muted-foreground truncate max-w-xs">{blog.excerpt}</div>
                    </div>
                  </TableCell>
                  <TableCell>{getStatusBadge(blog.status)}</TableCell>
                  <TableCell>
                    <div className="flex items-center gap-1">
                      <Eye className="h-4 w-4" />
                      {blog.views}
                    </div>
                  </TableCell>
                  <TableCell>{blog.readTime}</TableCell>
                  <TableCell>{new Date(blog.createdAt).toLocaleDateString()}</TableCell>
                  <TableCell>
                    <div className="flex gap-2">
                      {blog.status === "draft" && (
                        <Button variant="outline" size="sm" onClick={() => openEditDialog(blog)}>
                          <Edit className="h-4 w-4" />
                        </Button>
                      )}
                      {blog.status === "published" && (
                        <Button variant="outline" size="sm" asChild>
                          <Link href={`/blog/${blog._id}`}>
                            <Eye className="h-4 w-4" />
                          </Link>
                        </Button>
                      )}
                      {blog.status === "draft" && (
                        <Button variant="outline" size="sm" onClick={() => handleDeleteBlog(blog._id)}>
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      )}
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Edit Dialog */}
      <Dialog
        open={blogDialog.open && blogDialog.mode === "edit"}
        onOpenChange={(open) =>
          setBlogDialog({
            open,
            blog: open ? blogDialog.blog : null,
            mode: "edit",
          })
        }
      >
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Edit Blog</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label htmlFor="edit-title">Title</Label>
              <Input
                id="edit-title"
                value={blogData.title}
                onChange={(e) => setBlogData({ ...blogData, title: e.target.value })}
                placeholder="Enter blog title..."
              />
            </div>
            <div>
              <Label htmlFor="edit-excerpt">Excerpt</Label>
              <Textarea
                id="edit-excerpt"
                value={blogData.excerpt}
                onChange={(e) => setBlogData({ ...blogData, excerpt: e.target.value })}
                placeholder="Brief description of your blog..."
                rows={3}
              />
            </div>
            <div>
              <Label htmlFor="edit-content">Content</Label>
              <Textarea
                id="edit-content"
                value={blogData.content}
                onChange={(e) => setBlogData({ ...blogData, content: e.target.value })}
                placeholder="Write your blog content..."
                rows={10}
              />
            </div>
            <div>
              <Label htmlFor="edit-image">Featured Image URL</Label>
              <Input
                id="edit-image"
                value={blogData.image}
                onChange={(e) => setBlogData({ ...blogData, image: e.target.value })}
                placeholder="https://example.com/image.jpg"
              />
            </div>
            <div>
              <Label htmlFor="edit-readTime">Read Time</Label>
              <Input
                id="edit-readTime"
                value={blogData.readTime}
                onChange={(e) => setBlogData({ ...blogData, readTime: e.target.value })}
                placeholder="5 min read"
              />
            </div>
            <Button onClick={handleUpdateBlog} className="w-full">
              Update Blog
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}
