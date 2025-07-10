import { type NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import dbConnect from "@/lib/mongodb"
import Event from "@/lib/models/Event"
import { authOptions } from "@/lib/auth"
import { sendEventConfirmation } from "@/lib/email"

export async function POST(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const session = await getServerSession(authOptions)

    if (!session) {
      return NextResponse.json({ error: "Authentication required" }, { status: 401 })
    }

    const body = await request.json()
    const { status } = body

    if (!["attending", "not_attending"].includes(status)) {
      return NextResponse.json({ error: "Invalid RSVP status" }, { status: 400 })
    }

    await dbConnect()

    const event = await Event.findById(params.id)
    if (!event) {
      return NextResponse.json({ error: "Event not found" }, { status: 404 })
    }

    // Check if event is full (only for attending status)
    if (status === "attending") {
      const currentAttendees = event.attendees?.filter((a: any) => a.status === "attending").length || 0
      if (currentAttendees >= event.maxAttendees) {
        return NextResponse.json({ error: "Event is full" }, { status: 400 })
      }
    }

    // Find existing RSVP
    const existingRSVPIndex = event.attendees?.findIndex(
      (attendee: any) => attendee.userId.toString() === session.user.id,
    )

    if (existingRSVPIndex !== undefined && existingRSVPIndex >= 0) {
      // Update existing RSVP
      event.attendees[existingRSVPIndex].status = status
      event.attendees[existingRSVPIndex].rsvpDate = new Date()
    } else {
      // Add new RSVP
      if (!event.attendees) event.attendees = []
      event.attendees.push({
        userId: session.user.id,
        status,
        rsvpDate: new Date(),
      })
    }

    await event.save()

    // Send confirmation email
    try {
      await sendEventConfirmation(event, session.user, status)
    } catch (emailError) {
      console.error("Failed to send confirmation email:", emailError)
      // Don't fail the request if email fails
    }

    return NextResponse.json({
      message: "RSVP updated successfully",
      status,
    })
  } catch (error) {
    console.error("Error updating RSVP:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
