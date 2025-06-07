import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { FileText, AlertTriangle, Scale, Users } from "lucide-react"

export default function TermsPage() {
  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-blue-600 to-purple-700 text-white py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-5xl font-bold mb-6">Terms of Service</h1>
            <p className="text-xl opacity-90">
              Please read these terms carefully before using our services. By using our website and services, you agree
              to these terms.
            </p>
            <p className="text-sm opacity-75 mt-4">Last updated: January 2024</p>
          </div>
        </div>
      </section>

      <div className="container mx-auto px-4 py-12">
        <div className="max-w-4xl mx-auto space-y-8">
          {/* Acceptance */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileText className="w-6 h-6 text-blue-600" />
                Acceptance of Terms
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p>
                By accessing and using the Hope Foundation website and services, you accept and agree to be bound by the
                terms and provision of this agreement. If you do not agree to abide by the above, please do not use this
                service.
              </p>
            </CardContent>
          </Card>

          {/* Use License */}
          <Card>
            <CardHeader>
              <CardTitle>Use License</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p>
                Permission is granted to temporarily download one copy of the materials on Hope Foundation's website for
                personal, non-commercial transitory viewing only. This is the grant of a license, not a transfer of
                title, and under this license you may not:
              </p>

              <ul className="list-disc list-inside space-y-2 text-gray-700">
                <li>modify or copy the materials</li>
                <li>
                  use the materials for any commercial purpose or for any public display (commercial or non-commercial)
                </li>
                <li>attempt to decompile or reverse engineer any software contained on the website</li>
                <li>remove any copyright or other proprietary notations from the materials</li>
              </ul>

              <p>
                This license shall automatically terminate if you violate any of these restrictions and may be
                terminated by Hope Foundation at any time.
              </p>
            </CardContent>
          </Card>

          {/* Donations */}
          <Card>
            <CardHeader>
              <CardTitle>Donations and Payments</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <h3 className="text-lg font-semibold mb-3">Donation Terms</h3>
                <ul className="list-disc list-inside space-y-2 text-gray-700">
                  <li>All donations are voluntary and non-refundable unless required by law</li>
                  <li>Donations are used to support our charitable activities and operations</li>
                  <li>We reserve the right to use donations where they are most needed</li>
                  <li>Tax receipts will be provided for eligible donations</li>
                  <li>Recurring donations can be cancelled at any time through your account</li>
                </ul>
              </div>

              <div>
                <h3 className="text-lg font-semibold mb-3">Payment Processing</h3>
                <ul className="list-disc list-inside space-y-2 text-gray-700">
                  <li>Payments are processed securely through Razorpay</li>
                  <li>We do not store your payment information on our servers</li>
                  <li>You are responsible for providing accurate payment information</li>
                  <li>Failed payments may result in suspension of recurring donations</li>
                </ul>
              </div>
            </CardContent>
          </Card>

          {/* User Accounts */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Users className="w-6 h-6 text-green-600" />
                User Accounts and Responsibilities
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <h3 className="text-lg font-semibold mb-3">Account Creation</h3>
                <ul className="list-disc list-inside space-y-2 text-gray-700">
                  <li>You must provide accurate and complete information when creating an account</li>
                  <li>You are responsible for maintaining the confidentiality of your account credentials</li>
                  <li>You must notify us immediately of any unauthorized use of your account</li>
                  <li>One person may not maintain multiple accounts</li>
                </ul>
              </div>

              <div>
                <h3 className="text-lg font-semibold mb-3">Prohibited Activities</h3>
                <ul className="list-disc list-inside space-y-2 text-gray-700">
                  <li>Providing false or misleading information</li>
                  <li>Using the service for any illegal or unauthorized purpose</li>
                  <li>Attempting to gain unauthorized access to our systems</li>
                  <li>Harassing, abusing, or harming other users</li>
                  <li>Posting inappropriate or offensive content</li>
                  <li>Violating any applicable laws or regulations</li>
                </ul>
              </div>
            </CardContent>
          </Card>

          {/* Volunteer Terms */}
          <Card>
            <CardHeader>
              <CardTitle>Volunteer Terms</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <ul className="list-disc list-inside space-y-2 text-gray-700">
                <li>Volunteer positions are unpaid and voluntary</li>
                <li>Background checks may be required for certain positions</li>
                <li>Volunteers must comply with our code of conduct and policies</li>
                <li>We reserve the right to terminate volunteer relationships at any time</li>
                <li>Volunteers are not employees and are not entitled to employment benefits</li>
                <li>Confidential information must be kept confidential</li>
              </ul>
            </CardContent>
          </Card>

          {/* Content and Intellectual Property */}
          <Card>
            <CardHeader>
              <CardTitle>Content and Intellectual Property</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <h3 className="text-lg font-semibold mb-3">Our Content</h3>
                <p>
                  The materials on Hope Foundation's website are owned by or licensed to Hope Foundation and are
                  protected by applicable copyright and trademark law. You may not reproduce, distribute, or create
                  derivative works from our content without permission.
                </p>
              </div>

              <div>
                <h3 className="text-lg font-semibold mb-3">User-Generated Content</h3>
                <ul className="list-disc list-inside space-y-2 text-gray-700">
                  <li>You retain ownership of content you submit to us</li>
                  <li>By submitting content, you grant us a license to use, modify, and distribute it</li>
                  <li>You are responsible for ensuring you have rights to any content you submit</li>
                  <li>We reserve the right to remove any content that violates our policies</li>
                </ul>
              </div>
            </CardContent>
          </Card>

          {/* Privacy */}
          <Card>
            <CardHeader>
              <CardTitle>Privacy</CardTitle>
            </CardHeader>
            <CardContent>
              <p>
                Your privacy is important to us. Please review our Privacy Policy, which also governs your use of the
                website, to understand our practices regarding the collection and use of your personal information.
              </p>
            </CardContent>
          </Card>

          {/* Disclaimers */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <AlertTriangle className="w-6 h-6 text-yellow-600" />
                Disclaimers and Limitations
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <h3 className="text-lg font-semibold mb-3">Service Availability</h3>
                <p>
                  We strive to maintain continuous service availability but cannot guarantee uninterrupted access. We
                  reserve the right to modify, suspend, or discontinue services at any time without notice.
                </p>
              </div>

              <div>
                <h3 className="text-lg font-semibold mb-3">Limitation of Liability</h3>
                <p>
                  Hope Foundation shall not be liable for any indirect, incidental, special, consequential, or punitive
                  damages, including without limitation, loss of profits, data, use, goodwill, or other intangible
                  losses.
                </p>
              </div>

              <div>
                <h3 className="text-lg font-semibold mb-3">Indemnification</h3>
                <p>
                  You agree to defend, indemnify, and hold harmless Hope Foundation from and against any claims,
                  damages, obligations, losses, liabilities, costs, or debt arising from your use of our services.
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Governing Law */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Scale className="w-6 h-6 text-purple-600" />
                Governing Law
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p>
                These terms and conditions are governed by and construed in accordance with the laws of India. Any
                disputes relating to these terms shall be subject to the exclusive jurisdiction of the courts of Mumbai,
                Maharashtra.
              </p>
            </CardContent>
          </Card>

          {/* Changes to Terms */}
          <Card>
            <CardHeader>
              <CardTitle>Changes to Terms</CardTitle>
            </CardHeader>
            <CardContent>
              <p>
                Hope Foundation reserves the right to revise these terms of service at any time without notice. By using
                this website, you are agreeing to be bound by the then current version of these terms of service.
              </p>
            </CardContent>
          </Card>

          {/* Contact Information */}
          <Card>
            <CardHeader>
              <CardTitle>Contact Information</CardTitle>
              <CardDescription>
                If you have any questions about these Terms of Service, please contact us:
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div>
                <p className="font-semibold">Hope Foundation</p>
                <p>123 Hope Street</p>
                <p>Mumbai, Maharashtra 400001</p>
                <p>India</p>
                <p className="mt-2">Email: legal@hopefoundation.org</p>
                <p>Phone: +91 98765 43210</p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
