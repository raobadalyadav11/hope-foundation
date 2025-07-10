import { type NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import connectDB from "@/lib/mongodb"
import Volunteer from "@/lib/models/Volunteer"
import { authOptions } from "@/lib/auth"

export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const session = await getServerSession(authOptions)

    if (!session) {
      return NextResponse.json({ error: "Authentication required" }, { status: 401 })
    }

    await connectDB()

    const volunteer = await Volunteer.findById(params.id)
      .populate("userId", "name email phone profileImage")
      .populate("assignments.campaignId", "title")
      .populate("assignments.eventId", "title")
      .lean()

    if (!volunteer) {
      return NextResponse.json({ error: "Volunteer not found" }, { status: 404 })
    }

    // Check if user can access this volunteer data
    if (session.user.id !== volunteer.userId._id.toString() && !["admin", "creator"].includes(session.user.role)) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 403 })
    }

    return NextResponse.json(volunteer)
  } catch (error) {
    console.error("Error fetching volunteer:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

export async function PUT(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const session = await getServerSession(authOptions)

    if (!session || !["admin", "creator"].includes(session.user.role)) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    await connectDB()

    const body = await request.json()

    const volunteer = await Volunteer.findByIdAndUpdate(params.id, body, { new: true, runValidators: true }).populate(
      "userId",
      "name email phone",
    )

    if (!volunteer) {
      return NextResponse.json({ error: "Volunteer not found" }, { status: 404 })
    }

    return NextResponse.json(volunteer)
  } catch (error) {
    console.error("Error updating volunteer:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
