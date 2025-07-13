/**
 * This file contains utility functions for generating PDFs
 * 
 * Note: Since we can't install new npm packages in this environment,
 * we're creating a simple HTML-based receipt that can be converted to PDF
 * in the browser using the browser's print functionality.
 */

import { format } from "date-fns"

/**
 * Generate an HTML receipt for a donation that can be printed as PDF
 */
export async function generateDonationReceipt(donation: any): Promise<string> {
  // Check if this is a recurring donation
  const isRecurring = donation.isRecurring || false
  const frequency = donation.frequency || ""
  // Format the donation date
  const donationDate = format(
    donation.createdAt || new Date(),
    "MMMM dd, yyyy"
  )
  
  // Generate receipt number if not available
  const receiptNumber = donation.receiptNumber || `HF-${donation._id.toString().slice(-8).toUpperCase()}`
  
  // Create HTML receipt
  const receiptHtml = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8" />
      <title>Donation Receipt - Hope Foundation</title>
      <style>
        body {
          font-family: Arial, sans-serif;
          line-height: 1.6;
          color: #333;
          max-width: 800px;
          margin: 0 auto;
          padding: 20px;
        }
        .receipt {
          border: 1px solid #ddd;
          padding: 30px;
          border-radius: 8px;
          box-shadow: 0 2px 4px rgba(0,0,0,0.1);
        }
        .header {
          text-align: center;
          margin-bottom: 30px;
          border-bottom: 2px solid #2563eb;
          padding-bottom: 20px;
        }
        .logo {
          font-size: 24px;
          font-weight: bold;
          color: #2563eb;
          margin-bottom: 5px;
        }
        .receipt-title {
          font-size: 20px;
          margin-top: 10px;
          color: #555;
        }
        .receipt-number {
          font-size: 14px;
          color: #777;
          margin-top: 5px;
        }
        .section {
          margin-bottom: 25px;
        }
        .section-title {
          font-weight: bold;
          margin-bottom: 10px;
          color: #2563eb;
        }
        .info-row {
          display: flex;
          justify-content: space-between;
          margin-bottom: 8px;
        }
        .info-label {
          font-weight: bold;
          width: 40%;
        }
        .info-value {
          width: 60%;
        }
        .amount {
          font-size: 18px;
          font-weight: bold;
          color: #2563eb;
        }
        .footer {
          margin-top: 40px;
          text-align: center;
          font-size: 12px;
          color: #777;
          border-top: 1px solid #ddd;
          padding-top: 20px;
        }
        .tax-info {
          margin-top: 30px;
          padding: 15px;
          background-color: #f8f9fa;
          border-radius: 5px;
          font-size: 13px;
        }
        @media print {
          body {
            padding: 0;
          }
          .receipt {
            border: none;
            box-shadow: none;
          }
          .no-print {
            display: none;
          }
        }
      </style>
    </head>
    <body>
      <div class="receipt">
        <div class="header">
          <div class="logo">HOPE FOUNDATION</div>
          <div class="receipt-title">DONATION RECEIPT</div>
          <div class="receipt-number">Receipt #: ${receiptNumber}</div>
        </div>
        
        <div class="section">
          <div class="section-title">Donor Information</div>
          <div class="info-row">
            <div class="info-label">Name:</div>
            <div class="info-value">${donation.donorName}</div>
          </div>
          <div class="info-row">
            <div class="info-label">Email:</div>
            <div class="info-value">${donation.donorEmail}</div>
          </div>
          ${donation.donorPhone ? `
          <div class="info-row">
            <div class="info-label">Phone:</div>
            <div class="info-value">${donation.donorPhone}</div>
          </div>
          ` : ''}
          ${donation.donorAddress ? `
          <div class="info-row">
            <div class="info-label">Address:</div>
            <div class="info-value">${donation.donorAddress}</div>
          </div>
          ` : ''}
        </div>
        
        <div class="section">
          <div class="section-title">Donation Details</div>
          <div class="info-row">
            <div class="info-label">Date:</div>
            <div class="info-value">${donationDate}</div>
          </div>
          <div class="info-row">
            <div class="info-label">Payment Method:</div>
            <div class="info-value">${donation.paymentMethod === 'razorpay' ? 'Online Payment (Razorpay)' : donation.paymentMethod}${isRecurring ? ` (${frequency.charAt(0).toUpperCase() + frequency.slice(1)} Recurring)` : ''}</div>
          </div>
          ${isRecurring && donation.subscriptionId ? `
          <div class="info-row">
            <div class="info-label">Subscription ID:</div>
            <div class="info-value">${donation.subscriptionId}</div>
          </div>
          ` : ''}
          <div class="info-row">
            <div class="info-label">Payment ID:</div>
            <div class="info-value">${donation.paymentId || 'N/A'}</div>
          </div>
          <div class="info-row">
            <div class="info-label">Order ID:</div>
            <div class="info-value">${donation.orderId}</div>
          </div>
          ${donation.cause ? `
          <div class="info-row">
            <div class="info-label">Cause:</div>
            <div class="info-value">${donation.cause.charAt(0).toUpperCase() + donation.cause.slice(1)}</div>
          </div>
          ` : ''}
        </div>
        
        <div class="section">
          <div class="section-title">Amount</div>
          <div class="info-row">
            <div class="info-label">Donation Amount:</div>
            <div class="info-value amount">₹${donation.amount.toLocaleString('en-IN')}</div>
          </div>
        </div>
        
        <div class="tax-info">
          <strong>Tax Information:</strong> This donation may be eligible for tax benefits under Section 80G of the Income Tax Act. 
          Hope Foundation is a registered non-profit organization (Registration No. HF12345).
        </div>
        
        <div class="footer">
          <p>Thank you for your generous support! Your contribution helps us create lasting change.</p>
          <p>Hope Foundation | contact@hopefoundation.org | +91-9876543210</p>
          <p>123 Charity Lane, Bangalore, Karnataka - 560001</p>
        </div>
      </div>
      
      <div class="no-print" style="text-align: center; margin-top: 30px;">
        <button onclick="window.print()" style="padding: 10px 20px; background: #2563eb; color: white; border: none; border-radius: 5px; cursor: pointer;">
          Print Receipt
        </button>
      </div>
    </body>
    </html>
  `
  
  // Return the HTML as a base64 string
  return Buffer.from(receiptHtml).toString('base64')
}