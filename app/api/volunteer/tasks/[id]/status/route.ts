import { type NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import connectDB from "@/lib/mongodb"
import VolunteerTask from "@/lib/models/VolunteerTask"
import Volunteer from "@/lib/models/Volunteer"
import { authOptions } from "@/lib/auth"

export async function PATCH(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const session = await getServerSession(authOptions)

    if (!session) {
      return NextResponse.json({ error: "Authentication required" }, { status: 401 })
    }

    const body = await request.json()
    const { status, actualHours } = body

    await connectDB()

    const task = await VolunteerTask.findOne({
      _id: params.id,
      volunteerId: session.user.id,
    })

    if (!task) {
      return NextResponse.json({ error: "Task not found" }, { status: 404 })
    }

    const updateData: any = { status }
    if (status === "completed" && actualHours) {
      updateData.actualHours = actualHours
      updateData.completedAt = new Date()
    }

    const updatedTask = await VolunteerTask.findByIdAndUpdate(params.id, updateData, { new: true })

    // Update volunteer's total hours if task is completed
    if (status === "completed" && actualHours) {
      await Volunteer.findOneAndUpdate({ userId: session.user.id }, { $inc: { totalHours: actualHours } })
    }

    return NextResponse.json({
      message: "Task updated successfully",
      task: updatedTask,
    })
  } catch (error) {
    console.error("Error updating task:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
