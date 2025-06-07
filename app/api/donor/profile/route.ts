import { type NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import dbConnect from "@/lib/mongodb"
import User from "@/lib/models/User"
import Donation from "@/lib/models/Donation"
import { authOptions } from "@/lib/auth"

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)

    if (!session) {
      return NextResponse.json({ error: "Authentication required" }, { status: 401 })
    }

    await dbConnect()

    // Get user profile
    const user = await User.findById(session.user.id).select("-password")

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 })
    }

    // Get donation statistics
    const donationStats = await Donation.aggregate([
      { $match: { donorId: session.user.id, status: "completed" } },
      {
        $group: {
          _id: null,
          totalDonated: { $sum: "$amount" },
          donationCount: { $sum: 1 },
          averageDonation: { $avg: "$amount" },
        },
      },
    ])

    // Get recent donations
    const recentDonations = await Donation.find({
      donorId: session.user.id,
      status: "completed",
    })
      .populate("campaignId", "title image")
      .sort({ createdAt: -1 })
      .limit(5)
      .lean()

    // Get donation history by month
    const donationHistory = await Donation.aggregate([
      {
        $match: {
          donorId: session.user.id,
          status: "completed",
          createdAt: { $gte: new Date(Date.now() - 365 * 24 * 60 * 60 * 1000) },
        },
      },
      {
        $group: {
          _id: {
            year: { $year: "$createdAt" },
            month: { $month: "$createdAt" },
          },
          amount: { $sum: "$amount" },
          count: { $sum: 1 },
        },
      },
      { $sort: { "_id.year": 1, "_id.month": 1 } },
    ])

    const stats = donationStats[0] || {
      totalDonated: 0,
      donationCount: 0,
      averageDonation: 0,
    }

    return NextResponse.json({
      user,
      stats,
      recentDonations,
      donationHistory,
    })
  } catch (error) {
    console.error("Error fetching donor profile:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

export async function PUT(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)

    if (!session) {
      return NextResponse.json({ error: "Authentication required" }, { status: 401 })
    }

    const body = await request.json()

    await dbConnect()

    const updatedUser = await User.findByIdAndUpdate(
      session.user.id,
      {
        name: body.name,
        phone: body.phone,
        address: body.address,
        profileImage: body.profileImage,
      },
      { new: true, runValidators: true },
    ).select("-password")

    if (!updatedUser) {
      return NextResponse.json({ error: "User not found" }, { status: 404 })
    }

    return NextResponse.json(updatedUser)
  } catch (error) {
    console.error("Error updating donor profile:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
