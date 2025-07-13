import { type NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import connectDB from "@/lib/mongodb"
import VolunteerTask from "@/lib/models/VolunteerTask"
import { authOptions } from "@/lib/auth"

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)

    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    await connectDB()

    const { searchParams } = new URL(request.url)
    const status = searchParams.get("status") || "all"
    const limit = Number.parseInt(searchParams.get("limit") || "10")

    const query: any = { assignedTo: session.user.id }
    
    if (status !== "all") {
      query.status = status
    }

    const tasks = await VolunteerTask.find(query)
      .populate("assignedBy", "name email")
      .sort({ createdAt: -1 })
      .limit(limit)
      .lean()

    return NextResponse.json({ tasks })
  } catch (error) {
    console.error("Error fetching volunteer tasks:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}