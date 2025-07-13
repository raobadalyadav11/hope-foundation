"use client"

import { useState, useEffect } from "react"
import { useSession } from "next-auth/react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { AlertCircle, Save, Send, Eye, Upload, X } from "lucide-react"
import { toast } from "sonner"
import { Alert, AlertDescription } from "@/components/ui/alert"

interface BlogPost {
  _id?: string
  title: string
  content: string
  excerpt: string
  tags: string[]
  category: string
  status: "draft" | "pending" | "published" | "rejected"
  featuredImage?: string
  authorId: string
  createdAt?: string
  updatedAt?: string
  adminFeedback?: string
}

const categories = [
  "Impact Stories",
  "Fundraising Updates",
  "Community News",
  "Educational Content",
  "Event Coverage",
  "Volunteer Spotlights",
]

export default function BlogEditorPage() {
  const { data: session } = useSession()
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [uploading, setUploading] = useState(false)
  const [blog, setBlog] = useState<BlogPost>({
    title: "",
    content: "",
    excerpt: "",
    tags: [],
    category: "",
    status: "draft",
    authorId: session?.user?.id || "",
  })
  const [tagInput, setTagInput] = useState("")
  const [imageFile, setImageFile] = useState<File | null>(null)
  const [previewMode, setPreviewMode] = useState(false)

  // Check if user has content creator role
  useEffect(() => {
    if (session?.user && !session.user.roles?.includes("content_creator")) {
      toast.error("You don't have permission to create blogs")
      router.push("/donor/dashboard")
    }
  }, [session, router])

  const handleImageUpload = async (file: File) => {
    setUploading(true)
    try {
      const formData = new FormData()
      formData.append("file", file)
      formData.append("folder", "blog-images")

      const response = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      })

      const data = await response.json()
      if (response.ok) {
        setBlog((prev) => ({ ...prev, featuredImage: data.url }))
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
    if (tagInput.trim() && !blog.tags.includes(tagInput.trim())) {
      setBlog((prev) => ({
        ...prev,
        tags: [...prev.tags, tagInput.trim()],
      }))
      setTagInput("")
    }
  }

  const removeTag = (tagToRemove: string) => {
    setBlog((prev) => ({
      ...prev,
      tags: prev.tags.filter((tag) => tag !== tagToRemove),
    }))
  }

  const saveDraft = async () => {
    if (!blog.title.trim()) {
      toast.error("Please enter a title")
      return
    }

    setLoading(true)
    try {
      const response = await fetch("/api/donor/blogs", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...blog,
          status: "draft",
        }),
      })

      const data = await response.json()
      if (response.ok) {
        setBlog(data.blog)
        toast.success("Draft saved successfully")
      } else {
        toast.error(data.error || "Failed to save draft")
      }
    } catch (error) {
      toast.error("Failed to save draft")
    } finally {
      setLoading(false)
    }
  }

  const submitForReview = async () => {
    if (!blog.title.trim() || !blog.content.trim() || !blog.excerpt.trim() || !blog.category) {
      toast.error("Please fill in all required fields")
      return
    }

    setLoading(true)
    try {
      const response = await fetch("/api/donor/blogs", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...blog,
          status: "pending",
        }),
      })

      const data = await response.json()
      if (response.ok) {
        toast.success("Blog submitted for review")
        router.push("/donor/dashboard/blogs")
      } else {
        toast.error(data.error || "Failed to submit blog")
      }
    } catch (error) {
      toast.error("Failed to submit blog")
    } finally {
      setLoading(false)
    }
  }

  if (!session?.user?.roles?.includes("content_creator")) {
    return (
      <div className="flex items-center justify-center h-96">
        <Alert className="max-w-md">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>
            You don't have permission to access the blog editor. Please contact an administrator to request content
            creator access.
          </AlertDescription>
        </Alert>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Blog Editor</h1>
          <p className="text-muted-foreground">Create and edit blog posts</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={() => setPreviewMode(!previewMode)}>
            <Eye className="h-4 w-4 mr-2" />
            {previewMode ? "Edit" : "Preview"}
          </Button>
          <Button variant="outline" onClick={saveDraft} disabled={loading}>
            <Save className="h-4 w-4 mr-2" />
            Save Draft
          </Button>
          <Button onClick={submitForReview} disabled={loading}>
            <Send className="h-4 w-4 mr-2" />
            Submit for Review
          </Button>
        </div>
      </div>

      {previewMode ? (
        <Card>
          <CardContent className="p-6">
            {blog.featuredImage && (
              <img
                src={blog.featuredImage || "/event.png"}
                alt={blog.title}
                className="w-full h-64 object-cover rounded-lg mb-6"
              />
            )}
            <div className="flex items-center gap-2 mb-4">
              <Badge variant="secondary">{blog.category}</Badge>
              {blog.tags.map((tag) => (
                <Badge key={tag} variant="outline">
                  #{tag}
                </Badge>
              ))}
            </div>
            <h1 className="text-3xl font-bold mb-4">{blog.title}</h1>
            <p className="text-lg text-muted-foreground mb-6">{blog.excerpt}</p>
            <div className="prose max-w-none">
              {blog.content.split("\n").map((paragraph, index) => (
                <p key={index} className="mb-4">
                  {paragraph}
                </p>
              ))}
            </div>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-6 lg:grid-cols-3">
          <div className="lg:col-span-2 space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Blog Content</CardTitle>
                <CardDescription>Write your blog post content</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="title">Title *</Label>
                  <Input
                    id="title"
                    value={blog.title}
                    onChange={(e) => setBlog((prev) => ({ ...prev, title: e.target.value }))}
                    placeholder="Enter blog title"
                  />
                </div>

                <div>
                  <Label htmlFor="excerpt">Excerpt *</Label>
                  <Textarea
                    id="excerpt"
                    value={blog.excerpt}
                    onChange={(e) => setBlog((prev) => ({ ...prev, excerpt: e.target.value }))}
                    placeholder="Brief description of your blog post"
                    rows={3}
                  />
                </div>

                <div>
                  <Label htmlFor="content">Content *</Label>
                  <Textarea
                    id="content"
                    value={blog.content}
                    onChange={(e) => setBlog((prev) => ({ ...prev, content: e.target.value }))}
                    placeholder="Write your blog content here..."
                    rows={15}
                    className="min-h-[400px]"
                  />
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Blog Settings</CardTitle>
                <CardDescription>Configure your blog post</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="category">Category *</Label>
                  <Select
                    value={blog.category}
                    onValueChange={(value) => setBlog((prev) => ({ ...prev, category: value }))}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select category" />
                    </SelectTrigger>
                    <SelectContent>
                      {categories.map((category) => (
                        <SelectItem key={category} value={category}>
                          {category}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label>Tags</Label>
                  <div className="flex gap-2 mb-2">
                    <Input
                      value={tagInput}
                      onChange={(e) => setTagInput(e.target.value)}
                      placeholder="Add tag"
                      onKeyPress={(e) => e.key === "Enter" && (e.preventDefault(), addTag())}
                    />
                    <Button type="button" onClick={addTag} size="sm">
                      Add
                    </Button>
                  </div>
                  <div className="flex flex-wrap gap-1">
                    {blog.tags.map((tag) => (
                      <Badge key={tag} variant="secondary" className="flex items-center gap-1">
                        #{tag}
                        <X className="h-3 w-3 cursor-pointer" onClick={() => removeTag(tag)} />
                      </Badge>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Featured Image</CardTitle>
                <CardDescription>Upload a featured image for your blog</CardDescription>
              </CardHeader>
              <CardContent>
                {blog.featuredImage ? (
                  <div className="space-y-4">
                    <img
                      src={blog.featuredImage || "/event.png"}
                      alt="Featured"
                      className="w-full h-32 object-cover rounded-lg"
                    />
                    <Button
                      variant="outline"
                      onClick={() => setBlog((prev) => ({ ...prev, featuredImage: undefined }))}
                      className="w-full"
                    >
                      Remove Image
                    </Button>
                  </div>
                ) : (
                  <div>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={(e) => {
                        const file = e.target.files?.[0]
                        if (file) {
                          setImageFile(file)
                          handleImageUpload(file)
                        }
                      }}
                      className="hidden"
                      id="image-upload"
                    />
                    <Label
                      htmlFor="image-upload"
                      className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer hover:bg-gray-50"
                    >
                      <Upload className="h-8 w-8 text-gray-400 mb-2" />
                      <span className="text-sm text-gray-500">
                        {uploading ? "Uploading..." : "Click to upload image"}
                      </span>
                    </Label>
                  </div>
                )}
              </CardContent>
            </Card>

            {blog.status === "rejected" && blog.adminFeedback && (
              <Alert>
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>
                  <strong>Admin Feedback:</strong> {blog.adminFeedback}
                </AlertDescription>
              </Alert>
            )}
          </div>
        </div>
      )}
    </div>
  )
}
