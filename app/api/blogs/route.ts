import { type NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import dbConnect from "@/lib/mongodb"
import Blog from "@/lib/models/Blog"
import { authOptions } from "@/lib/auth"
import { z } from "zod"

const blogSchema = z.object({
  title: z.string().min(1, "Title is required").max(200, "Title cannot exceed 200 characters"),
  content: z.string().min(1, "Content is required"),
  excerpt: z.string().min(1, "Excerpt is required").max(300, "Excerpt cannot exceed 300 characters"),
  category: z.enum([
    "impact-stories",
    "news",
    "education",
    "healthcare",
    "environment",
    "volunteer-stories",
    "fundraising",
  ]),
  image: z.string().url("Invalid image URL"),
  gallery: z.array(z.string().url()).optional(),
  tags: z.array(z.string()).optional(),
  status: z.enum(["draft", "published", "archived"]).optional(),
  featured: z.boolean().optional(),
  readTime: z.string().min(1, "Read time is required"),
  seoTitle: z.string().max(60, "SEO title cannot exceed 60 characters").optional(),
  seoDescription: z.string().max(160, "SEO description cannot exceed 160 characters").optional(),
  scheduledAt: z
    .string()
    .transform((str) => new Date(str))
    .optional(),
})

export async function GET(request: NextRequest) {
  try {
    await dbConnect()

    const { searchParams } = new URL(request.url)
    const status = searchParams.get("status")
    const category = searchParams.get("category")
    const featured = searchParams.get("featured")
    const search = searchParams.get("search")
    const tags = searchParams.get("tags")
    const limit = Number.parseInt(searchParams.get("limit") || "10")
    const page = Number.parseInt(searchParams.get("page") || "1")
    const sort = searchParams.get("sort") || "publishedAt"
    const order = searchParams.get("order") || "desc"

    const query: any = {}

    // For public access, only show published blogs
    const session = await getServerSession(authOptions)
    if (!session || !["admin", "creator"].includes(session.user.role)) {
      query.status = "published"
    } else if (status) {
      query.status = status
    }

    if (category && category !== "all") {
      query.category = category
    }

    if (featured === "true") {
      query.featured = true
    }

    if (search) {
      query.$or = [
        { title: { $regex: search, $options: "i" } },
        { excerpt: { $regex: search, $options: "i" } },
        { content: { $regex: search, $options: "i" } },
      ]
    }

    if (tags) {
      query.tags = { $in: tags.split(",") }
    }

    const sortOrder = order === "desc" ? -1 : 1
    const sortObj: any = {}
    sortObj[sort] = sortOrder

    const blogs = await Blog.find(query)
      .populate("authorId", "name email profileImage")
      .sort(sortObj)
      .limit(limit)
      .skip((page - 1) * limit)
      .lean()

    const total = await Blog.countDocuments(query)

    return NextResponse.json({
      blogs,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit),
      },
    })
  } catch (error) {
    console.error("Error fetching blogs:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)

    if (!session || !["admin", "creator"].includes(session.user.role)) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const body = await request.json()
    const blogData = blogSchema.parse(body)

    await dbConnect()

    const blog = await Blog.create({
      ...blogData,
      authorId: session.user.id,
    })

    const populatedBlog = await Blog.findById(blog._id).populate("authorId", "name email")

    return NextResponse.json(populatedBlog, { status: 201 })
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: "Validation error", details: error.errors }, { status: 400 })
    }

    console.error("Error creating blog:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
