import { Resend } from "resend"
import type { IDonation } from "./models/Donation"
import type { IVolunteer } from "./models/Volunteer"

const resend = new Resend(process.env.RESEND_API_KEY)

export async function sendDonationConfirmation(donation: IDonation) {
  try {
    await resend.emails.send({
      from: "Hope Foundation <noreply@hopefoundation.org>",
      to: donation.donorEmail,
      subject: "Thank you for your generous donation!",
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
          <div style="text-align: center; margin-bottom: 30px;">
            <h1 style="color: #2563eb; margin-bottom: 10px;">Thank You for Your Generous Donation!</h1>
            <p style="color: #6b7280; font-size: 16px;">Your support makes a real difference in people's lives</p>
          </div>
          
          <div style="background-color: #f8fafc; padding: 25px; border-radius: 8px; margin: 25px 0;">
            <h3 style="color: #1f2937; margin-bottom: 15px;">Donation Details</h3>
            <table style="width: 100%; border-collapse: collapse;">
              <tr>
                <td style="padding: 8px 0; color: #6b7280;">Amount:</td>
                <td style="padding: 8px 0; font-weight: bold; color: #1f2937;">₹${donation.amount.toLocaleString()}</td>
              </tr>
              <tr>
                <td style="padding: 8px 0; color: #6b7280;">Transaction ID:</td>
                <td style="padding: 8px 0; font-weight: bold; color: #1f2937;">${donation.paymentId}</td>
              </tr>
              <tr>
                <td style="padding: 8px 0; color: #6b7280;">Date:</td>
                <td style="padding: 8px 0; font-weight: bold; color: #1f2937;">${new Date(donation.createdAt).toLocaleDateString()}</td>
              </tr>
              <tr>
                <td style="padding: 8px 0; color: #6b7280;">Receipt Number:</td>
                <td style="padding: 8px 0; font-weight: bold; color: #1f2937;">${donation.receiptNumber}</td>
              </tr>
            </table>
          </div>
          
          <div style="margin: 25px 0;">
            <p style="color: #374151; line-height: 1.6;">Dear ${donation.donorName},</p>
            <p style="color: #374151; line-height: 1.6;">
              We are incredibly grateful for your donation of ₹${donation.amount.toLocaleString()} to Hope Foundation. 
              Your generosity helps us continue our mission to create positive change in communities worldwide.
            </p>
          </div>

          <div style="background-color: #ecfdf5; padding: 20px; border-radius: 8px; margin: 25px 0;">
            <h4 style="color: #065f46; margin-bottom: 15px;">Your Impact</h4>
            <ul style="color: #047857; margin: 0; padding-left: 20px;">
              <li>Provides clean water for ${Math.floor(donation.amount / 50)} people for a month</li>
              <li>Funds education for ${Math.floor(donation.amount / 200)} children for a week</li>
              <li>Supports ${Math.floor(donation.amount / 300)} medical treatments</li>
              <li>Helps feed ${Math.floor(donation.amount / 100)} families for a day</li>
            </ul>
          </div>
          
          <div style="margin: 25px 0;">
            <p style="color: #374151; line-height: 1.6;">
              <strong>Tax Information:</strong> Your donation is tax-deductible under Section 80G of the Income Tax Act. 
              This email serves as your receipt for tax purposes.
            </p>
          </div>
          
          <div style="text-align: center; margin: 30px 0;">
            <a href="https://hopefoundation.org/campaigns" 
               style="background-color: #2563eb; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; display: inline-block;">
              View Our Current Campaigns
            </a>
          </div>
          
          <div style="margin: 25px 0;">
            <p style="color: #374151; line-height: 1.6;">
              Thank you once again for your kindness and support. Together, we can build a better world.
            </p>
            <p style="color: #374151; line-height: 1.6;">
              With gratitude,<br>
              <strong>The Hope Foundation Team</strong>
            </p>
          </div>
          
          <hr style="margin: 30px 0; border: none; border-top: 1px solid #e5e7eb;">
          <div style="text-align: center;">
            <p style="font-size: 12px; color: #6b7280; margin: 0;">
              Hope Foundation | 123 Hope Street, Mumbai, India 400001<br>
              Email: info@hopefoundation.org | Phone: +91 98765 43210<br>
              <a href="https://hopefoundation.org" style="color: #2563eb;">www.hopefoundation.org</a>
            </p>
          </div>
        </div>
      `,
    })
  } catch (error) {
    console.error("Error sending donation confirmation:", error)
  }
}

export async function sendVolunteerWelcome(volunteer: IVolunteer, user: any) {
  try {
    await resend.emails.send({
      from: "Hope Foundation <noreply@hopefoundation.org>",
      to: user.email,
      subject: "Welcome to Hope Foundation - Volunteer Application Received",
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
          <div style="text-align: center; margin-bottom: 30px;">
            <h1 style="color: #16a34a; margin-bottom: 10px;">Welcome to Hope Foundation!</h1>
            <p style="color: #6b7280; font-size: 16px;">Thank you for your interest in volunteering with us</p>
          </div>
          
          <div style="margin: 25px 0;">
            <p style="color: #374151; line-height: 1.6;">Dear ${user.name},</p>
            <p style="color: #374151; line-height: 1.6;">
              Thank you for your interest in volunteering with Hope Foundation. We have received your application 
              and are excited about the possibility of having you join our team of dedicated volunteers.
            </p>
          </div>

          <div style="background-color: #f0f9ff; padding: 20px; border-radius: 8px; margin: 25px 0;">
            <h3 style="color: #0369a1; margin-bottom: 15px;">What's Next?</h3>
            <ol style="color: #374151; margin: 0; padding-left: 20px;">
              <li style="margin-bottom: 8px;">Our volunteer coordinator will review your application</li>
              <li style="margin-bottom: 8px;">We'll contact you within 3-5 business days</li>
              <li style="margin-bottom: 8px;">Background verification process (if required)</li>
              <li style="margin-bottom: 8px;">Orientation and training session</li>
              <li>Assignment to suitable volunteer opportunities</li>
            </ol>
          </div>
          
          <div style="background-color: #fef3c7; padding: 20px; border-radius: 8px; margin: 25px 0;">
            <h4 style="color: #92400e; margin-bottom: 15px;">In the meantime, you can:</h4>
            <ul style="color: #92400e; margin: 0; padding-left: 20px;">
              <li>Follow us on social media for updates</li>
              <li>Read our latest blog posts to learn more about our work</li>
              <li>Share our mission with friends and family</li>
              <li>Attend our upcoming events</li>
            </ul>
          </div>
          
          <div style="text-align: center; margin: 30px 0;">
            <a href="https://hopefoundation.org/events" 
               style="background-color: #16a34a; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; display: inline-block; margin-right: 10px;">
              View Upcoming Events
            </a>
            <a href="https://hopefoundation.org/blog" 
               style="background-color: #2563eb; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; display: inline-block;">
              Read Our Blog
            </a>
          </div>
          
          <div style="margin: 25px 0;">
            <p style="color: #374151; line-height: 1.6;">
              If you have any questions about your application or our volunteer programs, please don't hesitate to contact us.
            </p>
            <p style="color: #374151; line-height: 1.6;">
              Thank you for your commitment to making a difference!
            </p>
            <p style="color: #374151; line-height: 1.6;">
              Best regards,<br>
              <strong>The Hope Foundation Volunteer Team</strong>
            </p>
          </div>
          
          <hr style="margin: 30px 0; border: none; border-top: 1px solid #e5e7eb;">
          <div style="text-align: center;">
            <p style="font-size: 12px; color: #6b7280; margin: 0;">
              Hope Foundation | 123 Hope Street, Mumbai, India 400001<br>
              Email: volunteer@hopefoundation.org | Phone: +91 98765 43210<br>
              <a href="https://hopefoundation.org" style="color: #2563eb;">www.hopefoundation.org</a>
            </p>
          </div>
        </div>
      `,
    })
  } catch (error) {
    console.error("Error sending volunteer welcome email:", error)
  }
}

export async function sendEventRegistrationConfirmation(event: any, user: any) {
  try {
    await resend.emails.send({
      from: "Hope Foundation <noreply@hopefoundation.org>",
      to: user.email,
      subject: `Event Registration Confirmed - ${event.title}`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
          <div style="text-align: center; margin-bottom: 30px;">
            <h1 style="color: #7c3aed; margin-bottom: 10px;">Event Registration Confirmed!</h1>
            <p style="color: #6b7280; font-size: 16px;">You're all set for ${event.title}</p>
          </div>
          
          <div style="background-color: #faf5ff; padding: 25px; border-radius: 8px; margin: 25px 0;">
            <h3 style="color: #6b21a8; margin-bottom: 15px;">Event Details</h3>
            <table style="width: 100%; border-collapse: collapse;">
              <tr>
                <td style="padding: 8px 0; color: #6b7280;">Event:</td>
                <td style="padding: 8px 0; font-weight: bold; color: #1f2937;">${event.title}</td>
              </tr>
              <tr>
                <td style="padding: 8px 0; color: #6b7280;">Date:</td>
                <td style="padding: 8px 0; font-weight: bold; color: #1f2937;">${new Date(event.date).toLocaleDateString()}</td>
              </tr>
              <tr>
                <td style="padding: 8px 0; color: #6b7280;">Time:</td>
                <td style="padding: 8px 0; font-weight: bold; color: #1f2937;">${new Date(event.date).toLocaleTimeString()}</td>
              </tr>
              <tr>
                <td style="padding: 8px 0; color: #6b7280;">Location:</td>
                <td style="padding: 8px 0; font-weight: bold; color: #1f2937;">${event.location}</td>
              </tr>
              <tr>
                <td style="padding: 8px 0; color: #6b7280;">Address:</td>
                <td style="padding: 8px 0; font-weight: bold; color: #1f2937;">${event.address}</td>
              </tr>
            </table>
          </div>
          
          <div style="margin: 25px 0;">
            <p style="color: #374151; line-height: 1.6;">Dear ${user.name},</p>
            <p style="color: #374151; line-height: 1.6;">
              Your registration for "${event.title}" has been confirmed. We're excited to have you join us for this event!
            </p>
          </div>

          ${
            event.requirements && event.requirements.length > 0
              ? `
          <div style="background-color: #fef2f2; padding: 20px; border-radius: 8px; margin: 25px 0;">
            <h4 style="color: #dc2626; margin-bottom: 15px;">Important Requirements</h4>
            <ul style="color: #dc2626; margin: 0; padding-left: 20px;">
              ${event.requirements.map((req: string) => `<li>${req}</li>`).join("")}
            </ul>
          </div>
          `
              : ""
          }
          
          <div style="margin: 25px 0;">
            <p style="color: #374151; line-height: 1.6;">
              <strong>Contact Person:</strong> ${event.contactPerson.name}<br>
              <strong>Email:</strong> ${event.contactPerson.email}<br>
              <strong>Phone:</strong> ${event.contactPerson.phone}
            </p>
          </div>
          
          <div style="text-align: center; margin: 30px 0;">
            <a href="https://hopefoundation.org/events/${event._id}" 
               style="background-color: #7c3aed; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; display: inline-block;">
              View Event Details
            </a>
          </div>
          
          <div style="margin: 25px 0;">
            <p style="color: #374151; line-height: 1.6;">
              If you need to cancel your registration or have any questions, please contact us as soon as possible.
            </p>
            <p style="color: #374151; line-height: 1.6;">
              We look forward to seeing you at the event!
            </p>
            <p style="color: #374151; line-height: 1.6;">
              Best regards,<br>
              <strong>The Hope Foundation Events Team</strong>
            </p>
          </div>
          
          <hr style="margin: 30px 0; border: none; border-top: 1px solid #e5e7eb;">
          <div style="text-align: center;">
            <p style="font-size: 12px; color: #6b7280; margin: 0;">
              Hope Foundation | 123 Hope Street, Mumbai, India 400001<br>
              Email: events@hopefoundation.org | Phone: +91 98765 43210<br>
              <a href="https://hopefoundation.org" style="color: #2563eb;">www.hopefoundation.org</a>
            </p>
          </div>
        </div>
      `,
    })
  } catch (error) {
    console.error("Error sending event registration confirmation:", error)
  }
}

export async function sendCampaignUpdate(campaign: any, update: any, subscribers: string[]) {
  try {
    await resend.emails.send({
      from: "Hope Foundation <noreply@hopefoundation.org>",
      to: subscribers,
      subject: `Campaign Update: ${campaign.title}`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
          <div style="text-align: center; margin-bottom: 30px;">
            <h1 style="color: #2563eb; margin-bottom: 10px;">Campaign Update</h1>
            <h2 style="color: #374151; margin-bottom: 10px;">${campaign.title}</h2>
          </div>
          
          <div style="background-color: #f8fafc; padding: 25px; border-radius: 8px; margin: 25px 0;">
            <h3 style="color: #1f2937; margin-bottom: 15px;">${update.title}</h3>
            <p style="color: #374151; line-height: 1.6;">${update.content}</p>
            ${update.image ? `<img src="${update.image}" alt="Update image" style="width: 100%; border-radius: 8px; margin-top: 15px;">` : ""}
          </div>
          
          <div style="background-color: #ecfdf5; padding: 20px; border-radius: 8px; margin: 25px 0;">
            <h4 style="color: #065f46; margin-bottom: 15px;">Campaign Progress</h4>
            <div style="background-color: #d1fae5; height: 20px; border-radius: 10px; overflow: hidden;">
              <div style="background-color: #10b981; height: 100%; width: ${(campaign.raised / campaign.goal) * 100}%;"></div>
            </div>
            <p style="color: #047857; margin-top: 10px; font-weight: bold;">
              ₹${campaign.raised.toLocaleString()} raised of ₹${campaign.goal.toLocaleString()} goal 
              (${Math.round((campaign.raised / campaign.goal) * 100)}%)
            </p>
          </div>
          
          <div style="text-align: center; margin: 30px 0;">
            <a href="https://hopefoundation.org/campaigns/${campaign._id}" 
               style="background-color: #2563eb; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; display: inline-block; margin-right: 10px;">
              View Campaign
            </a>
            <a href="https://hopefoundation.org/donate?campaign=${campaign._id}" 
               style="background-color: #16a34a; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; display: inline-block;">
              Donate Now
            </a>
          </div>
          
          <div style="margin: 25px 0;">
            <p style="color: #374151; line-height: 1.6;">
              Thank you for your continued support of this campaign. Your contributions are making a real difference!
            </p>
            <p style="color: #374151; line-height: 1.6;">
              With gratitude,<br>
              <strong>The Hope Foundation Team</strong>
            </p>
          </div>
          
          <hr style="margin: 30px 0; border: none; border-top: 1px solid #e5e7eb;">
          <div style="text-align: center;">
            <p style="font-size: 12px; color: #6b7280; margin: 0;">
              Hope Foundation | 123 Hope Street, Mumbai, India 400001<br>
              <a href="https://hopefoundation.org/unsubscribe" style="color: #6b7280;">Unsubscribe</a> | 
              <a href="https://hopefoundation.org" style="color: #2563eb;">www.hopefoundation.org</a>
            </p>
          </div>
        </div>
      `,
    })
  } catch (error) {
    console.error("Error sending campaign update:", error)
  }
}
