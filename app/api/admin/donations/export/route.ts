import { type NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import connectDB from "@/lib/mongodb"
import Donation from "@/lib/models/Donation"
import { authOptions } from "@/lib/auth"

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)

    if (!session || session.user.role !== "admin") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    await connectDB()

    const { searchParams } = new URL(request.url)
    const status = searchParams.get("status") || "all"
    const campaign = searchParams.get("campaign") || "all"
    const range = searchParams.get("range") || "30d"

    // Calculate date range
    const now = new Date()
    const daysBack = range === "7d" ? 7 : range === "30d" ? 30 : range === "90d" ? 90 : 365
    const startDate = new Date(now.getTime() - daysBack * 24 * 60 * 60 * 1000)

    // Build query
    const query: any = {
      createdAt: { $gte: startDate },
    }

    if (status !== "all") {
      query.status = status
    }

    if (campaign !== "all" && campaign !== "general") {
      query.campaignId = campaign
    } else if (campaign === "general") {
      query.campaignId = { $exists: false }
    }

    // Get donations
    const donations = await Donation.find(query).populate("campaignId", "title").sort({ createdAt: -1 }).lean()

    // Create CSV content
    const csvHeaders = [
      "Receipt Number",
      "Donor Name",
      "Donor Email",
      "Amount",
      "Campaign",
      "Payment Method",
      "Status",
      "Date",
      "Message",
    ]

    const csvRows = donations.map((donation) => [
      donation.receiptNumber,
      donation.isAnonymous ? "Anonymous" : donation.donorName,
      donation.donorEmail,
      donation.amount,
      donation.campaignId?.title || "General Donation",
      donation.paymentMethod,
      donation.status,
      new Date(donation.createdAt).toLocaleDateString(),
      donation.message || "",
    ])

    const csvContent = [csvHeaders.join(","), ...csvRows.map((row) => row.map((field) => `"${field}"`).join(","))].join(
      "\n",
    )

    return new NextResponse(csvContent, {
      headers: {
        "Content-Type": "text/csv",
        "Content-Disposition": `attachment; filename="donations-${new Date().toISOString().split("T")[0]}.csv"`,
      },
    })
  } catch (error) {
    console.error("Error exporting donations:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
