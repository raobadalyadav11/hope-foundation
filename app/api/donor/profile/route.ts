import { type NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import connectDB from "@/lib/mongodb"
import User from "@/lib/models/User"
import Donation from "@/lib/models/Donation"
import { authOptions } from "@/lib/auth"

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)

    if (!session) {
      return NextResponse.json({ error: "Authentication required" }, { status: 401 })
    }

    await connectDB()

    // Get user profile by email
    const user = await User.findOne({
      email: session.user.email
    }).select("-password")

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 })
    }

    // Get donation statistics by email
    const donationStats = await Donation.aggregate([
      { 
        $match: { 
          donorEmail: session.user.email,
          status: "completed" 
        } 
      },
      {
        $group: {
          _id: null,
          totalDonated: { $sum: "$amount" },
          donationCount: { $sum: 1 },
          averageDonation: { $avg: "$amount" },
        },
      },
    ])

    // Get recent donations by email
    const recentDonations = await Donation.find({
      donorEmail: session.user.email,
      status: "completed",
    })
      .populate("campaignId", "title image")
      .sort({ createdAt: -1 })
      .limit(5)
      .lean()

    // Get donation history by month using email
    const donationHistory = await Donation.aggregate([
      {
        $match: {
          donorEmail: session.user.email,
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

    await connectDB()

    const updatedUser = await User.findOneAndUpdate(
      { email: session.user.email },
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
