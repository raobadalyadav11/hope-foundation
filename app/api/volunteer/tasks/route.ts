import { type NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import dbConnect from "@/lib/mongodb"
import VolunteerTask from "@/lib/models/VolunteerTask"
import { authOptions } from "@/lib/auth"

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)

    if (!session) {
      return NextResponse.json({ error: "Authentication required" }, { status: 401 })
    }

    await dbConnect()

    const tasks = await VolunteerTask.find({ volunteerId: session.user.id })
      .populate("campaignId", "title")
      .populate("eventId", "title date location")
      .populate("assignedBy", "name email")
      .sort({ createdAt: -1 })
      .lean()

    return NextResponse.json({ tasks })
  } catch (error) {
    console.error("Error fetching volunteer tasks:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
