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

    const { autoGenerate = false, minAmount = 500 } = await request.json()

    if (autoGenerate) {
      // Auto-generate certificates for eligible donations
      const eligibleDonations = await Donation.find({
        status: "completed",
        amount: { $gte: minAmount },
        _id: { $nin: await TaxCertificate.distinct("donationId") }, // Donations without certificates
        createdAt: { $gte: new Date(Date.now() - 365 * 24 * 60 * 60 * 1000) }, // Last year
      }).limit(100) // Process in batches

      const results = []
      for (const donation of eligibleDonations) {
        try {
          const certificate = await generateCertificateForDonation(donation, session.user.id)
          results.push({ success: true, donationId: donation._id, certificateId: certificate._id })
        } catch (error: any) {
          console.error(`Failed to generate certificate for donation ${donation._id}:`, error)
          results.push({ success: false, donationId: donation._id, error: error?.message || 'Unknown error' })
        }
      }

      return NextResponse.json({
        message: `Processed ${eligibleDonations.length} donations`,
        results,
        summary: {
          total: results.length,
          successful: results.filter(r => r.success).length,
          failed: results.filter(r => !r.success).length,
        },
      })
    }

    return NextResponse.json({ message: "Auto-generation endpoint" })
  } catch (error) {
    console.error("Error in certificate automation:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

async function generateCertificateForDonation(donation: any, adminId: string) {
  const donationDate = new Date(donation.createdAt)
  const financialYear = donationDate.getMonth() >= 3 
    ? `${donationDate.getFullYear()}-${donationDate.getFullYear() + 1}`
    : `${donationDate.getFullYear() - 1}-${donationDate.getFullYear()}`

  const certificate = new TaxCertificate({
    donationId: donation._id,
    certificateType: "80G",
    donorName: donation.donorName,
    donorEmail: donation.donorEmail,
    donorPan: "Auto-Generated",
    donorAddress: donation.donorAddress || "Not Provided",
    donationAmount: donation.amount,
    donationDate: donation.createdAt,
    financialYear,
    deductionPercentage: 50,
    status: "issued",
    issuedDate: new Date(),
    generatedBy: adminId,
    auditTrail: [
      {
        action: "created",
        performedBy: adminId,
        timestamp: new Date(),
        notes: "Auto-generated certificate",
      },
      {
        action: "issued",
        performedBy: adminId,
        timestamp: new Date(),
        notes: "Auto-issued certificate",
      },
    ],
  })

  return await certificate.save()
}

// Analytics endpoint for tax compliance
export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)

    if (!session || session.user.role !== "admin") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    await connectDB()

    const { searchParams } = new URL(request.url)
    const financialYear = searchParams.get("financialYear") || ""
    const reportType = searchParams.get("type") || "summary"

    const currentYear = new Date().getFullYear()
    const currentFY = `${currentYear - 1}-${currentYear}`

    if (reportType === "summary") {
      // Get summary statistics
      const totalDonations = await Donation.aggregate([
        {
          $match: {
            status: "completed",
            amount: { $gte: 500 },
            createdAt: {
              $gte: new Date(`${financialYear.split('-')[0]}-04-01`),
              $lt: new Date(`${financialYear.split('-')[1]}-04-01`),
            },
          },
        },
        {
          $group: {
            _id: null,
            totalAmount: { $sum: "$amount" },
            totalCount: { $sum: 1 },
            avgAmount: { $avg: "$amount" },
          },
        },
      ])

      const certificates = await TaxCertificate.aggregate([
        {
          $match: {
            financialYear: financialYear || currentFY,
            status: { $in: ["issued", "pending"] },
          },
        },
        {
          $group: {
            _id: null,
            totalCertificates: { $sum: 1 },
            totalDeductibleAmount: { $sum: "$deductibleAmount" },
            avgDeduction: { $avg: "$deductionPercentage" },
          },
        },
      ])

      const pendingCertificates = await TaxCertificate.countDocuments({
        financialYear: financialYear || currentFY,
        status: "pending",
      })

      return NextResponse.json({
        financialYear: financialYear || currentFY,
        donations: totalDonations[0] || { totalAmount: 0, totalCount: 0, avgAmount: 0 },
        certificates: certificates[0] || { totalCertificates: 0, totalDeductibleAmount: 0, avgDeduction: 50 },
        pendingCertificates,
        complianceRate: totalDonations[0]?.totalCount > 0 
          ? ((certificates[0]?.totalCertificates || 0) / totalDonations[0].totalCount * 100).toFixed(2)
          : "0",
      })
    }

    return NextResponse.json({ message: "Tax compliance analytics" })
  } catch (error) {
    console.error("Error fetching tax compliance analytics:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}