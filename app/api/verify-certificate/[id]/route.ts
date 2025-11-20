import { type NextRequest, NextResponse } from "next/server"
import connectDB from "@/lib/mongodb"
import TaxCertificate from "@/lib/models/TaxCertificate"

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await connectDB()

    const certificate = await TaxCertificate.findById(params.id)
      .populate("donationId")
      .lean()

    if (!certificate) {
      return NextResponse.json({ 
        valid: false, 
        message: "Certificate not found" 
      }, { status: 404 })
    }

    // Check if certificate is cancelled
    if ((certificate as any).status === "cancelled") {
      return NextResponse.json({
        valid: false,
        message: "This certificate has been cancelled",
        certificate: {
          certificateNumber: (certificate as any).certificateNumber,
          donorName: (certificate as any).donorName,
          donationAmount: (certificate as any).donationAmount,
          cancelledDate: (certificate as any).cancelledDate,
          cancellationReason: (certificate as any).cancellationReason,
        }
      })
    }

    // Return certificate details for verification
    return NextResponse.json({
      valid: true,
      message: "Certificate is valid",
      certificate: {
        certificateNumber: (certificate as any).certificateNumber,
        certificateType: (certificate as any).certificateType,
        donorName: (certificate as any).donorName,
        donationAmount: (certificate as any).donationAmount,
        deductibleAmount: (certificate as any).deductibleAmount,
        deductionPercentage: (certificate as any).deductionPercentage,
        donationDate: (certificate as any).donationDate,
        financialYear: (certificate as any).financialYear,
        issuedDate: (certificate as any).issuedDate,
        status: (certificate as any).status,
        organizationDetails: (certificate as any).organizationDetails,
        verificationTimestamp: new Date().toISOString(),
      }
    })
  } catch (error) {
    console.error("Error verifying certificate:", error)
    return NextResponse.json({ 
      valid: false, 
      message: "Verification failed" 
    }, { status: 500 })
  }
}