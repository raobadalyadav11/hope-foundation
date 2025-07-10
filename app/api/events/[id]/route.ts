import { type NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import connectDB from "@/lib/mongodb"
import Event from "@/lib/models/Event"
import { authOptions } from "@/lib/auth"

export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    await connectDB()

    const event = await Event.findById(params.id)
      .populate("createdBy", "name email")
      .populate("attendees.userId", "name email")
      .lean()

    if (!event) {
      return NextResponse.json({ error: "Event not found" }, { status: 404 })
    }

    // Calculate additional metrics
    const eventWithMetrics = {
      ...event,
      spotsLeft: event.maxAttendees ? event.maxAttendees - event.currentAttendees : null,
      isFull: event.maxAttendees ? event.currentAttendees >= event.maxAttendees : false,
      daysUntil: Math.ceil((new Date(event.date).getTime() - Date.now()) / (1000 * 60 * 60 * 24)),
    }

    return NextResponse.json(eventWithMetrics)
  } catch (error) {
    console.error("Error fetching event:", error)
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

    const event = await Event.findByIdAndUpdate(params.id, body, { new: true, runValidators: true }).populate(
      "createdBy",
      "name email",
    )

    if (!event) {
      return NextResponse.json({ error: "Event not found" }, { status: 404 })
    }

    return NextResponse.json(event)
  } catch (error) {
    console.error("Error updating event:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

export async function DELETE(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const session = await getServerSession(authOptions)

    if (!session || session.user.role !== "admin") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    await connectDB()

    const event = await Event.findByIdAndUpdate(params.id, { isActive: false }, { new: true })

    if (!event) {
      return NextResponse.json({ error: "Event not found" }, { status: 404 })
    }

    return NextResponse.json({ message: "Event deactivated successfully" })
  } catch (error) {
    console.error("Error deleting event:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
