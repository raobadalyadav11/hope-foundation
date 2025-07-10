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

export async function sendContactResponse(contact: any, response: string) {
  const mailOptions = {
    from: process.env.FROM_EMAIL,
    to: contact.email,
    subject: `Re: ${contact.subject}`,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h1 style="color: #2563eb;">Thank you for contacting us!</h1>
        <p>Dear ${contact.name},</p>
        <p>Thank you for reaching out to us. We have reviewed your message and here is our response:</p>
        <div style="background-color: #f3f4f6; padding: 20px; border-radius: 8px; margin: 20px 0;">
          <h3>Your Original Message:</h3>
          <p><strong>Subject:</strong> ${contact.subject}</p>
          <p><strong>Message:</strong> ${contact.message}</p>
        </div>
        <div style="background-color: #e0f2fe; padding: 20px; border-radius: 8px; margin: 20px 0;">
          <h3>Our Response:</h3>
          <p>${response}</p>
        </div>
        <p>If you have any further questions, please don't hesitate to contact us again.</p>
        <p>Best regards,<br>The Hope Foundation Team</p>
      </div>
    `,
  }

  await transporter.sendMail(mailOptions)
}

export async function sendDonationConfirmation(donation: any) {
  const mailOptions = {
    from: process.env.FROM_EMAIL,
    to: donation.email,
    subject: "Thank you for your donation!",
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h1 style="color: #059669;">Thank you for your generous donation!</h1>
        <p>Dear ${donation.name || 'Donor'},</p>
        <p>We are grateful for your support and generosity. Your donation has been successfully processed.</p>
        <div style="background-color: #f3f4f6; padding: 20px; border-radius: 8px; margin: 20px 0;">
          <h3>Donation Details:</h3>
          <p><strong>Amount:</strong> $${donation.amount}</p>
          <p><strong>Receipt Number:</strong> ${donation.receiptNumber}</p>
          <p><strong>Payment ID:</strong> ${donation.paymentId}</p>
          <p><strong>Date:</strong> ${new Date(donation.createdAt).toLocaleDateString()}</p>
          ${donation.campaignId ? `<p><strong>Campaign:</strong> ${donation.campaignName || 'Campaign'}</p>` : ''}
        </div>
        <div style="background-color: #e0f2fe; padding: 20px; border-radius: 8px; margin: 20px 0;">
          <h3>What Happens Next?</h3>
          <ul>
            <li>Your donation will be used to support our cause</li>
            <li>You'll receive updates on how your contribution is making a difference</li>
            <li>This email serves as your official receipt for tax purposes</li>
          </ul>
        </div>
        <p>Your support helps us continue our mission to make a positive impact in the community.</p>
        <p>Best regards,<br>The Hope Foundation Team</p>
      </div>
    `,
  }

  await transporter.sendMail(mailOptions)
}

export async function sendContactNotification(contact: any) {
  const mailOptions = {
    from: process.env.FROM_EMAIL,
    to: process.env.ADMIN_EMAIL || process.env.FROM_EMAIL,
    subject: `New Contact Form Submission: ${contact.subject}`,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h1 style="color: #dc2626;">New Contact Form Submission</h1>
        <p>A new contact form has been submitted through the website.</p>
        <div style="background-color: #f3f4f6; padding: 20px; border-radius: 8px; margin: 20px 0;">
          <h3>Contact Details:</h3>
          <p><strong>Name:</strong> ${contact.name}</p>
          <p><strong>Email:</strong> ${contact.email}</p>
          ${contact.phone ? `<p><strong>Phone:</strong> ${contact.phone}</p>` : ''}
          <p><strong>Subject:</strong> ${contact.subject}</p>
          <p><strong>Source:</strong> ${contact.source}</p>
          <p><strong>Submitted:</strong> ${new Date(contact.createdAt).toLocaleString()}</p>
        </div>
        <div style="background-color: #e0f2fe; padding: 20px; border-radius: 8px; margin: 20px 0;">
          <h3>Message:</h3>
          <p style="white-space: pre-wrap;">${contact.message}</p>
        </div>
        <div style="background-color: #fef3c7; padding: 15px; border-radius: 8px; margin: 20px 0;">
          <p><strong>Action Required:</strong> Please respond to this inquiry within 24 hours.</p>
        </div>
        <p>You can reply directly to this email or contact them at ${contact.email}.</p>
        <p>Best regards,<br>Website Contact System</p>
      </div>
    `,
  }

  await transporter.sendMail(mailOptions)
}

export async function sendNewsletterWelcome(subscriber: any) {
  const mailOptions = {
    from: process.env.FROM_EMAIL,
    to: subscriber.email,
    subject: "Welcome to Our Newsletter!",
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h1 style="color: #2563eb;">Welcome to Our Newsletter!</h1>
        <p>Dear ${subscriber.name || 'Subscriber'},</p>
        <p>Thank you for subscribing to our newsletter. We're excited to have you join our community!</p>
        <div style="background-color: #f3f4f6; padding: 20px; border-radius: 8px; margin: 20px 0;">
          <h3>What to Expect:</h3>
          <ul>
            ${subscriber.preferences?.campaigns ? '<li>Updates on our latest campaigns and initiatives</li>' : ''}
            ${subscriber.preferences?.events ? '<li>Information about upcoming events and activities</li>' : ''}
            ${subscriber.preferences?.blogs ? '<li>Our latest blog posts and articles</li>' : ''}
            ${subscriber.preferences?.newsletters ? '<li>Monthly newsletter with organization updates</li>' : ''}
          </ul>
        </div>
        <div style="background-color: #e0f2fe; padding: 20px; border-radius: 8px; margin: 20px 0;">
          <h3>Stay Connected:</h3>
          <p>You can update your preferences or unsubscribe at any time by clicking the link at the bottom of our emails.</p>
        </div>
        <p>We look forward to keeping you informed about our mission and the impact we're making together!</p>
        <p>Best regards,<br>The Hope Foundation Team</p>
      </div>
    `,
  }

  await transporter.sendMail(mailOptions)
}

export async function sendVolunteerApproval(volunteer: any) {
  const mailOptions = {
    from: process.env.FROM_EMAIL,
    to: volunteer.userId.email,
    subject: "Volunteer Application Approved!",
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h1 style="color: #059669;">Congratulations! Your Volunteer Application has been Approved!</h1>
        <p>Dear ${volunteer.userId.name},</p>
        <p>We are excited to inform you that your volunteer application has been approved! Welcome to our volunteer community.</p>
        <div style="background-color: #f3f4f6; padding: 20px; border-radius: 8px; margin: 20px 0;">
          <h3>Your Application Details:</h3>
          <p><strong>Name:</strong> ${volunteer.userId.name}</p>
          <p><strong>Email:</strong> ${volunteer.userId.email}</p>
          <p><strong>Skills:</strong> ${volunteer.skills?.join(', ') || 'General Support'}</p>
          <p><strong>Availability:</strong> ${volunteer.availability || 'Flexible'}</p>
          <p><strong>Status:</strong> <span style="color: #059669; font-weight: bold;">Approved</span></p>
        </div>
        <div style="background-color: #dcfce7; padding: 20px; border-radius: 8px; margin: 20px 0;">
          <h3>What's Next?</h3>
          <ul>
            <li>You now have access to volunteer opportunities and tasks</li>
            <li>Check your dashboard for available volunteer activities</li>
            <li>You'll receive notifications about upcoming events and volunteer opportunities</li>
            <li>Join our volunteer community to connect with other volunteers</li>
          </ul>
        </div>
        <div style="background-color: #e0f2fe; padding: 20px; border-radius: 8px; margin: 20px 0;">
          <h3>Getting Started:</h3>
          <p>Log in to your account to view and sign up for volunteer opportunities that match your skills and interests.</p>
        </div>
        <p>Thank you for your commitment to making a positive impact in our community. We look forward to working with you!</p>
        <p>If you have any questions, please don't hesitate to contact us.</p>
        <p>Best regards,<br>The Hope Foundation Team</p>
      </div>
    `,
  }

  await transporter.sendMail(mailOptions)
}
 