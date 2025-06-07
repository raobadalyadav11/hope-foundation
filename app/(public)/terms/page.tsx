import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Scale, FileText, Shield, AlertTriangle, Users, CreditCard } from "lucide-react"

export default function TermsOfServicePage() {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-purple-600 to-blue-700 text-white py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-5xl font-bold mb-6">Terms of Service</h1>
            <p className="text-xl opacity-90">
              Please read these terms carefully before using our services. By accessing our website, you agree to be
              bound by these terms.
            </p>
            <p className="text-sm opacity-75 mt-4">Last updated: December 2024</p>
          </div>
        </div>
      </section>

      <div className="container mx-auto px-4 py-12">
        <div className="max-w-4xl mx-auto space-y-8">
          {/* Acceptance of Terms */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Scale className="w-6 h-6 text-blue-600" />
                Acceptance of Terms
              </CardTitle>
            </CardHeader>
            <CardContent className="prose max-w-none">
              <p>
                By accessing and using the Hope Foundation website and services, you accept and agree to be bound by the
                terms and provision of this agreement. If you do not agree to abide by the above, please do not use this
                service.
              </p>
              <p>
                These Terms of Service ("Terms") govern your use of our website located at hopefoundation.org (the
                "Service") operated by Hope Foundation ("us", "we", or "our").
              </p>
            </CardContent>
          </Card>

          {/* Use of Website */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileText className="w-6 h-6 text-green-600" />
                Use of Website
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div>
                <h3 className="text-lg font-semibold mb-3">Permitted Uses</h3>
                <ul className="list-disc list-inside space-y-2 text-gray-700">
                  <li>Making donations to support our charitable activities</li>
                  <li>Applying for volunteer opportunities</li>
                  <li>Accessing information about our programs and impact</li>
                  <li>Subscribing to newsletters and updates</li>
                  <li>Participating in fundraising campaigns</li>
                  <li>Contacting us for legitimate inquiries</li>
                </ul>
              </div>

              <div>
                <h3 className="text-lg font-semibold mb-3">Account Responsibilities</h3>
                <ul className="list-disc list-inside space-y-2 text-gray-700">
                  <li>Provide accurate and complete information</li>
                  <li>Maintain the security of your account credentials</li>
                  <li>Notify us immediately of any unauthorized use</li>
                  <li>Update your information when necessary</li>
                  <li>Use the service in compliance with applicable laws</li>
                </ul>
              </div>
            </CardContent>
          </Card>

          {/* Prohibited Activities */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <AlertTriangle className="w-6 h-6 text-red-600" />
                Prohibited Activities
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-700 mb-4">
                You agree not to engage in any of the following prohibited activities:
              </p>
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <h3 className="text-lg font-semibold mb-3">Technical Violations</h3>
                  <ul className="list-disc list-inside space-y-2 text-gray-700">
                    <li>Attempting to hack or compromise our systems</li>
                    <li>Using automated tools to access our services</li>
                    <li>Reverse engineering our software</li>
                    <li>Introducing viruses or malicious code</li>
                    <li>Overloading our servers or networks</li>
                  </ul>
                </div>
                <div>
                  <h3 className="text-lg font-semibold mb-3">Content Violations</h3>
                  <ul className="list-disc list-inside space-y-2 text-gray-700">
                    <li>Posting false or misleading information</li>
                    <li>Sharing inappropriate or offensive content</li>
                    <li>Violating intellectual property rights</li>
                    <li>Impersonating others or organizations</li>
                    <li>Soliciting for competing organizations</li>
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Donations and Payments */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <CreditCard className="w-6 h-6 text-purple-600" />
                Donations and Payments
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div>
                <h3 className="text-lg font-semibold mb-3">Donation Terms</h3>
                <ul className="list-disc list-inside space-y-2 text-gray-700">
                  <li>All donations are voluntary and non-refundable unless required by law</li>
                  <li>Donations will be used for charitable purposes as described on our website</li>
                  <li>Tax receipts will be provided for eligible donations</li>
                  <li>We reserve the right to refuse donations from certain sources</li>
                  <li>Recurring donations can be cancelled at any time</li>
                </ul>
              </div>

              <div>
                <h3 className="text-lg font-semibold mb-3">Payment Processing</h3>
                <ul className="list-disc list-inside space-y-2 text-gray-700">
                  <li>Payments are processed through secure third-party providers</li>
                  <li>We do not store your complete payment information</li>
                  <li>Payment disputes should be reported within 30 days</li>
                  <li>Failed payments may result in suspension of recurring donations</li>
                  <li>Currency conversion fees may apply for international donations</li>
                </ul>
              </div>

              <div>
                <h3 className="text-lg font-semibold mb-3">Refund Policy</h3>
                <p className="text-gray-700">
                  Donations are generally non-refundable. However, we may consider refunds in exceptional circumstances
                  such as technical errors, duplicate charges, or fraudulent transactions. Refund requests must be
                  submitted within 30 days of the donation.
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Volunteer Terms */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Users className="w-6 h-6 text-green-600" />
                Volunteer Terms
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div>
                <h3 className="text-lg font-semibold mb-3">Volunteer Obligations</h3>
                <ul className="list-disc list-inside space-y-2 text-gray-700">
                  <li>Complete required training and orientation programs</li>
                  <li>Adhere to our code of conduct and ethical guidelines</li>
                  <li>Maintain confidentiality of sensitive information</li>
                  <li>Report any incidents or concerns promptly</li>
                  <li>Represent the organization professionally</li>
                </ul>
              </div>

              <div>
                <h3 className="text-lg font-semibold mb-3">Background Checks</h3>
                <p className="text-gray-700">
                  Certain volunteer positions may require background checks, reference verification, or other screening
                  procedures. By applying to volunteer, you consent to such checks as deemed necessary by the
                  organization.
                </p>
              </div>

              <div>
                <h3 className="text-lg font-semibold mb-3">Termination of Volunteer Status</h3>
                <p className="text-gray-700">
                  We reserve the right to terminate volunteer relationships at any time for any reason, including but
                  not limited to violation of policies, inappropriate conduct, or organizational needs.
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Intellectual Property */}
          <Card>
            <CardHeader>
              <CardTitle>Intellectual Property Rights</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <h3 className="text-lg font-semibold mb-3">Our Content</h3>
                <p className="text-gray-700">
                  The Service and its original content, features, and functionality are and will remain the exclusive
                  property of Hope Foundation and its licensors. The Service is protected by copyright, trademark, and
                  other laws.
                </p>
              </div>

              <div>
                <h3 className="text-lg font-semibold mb-3">User Content</h3>
                <p className="text-gray-700">
                  By submitting content to our Service, you grant us a non-exclusive, worldwide, royalty-free license to
                  use, reproduce, modify, and distribute such content for the purposes of operating and promoting our
                  charitable activities.
                </p>
              </div>

              <div>
                <h3 className="text-lg font-semibold mb-3">Trademark Usage</h3>
                <p className="text-gray-700">
                  Our trademarks and trade dress may not be used in connection with any product or service without our
                  prior written consent.
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Privacy and Data */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Shield className="w-6 h-6 text-blue-600" />
                Privacy and Data Protection
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-700">
                Your privacy is important to us. Our Privacy Policy explains how we collect, use, and protect your
                information when you use our Service. By using our Service, you agree to the collection and use of
                information in accordance with our Privacy Policy.
              </p>
            </CardContent>
          </Card>

          {/* Disclaimers */}
          <Card>
            <CardHeader>
              <CardTitle>Disclaimers and Limitations</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <h3 className="text-lg font-semibold mb-3">Service Availability</h3>
                <p className="text-gray-700">
                  We strive to maintain continuous service availability but cannot guarantee uninterrupted access. We
                  may suspend or discontinue the Service at any time for maintenance, updates, or other reasons.
                </p>
              </div>

              <div>
                <h3 className="text-lg font-semibold mb-3">Information Accuracy</h3>
                <p className="text-gray-700">
                  While we strive to provide accurate and up-to-date information, we make no warranties about the
                  completeness, reliability, or accuracy of the information on our website.
                </p>
              </div>

              <div>
                <h3 className="text-lg font-semibold mb-3">Third-Party Links</h3>
                <p className="text-gray-700">
                  Our Service may contain links to third-party websites. We are not responsible for the content, privacy
                  policies, or practices of these external sites.
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Limitation of Liability */}
          <Card>
            <CardHeader>
              <CardTitle>Limitation of Liability</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-700">
                In no event shall Hope Foundation, nor its directors, employees, partners, agents, suppliers, or
                affiliates, be liable for any indirect, incidental, special, consequential, or punitive damages,
                including without limitation, loss of profits, data, use, goodwill, or other intangible losses,
                resulting from your use of the Service.
              </p>
            </CardContent>
          </Card>

          {/* Governing Law */}
          <Card>
            <CardHeader>
              <CardTitle>Governing Law and Jurisdiction</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-700">
                These Terms shall be interpreted and governed by the laws of India. Any disputes arising from these
                Terms or your use of the Service shall be subject to the exclusive jurisdiction of the courts in Mumbai,
                India.
              </p>
            </CardContent>
          </Card>

          {/* Changes to Terms */}
          <Card>
            <CardHeader>
              <CardTitle>Changes to Terms</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-700">
                We reserve the right to modify or replace these Terms at any time. If a revision is material, we will
                try to provide at least 30 days notice prior to any new terms taking effect. What constitutes a material
                change will be determined at our sole discretion.
              </p>
            </CardContent>
          </Card>

          {/* Contact Information */}
          <Card>
            <CardHeader>
              <CardTitle>Contact Information</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-700 mb-4">
                If you have any questions about these Terms of Service, please contact us:
              </p>
              <div className="space-y-2 text-gray-700">
                <p>
                  <strong>Email:</strong> legal@hopefoundation.org
                </p>
                <p>
                  <strong>Phone:</strong> +91 98765 43210
                </p>
                <p>
                  <strong>Address:</strong> Hope Foundation, 123 Hope Street, Mumbai, India 400001
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
