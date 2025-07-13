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