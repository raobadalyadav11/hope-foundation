import { type NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import dbConnect from "@/lib/mongodb"
import User from "@/lib/models/User"
import Donation from "@/lib/models/Donation"
import Volunteer from "@/lib/models/Volunteer"
import { authOptions } from "@/lib/auth"

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)

    if (!session || !["admin", "creator"].includes(session.user.role)) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    await dbConnect()

    const { searchParams } = new URL(request.url)
    const page = Number.parseInt(searchParams.get("page") || "1")
    const limit = Number.parseInt(searchParams.get("limit") || "10")
    const role = searchParams.get("role")
    const status = searchParams.get("status")
    const search = searchParams.get("search")

    // Build query
    const query: any = {}

    if (role && role !== "all") {
      query.role = role
    }

    if (status && status !== "all") {
      query.isActive = status === "active"
    }

    if (search) {
      query.$or = [{ name: { $regex: search, $options: "i" } }, { email: { $regex: search, $options: "i" } }]
    }

    const skip = (page - 1) * limit

    const [users, totalUsers] = await Promise.all([
      User.find(query).select("-password").sort({ createdAt: -1 }).skip(skip).limit(limit).lean(),
      User.countDocuments(query),
    ])

    // Get user stats
    const usersWithStats = await Promise.all(
      users.map(async (user) => {
        const [donations, volunteer] = await Promise.all([
          Donation.aggregate([
            { $match: { donorId: user._id, status: "completed" } },
            { $group: { _id: null, total: { $sum: "$amount" }, count: { $sum: 1 } } },
          ]),
          Volunteer.findOne({ userId: user._id }).lean(),
        ])

        const donationStats = donations[0] || { total: 0, count: 0 }

        return {
          ...user,
          stats: {
            totalDonations: donationStats.count,
            donationAmount: donationStats.total,
            volunteerHours: volunteer?.hoursLogged || 0,
            eventsAttended: volunteer?.eventsAttended?.length || 0,
          },
        }
      }),
    )

    const totalPages = Math.ceil(totalUsers / limit)

    return NextResponse.json({
      users: usersWithStats,
      totalPages,
      currentPage: page,
      totalUsers,
    })
  } catch (error) {
    console.error("Error fetching users:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
