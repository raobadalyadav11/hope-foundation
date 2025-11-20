import { type NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth/next"
import { authOptions } from "@/lib/auth"
import connectDB from "@/lib/mongodb"
import mongoose from "mongoose"

// Create NotificationTemplate schema if it doesn't exist
const NotificationTemplateSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true,
  },
  type: {
    type: String,
    enum: ["donation", "volunteer", "event", "campaign", "newsletter", "general"],
    required: true,
  },
  subject: {
    type: String,
    required: true,
  },
  content: {
    type: String,
    required: true,
  },
  variables: [{
    type: String,
  }],
  isActive: {
    type: Boolean,
    default: true,
  },
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
})

const NotificationTemplate = mongoose.models.NotificationTemplate || mongoose.model("NotificationTemplate", NotificationTemplateSchema)

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    if (!session || session.user.role !== "admin") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    await connectDB()

    const { searchParams } = new URL(request.url)
    const page = parseInt(searchParams.get("page") || "1")
    const limit = parseInt(searchParams.get("limit") || "10")
    const search = searchParams.get("search") || ""
    const type = searchParams.get("type") || ""

    const query: any = {}
    
    if (search) {
      query.$or = [
        { name: { $regex: search, $options: "i" } },
        { subject: { $regex: search, $options: "i" } },
      ]
    }

    if (type && type !== "all") {
      query.type = type
    }

    const total = await NotificationTemplate.countDocuments(query)
    const templates = await NotificationTemplate.find(query)
      .populate("createdBy", "name email")
      .sort({ createdAt: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit)

    return NextResponse.json({
      templates,
      totalPages: Math.ceil(total / limit),
      currentPage: page,
      total
    })
  } catch (error) {
    console.error("Error fetching notification templates:", error)
    return NextResponse.json(
      { error: "Failed to fetch notification templates" },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    if (!session || session.user.role !== "admin") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    await connectDB()

    const data = await request.json()
    
    // Extract variables from content using regex
    const variablePattern = /\{\{([^}]+)\}\}/g
    const variables = []
    let match
    while ((match = variablePattern.exec(data.content)) !== null) {
      variables.push(match[1])
    }
    
    const template = new NotificationTemplate({
      ...data,
      variables: [...new Set(variables)], // Remove duplicates
      createdBy: session.user.id,
    })
    
    await template.save()

    return NextResponse.json(template, { status: 201 })
  } catch (error) {
    console.error("Error creating notification template:", error)
    return NextResponse.json(
      { error: "Failed to create notification template" },
      { status: 500 }
    )
  }
}