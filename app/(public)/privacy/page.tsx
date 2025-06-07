import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Shield, Eye, Lock, UserCheck, Mail, Phone } from "lucide-react"

export default function PrivacyPolicyPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-blue-600 to-purple-700 text-white py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-5xl font-bold mb-6">Privacy Policy</h1>
            <p className="text-xl opacity-90">
              Your privacy is important to us. This policy explains how we collect, use, and protect your information.
            </p>
            <p className="text-sm opacity-75 mt-4">Last updated: December 2024</p>
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
                Hope Foundation ("we," "our," or "us") is committed to protecting your privacy and ensuring the security
                of your personal information. This Privacy Policy explains how we collect, use, disclose, and safeguard
                your information when you visit our website, make donations, volunteer, or interact with our services.
              </p>
            </CardContent>
          </Card>

          {/* Information We Collect */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Eye className="w-6 h-6 text-green-600" />
                Information We Collect
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div>
                <h3 className="text-lg font-semibold mb-3">Personal Information</h3>
                <ul className="list-disc list-inside space-y-2 text-gray-700">
                  <li>Name, email address, phone number, and postal address</li>
                  <li>Payment information (processed securely through third-party providers)</li>
                  <li>Donation history and preferences</li>
                  <li>Volunteer application details and background information</li>
                  <li>Communication preferences and interaction history</li>
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
                <UserCheck className="w-6 h-6 text-purple-600" />
                How We Use Your Information
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <h3 className="text-lg font-semibold mb-3">Primary Uses</h3>
                  <ul className="list-disc list-inside space-y-2 text-gray-700">
                    <li>Process donations and issue tax receipts</li>
                    <li>Manage volunteer applications and assignments</li>
                    <li>Send program updates and impact reports</li>
                    <li>Respond to inquiries and provide support</li>
                    <li>Improve our services and user experience</li>
                  </ul>
                </div>
                <div>
                  <h3 className="text-lg font-semibold mb-3">Communications</h3>
                  <ul className="list-disc list-inside space-y-2 text-gray-700">
                    <li>Newsletter and program updates</li>
                    <li>Fundraising campaigns and events</li>
                    <li>Volunteer opportunities and training</li>
                    <li>Administrative and transactional messages</li>
                    <li>Emergency and urgent communications</li>
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Data Protection */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Lock className="w-6 h-6 text-red-600" />
                Data Protection & Security
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div>
                <h3 className="text-lg font-semibold mb-3">Security Measures</h3>
                <ul className="list-disc list-inside space-y-2 text-gray-700">
                  <li>SSL encryption for all data transmission</li>
                  <li>Secure payment processing through certified providers</li>
                  <li>Regular security audits and vulnerability assessments</li>
                  <li>Access controls and employee training</li>
                  <li>Data backup and disaster recovery procedures</li>
                </ul>
              </div>

              <div>
                <h3 className="text-lg font-semibold mb-3">Data Retention</h3>
                <p className="text-gray-700">
                  We retain your personal information only as long as necessary to fulfill the purposes outlined in this
                  policy, comply with legal obligations, resolve disputes, and enforce our agreements. Donation records
                  are kept for tax and audit purposes as required by law.
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Information Sharing */}
          <Card>
            <CardHeader>
              <CardTitle>Information Sharing & Disclosure</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <h3 className="text-lg font-semibold mb-3">We Do Not Sell Your Information</h3>
                <p className="text-gray-700">
                  We do not sell, trade, or rent your personal information to third parties for marketing purposes.
                </p>
              </div>

              <div>
                <h3 className="text-lg font-semibold mb-3">Limited Sharing</h3>
                <p className="text-gray-700 mb-2">We may share your information only in these circumstances:</p>
                <ul className="list-disc list-inside space-y-2 text-gray-700">
                  <li>With service providers who assist in our operations (payment processors, email services)</li>
                  <li>When required by law or to protect our rights and safety</li>
                  <li>With your explicit consent for specific purposes</li>
                  <li>In connection with a merger, acquisition, or sale of assets</li>
                </ul>
              </div>
            </CardContent>
          </Card>

          {/* Your Rights */}
          <Card>
            <CardHeader>
              <CardTitle>Your Rights & Choices</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <h3 className="text-lg font-semibold mb-3">Access & Control</h3>
                  <ul className="list-disc list-inside space-y-2 text-gray-700">
                    <li>Access your personal information</li>
                    <li>Update or correct your data</li>
                    <li>Delete your account and data</li>
                    <li>Export your data</li>
                    <li>Opt-out of communications</li>
                  </ul>
                </div>
                <div>
                  <h3 className="text-lg font-semibold mb-3">Communication Preferences</h3>
                  <ul className="list-disc list-inside space-y-2 text-gray-700">
                    <li>Unsubscribe from newsletters</li>
                    <li>Adjust email frequency</li>
                    <li>Choose communication channels</li>
                    <li>Set content preferences</li>
                    <li>Manage notification settings</li>
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Cookies & Tracking */}
          <Card>
            <CardHeader>
              <CardTitle>Cookies & Tracking Technologies</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <h3 className="text-lg font-semibold mb-3">Types of Cookies We Use</h3>
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <h4 className="font-medium mb-2">Essential Cookies</h4>
                    <p className="text-sm text-gray-600">Required for website functionality and security</p>
                  </div>
                  <div>
                    <h4 className="font-medium mb-2">Analytics Cookies</h4>
                    <p className="text-sm text-gray-600">Help us understand how visitors use our website</p>
                  </div>
                  <div>
                    <h4 className="font-medium mb-2">Preference Cookies</h4>
                    <p className="text-sm text-gray-600">Remember your settings and preferences</p>
                  </div>
                  <div>
                    <h4 className="font-medium mb-2">Marketing Cookies</h4>
                    <p className="text-sm text-gray-600">Used to deliver relevant advertisements</p>
                  </div>
                </div>
              </div>

              <div>
                <h3 className="text-lg font-semibold mb-3">Managing Cookies</h3>
                <p className="text-gray-700">
                  You can control cookies through your browser settings. However, disabling certain cookies may affect
                  website functionality. We respect your choices and provide cookie management options.
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Children's Privacy */}
          <Card>
            <CardHeader>
              <CardTitle>Children's Privacy</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-700">
                Our services are not directed to children under 13 years of age. We do not knowingly collect personal
                information from children under 13. If you are a parent or guardian and believe your child has provided
                us with personal information, please contact us immediately so we can delete such information.
              </p>
            </CardContent>
          </Card>

          {/* International Users */}
          <Card>
            <CardHeader>
              <CardTitle>International Data Transfers</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-700">
                Your information may be transferred to and processed in countries other than your own. We ensure
                appropriate safeguards are in place to protect your personal information in accordance with this privacy
                policy and applicable data protection laws.
              </p>
            </CardContent>
          </Card>

          {/* Changes to Policy */}
          <Card>
            <CardHeader>
              <CardTitle>Changes to This Privacy Policy</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-700">
                We may update this Privacy Policy from time to time to reflect changes in our practices or for other
                operational, legal, or regulatory reasons. We will notify you of any material changes by posting the new
                Privacy Policy on this page and updating the "Last updated" date. We encourage you to review this
                Privacy Policy periodically.
              </p>
            </CardContent>
          </Card>

          {/* Contact Information */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Mail className="w-6 h-6 text-blue-600" />
                Contact Us
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-700 mb-4">
                If you have any questions about this Privacy Policy or our data practices, please contact us:
              </p>
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <h3 className="font-semibold mb-2">Data Protection Officer</h3>
                  <div className="space-y-2 text-gray-700">
                    <div className="flex items-center gap-2">
                      <Mail className="w-4 h-4" />
                      <span>privacy@hopefoundation.org</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Phone className="w-4 h-4" />
                      <span>+91 98765 43210</span>
                    </div>
                  </div>
                </div>
                <div>
                  <h3 className="font-semibold mb-2">Mailing Address</h3>
                  <p className="text-gray-700">
                    Hope Foundation
                    <br />
                    123 Hope Street
                    <br />
                    Mumbai, India 400001
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
