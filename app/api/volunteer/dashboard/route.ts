import { type NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import connectDB from "@/lib/mongodb"
import Volunteer from "@/lib/models/Volunteer"
import { authOptions } from "@/lib/auth"

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)

    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    await connectDB()

    // Get volunteer profile or create default
    let volunteer = await Volunteer.findOne({ userId: session.user.id }).populate("userId", "name email").lean()

    if (!volunteer) {
      // Create default volunteer profile
      const newVolunteer = await Volunteer.create({
        userId: session.user.id,
        applicationStatus: "pending",
        skills: [],
        availability: "flexible",
        motivation: "I want to make a positive impact in my community",
        preferredCauses: [],
        emergencyContact: {
          name: "Not provided",
          relationship: "Not specified",
          phone: "Not provided"
        },
        totalHours: 0,
        assignments: [],
        reviews: [],
        isActive: true
      })
      volunteer = await Volunteer.findById(newVolunteer._id).populate("userId", "name email").lean()
    }

    // Calculate stats
    const stats = {
      totalHours: volunteer.totalHours || 0,
      eventsAttended: volunteer.assignments?.filter((a: any) => a.eventId).length || 0,
      tasksCompleted: volunteer.assignments?.filter((a: any) => a.status === "completed").length || 0,
      impactScore: Math.round((volunteer.totalHours || 0) * 10 + (volunteer.assignments?.filter((a: any) => a.status === "completed").length || 0) * 5),
      rank: getRank(volunteer.totalHours || 0),
      nextMilestone: getNextMilestone(volunteer.totalHours || 0),
    }

    // Get recent activity from assignments
    const recentActivity = (volunteer.assignments || [])
      .filter((assignment: any) => assignment && assignment.startDate)
      .sort((a: any, b: any) => {
        const dateA = new Date(a.startDate).getTime()
        const dateB = new Date(b.startDate).getTime()
        return dateB - dateA
      })
      .slice(0, 5)
      .map((assignment: any) => ({
        id: assignment._id,
        type: assignment.eventId ? "event" : "task",
        title: assignment.role,
        description: `Assignment: ${assignment.role}`,
        date: assignment.startDate,
        status: assignment.status
      }))

    return NextResponse.json({
      volunteer,
      stats,
      recentActivity,
      upcomingTasks: [],
      upcomingEvents: [],
      notifications: [],
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

function getNextMilestone(hours: number): { title: string; hoursNeeded: number; currentProgress: number } {
  if (hours < 10) return { title: "Helper", hoursNeeded: 10, currentProgress: hours }
  if (hours < 25) return { title: "Supporter", hoursNeeded: 25, currentProgress: hours }
  if (hours < 50) return { title: "Advocate", hoursNeeded: 50, currentProgress: hours }
  if (hours < 100) return { title: "Champion", hoursNeeded: 100, currentProgress: hours }
  return { title: "Legend", hoursNeeded: 200, currentProgress: hours }
}
