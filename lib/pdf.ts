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

/**
 * Generate 80G tax certificate HTML
 */
export async function generateTaxCertificate(certificate: any): Promise<string> {
  const donation = certificate.donationId
  const issueDate = certificate.issuedDate ? new Date(certificate.issuedDate).toLocaleDateString('en-IN', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  }) : new Date().toLocaleDateString('en-IN', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  })

  const donationDate = new Date(certificate.donationDate).toLocaleDateString('en-IN', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  })

  // Format amounts with Indian number system
  const donationAmount = certificate.donationAmount.toLocaleString('en-IN')
  const deductibleAmount = certificate.deductibleAmount.toLocaleString('en-IN')

  const certificateHtml = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8" />
      <title>80G Certificate - Hope Foundation</title>
      <style>
        body {
          font-family: 'Times New Roman', serif;
          line-height: 1.6;
          color: #000;
          max-width: 800px;
          margin: 0 auto;
          padding: 20px;
        }
        .certificate {
          border: 3px solid #000;
          padding: 40px;
          margin: 20px 0;
        }
        .header {
          text-align: center;
          margin-bottom: 30px;
          border-bottom: 2px solid #000;
          padding-bottom: 20px;
        }
        .org-name {
          font-size: 24px;
          font-weight: bold;
          margin-bottom: 5px;
        }
        .tagline {
          font-size: 14px;
          font-style: italic;
          margin-bottom: 10px;
        }
        .certificate-title {
          font-size: 22px;
          font-weight: bold;
          margin: 20px 0;
          text-decoration: underline;
        }
        .section {
          margin: 20px 0;
          text-align: justify;
        }
        .section-title {
          font-weight: bold;
          font-size: 16px;
          margin-bottom: 10px;
          text-decoration: underline;
        }
        .info-table {
          width: 100%;
          border-collapse: collapse;
          margin: 15px 0;
        }
        .info-table td {
          padding: 8px;
          vertical-align: top;
        }
        .info-table .label {
          font-weight: bold;
          width: 40%;
        }
        .info-table .value {
          width: 60%;
        }
        .amount {
          font-size: 18px;
          font-weight: bold;
        }
        .footer {
          margin-top: 40px;
          text-align: center;
        }
        .signature-section {
          margin-top: 60px;
          display: flex;
          justify-content: space-between;
        }
        .signature-box {
          width: 200px;
          text-align: center;
          border-top: 1px solid #000;
          padding-top: 5px;
        }
        .qr-code {
          width: 80px;
          height: 80px;
          border: 1px solid #000;
          margin: 20px auto;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 10px;
        }
        @media print {
          body { padding: 0; }
          .certificate { border: 3px solid #000; }
        }
      </style>
    </head>
    <body>
      <div class="certificate">
        <div class="header">
          <div class="org-name">${certificate.organizationDetails.name}</div>
          <div class="tagline">Making a Difference Together</div>
          <div>Reg. No: ${certificate.organizationDetails.registrationNumber} | PAN: ${certificate.organizationDetails.panNumber}</div>
          <div>${certificate.organizationDetails.address}</div>
        </div>

        <div class="certificate-title">
          CERTIFICATE OF DONATION U/S 80G OF THE INCOME TAX ACT, 1961
        </div>

        <div class="section">
          <p><strong>Certificate No:</strong> ${certificate.certificateNumber}</p>
          <p><strong>Financial Year:</strong> ${certificate.financialYear}</p>
          <p><strong>Date of Issue:</strong> ${issueDate}</p>
        </div>

        <div class="section">
          <div class="section-title">DONOR DETAILS</div>
          <table class="info-table">
            <tr>
              <td class="label">Name:</td>
              <td class="value">${certificate.donorName}</td>
            </tr>
            <tr>
              <td class="label">Address:</td>
              <td class="value">${certificate.donorAddress}</td>
            </tr>
            <tr>
              <td class="label">PAN:</td>
              <td class="value">${certificate.donorPan}</td>
            </tr>
            <tr>
              <td class="label">Email:</td>
              <td class="value">${certificate.donorEmail}</td>
            </tr>
          </table>
        </div>

        <div class="section">
          <div class="section-title">DONATION DETAILS</div>
          <table class="info-table">
            <tr>
              <td class="label">Date of Donation:</td>
              <td class="value">${donationDate}</td>
            </tr>
            <tr>
              <td class="label">Amount of Donation:</td>
              <td class="value"><span class="amount">₹${donationAmount}</span></td>
            </tr>
            <tr>
              <td class="label">Mode of Payment:</td>
              <td class="value">${donation?.paymentMethod || 'Online'}</td>
            </tr>
            <tr>
              <td class="label">Purpose of Donation:</td>
              <td class="value">General philanthropic purposes</td>
            </tr>
          </table>
        </div>

        <div class="section">
          <p><strong>50% of the above donation i.e. ₹${deductibleAmount} is deductible under section 80G of the Income Tax Act, 1961.</strong></p>
          
          <p><strong>Registration Details under section 80G:</strong></p>
          <ul>
            <li>Registration No: ${certificate.organizationDetails.eightyGNumber}</li>
            <li>Valid from: 01/04/2020 to 31/03/2025</li>
            <li>21A Registration No: ${certificate.organizationDetails.twelveANumber}</li>
          </ul>

          <p>This certificate is issued based on the donation received and is subject to the provisions of section 80G of the Income Tax Act, 1961 and rules made thereunder.</p>
        </div>

        <div class="footer">
          <div class="qr-code">QR Code<br>Verification</div>
          <p><strong>Verification URL:</strong> ${process.env.NEXTAUTH_URL}/verify-certificate/${certificate._id}</p>
        </div>

        <div class="signature-section">
          <div class="signature-box">
            <strong>Authorized Signatory</strong><br>
            ${certificate.signatureDetails?.signatoryName || 'Hope Foundation Representative'}<br>
            ${certificate.signatureDetails?.signatoryDesignation || 'Secretary'}
          </div>
          <div style="text-align: center; margin-top: 100px;">
            <div style="font-size: 12px; color: #666;">
              Generated on: ${issueDate}
            </div>
          </div>
        </div>
      </div>
    </body>
    </html>
  `

  return Buffer.from(certificateHtml).toString('base64')
}