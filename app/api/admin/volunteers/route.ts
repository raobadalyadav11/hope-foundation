import { type NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth/next"
import { authOptions } from "@/lib/auth"
import connectDB from "@/lib/mongodb"
import Volunteer from "@/lib/models/Volunteer"

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    if (!session || session.user.role !== "admin") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    await connectDB()

    const { searchParams } = new URL(request.url)
    const page = parseInt(searchParams.get("page") || "1")
    const limit = parseInt(searchParams.get("limit") || "10")
    const search = searchParams.get("search") || ""
    const status = searchParams.get("status") || ""
    const skill = searchParams.get("skill") || ""

    const query: any = {}
    
    if (search) {
      query.$or = [
        { name: { $regex: search, $options: "i" } },
        { email: { $regex: search, $options: "i" } },
        { skills: { $regex: search, $options: "i" } }
      ]
    }

    if (status && status !== "all") {
      query.status = status
    }

    if (skill && skill !== "all") {
      query.skills = { $in: [skill] }
    }

    const total = await Volunteer.countDocuments(query)
    const volunteers = await Volunteer.find(query)
      .populate("userId", "name email profileImage")
      .sort({ createdAt: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit)

    return NextResponse.json({
      volunteers,
      totalPages: Math.ceil(total / limit),
      currentPage: page,
      total
    })
  } catch (error) {
    console.error("Error fetching volunteers:", error)
    return NextResponse.json(
      { error: "Failed to fetch volunteers" },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    if (!session || session.user.role !== "admin") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    await connectDB()

    const data = await request.json()
    
    const volunteer = new Volunteer(data)
    await volunteer.save()

    return NextResponse.json(volunteer, { status: 201 })
  } catch (error) {
    console.error("Error creating volunteer:", error)
    return NextResponse.json(
      { error: "Failed to create volunteer" },
      { status: 500 }
    )
  }
}