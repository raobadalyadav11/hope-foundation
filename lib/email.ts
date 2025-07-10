import nodemailer from "nodemailer"

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: Number.parseInt(process.env.SMTP_PORT || "587"),
  secure: false,
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
})

export async function sendVolunteerWelcome(volunteer: any, user: any) {
  const mailOptions = {
    from: process.env.FROM_EMAIL,
    to: user.email,
    subject: "Welcome to Our Volunteer Community!",
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h1 style="color: #2563eb;">Welcome, ${user.name}!</h1>
        <p>Thank you for applying to become a volunteer with our organization.</p>
        <p>Your application has been received and is currently under review. We'll notify you once it's been processed.</p>
        <div style="background-color: #f3f4f6; padding: 20px; border-radius: 8px; margin: 20px 0;">
          <h3>What's Next?</h3>
          <ul>
            <li>Our team will review your application within 3-5 business days</li>
            <li>You'll receive an email notification about your application status</li>
            <li>If approved, you'll gain access to volunteer opportunities and tasks</li>
          </ul>
        </div>
        <p>If you have any questions, feel free to contact us.</p>
        <p>Best regards,<br>The Volunteer Team</p>
      </div>
    `,
  }

  await transporter.sendMail(mailOptions)
}

export async function sendEventConfirmation(event: any, user: any, status: string) {
  const isAttending = status === "attending"
  const subject = isAttending ? `RSVP Confirmed: ${event.title}` : `RSVP Cancelled: ${event.title}`

  const mailOptions = {
    from: process.env.FROM_EMAIL,
    to: user.email,
    subject,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h1 style="color: ${isAttending ? "#059669" : "#dc2626"};">
          ${isAttending ? "RSVP Confirmed!" : "RSVP Cancelled"}
        </h1>
        <h2>${event.title}</h2>
        <div style="background-color: #f3f4f6; padding: 20px; border-radius: 8px; margin: 20px 0;">
          <p><strong>Date:</strong> ${new Date(event.date).toLocaleDateString()}</p>
          <p><strong>Time:</strong> ${new Date(event.date).toLocaleTimeString()}</p>
          <p><strong>Location:</strong> ${event.location}</p>
        </div>
        ${
          isAttending
            ? `<p>We're excited to see you at the event! Please arrive on time and bring any required materials.</p>`
            : `<p>Your RSVP has been cancelled. You can always RSVP again if your plans change.</p>`
        }
        <p>Best regards,<br>The Event Team</p>
      </div>
    `,
  }

  await transporter.sendMail(mailOptions)
}

export async function sendEmail({ to, subject, html }: { to: string; subject: string; html: string }) {
  const mailOptions = {
    from: process.env.FROM_EMAIL,
    to,
    subject,
    html,
  }

  await transporter.sendMail(mailOptions)
}

export async function sendCampaignUpdate(campaign: any, updateData: any, donorEmails: string[]) {
  const mailOptions = {
    from: process.env.FROM_EMAIL,
    to: donorEmails,
    subject: `Campaign Update: ${campaign.title}`,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h1 style="color: #2563eb;">Campaign Update</h1>
        <h2>${campaign.title}</h2>
        <div style="background-color: #f3f4f6; padding: 20px; border-radius: 8px; margin: 20px 0;">
          <h3>${updateData.title}</h3>
          <p>${updateData.content}</p>
          ${updateData.image ? `<img src="${updateData.image}" alt="Update image" style="max-width: 100%; height: auto; border-radius: 8px;">` : ''}
        </div>
        <div style="background-color: #e0f2fe; padding: 15px; border-radius: 8px; margin: 20px 0;">
          <p><strong>Campaign Progress:</strong></p>
          <p>Raised: $${campaign.currentAmount} of $${campaign.goalAmount}</p>
          <div style="background-color: #fff; height: 10px; border-radius: 5px; overflow: hidden;">
            <div style="background-color: #2563eb; height: 100%; width: ${(campaign.currentAmount / campaign.goalAmount) * 100}%;"></div>
          </div>
        </div>
        <p>Thank you for your continued support!</p>
        <p>Best regards,<br>The Hope Foundation Team</p>
      </div>
    `,
  }

  await transporter.sendMail(mailOptions)
}
 