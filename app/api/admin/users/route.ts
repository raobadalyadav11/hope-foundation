import { type NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import dbConnect from "@/lib/mongodb"
import User from "@/lib/models/User"
import Donation from "@/lib/models/Donation"
import Volunteer from "@/lib/models/Volunteer"
import Campaign from "@/lib/models/Campaign"
import { authOptions } from "@/lib/auth"

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)

    if (!session || session.user.role !== "admin") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    await dbConnect()

    const { searchParams } = new URL(request.url)
    const search = searchParams.get("search") || ""
    const role = searchParams.get("role") || "all"
    const status = searchParams.get("status") || "all"
    const page = Number.parseInt(searchParams.get("page") || "1")
    const limit = Number.parseInt(searchParams.get("limit") || "10")

    // Build query
    const query: any = {}

    if (search) {
      query.$or = [{ name: { $regex: search, $options: "i" } }, { email: { $regex: search, $options: "i" } }]
    }

    if (role !== "all") {
      query.role = role
    }

    if (status !== "all") {
      query.status = status
    }

    // Get users with pagination
    const users = await User.find(query)
      .select("-password")
      .sort({ createdAt: -1 })
      .limit(limit)
      .skip((page - 1) * limit)
      .lean()

    const total = await User.countDocuments(query)

    // Enhance users with additional data
    const enhancedUsers = await Promise.all(
      users.map(async (user) => {
        const [donations, volunteer, campaigns] = await Promise.all([
          Donation.aggregate([
            { $match: { donorId: user._id, status: "completed" } },
            { $group: { _id: null, total: { $sum: "$amount" }, count: { $sum: 1 } } },
          ]),
          Volunteer.findOne({ userId: user._id }),
          Campaign.countDocuments({ createdBy: user._id }),
        ])

        return {
          ...user,
          totalDonations: donations[0]?.total || 0,
          donationCount: donations[0]?.count || 0,
          volunteerHours: volunteer?.hoursLogged || 0,
          campaignsCreated: campaigns || 0,
        }
      }),
    )

    return NextResponse.json({
      users: enhancedUsers,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit),
      },
    })
  } catch (error) {
    console.error("Error fetching users:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
