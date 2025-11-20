import nodemailer from 'nodemailer'
import { generateDonationReceipt } from './pdf'

// Configure email transporter
const transporter = nodemailer.createTransport({
  host: process.env.EMAIL_SERVER || 'smtp.gmail.com',
  port: parseInt(process.env.EMAIL_PORT || '587'),
  secure: process.env.EMAIL_SECURE === 'true',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASSWORD,
  },
})

/**
 * Generic email sending function
 */
export async function sendEmail({ to, subject, html }: { to: string; subject: string; html: string }) {
  try {
    const info = await transporter.sendMail({
      from: `"Hope Foundation" <${process.env.EMAIL_FROM || 'noreply@hopefoundation.org'}>`,
      to,
      subject,
      html,
    })
    return true
  } catch (error) {
    console.error('Error sending email:', error)
    return false
  }
}

/**
 * Send a donation confirmation email to the donor
 */
export async function sendDonationConfirmation(donation: any) {
  try {
    // Skip if no email is provided
    if (!donation.donorEmail) return false

    // Send email
    const info = await transporter.sendMail({
      from: `"Hope Foundation" <${process.env.EMAIL_FROM || 'noreply@hopefoundation.org'}>`,
      to: donation.donorEmail,
      subject: `Thank You for Your Donation to Hope Foundation`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <div style="background-color: #2563eb; padding: 20px; text-align: center; color: white;">
            <h1 style="margin: 0;">Thank You for Your Donation</h1>
          </div>
          <div style="padding: 20px; border: 1px solid #ddd; border-top: none;">
            <p>Dear ${donation.donorName},</p>
            <p>Thank you for your generous donation to Hope Foundation. Your support helps us create lasting change in communities worldwide.</p>
            <p>Your donation of ₹${donation.amount.toLocaleString()} has been successfully processed.</p>
            <p>A receipt has been generated and is available in your donor dashboard. You can also download it directly from the donation confirmation page.</p>
            <p>If you have any questions about your donation, please contact us at support@hopefoundation.org.</p>
            <p>With gratitude,<br>Hope Foundation Team</p>
          </div>
          <div style="background-color: #f3f4f6; padding: 15px; text-align: center; font-size: 12px; color: #666;">
            <p>Hope Foundation | 123 Charity Lane, Bangalore, Karnataka - 560001 | +91-9876543210</p>
          </div>
        </div>
      `
    })

    return true
  } catch (error) {
    console.error('Error sending confirmation email:', error)
    return false
  }
}

/**
 * Send a donation receipt email to the donor
 */
export async function sendDonationReceipt(donation: any) {
  try {
    // Skip if no email is provided
    if (!donation.donorEmail) return false

    // Generate receipt HTML
    const receiptHtml = await generateDonationReceipt(donation)
    const receiptBuffer = Buffer.from(receiptHtml, 'base64')

    // Send email
    const info = await transporter.sendMail({
      from: `"Hope Foundation" <${process.env.EMAIL_FROM || 'noreply@hopefoundation.org'}>`,
      to: donation.donorEmail,
      subject: `Your Donation Receipt #${donation.receiptNumber || ''}`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <div style="background-color: #2563eb; padding: 20px; text-align: center; color: white;">
            <h1 style="margin: 0;">Thank You for Your Donation</h1>
          </div>
          <div style="padding: 20px; border: 1px solid #ddd; border-top: none;">
            <p>Dear ${donation.donorName},</p>
            <p>Thank you for your generous donation to Hope Foundation. Your support helps us create lasting change in communities worldwide.</p>
            <p>Please find your donation receipt attached to this email. You can also view and download your receipt from your donor dashboard at any time.</p>
            <p><strong>Donation Details:</strong></p>
            <ul>
              <li>Amount: ₹${donation.amount.toLocaleString()}</li>
              <li>Date: ${new Date(donation.createdAt || Date.now()).toLocaleDateString()}</li>
              <li>Receipt Number: ${donation.receiptNumber || ''}</li>
            </ul>
            <p>If you have any questions about your donation, please contact us at support@hopefoundation.org.</p>
            <p>With gratitude,<br>Hope Foundation Team</p>
          </div>
          <div style="background-color: #f3f4f6; padding: 15px; text-align: center; font-size: 12px; color: #666;">
            <p>Hope Foundation | 123 Charity Lane, Bangalore, Karnataka - 560001 | +91-9876543210</p>
          </div>
        </div>
      `,
      attachments: [
        {
          filename: `donation-receipt-${donation.receiptNumber || donation._id}.html`,
          content: receiptBuffer,
          contentType: 'text/html',
        }
      ]
    })

    return true
  } catch (error) {
    console.error('Error sending receipt email:', error)
    return false
  }
}

/**
 * Send a recurring donation confirmation email
 */
export async function sendRecurringDonationConfirmation(subscription: any) {
  try {
    // Skip if no email is provided
    if (!subscription.donorEmail) return false

    // Format frequency for display
    const frequencyText = subscription.frequency === 'monthly' 
      ? 'Monthly' 
      : subscription.frequency === 'quarterly' 
        ? 'Quarterly' 
        : 'Yearly'

    // Send email
    const info = await transporter.sendMail({
      from: `"Hope Foundation" <${process.env.EMAIL_FROM || 'noreply@hopefoundation.org'}>`,
      to: subscription.donorEmail,
      subject: `Your Recurring Donation Has Been Set Up`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <div style="background-color: #2563eb; padding: 20px; text-align: center; color: white;">
            <h1 style="margin: 0;">Recurring Donation Confirmed</h1>
          </div>
          <div style="padding: 20px; border: 1px solid #ddd; border-top: none;">
            <p>Dear ${subscription.donorName},</p>
            <p>Thank you for setting up a recurring donation with Hope Foundation. Your ongoing support will help us make a sustainable impact.</p>
            <p><strong>Subscription Details:</strong></p>
            <ul>
              <li>Amount: ₹${subscription.amount.toLocaleString()} ${frequencyText}</li>
              <li>Start Date: ${new Date(subscription.startDate).toLocaleDateString()}</li>
              <li>Next Payment: ${new Date(subscription.nextPaymentDate).toLocaleDateString()}</li>
              <li>Subscription ID: ${subscription.subscriptionId}</li>
            </ul>
            <p>You will receive a receipt via email after each successful payment. You can manage your recurring donation from your donor dashboard at any time.</p>
            <p>If you have any questions, please contact us at support@hopefoundation.org.</p>
            <p>With gratitude,<br>Hope Foundation Team</p>
          </div>
          <div style="background-color: #f3f4f6; padding: 15px; text-align: center; font-size: 12px; color: #666;">
            <p>Hope Foundation | 123 Charity Lane, Bangalore, Karnataka - 560001 | +91-9876543210</p>
          </div>
        </div>
      `
    })

    return true
  } catch (error) {
    console.error('Error sending subscription confirmation email:', error)
    return false
  }
}

/**
 * Send campaign update to donors
 */
export async function sendCampaignUpdate(campaign: any, update: any, recipients: string[]) {
  try {
    // Send email
    const info = await transporter.sendMail({
      from: `"Hope Foundation" <${process.env.EMAIL_FROM || 'noreply@hopefoundation.org'}>`,
      bcc: recipients, // Use BCC for privacy
      subject: `Update on Campaign: ${campaign.title}`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <div style="background-color: #2563eb; padding: 20px; text-align: center; color: white;">
            <h1 style="margin: 0;">Campaign Update</h1>
          </div>
          <div style="padding: 20px; border: 1px solid #ddd; border-top: none;">
            <h2>${update.title}</h2>
            <p>Dear Supporter,</p>
            <p>Thank you for your support of our campaign "${campaign.title}". We have an important update to share with you:</p>
            <div style="margin: 20px 0; padding: 15px; background-color: #f9f9f9; border-left: 4px solid #2563eb;">
              ${update.content}
            </div>
            ${update.image ? `<img src="${update.image}" alt="Update Image" style="max-width: 100%; margin: 15px 0; border-radius: 5px;">` : ''}
            <p>Your continued support makes our work possible.</p>
            <p><a href="${process.env.NEXTAUTH_URL}/campaigns/${campaign._id}">View Campaign</a></p>
            <p>With gratitude,<br>Hope Foundation Team</p>
          </div>
          <div style="background-color: #f3f4f6; padding: 15px; text-align: center; font-size: 12px; color: #666;">
            <p>Hope Foundation | 123 Charity Lane, Bangalore, Karnataka - 560001 | +91-9876543210</p>
            <p>You're receiving this email because you donated to this campaign.</p>
          </div>
        </div>
      `
    })

    return true
  } catch (error) {
    console.error('Error sending campaign update email:', error)
    return false
  }
}

/**
 * Send contact form notification to admin
 */
export async function sendContactNotification(contact: any) {
  try {
    // Send email to admin
    const info = await transporter.sendMail({
      from: `"Hope Foundation Website" <${process.env.EMAIL_FROM || 'noreply@hopefoundation.org'}>`,
      to: process.env.ADMIN_EMAIL || 'admin@hopefoundation.org',
      subject: `New Contact Form Submission: ${contact.subject}`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <div style="background-color: #2563eb; padding: 20px; text-align: center; color: white;">
            <h1 style="margin: 0;">New Contact Form Submission</h1>
          </div>
          <div style="padding: 20px; border: 1px solid #ddd; border-top: none;">
            <p><strong>Name:</strong> ${contact.name}</p>
            <p><strong>Email:</strong> ${contact.email}</p>
            <p><strong>Phone:</strong> ${contact.phone || 'Not provided'}</p>
            <p><strong>Subject:</strong> ${contact.subject}</p>
            <p><strong>Message:</strong></p>
            <div style="margin: 10px 0; padding: 15px; background-color: #f9f9f9; border-left: 4px solid #2563eb;">
              ${contact.message}
            </div>
            <p><a href="${process.env.NEXTAUTH_URL}/admin/contacts">Manage Contact Submissions</a></p>
          </div>
        </div>
      `
    })

    return true
  } catch (error) {
    console.error('Error sending contact notification email:', error)
    return false
  }
}

/**
 * Send response to contact form submission
 */
export async function sendContactResponse(contact: any, response: string) {
  try {
    // Send email
    const info = await transporter.sendMail({
      from: `"Hope Foundation" <${process.env.EMAIL_FROM || 'noreply@hopefoundation.org'}>`,
      to: contact.email,
      subject: `Re: ${contact.subject}`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <div style="background-color: #2563eb; padding: 20px; text-align: center; color: white;">
            <h1 style="margin: 0;">Response to Your Inquiry</h1>
          </div>
          <div style="padding: 20px; border: 1px solid #ddd; border-top: none;">
            <p>Dear ${contact.name},</p>
            <p>Thank you for contacting Hope Foundation. We have received your inquiry regarding "${contact.subject}" and would like to provide the following response:</p>
            <div style="margin: 20px 0; padding: 15px; background-color: #f9f9f9; border-left: 4px solid #2563eb;">
              ${response}
            </div>
            <p>Your original message:</p>
            <div style="margin: 10px 0; padding: 15px; background-color: #f5f5f5; color: #666; font-style: italic;">
              ${contact.message}
            </div>
            <p>If you have any further questions, please don't hesitate to contact us.</p>
            <p>Best regards,<br>Hope Foundation Team</p>
          </div>
          <div style="background-color: #f3f4f6; padding: 15px; text-align: center; font-size: 12px; color: #666;">
            <p>Hope Foundation | 123 Charity Lane, Bangalore, Karnataka - 560001 | +91-9876543210</p>
          </div>
        </div>
      `
    })

    return true
  } catch (error) {
    console.error('Error sending contact response email:', error)
    return false
  }
}

/**
 * Send event confirmation email
 */
export async function sendEventConfirmation(event: any, rsvp: any) {
  try {
    // Format date
    const eventDate = new Date(event.date).toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    })
    
    const eventTime = new Date(event.date).toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit'
    })

    // Send email
    const info = await transporter.sendMail({
      from: `"Hope Foundation Events" <${process.env.EMAIL_FROM || 'noreply@hopefoundation.org'}>`,
      to: rsvp.email,
      subject: `Your Registration for ${event.title} is Confirmed`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <div style="background-color: #2563eb; padding: 20px; text-align: center; color: white;">
            <h1 style="margin: 0;">Event Registration Confirmed</h1>
          </div>
          <div style="padding: 20px; border: 1px solid #ddd; border-top: none;">
            <p>Dear ${rsvp.name},</p>
            <p>Thank you for registering for our event. Your registration has been confirmed!</p>
            <div style="margin: 20px 0; padding: 15px; background-color: #f9f9f9; border-radius: 5px;">
              <h2 style="margin-top: 0;">${event.title}</h2>
              <p><strong>Date:</strong> ${eventDate}</p>
              <p><strong>Time:</strong> ${eventTime}</p>
              <p><strong>Location:</strong> ${event.location}</p>
              <p><strong>Registration ID:</strong> ${rsvp._id}</p>
            </div>
            ${event.image ? `<img src="${event.image}" alt="Event Image" style="max-width: 100%; margin: 15px 0; border-radius: 5px;">` : ''}
            <p>We look forward to seeing you at the event!</p>
            <p><a href="${process.env.NEXTAUTH_URL}/events/${event._id}">View Event Details</a></p>
            <p>Best regards,<br>Hope Foundation Team</p>
          </div>
          <div style="background-color: #f3f4f6; padding: 15px; text-align: center; font-size: 12px; color: #666;">
            <p>Hope Foundation | 123 Charity Lane, Bangalore, Karnataka - 560001 | +91-9876543210</p>
          </div>
        </div>
      `
    })

    return true
  } catch (error) {
    console.error('Error sending event confirmation email:', error)
    return false
  }
}

/**
 * Send newsletter welcome email
 */
export async function sendNewsletterWelcome(email: string, name: string = '') {
  try {
    // Send email
    const info = await transporter.sendMail({
      from: `"Hope Foundation" <${process.env.EMAIL_FROM || 'noreply@hopefoundation.org'}>`,
      to: email,
      subject: `Welcome to Hope Foundation Newsletter`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <div style="background-color: #2563eb; padding: 20px; text-align: center; color: white;">
            <h1 style="margin: 0;">Welcome to Our Newsletter</h1>
          </div>
          <div style="padding: 20px; border: 1px solid #ddd; border-top: none;">
            <p>Dear ${name || 'Supporter'},</p>
            <p>Thank you for subscribing to the Hope Foundation newsletter!</p>
            <p>You'll now receive regular updates about our:</p>
            <ul>
              <li>Latest campaigns and their impact</li>
              <li>Upcoming events and volunteer opportunities</li>
              <li>Success stories from the communities we serve</li>
              <li>Ways you can get involved and make a difference</li>
            </ul>
            <p>We're excited to have you join our community of changemakers.</p>
            <p><a href="${process.env.NEXTAUTH_URL}">Visit Our Website</a></p>
            <p>Best regards,<br>Hope Foundation Team</p>
          </div>
          <div style="background-color: #f3f4f6; padding: 15px; text-align: center; font-size: 12px; color: #666;">
            <p>Hope Foundation | 123 Charity Lane, Bangalore, Karnataka - 560001 | +91-9876543210</p>
            <p>You can <a href="${process.env.NEXTAUTH_URL}/newsletter/unsubscribe?email=${encodeURIComponent(email)}">unsubscribe</a> at any time.</p>
          </div>
        </div>
      `
    })

    return true
  } catch (error) {
    console.error('Error sending newsletter welcome email:', error)
    return false
  }
}

/**
 * Send volunteer welcome email
 */
export async function sendVolunteerWelcome(volunteer: any) {
  try {
    // Send email
    const info = await transporter.sendMail({
      from: `"Hope Foundation Volunteer Program" <${process.env.EMAIL_FROM || 'noreply@hopefoundation.org'}>`,
      to: volunteer.email,
      subject: `Thank You for Applying to Volunteer with Hope Foundation`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <div style="background-color: #2563eb; padding: 20px; text-align: center; color: white;">
            <h1 style="margin: 0;">Volunteer Application Received</h1>
          </div>
          <div style="padding: 20px; border: 1px solid #ddd; border-top: none;">
            <p>Dear ${volunteer.name},</p>
            <p>Thank you for your interest in volunteering with Hope Foundation! We have received your application and are excited about your willingness to contribute to our mission.</p>
            <p>Our team will review your application and get back to you within 5-7 business days. If approved, you'll receive further instructions about orientation and available opportunities.</p>
            <p>In the meantime, you can learn more about our volunteer program and current initiatives on our website.</p>
            <p><a href="${process.env.NEXTAUTH_URL}/volunteer">Learn More About Volunteering</a></p>
            <p>Thank you for your passion to make a difference!</p>
            <p>Best regards,<br>Hope Foundation Volunteer Team</p>
          </div>
          <div style="background-color: #f3f4f6; padding: 15px; text-align: center; font-size: 12px; color: #666;">
            <p>Hope Foundation | 123 Charity Lane, Bangalore, Karnataka - 560001 | +91-9876543210</p>
          </div>
        </div>
      `
    })

    return true
  } catch (error) {
    console.error('Error sending volunteer welcome email:', error)
    return false
  }
}

/**
 * Send volunteer approval email
 */
export async function sendVolunteerApproval(volunteer: any) {
  try {
    // Send email
    const info = await transporter.sendMail({
      from: `"Hope Foundation Volunteer Program" <${process.env.EMAIL_FROM || 'noreply@hopefoundation.org'}>`,
      to: volunteer.email,
      subject: `Your Volunteer Application Has Been Approved!`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <div style="background-color: #2563eb; padding: 20px; text-align: center; color: white;">
            <h1 style="margin: 0;">Application Approved</h1>
          </div>
          <div style="padding: 20px; border: 1px solid #ddd; border-top: none;">
            <p>Dear ${volunteer.name},</p>
            <p>Congratulations! Your application to volunteer with Hope Foundation has been approved.</p>
            <p>We're thrilled to welcome you to our volunteer team. Your skills and passion will make a meaningful difference in our work.</p>
            <p><strong>Next Steps:</strong></p>
            <ol>
              <li>Complete your volunteer profile by logging in to our website</li>
              <li>Sign up for the mandatory orientation session</li>
              <li>Browse available volunteer opportunities</li>
            </ol>
            <p><a href="${process.env.NEXTAUTH_URL}/volunteer/dashboard">Access Your Volunteer Dashboard</a></p>
            <p>If you have any questions, please contact our volunteer coordinator at volunteer@hopefoundation.org.</p>
            <p>Welcome to the team!</p>
            <p>Best regards,<br>Hope Foundation Volunteer Team</p>
          </div>
          <div style="background-color: #f3f4f6; padding: 15px; text-align: center; font-size: 12px; color: #666;">
            <p>Hope Foundation | 123 Charity Lane, Bangalore, Karnataka - 560001 | +91-9876543210</p>
          </div>
        </div>
      `
    })

    return true
  } catch (error) {
    console.error('Error sending volunteer approval email:', error)
    return false
  }
}

/**
 * Send email verification email
 */
export async function sendVerificationEmail(email: string, name: string, verificationToken: string) {
  try {
    const verificationUrl = `${process.env.NEXTAUTH_URL}/auth/verify-email?token=${verificationToken}`
    
    const info = await transporter.sendMail({
      from: `"Hope Foundation" <${process.env.EMAIL_FROM || 'noreply@hopefoundation.org'}>`,
      to: email,
      subject: `Verify Your Email Address - Hope Foundation`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <div style="background-color: #2563eb; padding: 20px; text-align: center; color: white;">
            <h1 style="margin: 0;">Welcome to Hope Foundation!</h1>
          </div>
          <div style="padding: 20px; border: 1px solid #ddd; border-top: none;">
            <p>Dear ${name},</p>
            <p>Thank you for registering with Hope Foundation. To complete your account setup and start making a difference in communities, please verify your email address.</p>
            <div style="text-align: center; margin: 30px 0;">
              <a href="${verificationUrl}" style="display: inline-block; background-color: #2563eb; color: white; padding: 12px 30px; text-decoration: none; border-radius: 5px; font-weight: bold;">
                Verify Email Address
              </a>
            </div>
            <p>Or copy and paste this link into your browser:</p>
            <p style="word-break: break-all; color: #2563eb;">${verificationUrl}</p>
            <p>This verification link will expire in 24 hours.</p>
            <p>If you didn't create this account, please ignore this email.</p>
            <p>Welcome to our community of changemakers!</p>
            <p>Best regards,<br>Hope Foundation Team</p>
          </div>
          <div style="background-color: #f3f4f6; padding: 15px; text-align: center; font-size: 12px; color: #666;">
            <p>Hope Foundation | 123 Charity Lane, Bangalore, Karnataka - 560001 | +91-9876543210</p>
          </div>
        </div>
      `
    })

    return true
  } catch (error) {
    console.error('Error sending verification email:', error)
    return false
  }
}

/**
 * Send password reset email
 */
export async function sendPasswordResetEmail(email: string, name: string, resetToken: string) {
  try {
    const resetUrl = `${process.env.NEXTAUTH_URL}/auth/reset-password?token=${resetToken}`
    
    const info = await transporter.sendMail({
      from: `"Hope Foundation" <${process.env.EMAIL_FROM || 'noreply@hopefoundation.org'}>`,
      to: email,
      subject: `Reset Your Password - Hope Foundation`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <div style="background-color: #2563eb; padding: 20px; text-align: center; color: white;">
            <h1 style="margin: 0;">Password Reset Request</h1>
          </div>
          <div style="padding: 20px; border: 1px solid #ddd; border-top: none;">
            <p>Dear ${name},</p>
            <p>We received a request to reset your password for your Hope Foundation account.</p>
            <div style="text-align: center; margin: 30px 0;">
              <a href="${resetUrl}" style="display: inline-block; background-color: #dc2626; color: white; padding: 12px 30px; text-decoration: none; border-radius: 5px; font-weight: bold;">
                Reset Password
              </a>
            </div>
            <p>Or copy and paste this link into your browser:</p>
            <p style="word-break: break-all; color: #2563eb;">${resetUrl}</p>
            <p>This password reset link will expire in 1 hour.</p>
            <p>If you didn't request a password reset, please ignore this email. Your password will remain unchanged.</p>
            <p>Best regards,<br>Hope Foundation Team</p>
          </div>
          <div style="background-color: #f3f4f6; padding: 15px; text-align: center; font-size: 12px; color: #666;">
            <p>Hope Foundation | 123 Charity Lane, Bangalore, Karnataka - 560001 | +91-9876543210</p>
          </div>
        </div>
      `
    })

    return true
  } catch (error) {
    console.error('Error sending password reset email:', error)
    return false
  }
}