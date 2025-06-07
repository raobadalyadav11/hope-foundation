import { BlogEditor } from "@/components/blog-editor"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Plus, Edit, Trash2, Eye } from "lucide-react"

export default function AdminBlogPage() {
  const blogPosts = [
    {
      id: 1,
      title: "Transforming Lives Through Clean Water",
      status: "published",
      author: "Dr. Sarah Johnson",
      date: "2024-01-15",
      views: 1250,
    },
    {
      id: 2,
      title: "The Power of Education in Remote Areas",
      status: "draft",
      author: "Michael Chen",
      date: "2024-01-10",
      views: 0,
    },
    {
      id: 3,
      title: "Healthcare Heroes Making a Difference",
      status: "published",
      author: "Dr. Priya Sharma",
      date: "2024-01-08",
      views: 890,
    },
  ]

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Blog Management</h1>
          <p className="text-gray-600 mt-2">Create and manage blog posts for your NGO website</p>
        </div>
        <Button>
          <Plus className="w-4 h-4 mr-2" />
          New Post
        </Button>
      </div>

      <div className="grid lg:grid-cols-3 gap-8">
        {/* Blog Editor */}
        <div className="lg:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle>Blog Editor</CardTitle>
              <CardDescription>Create and edit blog posts with our rich text editor</CardDescription>
            </CardHeader>
            <CardContent>
              <BlogEditor />
            </CardContent>
          </Card>
        </div>

        {/* Blog Posts List */}
        <div>
          <Card>
            <CardHeader>
              <CardTitle>Recent Posts</CardTitle>
              <CardDescription>Manage your published and draft blog posts</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {blogPosts.map((post) => (
                <div key={post.id} className="border rounded-lg p-4">
                  <div className="flex justify-between items-start mb-2">
                    <h3 className="font-semibold text-sm line-clamp-2">{post.title}</h3>
                    <Badge variant={post.status === "published" ? "default" : "secondary"}>{post.status}</Badge>
                  </div>
                  <p className="text-xs text-gray-600 mb-3">
                    By {post.author} • {new Date(post.date).toLocaleDateString()}
                  </p>
                  {post.status === "published" && (
                    <p className="text-xs text-gray-500 mb-3">
                      <Eye className="w-3 h-3 inline mr-1" />
                      {post.views} views
                    </p>
                  )}
                  <div className="flex gap-2">
                    <Button size="sm" variant="outline">
                      <Edit className="w-3 h-3" />
                    </Button>
                    <Button size="sm" variant="outline">
                      <Trash2 className="w-3 h-3" />
                    </Button>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
