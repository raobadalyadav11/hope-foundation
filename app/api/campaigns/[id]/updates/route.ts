import { type NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import dbConnect from "@/lib/mongodb"
import Campaign from "@/lib/models/Campaign"
import Donation from "@/lib/models/Donation"
import { authOptions } from "@/lib/auth"
import { sendCampaignUpdate } from "@/lib/email"
import { z } from "zod"

const updateSchema = z.object({
  title: z.string().min(1, "Title is required"),
  content: z.string().min(1, "Content is required"),
  image: z.string().url().optional(),
})

export async function POST(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const session = await getServerSession(authOptions)

    if (!session || !["admin", "creator"].includes(session.user.role)) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const body = await request.json()
    const updateData = updateSchema.parse(body)

    await dbConnect()

    const campaign = await Campaign.findById(params.id)

    if (!campaign) {
      return NextResponse.json({ error: "Campaign not found" }, { status: 404 })
    }

    // Add update to campaign
    campaign.updates.push({
      ...updateData,
      date: new Date(),
    })

    await campaign.save()

    // Get donor emails for notifications
    const donations = await Donation.find({
      campaignId: params.id,
      status: "completed",
    }).distinct("donorEmail")

    // Send update emails to donors
    if (donations.length > 0) {
      await sendCampaignUpdate(campaign, updateData, donations)
    }

    return NextResponse.json({ message: "Update added successfully", update: updateData })
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: "Validation error", details: error.errors }, { status: 400 })
    }

    console.error("Error adding campaign update:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
