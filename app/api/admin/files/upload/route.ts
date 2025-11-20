import { type NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth/next"
import { authOptions } from "@/lib/auth"
import connectDB from "@/lib/mongodb"
import File from "@/lib/models/File"

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    if (!session || !session.user?.role || !["admin", "creator"].includes(session.user.role)) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    await connectDB()

    const formData = await request.formData()
    const file = formData.get("file") as File
    const usage = formData.get("usage") as string
    const description = formData.get("description") as string

    if (!file) {
      return NextResponse.json(
        { error: "No file provided" },
        { status: 400 }
      )
    }

    // Validate file size (10MB limit)
    const maxSize = 10 * 1024 * 1024 // 10MB
    if (file.size > maxSize) {
      return NextResponse.json(
        { error: "File size exceeds 10MB limit" },
        { status: 400 }
      )
    }

    // Validate file type
    const allowedTypes = [
      "image/jpeg", "image/png", "image/gif", "image/webp",
      "application/pdf", "text/plain", "application/msword",
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document"
    ]

    if (!allowedTypes.includes(file.type)) {
      return NextResponse.json(
        { error: "File type not allowed" },
        { status: 400 }
      )
    }

    // Convert file to buffer
    const bytes = await file.arrayBuffer()
    const buffer = Buffer.from(bytes)

    // Generate unique filename
    const timestamp = Date.now()
    const originalName = file.name.replace(/[^a-zA-Z0-9.-]/g, "_")
    const uniqueFilename = `${timestamp}_${originalName}`

    // Here you would typically upload to your cloud storage (AWS S3, Cloudinary, etc.)
    // For now, we'll store metadata and simulate file storage
    
    const fileRecord = new File({
      filename: uniqueFilename,
      originalName: file.name,
      mimeType: file.type,
      size: file.size,
      url: `/uploads/${uniqueFilename}`, // This would be your cloud storage URL
      description: description || "",
      usage: usage || "general",
      uploadedBy: session.user.id,
      metadata: {
        uploadDate: new Date(),
        lastModified: file.lastModified || Date.now(),
      }
    })

    await fileRecord.save()

    return NextResponse.json({
      file: fileRecord,
      message: "File uploaded successfully"
    }, { status: 201 })

  } catch (error) {
    console.error("Error uploading file:", error)
    return NextResponse.json(
      { error: "Failed to upload file" },
      { status: 500 }
    )
  }
}