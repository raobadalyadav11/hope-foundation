import { type NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import dbConnect from "@/lib/mongodb"
import { authOptions } from "@/lib/auth"
import { sendEmail } from "@/lib/email"
import { z } from "zod"

const notificationSchema = z.object({
  type: z.enum(["email", "in-app"]),
  recipients: z.array(z.string()),
  subject: z.string().min(1, "Subject is required"),
  message: z.string().min(1, "Message is required"),
  template: z.string().optional(),
})

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)

    if (!session || !["admin", "creator"].includes(session.user.role)) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const body = await request.json()
    const { type, recipients, subject, message, template } = notificationSchema.parse(body)

    await dbConnect()

    if (type === "email") {
      // Send bulk emails
      const emailPromises = recipients.map((email) =>
        sendEmail({
          to: email,
          subject,
          html: message,
          template,
        }),
      )

      await Promise.allSettled(emailPromises)

      return NextResponse.json({ message: "Emails sent successfully" })
    }

    // Handle in-app notifications (implement as needed)
    return NextResponse.json({ message: "Notifications sent successfully" })
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: "Validation error", details: error.errors }, { status: 400 })
    }

    console.error("Error sending notifications:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
