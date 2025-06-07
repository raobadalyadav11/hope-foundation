import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import { Eye, Download, PieChart, TrendingUp, Users, Heart, FileText, Award, Shield } from "lucide-react"
import Link from "next/link"

export default function TransparencyPage() {
  const financialData = {
    totalRevenue: 15000000,
    programExpenses: 13500000,
    adminExpenses: 900000,
    fundraisingExpenses: 600000,
    programPercentage: 90,
    adminPercentage: 6,
    fundraisingPercentage: 4,
  }

  const impactMetrics = [
    { label: "Lives Directly Impacted", value: "50,000+", icon: Users },
    { label: "Active Volunteers", value: "2,500+", icon: Heart },
    { label: "Projects Completed", value: "150+", icon: Award },
    { label: "Countries Served", value: "12", icon: TrendingUp },
  ]

  const reports = [
    {
      title: "Annual Report 2023",
      description: "Comprehensive overview of our activities, impact, and financials for 2023",
      type: "Annual Report",
      date: "March 2024",
      size: "2.5 MB",
      downloadUrl: "#",
    },
    {
      title: "Financial Audit 2023",
      description: "Independent audit of our financial statements by certified auditors",
      type: "Audit Report",
      date: "February 2024",
      size: "1.8 MB",
      downloadUrl: "#",
    },
    {
      title: "Impact Assessment 2023",
      description: "Detailed analysis of our program outcomes and beneficiary feedback",
      type: "Impact Report",
      date: "January 2024",
      size: "3.2 MB",
      downloadUrl: "#",
    },
    {
      title: "Quarterly Report Q4 2023",
      description: "Latest quarterly update on programs, finances, and operations",
      type: "Quarterly Report",
      date: "January 2024",
      size: "1.5 MB",
      downloadUrl: "#",
    },
  ]

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-blue-600 to-purple-700 text-white py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-5xl font-bold mb-6">Transparency & Accountability</h1>
            <p className="text-xl opacity-90">
              We believe in complete transparency. Here you can access our financial reports, impact data, and see
              exactly how your donations are making a difference.
            </p>
          </div>
        </div>
      </section>

      <div className="container mx-auto px-4 py-12">
        <div className="max-w-6xl mx-auto space-y-12">
          {/* Financial Overview */}
          <section>
            <div className="text-center mb-8">
              <h2 className="text-4xl font-bold text-gray-900 mb-4">Financial Transparency</h2>
              <p className="text-xl text-gray-600">How we use your donations responsibly and effectively</p>
            </div>

            <div className="grid lg:grid-cols-2 gap-8">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <PieChart className="w-6 h-6 text-blue-600" />
                    Fund Allocation 2023
                  </CardTitle>
                  <CardDescription>
                    Total Revenue: ₹{(financialData.totalRevenue / 10000000).toFixed(1)} Crores
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div>
                    <div className="flex justify-between items-center mb-2">
                      <span className="font-medium">Program Expenses</span>
                      <span className="font-bold text-green-600">{financialData.programPercentage}%</span>
                    </div>
                    <Progress value={financialData.programPercentage} className="h-3" />
                    <p className="text-sm text-gray-600 mt-1">
                      ₹{(financialData.programExpenses / 10000000).toFixed(1)} Crores directly to programs
                    </p>
                  </div>

                  <div>
                    <div className="flex justify-between items-center mb-2">
                      <span className="font-medium">Administrative Costs</span>
                      <span className="font-bold text-blue-600">{financialData.adminPercentage}%</span>
                    </div>
                    <Progress value={financialData.adminPercentage} className="h-3" />
                    <p className="text-sm text-gray-600 mt-1">
                      ₹{(financialData.adminExpenses / 1000000).toFixed(1)} Lakhs for operations
                    </p>
                  </div>

                  <div>
                    <div className="flex justify-between items-center mb-2">
                      <span className="font-medium">Fundraising Expenses</span>
                      <span className="font-bold text-purple-600">{financialData.fundraisingPercentage}%</span>
                    </div>
                    <Progress value={financialData.fundraisingPercentage} className="h-3" />
                    <p className="text-sm text-gray-600 mt-1">
                      ₹{(financialData.fundraisingExpenses / 1000000).toFixed(1)} Lakhs for fundraising
                    </p>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <TrendingUp className="w-6 h-6 text-green-600" />
                    Impact Metrics 2023
                  </CardTitle>
                  <CardDescription>Measuring our real-world impact</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 gap-4">
                    {impactMetrics.map((metric, index) => (
                      <div key={index} className="text-center p-4 bg-gray-50 rounded-lg">
                        <metric.icon className="w-8 h-8 mx-auto mb-2 text-blue-600" />
                        <div className="text-2xl font-bold text-gray-900">{metric.value}</div>
                        <div className="text-sm text-gray-600">{metric.label}</div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </section>

          {/* Certifications */}
          <section>
            <div className="text-center mb-8">
              <h2 className="text-4xl font-bold text-gray-900 mb-4">Certifications & Recognition</h2>
              <p className="text-xl text-gray-600">
                Our commitment to excellence is recognized by leading organizations
              </p>
            </div>

            <div className="grid md:grid-cols-3 gap-6">
              <Card className="text-center">
                <CardContent className="pt-6">
                  <Award className="w-12 h-12 mx-auto mb-4 text-yellow-600" />
                  <h3 className="text-lg font-semibold mb-2">GuideStar India Seal</h3>
                  <p className="text-gray-600 text-sm">Recognized for transparency and accountability in operations</p>
                  <Badge className="mt-2">Verified 2023</Badge>
                </CardContent>
              </Card>

              <Card className="text-center">
                <CardContent className="pt-6">
                  <Shield className="w-12 h-12 mx-auto mb-4 text-blue-600" />
                  <h3 className="text-lg font-semibold mb-2">ISO 9001:2015</h3>
                  <p className="text-gray-600 text-sm">Quality management system certification</p>
                  <Badge className="mt-2">Certified 2023</Badge>
                </CardContent>
              </Card>

              <Card className="text-center">
                <CardContent className="pt-6">
                  <FileText className="w-12 h-12 mx-auto mb-4 text-green-600" />
                  <h3 className="text-lg font-semibold mb-2">12A & 80G Registration</h3>
                  <p className="text-gray-600 text-sm">Tax exemption and donation benefits certified</p>
                  <Badge className="mt-2">Valid 2024</Badge>
                </CardContent>
              </Card>
            </div>
          </section>

          {/* Reports & Documents */}
          <section>
            <div className="text-center mb-8">
              <h2 className="text-4xl font-bold text-gray-900 mb-4">Reports & Documents</h2>
              <p className="text-xl text-gray-600">Download our latest reports and financial statements</p>
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              {reports.map((report, index) => (
                <Card key={index} className="hover:shadow-lg transition-shadow">
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div>
                        <CardTitle className="text-lg">{report.title}</CardTitle>
                        <CardDescription className="mt-2">{report.description}</CardDescription>
                      </div>
                      <Badge variant="outline">{report.type}</Badge>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-center justify-between">
                      <div className="text-sm text-gray-600">
                        <p>
                          {report.date} • {report.size}
                        </p>
                      </div>
                      <Button size="sm" className="flex items-center gap-2">
                        <Download className="w-4 h-4" />
                        Download
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </section>

          {/* Governance */}
          <section>
            <div className="text-center mb-8">
              <h2 className="text-4xl font-bold text-gray-900 mb-4">Governance Structure</h2>
              <p className="text-xl text-gray-600">Our leadership and oversight ensure responsible management</p>
            </div>

            <div className="grid lg:grid-cols-2 gap-8">
              <Card>
                <CardHeader>
                  <CardTitle>Board of Directors</CardTitle>
                  <CardDescription>Independent oversight and strategic guidance</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="border-l-4 border-blue-500 pl-4">
                    <h4 className="font-semibold">Dr. Rajesh Kumar</h4>
                    <p className="text-sm text-gray-600">Chairman, Former Secretary of Health & Family Welfare</p>
                  </div>
                  <div className="border-l-4 border-green-500 pl-4">
                    <h4 className="font-semibold">Ms. Anita Sharma</h4>
                    <p className="text-sm text-gray-600">Vice-Chairman, Social Development Expert</p>
                  </div>
                  <div className="border-l-4 border-purple-500 pl-4">
                    <h4 className="font-semibold">Mr. Vikram Patel</h4>
                    <p className="text-sm text-gray-600">Treasurer, Chartered Accountant</p>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Advisory Committee</CardTitle>
                  <CardDescription>Expert guidance on programs and strategy</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="border-l-4 border-orange-500 pl-4">
                    <h4 className="font-semibold">Prof. Meera Desai</h4>
                    <p className="text-sm text-gray-600">Education Policy Expert, Former Vice-Chancellor</p>
                  </div>
                  <div className="border-l-4 border-red-500 pl-4">
                    <h4 className="font-semibold">Dr. Suresh Gupta</h4>
                    <p className="text-sm text-gray-600">Public Health Specialist, WHO Consultant</p>
                  </div>
                  <div className="border-l-4 border-teal-500 pl-4">
                    <h4 className="font-semibold">Ms. Kavita Jain</h4>
                    <p className="text-sm text-gray-600">Corporate Social Responsibility Expert</p>
                  </div>
                </CardContent>
              </Card>
            </div>
          </section>

          {/* Audit Information */}
          <section>
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Eye className="w-6 h-6 text-blue-600" />
                  Independent Auditing
                </CardTitle>
                <CardDescription>
                  Our finances are audited annually by independent certified public accountants
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <h4 className="font-semibold mb-2">External Auditor</h4>
                    <p className="text-gray-700">M/s Deloitte Haskins & Sells LLP</p>
                    <p className="text-sm text-gray-600">Chartered Accountants</p>
                  </div>
                  <div>
                    <h4 className="font-semibold mb-2">Internal Auditor</h4>
                    <p className="text-gray-700">KPMG Advisory Services Pvt. Ltd.</p>
                    <p className="text-sm text-gray-600">Risk & Compliance Review</p>
                  </div>
                </div>

                <div className="bg-blue-50 p-4 rounded-lg">
                  <h4 className="font-semibold mb-2">Audit Highlights 2023</h4>
                  <ul className="list-disc list-inside text-sm text-gray-700 space-y-1">
                    <li>Clean audit opinion with no material weaknesses</li>
                    <li>95% of funds directly allocated to program activities</li>
                    <li>Strong internal controls and financial management</li>
                    <li>Compliance with all regulatory requirements</li>
                  </ul>
                </div>
              </CardContent>
            </Card>
          </section>

          {/* Contact for Transparency */}
          <section>
            <Card className="bg-gradient-to-r from-blue-50 to-purple-50">
              <CardHeader className="text-center">
                <CardTitle>Questions About Our Transparency?</CardTitle>
                <CardDescription>
                  We're committed to answering any questions about our operations, finances, or impact
                </CardDescription>
              </CardHeader>
              <CardContent className="text-center">
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <Button asChild>
                    <Link href="/contact">Contact Us</Link>
                  </Button>
                  <Button variant="outline" asChild>
                    <Link href="mailto:transparency@hopefoundation.org">Email Transparency Team</Link>
                  </Button>
                </div>
              </CardContent>
            </Card>
          </section>
        </div>
      </div>
    </div>
  )
}
