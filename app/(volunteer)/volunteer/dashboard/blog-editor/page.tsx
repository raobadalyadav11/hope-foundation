"use client"

import { useState, useEffect } from "react"
import { useSession } from "next-auth/react"
import { useRouter, useSearchParams } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Save, Send, Eye, ArrowLeft, X } from "lucide-react"
import { toast } from "sonner"
import { BlogEditor } from "@/components/blog-editor"

interface BlogData {
  _id?: string
  title: string
  content: string
  excerpt: string
  featuredImage: string
  tags: string[]
  readTime: string
  status: "draft" | "pending" | "published"
  category: string
}

export default function VolunteerBlogEditorPage() {
  const { data: session } = useSession()
  const router = useRouter()
  const searchParams = useSearchParams()
  const blogId = searchParams.get("id")
  const isEditing = !!blogId

  const [blogData, setBlogData] = useState<BlogData>({
    title: "",
    content: "",
    excerpt: "",
    featuredImage: "",
    tags: [],
    readTime: "",
    status: "draft",
    category: "volunteer-stories",
  })
  const [newTag, setNewTag] = useState("")
  const [loading, setLoading] = useState(false)
  const [saving, setSaving] = useState(false)
  const [uploading, setUploading] = useState(false)

  // Check if user has content creator role
  const canCreateBlogs = session?.user?.role === "volunteer" || session?.user?.role === "content_creator"

  useEffect(() => {
    if (isEditing && blogId) {
      fetchBlog()
    }
  }, [blogId])

  const fetchBlog = async () => {
    try {
      setLoading(true)
      const response = await fetch(`/api/volunteer/blogs/${blogId}`)
      const data = await response.json()

      if (response.ok) {
        setBlogData(data)
      } else {
        toast.error(data.error || "Failed to fetch blog")
        router.push("/volunteer/dashboard/blogs")
      }
    } catch (error) {
      toast.error("Failed to fetch blog")
      router.push("/volunteer/dashboard/blogs")
    } finally {
      setLoading(false)
    }
  }

  const handleSave = async (status: "draft" | "pending" = "draft") => {
    if (!blogData.title.trim()) {
      toast.error("Please enter a title")
      return
    }

    if (!blogData.content.trim()) {
      toast.error("Please enter content")
      return
    }

    if (!blogData.excerpt.trim()) {
      toast.error("Please enter an excerpt")
      return
    }

    try {
      setSaving(true)
      const dataToSave = { ...blogData, status }

      const response = await fetch(isEditing ? `/api/volunteer/blogs/${blogId}` : "/api/volunteer/blogs", {
        method: isEditing ? "PUT" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(dataToSave),
      })

      const result = await response.json()

      if (response.ok) {
        toast.success(
          status === "pending" ? "Blog submitted for review successfully!" : "Blog saved as draft successfully!",
        )
        if (!isEditing) {
          router.push(`/volunteer/dashboard/blog-editor?id=${result._id}`)
        }
      } else {
        toast.error(result.error || "Failed to save blog")
      }
    } catch (error) {
      toast.error("Failed to save blog")
    } finally {
      setSaving(false)
    }
  }

  const handleImageUpload = async (file: File) => {
    try {
      setUploading(true)
      const formData = new FormData()
      formData.append("file", file)
      formData.append("folder", "blog-images")

      const response = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      })

      const data = await response.json()

      if (response.ok) {
        setBlogData({ ...blogData, featuredImage: data.url })
        toast.success("Image uploaded successfully")
      } else {
        toast.error(data.error || "Failed to upload image")
      }
    } catch (error) {
      toast.error("Failed to upload image")
    } finally {
      setUploading(false)
    }
  }

  const addTag = () => {
    if (newTag.trim() && !blogData.tags.includes(newTag.trim())) {
      setBlogData({
        ...blogData,
        tags: [...blogData.tags, newTag.trim()],
      })
      setNewTag("")
    }
  }

  const removeTag = (tagToRemove: string) => {
    setBlogData({
      ...blogData,
      tags: blogData.tags.filter((tag) => tag !== tagToRemove),
    })
  }

  if (!canCreateBlogs) {
    return (
      <Card className="text-center py-12">
        <CardContent>
          <div className="text-red-500 mb-4">
            <X className="h-16 w-16 mx-auto" />
          </div>
          <h2 className="text-2xl font-bold mb-4">Access Denied</h2>
          <p className="text-gray-600 mb-6">
            You need content creator permissions to write blogs. Please contact an administrator.
          </p>
          <Button asChild>
            <a href="/volunteer/dashboard">Back to Dashboard</a>
          </Button>
        </CardContent>
      </Card>
    )
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="sm" onClick={() => router.back()}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back
          </Button>
          <div>
            <h1 className="text-3xl font-bold">{isEditing ? "Edit Blog" : "Create New Blog"}</h1>
            <p className="text-muted-foreground">
              {isEditing ? "Update your blog post" : "Share your volunteer experience"}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Badge variant={blogData.status === "published" ? "default" : "secondary"}>
            {blogData.status.charAt(0).toUpperCase() + blogData.status.slice(1)}
          </Badge>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Editor */}
        <div className="lg:col-span-2 space-y-6">
          {/* Title */}
          <Card>
            <CardHeader>
              <CardTitle>Blog Title</CardTitle>
            </CardHeader>
            <CardContent>
              <Input
                placeholder="Enter your blog title..."
                value={blogData.title}
                onChange={(e) => setBlogData({ ...blogData, title: e.target.value })}
                className="text-lg"
              />
            </CardContent>
          </Card>

          {/* Content Editor */}
          <Card>
            <CardHeader>
              <CardTitle>Content</CardTitle>
              <CardDescription>Write your blog content using the rich text editor</CardDescription>
            </CardHeader>
            <CardContent>
              <BlogEditor content={blogData.content} onChange={(content) => setBlogData({ ...blogData, content })} />
            </CardContent>
          </Card>

          {/* Excerpt */}
          <Card>
            <CardHeader>
              <CardTitle>Excerpt</CardTitle>
              <CardDescription>A brief summary of your blog post</CardDescription>
            </CardHeader>
            <CardContent>
              <Textarea
                placeholder="Write a brief excerpt..."
                value={blogData.excerpt}
                onChange={(e) => setBlogData({ ...blogData, excerpt: e.target.value })}
                rows={3}
                maxLength={300}
              />
              <p className="text-sm text-gray-500 mt-2">{blogData.excerpt.length}/300 characters</p>
            </CardContent>
          </Card>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Actions */}
          <Card>
            <CardHeader>
              <CardTitle>Actions</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <Button onClick={() => handleSave("draft")} disabled={saving} variant="outline" className="w-full">
                <Save className="h-4 w-4 mr-2" />
                {saving ? "Saving..." : "Save Draft"}
              </Button>
              <Button
                onClick={() => handleSave("pending")}
                disabled={saving || blogData.status === "published"}
                className="w-full"
              >
                <Send className="h-4 w-4 mr-2" />
                {saving ? "Submitting..." : "Submit for Review"}
              </Button>
              {blogData.status === "published" && (
                <Button variant="outline" className="w-full bg-transparent" asChild>
                  <a href={`/blog/${blogData._id}`} target="_blank" rel="noreferrer">
                    <Eye className="h-4 w-4 mr-2" />
                    View Published
                  </a>
                </Button>
              )}
            </CardContent>
          </Card>

          {/* Featured Image */}
          <Card>
            <CardHeader>
              <CardTitle>Featured Image</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {blogData.featuredImage ? (
                <div className="space-y-2">
                  <img
                    src={blogData.featuredImage || "/placeholder.svg"}
                    alt="Featured"
                    className="w-full h-32 object-cover rounded-lg"
                  />
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setBlogData({ ...blogData, featuredImage: "" })}
                    className="w-full"
                  >
                    Remove Image
                  </Button>
                </div>
              ) : (
                <div>
                  <Input
                    type="file"
                    accept="image/*"
                    onChange={(e) => {
                      const file = e.target.files?.[0]
                      if (file) handleImageUpload(file)
                    }}
                    disabled={uploading}
                  />
                  <p className="text-sm text-gray-500 mt-2">Upload a featured image for your blog</p>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Category */}
          <Card>
            <CardHeader>
              <CardTitle>Category</CardTitle>
            </CardHeader>
            <CardContent>
              <Select
                value={blogData.category}
                onValueChange={(value) => setBlogData({ ...blogData, category: value })}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="volunteer-stories">Volunteer Stories</SelectItem>
                  <SelectItem value="impact-reports">Impact Reports</SelectItem>
                  <SelectItem value="community-updates">Community Updates</SelectItem>
                  <SelectItem value="tips-guides">Tips & Guides</SelectItem>
                </SelectContent>
              </Select>
            </CardContent>
          </Card>

          {/* Tags */}
          <Card>
            <CardHeader>
              <CardTitle>Tags</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex gap-2">
                <Input
                  placeholder="Add a tag..."
                  value={newTag}
                  onChange={(e) => setNewTag(e.target.value)}
                  onKeyPress={(e) => e.key === "Enter" && addTag()}
                />
                <Button onClick={addTag} size="sm">
                  Add
                </Button>
              </div>
              <div className="flex flex-wrap gap-2">
                {blogData.tags.map((tag) => (
                  <Badge key={tag} variant="secondary" className="cursor-pointer">
                    {tag}
                    <X className="h-3 w-3 ml-1" onClick={() => removeTag(tag)} />
                  </Badge>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Read Time */}
          <Card>
            <CardHeader>
              <CardTitle>Read Time</CardTitle>
            </CardHeader>
            <CardContent>
              <Input
                placeholder="e.g., 5 min read"
                value={blogData.readTime}
                onChange={(e) => setBlogData({ ...blogData, readTime: e.target.value })}
              />
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
