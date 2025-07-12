"use client"

import { useState } from "react"
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import { useSession } from "next-auth/react"
import { useParams } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { Textarea } from "@/components/ui/textarea"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Heart, MessageCircle, Share2, Clock, Eye, Calendar, ArrowLeft } from "lucide-react"
import Image from "next/image"
import Link from "next/link"
import { toast } from "sonner"

interface BlogPost {
  _id: string
  title: string
  slug: string
  content: string
  excerpt: string
  authorId: {
    _id: string
    name: string
    email: string
    profileImage?: string
  }
  authorName: string
  status: string
  tags: string[]
  category: string
  featuredImage: string
  views: number
  likes: number
  comments: Array<{
    _id: string
    userId: {
      _id: string
      name: string
      profileImage?: string
    }
    content: string
    createdAt: string
    isApproved: boolean
  }>
  publishedAt: string
  createdAt: string
  relatedBlogs: Array<{
    _id: string
    title: string
    slug: string
    excerpt: string
    featuredImage: string
    publishedAt: string
    authorId: {
      name: string
    }
  }>
}

export default function BlogPostPage() {
  const params = useParams()
  const { data: session } = useSession()
  const queryClient = useQueryClient()
  const [comment, setComment] = useState("")
  const [isLiked, setIsLiked] = useState(false)

  const { data: blog, isLoading } = useQuery({
    queryKey: ["blog", params.slug],
    queryFn: async () => {
      const response = await fetch(`/api/blogs/${params.slug}`)
      if (!response.ok) throw new Error("Failed to fetch blog")
      const data = (await response.json()) as BlogPost
      setIsLiked(false) // For now, since we don't track individual likes
      return data
    },
  })

  const likeMutation = useMutation({
    mutationFn: async () => {
      const response = await fetch(`/api/blogs/${params.slug}/like`, {
        method: "POST",
      })
      if (!response.ok) throw new Error("Failed to like blog")
      return response.json()
    },
    onSuccess: () => {
      setIsLiked(!isLiked)
      queryClient.invalidateQueries({ queryKey: ["blog", params.slug] })
    },
    onError: () => {
      toast.error("Failed to like blog")
    },
  })

  const commentMutation = useMutation({
    mutationFn: async (content: string) => {
      const response = await fetch(`/api/blogs/${params.slug}/comments`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ content }),
      })
      if (!response.ok) throw new Error("Failed to add comment")
      return response.json()
    },
    onSuccess: () => {
      setComment("")
      toast.success("Comment added successfully! It will be visible after approval.")
      queryClient.invalidateQueries({ queryKey: ["blog", params.slug] })
    },
    onError: () => {
      toast.error("Failed to add comment")
    },
  })

  const handleLike = () => {
    if (!session) {
      toast.error("Please login to like this post")
      return
    }
    likeMutation.mutate()
  }

  const handleComment = () => {
    if (!session) {
      toast.error("Please login to comment")
      return
    }
    if (!comment.trim()) {
      toast.error("Please enter a comment")
      return
    }
    commentMutation.mutate(comment)
  }

  const handleShare = async () => {
    const url = window.location.href
    if (navigator.share) {
      try {
        await navigator.share({
          title: blog?.title,
          text: blog?.excerpt,
          url: url,
        })
      } catch (error) {
        navigator.clipboard.writeText(url)
        toast.success("Link copied to clipboard!")
      }
    } else {
      navigator.clipboard.writeText(url)
      toast.success("Link copied to clipboard!")
    }
  }

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
      </div>
    )
  }

  if (!blog) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Blog Post Not Found</h1>
          <Button asChild>
            <Link href="/blog">Back to Blog</Link>
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        {/* Back Button */}
        <div className="mb-6">
          <Button variant="ghost" asChild>
            <Link href="/blog">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Blog
            </Link>
          </Button>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2">
            <article className="bg-white rounded-lg shadow-sm overflow-hidden">
              {/* Hero Image */}
              <div className="relative h-96">
                <Image
                  src={blog.featuredImage || "/placeholder.svg?height=400&width=800"}
                  alt={blog.title}
                  fill
                  className="object-cover"
                />
                <div className="absolute top-4 left-4">
                  <Badge className="bg-blue-600 text-white">{blog.category}</Badge>
                </div>
              </div>

              {/* Article Header */}
              <div className="p-8">
                <div className="flex items-center gap-4 mb-6">
                  <Avatar>
                    <AvatarImage src={blog.authorId.profileImage || "/placeholder.svg"} />
                    <AvatarFallback>{blog.authorId.name.charAt(0)}</AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="font-medium">{blog.authorId.name}</p>
                    <div className="flex items-center gap-4 text-sm text-gray-600">
                      <div className="flex items-center gap-1">
                        <Calendar className="w-4 h-4" />
                        <span>{new Date(blog.publishedAt).toLocaleDateString()}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Clock className="w-4 h-4" />
                        <span>{blog.readTime}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Eye className="w-4 h-4" />
                        <span>{blog.views} views</span>
                      </div>
                    </div>
                  </div>
                </div>

                <h1 className="text-4xl font-bold text-gray-900 mb-4">{blog.title}</h1>
                <p className="text-xl text-gray-600 mb-6">{blog.excerpt}</p>

                {/* Tags */}
                <div className="flex flex-wrap gap-2 mb-8">
                  {blog.tags.map((tag) => (
                    <Badge key={tag} variant="secondary">
                      {tag}
                    </Badge>
                  ))}
                </div>

                {/* Content */}
                <div className="prose max-w-none">
                  <div className="text-gray-700 leading-relaxed" dangerouslySetInnerHTML={{ __html: blog.content }} />
                </div>

                {/* Gallery */}
                {blog.gallery && blog.gallery.length > 0 && (
                  <div className="mt-8">
                    <h3 className="text-xl font-semibold mb-4">Gallery</h3>
                    <div className="grid md:grid-cols-2 gap-4">
                      {blog.gallery.map((image, index) => (
                        <div key={index} className="relative h-64 rounded-lg overflow-hidden">
                          <Image
                            src={image || "/placeholder.svg"}
                            alt={`Gallery ${index + 1}`}
                            fill
                            className="object-cover"
                          />
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Action Buttons */}
                <div className="flex items-center gap-4 mt-8 pt-8 border-t">
                  <Button
                    variant={isLiked ? "default" : "outline"}
                    onClick={handleLike}
                    disabled={likeMutation.isPending}
                  >
                    <Heart className={`w-4 h-4 mr-2 ${isLiked ? "fill-current" : ""}`} />
                    {blog.likes} Likes
                  </Button>
                  <Button variant="outline" onClick={handleShare}>
                    <Share2 className="w-4 h-4 mr-2" />
                    Share
                  </Button>
                </div>
              </div>
            </article>

            {/* Comments Section */}
            <Card className="mt-8">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <MessageCircle className="w-5 h-5" />
                  Comments ({blog.comments.filter((c) => c.isApproved).length})
                </CardTitle>
              </CardHeader>
              <CardContent>
                {/* Add Comment */}
                {session ? (
                  <div className="mb-6">
                    <Textarea
                      placeholder="Share your thoughts..."
                      value={comment}
                      onChange={(e) => setComment(e.target.value)}
                      rows={3}
                    />
                    <Button
                      className="mt-2"
                      onClick={handleComment}
                      disabled={commentMutation.isPending || !comment.trim()}
                    >
                      {commentMutation.isPending ? "Posting..." : "Post Comment"}
                    </Button>
                  </div>
                ) : (
                  <div className="mb-6 p-4 bg-gray-50 rounded-lg text-center">
                    <p className="text-gray-600 mb-2">Please login to leave a comment</p>
                    <Button asChild>
                      <Link href="/auth/signin">Login</Link>
                    </Button>
                  </div>
                )}

                <Separator className="mb-6" />

                {/* Comments List */}
                <div className="space-y-6">
                  {blog.comments
                    .filter((comment) => comment.isApproved)
                    .map((comment) => (
                      <div key={comment._id} className="flex gap-4">
                        <Avatar>
                          <AvatarImage src={comment.userId.profileImage || "/placeholder.svg"} />
                          <AvatarFallback>{comment.userId.name.charAt(0)}</AvatarFallback>
                        </Avatar>
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            <span className="font-medium">{comment.userId.name}</span>
                            <span className="text-sm text-gray-500">
                              {new Date(comment.createdAt).toLocaleDateString()}
                            </span>
                          </div>
                          <p className="text-gray-700">{comment.content}</p>
                        </div>
                      </div>
                    ))}

                  {blog.comments.filter((c) => c.isApproved).length === 0 && (
                    <div className="text-center py-8 text-gray-500">
                      <MessageCircle className="w-12 h-12 mx-auto mb-4 opacity-50" />
                      <p>No comments yet. Be the first to share your thoughts!</p>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Author Info */}
            <Card>
              <CardHeader>
                <CardTitle>About the Author</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center gap-4 mb-4">
                  <Avatar className="w-16 h-16">
                    <AvatarImage src={blog.authorId.profileImage || "/placeholder.svg"} />
                    <AvatarFallback className="text-lg">{blog.authorId.name.charAt(0)}</AvatarFallback>
                  </Avatar>
                  <div>
                    <h3 className="font-semibold text-lg">{blog.authorId.name}</h3>
                    <p className="text-sm text-gray-600">Content Creator</p>
                  </div>
                </div>
                <p className="text-sm text-gray-600">
                  Passionate about creating positive change through storytelling and community engagement.
                </p>
              </CardContent>
            </Card>

            {/* Related Posts */}
            {blog.relatedBlogs && blog.relatedBlogs.length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle>Related Posts</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {blog.relatedBlogs.map((relatedBlog) => (
                      <Link key={relatedBlog._id} href={`/blog/${relatedBlog.slug}`} className="block group">
                        <div className="flex gap-3">
                          <div className="relative w-20 h-20 rounded-lg overflow-hidden flex-shrink-0">
                            <Image
                              src={relatedBlog.image || "/placeholder.svg?height=80&width=80"}
                              alt={relatedBlog.title}
                              fill
                              className="object-cover group-hover:scale-105 transition-transform"
                            />
                          </div>
                          <div className="flex-1 min-w-0">
                            <h4 className="font-medium text-sm line-clamp-2 group-hover:text-blue-600 transition-colors">
                              {relatedBlog.title}
                            </h4>
                            <p className="text-xs text-gray-500 mt-1">By {relatedBlog.authorId.name}</p>
                            <div className="flex items-center gap-2 mt-1 text-xs text-gray-500">
                              <Clock className="w-3 h-3" />
                              <span>{relatedBlog.readTime}</span>
                            </div>
                          </div>
                        </div>
                      </Link>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Newsletter Signup */}
            <Card className="bg-blue-50">
              <CardContent className="p-6">
                <h3 className="font-semibold text-lg mb-2">Stay Updated</h3>
                <p className="text-sm text-gray-600 mb-4">
                  Subscribe to our newsletter for the latest stories and updates.
                </p>
                <Button className="w-full">Subscribe Now</Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
