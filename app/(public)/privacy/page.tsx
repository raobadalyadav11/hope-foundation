import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Shield, Eye, Lock, Database, Mail, Phone } from "lucide-react"

export default function PrivacyPage() {
  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-blue-600 to-purple-700 text-white py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-5xl font-bold mb-6">Privacy Policy</h1>
            <p className="text-xl opacity-90">
              Your privacy is important to us. This policy explains how we collect, use, and protect your personal
              information.
            </p>
            <p className="text-sm opacity-75 mt-4">Last updated: January 2024</p>
          </div>
        </div>
      </section>

      <div className="container mx-auto px-4 py-12">
        <div className="max-w-4xl mx-auto space-y-8">
          {/* Overview */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Shield className="w-6 h-6 text-blue-600" />
                Overview
              </CardTitle>
            </CardHeader>
            <CardContent className="prose max-w-none">
              <p>
                Hope Foundation ("we," "our," or "us") is committed to protecting your privacy. This Privacy Policy
                explains how we collect, use, disclose, and safeguard your information when you visit our website, make
                donations, volunteer with us, or otherwise interact with our services.
              </p>
            </CardContent>
          </Card>

          {/* Information We Collect */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Database className="w-6 h-6 text-green-600" />
                Information We Collect
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div>
                <h3 className="text-lg font-semibold mb-3">Personal Information</h3>
                <ul className="list-disc list-inside space-y-2 text-gray-700">
                  <li>Name, email address, phone number, and mailing address</li>
                  <li>Payment information (processed securely through Razorpay)</li>
                  <li>Donation history and preferences</li>
                  <li>Volunteer application information and background checks</li>
                  <li>Event registration details</li>
                  <li>Communication preferences</li>
                </ul>
              </div>

              <div>
                <h3 className="text-lg font-semibold mb-3">Automatically Collected Information</h3>
                <ul className="list-disc list-inside space-y-2 text-gray-700">
                  <li>IP address, browser type, and device information</li>
                  <li>Website usage data and analytics</li>
                  <li>Cookies and similar tracking technologies</li>
                  <li>Location data (with your consent)</li>
                </ul>
              </div>
            </CardContent>
          </Card>

          {/* How We Use Information */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Eye className="w-6 h-6 text-purple-600" />
                How We Use Your Information
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="list-disc list-inside space-y-2 text-gray-700">
                <li>Process donations and issue tax receipts</li>
                <li>Manage volunteer applications and assignments</li>
                <li>Send updates about our programs and impact</li>
                <li>Respond to inquiries and provide customer support</li>
                <li>Improve our website and services</li>
                <li>Comply with legal obligations</li>
                <li>Prevent fraud and ensure security</li>
                <li>Conduct research and analytics to improve our mission</li>
              </ul>
            </CardContent>
          </Card>

          {/* Information Sharing */}
          <Card>
            <CardHeader>
              <CardTitle>Information Sharing and Disclosure</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p>
                We do not sell, trade, or rent your personal information. We may share your information in the following
                circumstances:
              </p>

              <div className="space-y-4">
                <div>
                  <h4 className="font-semibold">Service Providers</h4>
                  <p className="text-gray-700">
                    We work with trusted third-party service providers who help us operate our website and services,
                    such as payment processors, email services, and analytics providers.
                  </p>
                </div>

                <div>
                  <h4 className="font-semibold">Legal Requirements</h4>
                  <p className="text-gray-700">
                    We may disclose information when required by law or to protect our rights, property, or safety, or
                    that of others.
                  </p>
                </div>

                <div>
                  <h4 className="font-semibold">Anonymous Information</h4>
                  <p className="text-gray-700">
                    We may share aggregated, anonymized data for research, reporting, or marketing purposes.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Data Security */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Lock className="w-6 h-6 text-red-600" />
                Data Security
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p>
                We implement appropriate technical and organizational measures to protect your personal information:
              </p>

              <ul className="list-disc list-inside space-y-2 text-gray-700">
                <li>SSL encryption for all data transmission</li>
                <li>Secure payment processing through PCI-compliant providers</li>
                <li>Regular security audits and updates</li>
                <li>Access controls and employee training</li>
                <li>Data backup and recovery procedures</li>
              </ul>

              <p className="text-sm text-gray-600">
                While we strive to protect your information, no method of transmission over the internet is 100% secure.
                We cannot guarantee absolute security but are committed to protecting your data.
              </p>
            </CardContent>
          </Card>

          {/* Your Rights */}
          <Card>
            <CardHeader>
              <CardTitle>Your Rights and Choices</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p>You have the following rights regarding your personal information:</p>

              <ul className="list-disc list-inside space-y-2 text-gray-700">
                <li>
                  <strong>Access:</strong> Request a copy of the personal information we hold about you
                </li>
                <li>
                  <strong>Correction:</strong> Request correction of inaccurate or incomplete information
                </li>
                <li>
                  <strong>Deletion:</strong> Request deletion of your personal information (subject to legal
                  requirements)
                </li>
                <li>
                  <strong>Opt-out:</strong> Unsubscribe from marketing communications at any time
                </li>
                <li>
                  <strong>Data Portability:</strong> Request your data in a portable format
                </li>
                <li>
                  <strong>Restriction:</strong> Request restriction of processing in certain circumstances
                </li>
              </ul>

              <p className="text-sm text-gray-600">
                To exercise these rights, please contact us using the information provided below.
              </p>
            </CardContent>
          </Card>

          {/* Cookies */}
          <Card>
            <CardHeader>
              <CardTitle>Cookies and Tracking</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p>We use cookies and similar technologies to:</p>

              <ul className="list-disc list-inside space-y-2 text-gray-700">
                <li>Remember your preferences and settings</li>
                <li>Analyze website traffic and usage patterns</li>
                <li>Provide personalized content and experiences</li>
                <li>Ensure website security and functionality</li>
              </ul>

              <p>
                You can control cookies through your browser settings. However, disabling cookies may affect website
                functionality.
              </p>
            </CardContent>
          </Card>

          {/* Children's Privacy */}
          <Card>
            <CardHeader>
              <CardTitle>Children's Privacy</CardTitle>
            </CardHeader>
            <CardContent>
              <p>
                Our services are not directed to children under 13. We do not knowingly collect personal information
                from children under 13. If we become aware that we have collected such information, we will take steps
                to delete it promptly.
              </p>
            </CardContent>
          </Card>

          {/* International Transfers */}
          <Card>
            <CardHeader>
              <CardTitle>International Data Transfers</CardTitle>
            </CardHeader>
            <CardContent>
              <p>
                Your information may be transferred to and processed in countries other than your own. We ensure
                appropriate safeguards are in place to protect your information in accordance with applicable data
                protection laws.
              </p>
            </CardContent>
          </Card>

          {/* Changes to Policy */}
          <Card>
            <CardHeader>
              <CardTitle>Changes to This Policy</CardTitle>
            </CardHeader>
            <CardContent>
              <p>
                We may update this Privacy Policy from time to time. We will notify you of any material changes by
                posting the new policy on our website and updating the "Last updated" date. Your continued use of our
                services after such changes constitutes acceptance of the updated policy.
              </p>
            </CardContent>
          </Card>

          {/* Contact Information */}
          <Card>
            <CardHeader>
              <CardTitle>Contact Us</CardTitle>
              <CardDescription>
                If you have questions about this Privacy Policy or our data practices, please contact us:
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid md:grid-cols-2 gap-6">
                <div className="flex items-start gap-3">
                  <Mail className="w-5 h-5 text-blue-600 mt-1" />
                  <div>
                    <h4 className="font-semibold">Email</h4>
                    <p className="text-gray-700">privacy@hopefoundation.org</p>
                    <p className="text-gray-700">info@hopefoundation.org</p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <Phone className="w-5 h-5 text-blue-600 mt-1" />
                  <div>
                    <h4 className="font-semibold">Phone</h4>
                    <p className="text-gray-700">+91 98765 43210</p>
                  </div>
                </div>
              </div>

              <div>
                <h4 className="font-semibold mb-2">Mailing Address</h4>
                <p className="text-gray-700">
                  Hope Foundation
                  <br />
                  123 Hope Street
                  <br />
                  Mumbai, Maharashtra 400001
                  <br />
                  India
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
