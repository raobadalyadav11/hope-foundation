import { type NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth/next"
import { authOptions } from "@/lib/auth"
import connectDB from "@/lib/mongodb"
import Impact from "@/lib/models/Impact"

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await connectDB()

    const impact = await Impact.findById(params.id)
      .populate("campaign", "title description goal image")
      .populate("event", "title description date location image")
      .populate("createdBy", "name email")
      .populate("verifiedBy", "name email")

    if (!impact) {
      return NextResponse.json(
        { error: "Impact not found" },
        { status: 404 }
      )
    }

    // Only allow published impacts for public access
    if (!impact.isPublished) {
      return NextResponse.json(
        { error: "Impact not published" },
        { status: 404 }
      )
    }

    return NextResponse.json(impact)
  } catch (error) {
    console.error("Error fetching impact:", error)
    return NextResponse.json(
      { error: "Failed to fetch impact" },
      { status: 500 }
    )
  }
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions)
    if (!session || !session.user?.role || !["admin", "creator"].includes(session.user.role)) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    await connectDB()

    const data = await request.json()
    
    const impact = await Impact.findByIdAndUpdate(
      params.id,
      { ...data, updatedAt: new Date() },
      { new: true }
    ).populate("campaign", "title")
      .populate("event", "title")
      .populate("createdBy", "name email")

    if (!impact) {
      return NextResponse.json(
        { error: "Impact not found" },
        { status: 404 }
      )
    }

    return NextResponse.json(impact)
  } catch (error) {
    console.error("Error updating impact:", error)
    return NextResponse.json(
      { error: "Failed to update impact" },
      { status: 500 }
    )
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions)
    if (!session || session.user.role !== "admin") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    await connectDB()

    const impact = await Impact.findByIdAndDelete(params.id)

    if (!impact) {
      return NextResponse.json(
        { error: "Impact not found" },
        { status: 404 }
      )
    }

    return NextResponse.json({ message: "Impact deleted successfully" })
  } catch (error) {
    console.error("Error deleting impact:", error)
    return NextResponse.json(
      { error: "Failed to delete impact" },
      { status: 500 }
    )
  }
}