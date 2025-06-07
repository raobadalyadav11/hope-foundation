import { type NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import dbConnect from "@/lib/mongodb"
import Volunteer from "@/lib/models/Volunteer"
import { authOptions } from "@/lib/auth"

export async function GET(request: NextRequest, { params }: { params: { userId: string } }) {
  try {
    const session = await getServerSession(authOptions)

    if (!session || session.user.id !== params.userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    await dbConnect()

    const volunteer = await Volunteer.findOne({ userId: params.userId }).populate("userId", "name email").lean()

    if (!volunteer) {
      return NextResponse.json({ error: "Volunteer profile not found" }, { status: 404 })
    }

    return NextResponse.json(volunteer)
  } catch (error) {
    console.error("Error fetching volunteer profile:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
