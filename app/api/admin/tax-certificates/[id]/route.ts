import { type NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import connectDB from "@/lib/mongodb"
import TaxCertificate from "@/lib/models/TaxCertificate"
import Donation from "@/lib/models/Donation"
import { authOptions } from "@/lib/auth"

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions)

    if (!session || !session.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    await connectDB()

    const certificate = await TaxCertificate.findById(params.id)
      .populate("donationId")
      .populate("generatedBy", "name email")
      .populate("verifiedBy", "name email")

    if (!certificate) {
      return NextResponse.json({ error: "Tax certificate not found" }, { status: 404 })
    }

    // Check if user has access to this certificate
    const isAdmin = session.user.role === "admin"
    const isOwner = certificate.donorEmail === session.user.email

    if (!isAdmin && !isOwner) {
      return NextResponse.json({ error: "Access denied" }, { status: 403 })
    }

    return NextResponse.json({
      certificate,
    })
  } catch (error) {
    console.error("Error fetching tax certificate:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions)

    if (!session || session.user.role !== "admin") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    await connectDB()

    const { action, notes } = await request.json()

    const certificate = await TaxCertificate.findById(params.id)
    if (!certificate) {
      return NextResponse.json({ error: "Tax certificate not found" }, { status: 404 })
    }

    if (action === "issue") {
      certificate.status = "issued"
      certificate.issuedDate = new Date()
      certificate.auditTrail.push({
        action: "issued",
        performedBy: session.user.id,
        timestamp: new Date(),
        notes: notes || "Certificate issued",
      })
    } else if (action === "cancel") {
      certificate.status = "cancelled"
      certificate.cancelledDate = new Date()
      certificate.cancellationReason = notes || "Cancelled by admin"
      certificate.auditTrail.push({
        action: "cancelled",
        performedBy: session.user.id,
        timestamp: new Date(),
        notes: notes || "Certificate cancelled",
      })
    } else if (action === "verify") {
      certificate.verifiedBy = session.user.id as any
      certificate.verifiedDate = new Date()
      certificate.auditTrail.push({
        action: "verified",
        performedBy: session.user.id,
        timestamp: new Date(),
        notes: notes || "Certificate verified",
      })
    } else {
      return NextResponse.json({ error: "Invalid action" }, { status: 400 })
    }

    await certificate.save()

    return NextResponse.json({
      message: `Certificate ${action}ed successfully`,
      certificate,
    })
  } catch (error) {
    console.error("Error updating tax certificate:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions)

    if (!session || session.user.role !== "admin") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    await connectDB()

    const certificate = await TaxCertificate.findById(params.id)
    if (!certificate) {
      return NextResponse.json({ error: "Tax certificate not found" }, { status: 404 })
    }

    // Soft delete - mark as cancelled instead of removing
    certificate.status = "cancelled"
    certificate.cancelledDate = new Date()
    certificate.cancellationReason = "Deleted by admin"
    certificate.auditTrail.push({
      action: "cancelled",
      performedBy: session.user.id,
      timestamp: new Date(),
      notes: "Certificate deleted",
    })

    await certificate.save()

    return NextResponse.json({
      message: "Tax certificate deleted successfully",
    })
  } catch (error) {
    console.error("Error deleting tax certificate:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}