import { type NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth/next"
import { authOptions } from "@/lib/auth"
import connectDB from "@/lib/mongodb"

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    if (!session || !session.user?.role || !["admin", "creator"].includes(session.user.role)) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    await connectDB()

    // Get file storage statistics
    // This would typically query your cloud storage service
    const stats = {
      totalFiles: 245, // Mock data - replace with actual count
      totalSize: 1572864000, // 1.5GB in bytes
      storageUsed: 45.2, // Percentage used
      filesByType: [
        { type: "image", count: 156, size: 524288000 }, // 500MB
        { type: "pdf", count: 42, size: 104857600 }, // 100MB
        { type: "video", count: 12, size: 524288000 }, // 500MB
        { type: "document", count: 35, size: 209715200 }, // 200MB
      ],
      recentUploads: [
        {
          id: "1",
          filename: "campaign_image_001.jpg",
          size: 245678,
          uploadedAt: new Date("2024-11-19T10:30:00Z"),
          uploadedBy: "Admin User"
        },
        {
          id: "2",
          filename: "event_poster.pdf",
          size: 567890,
          uploadedAt: new Date("2024-11-19T09:15:00Z"),
          uploadedBy: "Content Creator"
        }
      ]
    }

    return NextResponse.json(stats)
  } catch (error) {
    console.error("Error fetching file stats:", error)
    return NextResponse.json(
      { error: "Failed to fetch file statistics" },
      { status: 500 }
    )
  }
}