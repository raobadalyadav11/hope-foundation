import nodemailer from "nodemailer"

// Create transporter
const transporter = nodemailer.createTransporter({
  host: process.env.SMTP_HOST,
  port: Number(process.env.SMTP_PORT),
  secure: process.env.SMTP_SECURE === "true",
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
})

// Email templates
export const sendDonationConfirmation = async (donation: any) => {
  const mailOptions = {
    from: process.env.FROM_EMAIL,
    to: donation.donorEmail,
    subject: "Thank you for your donation!",
    html: `
      <h2>Thank you for your generous donation!</h2>
      <p>Dear ${donation.donorName},</p>
      <p>We have received your donation of ₹${donation.amount.toLocaleString()}.</p>
      <p>Receipt Number: ${donation.receiptNumber}</p>
      <p>Your support makes a real difference in the lives of those we serve.</p>
      <p>Best regards,<br>Hope Foundation Team</p>
    `,
  }

  await transporter.sendMail(mailOptions)
}

export const sendVolunteerWelcome = async (volunteer: any, user: any) => {
  const mailOptions = {
    from: process.env.FROM_EMAIL,
    to: user.email,
    subject: "Welcome to Hope Foundation Volunteer Program!",
    html: `
      <h2>Welcome to our volunteer community!</h2>
      <p>Dear ${user.name},</p>
      <p>Thank you for applying to become a volunteer with Hope Foundation.</p>
      <p>Your application is currently under review. We'll notify you once it's approved.</p>
      <p>Best regards,<br>Hope Foundation Team</p>
    `,
  }

  await transporter.sendMail(mailOptions)
}

export const sendVolunteerApproval = async (volunteer: any) => {
  const mailOptions = {
    from: process.env.FROM_EMAIL,
    to: volunteer.userId.email,
    subject: "Volunteer Application Approved!",
    html: `
      <h2>Congratulations! Your volunteer application has been approved.</h2>
      <p>Dear ${volunteer.userId.name},</p>
      <p>We're excited to welcome you to our volunteer team!</p>
      <p>You can now access your volunteer dashboard and start making a difference.</p>
      <p>Best regards,<br>Hope Foundation Team</p>
    `,
  }

  await transporter.sendMail(mailOptions)
}

export const sendContactNotification = async (contact: any) => {
  const mailOptions = {
    from: process.env.FROM_EMAIL,
    to: process.env.ADMIN_EMAIL,
    subject: `New Contact Form Submission: ${contact.subject}`,
    html: `
      <h2>New Contact Form Submission</h2>
      <p><strong>Name:</strong> ${contact.name}</p>
      <p><strong>Email:</strong> ${contact.email}</p>
      <p><strong>Phone:</strong> ${contact.phone || "Not provided"}</p>
      <p><strong>Subject:</strong> ${contact.subject}</p>
      <p><strong>Message:</strong></p>
      <p>${contact.message}</p>
    `,
  }

  await transporter.sendMail(mailOptions)
}

export const sendContactResponse = async (contact: any, response: string) => {
  const mailOptions = {
    from: process.env.FROM_EMAIL,
    to: contact.email,
    subject: `Re: ${contact.subject}`,
    html: `
      <h2>Thank you for contacting Hope Foundation</h2>
      <p>Dear ${contact.name},</p>
      <p>${response}</p>
      <p>Best regards,<br>Hope Foundation Team</p>
    `,
  }

  await transporter.sendMail(mailOptions)
}

export const sendNewsletterWelcome = async (subscriber: any) => {
  const mailOptions = {
    from: process.env.FROM_EMAIL,
    to: subscriber.email,
    subject: "Welcome to Hope Foundation Newsletter!",
    html: `
      <h2>Welcome to our newsletter!</h2>
      <p>Dear ${subscriber.name || "Friend"},</p>
      <p>Thank you for subscribing to the Hope Foundation newsletter.</p>
      <p>You'll receive updates about our campaigns, events, and impact stories.</p>
      <p>Best regards,<br>Hope Foundation Team</p>
    `,
  }

  await transporter.sendMail(mailOptions)
}
