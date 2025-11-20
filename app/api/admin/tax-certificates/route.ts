import { type NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import connectDB from "@/lib/mongodb"
import Donation from "@/lib/models/Donation"
import TaxCertificate from "@/lib/models/TaxCertificate"
import { authOptions } from "@/lib/auth"

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)

    if (!session || session.user.role !== "admin") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    await connectDB()

    const { donationId, donorPan, donorAddress } = await request.json()

    if (!donationId) {
      return NextResponse.json({ error: "Donation ID is required" }, { status: 400 })
    }

    // Find the donation
    const donation = await Donation.findById(donationId)
    if (!donation) {
      return NextResponse.json({ error: "Donation not found" }, { status: 404 })
    }

    // Check if certificate already exists
    const existingCertificate = await TaxCertificate.findOne({ donationId })
    if (existingCertificate) {
      return NextResponse.json({ error: "Tax certificate already exists for this donation" }, { status: 400 })
    }

    // Calculate financial year
    const donationDate = new Date(donation.createdAt)
    const financialYear = donationDate.getMonth() >= 3 
      ? `${donationDate.getFullYear()}-${donationDate.getFullYear() + 1}`
      : `${donationDate.getFullYear() - 1}-${donationDate.getFullYear()}`

    // Determine deduction percentage based on certificate type
    let deductionPercentage = 50 // Default 50% for 80G
    let certificateType = "80G"

    // Check donation amount for eligibility (80G certificates typically for donations above ₹500)
    if (donation.amount < 500) {
      return NextResponse.json({ 
        error: "Donation amount must be at least ₹500 for tax certificate generation" 
      }, { status: 400 })
    }

    // Create tax certificate
    const certificate = new TaxCertificate({
      donationId,
      certificateType,
      donorName: donation.donorName,
      donorEmail: donation.donorEmail,
      donorPan: donorPan || "Not Provided",
      donorAddress: donorAddress || donation.donorAddress || "Not Provided",
      donationAmount: donation.amount,
      donationDate: donation.createdAt,
      financialYear,
      deductionPercentage,
      generatedBy: session.user.id,
      auditTrail: [
        {
          action: "created",
          performedBy: session.user.id,
          timestamp: new Date(),
          notes: "Tax certificate created",
        },
      ],
    })

    await certificate.save()

    return NextResponse.json({
      message: "Tax certificate generated successfully",
      certificate,
    })
  } catch (error) {
    console.error("Error generating tax certificate:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)

    if (!session || session.user.role !== "admin") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    await connectDB()

    const { searchParams } = new URL(request.url)
    const page = Number.parseInt(searchParams.get("page") || "1")
    const limit = Number.parseInt(searchParams.get("limit") || "10")
    const status = searchParams.get("status") || "all"
    const financialYear = searchParams.get("financialYear") || ""
    const search = searchParams.get("search") || ""

    // Build query
    const query: any = {}

    if (status !== "all") {
      query.status = status
    }

    if (financialYear) {
      query.financialYear = financialYear
    }

    if (search) {
      query.$or = [
        { donorName: { $regex: search, $options: "i" } },
        { donorEmail: { $regex: search, $options: "i" } },
        { certificateNumber: { $regex: search, $options: "i" } },
      ]
    }

    // Get certificates with pagination
    const certificates = await TaxCertificate.find(query)
      .populate("donationId", "amount donorName donorEmail createdAt")
      .populate("generatedBy", "name email")
      .populate("verifiedBy", "name email")
      .sort({ createdAt: -1 })
      .limit(limit)
      .skip((page - 1) * limit)
      .lean()

    const total = await TaxCertificate.countDocuments(query)

    return NextResponse.json({
      certificates,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit),
      },
    })
  } catch (error) {
    console.error("Error fetching tax certificates:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}