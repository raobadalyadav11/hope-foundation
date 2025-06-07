import { type NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import dbConnect from "@/lib/mongodb"
import Volunteer from "@/lib/models/Volunteer"
import { authOptions } from "@/lib/auth"

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)

    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    await dbConnect()

    // Get volunteer profile
    const volunteer = await Volunteer.findOne({ userId: session.user.id }).populate("userId", "name email").lean()

    if (!volunteer) {
      return NextResponse.json({ error: "Volunteer profile not found" }, { status: 404 })
    }

    // Calculate stats
    const stats = {
      totalHours: volunteer.hoursLogged || 0,
      eventsAttended: volunteer.eventsAttended?.length || 0,
      tasksCompleted: volunteer.tasksCompleted || 0,
      impactScore: Math.round((volunteer.hoursLogged || 0) * 10 + (volunteer.tasksCompleted || 0) * 5),
      rank: getRank(volunteer.hoursLogged || 0),
      nextMilestone: getNextMilestone(volunteer.hoursLogged || 0),
    }

    // Get recent activity
    const recentActivity = [
      ...(volunteer.recentActivities || []),
      // Add more activity sources as needed
    ]
      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
      .slice(0, 5)

    return NextResponse.json({
      volunteer,
      stats,
      recentActivity,
      profile: {
        skills: volunteer.skills || [],
        availability: volunteer.availability || "Not specified",
      },
    })
  } catch (error) {
    console.error("Error fetching volunteer dashboard:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

function getRank(hours: number): string {
  if (hours >= 100) return "Champion"
  if (hours >= 50) return "Advocate"
  if (hours >= 25) return "Supporter"
  if (hours >= 10) return "Helper"
  return "Newcomer"
}

function getNextMilestone(hours: number) {
  if (hours < 10) return { title: "Helper", hoursNeeded: 10, currentProgress: hours }
  if (hours < 25) return { title: "Supporter", hoursNeeded: 25, currentProgress: hours }
  if (hours < 50) return { title: "Advocate", hoursNeeded: 50, currentProgress: hours }
  if (hours < 100) return { title: "Champion", hoursNeeded: 100, currentProgress: hours }
  return { title: "Legend", hoursNeeded: 200, currentProgress: hours }
}
