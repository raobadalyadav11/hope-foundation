"use client"

import { useState, useEffect } from "react"
import { useSession } from "next-auth/react"
import { useRouter } from "next/navigation"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { toast } from "@/hooks/use-toast"
import { Heart, Search, Calendar, CreditCard, Receipt, TrendingUp, Target, Award, RefreshCw } from "lucide-react"
import Link from "next/link"

interface Donation {
  _id: string
  amount: number
  campaignId?: {
    _id: string
    title: string
    category: string
  }
  status: string
  receiptNumber?: string
  paymentMethod: string
  createdAt: string
  isRecurring: boolean
  subscriptionId?: string
}

interface DonationStats {
  totalDonated: number
  donationCount: number
  campaignsSupported: number
  averageDonation: number
  monthlyTotal: number
  yearlyTotal: number
}

export default function MyDonationsPage() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const [donations, setDonations] = useState<Donation[]>([])
  const [stats, setStats] = useState<DonationStats | null>(null)
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const [filterStatus, setFilterStatus] = useState("all")

  useEffect(() => {
    if (status === "loading") return
    if (!session) {
      router.push("/signin")
      return
    }
    fetchDonations()
  }, [session, status, router])

  const fetchDonations = async () => {
    try {
      const response = await fetch(`/api/donations/user/${session?.user?.id}`)
      const data = await response.json()
      setDonations(data.donations || [])
      setStats(data.stats || null)
    } catch (error) {
      console.error("Error fetching donations:", error)
      toast({
        title: "Error",
        description: "Failed to load donations",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  const downloadReceipt = async (donationId: string) => {
    try {
      const response = await fetch(`/api/donations/receipt/${donationId}`)
      const blob = await response.blob()
      const url = window.URL.createObjectURL(blob)
      const a = document.createElement("a")
      a.href = url
      a.download = `receipt-${donationId}.pdf`
      document.body.appendChild(a)
      a.click()
      window.URL.revokeObjectURL(url)
      document.body.removeChild(a)
    } catch (error) {
      console.error("Error downloading receipt:", error)
      toast({
        title: "Error",
        description: "Failed to download receipt",
        variant: "destructive",
      })
    }
  }

  const filteredDonations = donations.filter((donation) => {
    const matchesSearch =
      donation.campaignId?.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      donation.receiptNumber?.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesFilter = filterStatus === "all" || donation.status === filterStatus
    return matchesSearch && matchesFilter
  })

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
        <div className="container mx-auto px-4 py-8">
          <div className="flex items-center justify-center h-96">
            <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-6xl mx-auto space-y-8">
          {/* Header */}
          <div className="text-center">
            <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              My Donations
            </h1>
            <p className="text-gray-600 mt-2">Track your contributions and impact</p>
          </div>

          {/* Stats Cards */}
          {stats && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <Card className="shadow-lg border-0 hover:shadow-xl transition-all duration-300 border-l-4 border-l-green-500">
                <CardContent className="pt-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-600">Total Donated</p>
                      <p className="text-2xl font-bold text-gray-900">₹{stats.totalDonated.toLocaleString()}</p>
                    </div>
                    <div className="p-3 bg-green-100 rounded-full">
                      <CreditCard className="w-6 h-6 text-green-600" />
                    </div>
                  </div>
                  <div className="mt-2 flex items-center text-sm text-green-600">
                    <TrendingUp className="w-4 h-4 mr-1" />
                    <span>Lifetime total</span>
                  </div>
                </CardContent>
              </Card>

              <Card className="shadow-lg border-0 hover:shadow-xl transition-all duration-300 border-l-4 border-l-blue-500">
                <CardContent className="pt-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-600">Donations Made</p>
                      <p className="text-2xl font-bold text-gray-900">{stats.donationCount}</p>
                    </div>
                    <div className="p-3 bg-blue-100 rounded-full">
                      <Heart className="w-6 h-6 text-blue-600" />
                    </div>
                  </div>
                  <div className="mt-2 flex items-center text-sm text-blue-600">
                    <Award className="w-4 h-4 mr-1" />
                    <span>Total contributions</span>
                  </div>
                </CardContent>
              </Card>

              <Card className="shadow-lg border-0 hover:shadow-xl transition-all duration-300 border-l-4 border-l-purple-500">
                <CardContent className="pt-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-600">Campaigns Supported</p>
                      <p className="text-2xl font-bold text-gray-900">{stats.campaignsSupported}</p>
                    </div>
                    <div className="p-3 bg-purple-100 rounded-full">
                      <Target className="w-6 h-6 text-purple-600" />
                    </div>
                  </div>
                  <div className="mt-2 flex items-center text-sm text-purple-600">
                    <Target className="w-4 h-4 mr-1" />
                    <span>Different causes</span>
                  </div>
                </CardContent>
              </Card>

              <Card className="shadow-lg border-0 hover:shadow-xl transition-all duration-300 border-l-4 border-l-orange-500">
                <CardContent className="pt-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-600">Average Donation</p>
                      <p className="text-2xl font-bold text-gray-900">₹{stats.averageDonation.toLocaleString()}</p>
                    </div>
                    <div className="p-3 bg-orange-100 rounded-full">
                      <TrendingUp className="w-6 h-6 text-orange-600" />
                    </div>
                  </div>
                  <div className="mt-2 flex items-center text-sm text-orange-600">
                    <Calendar className="w-4 h-4 mr-1" />
                    <span>Per donation</span>
                  </div>
                </CardContent>
              </Card>
            </div>
          )}

          {/* Search and Filters */}
          <Card className="shadow-lg border-0">
            <CardContent className="pt-6">
              <div className="flex flex-col md:flex-row gap-4">
                <div className="flex-1 relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                  <Input
                    placeholder="Search donations by campaign or receipt number..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10 border-gray-300 focus:border-blue-500"
                  />
                </div>
                <div className="flex gap-2">
                  <select
                    value={filterStatus}
                    onChange={(e) => setFilterStatus(e.target.value)}
                    className="px-3 py-2 border border-gray-300 rounded-md focus:border-blue-500 focus:outline-none"
                  >
                    <option value="all">All Status</option>
                    <option value="completed">Completed</option>
                    <option value="pending">Pending</option>
                    <option value="failed">Failed</option>
                  </select>
                  <Button variant="outline" onClick={fetchDonations}>
                    <RefreshCw className="w-4 h-4 mr-2" />
                    Refresh
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Donations List */}
          <Tabs defaultValue="all" className="w-full">
            <TabsList className="grid w-full grid-cols-3 bg-gray-100">
              <TabsTrigger value="all" className="data-[state=active]:bg-blue-600 data-[state=active]:text-white">
                All Donations
              </TabsTrigger>
              <TabsTrigger value="one-time" className="data-[state=active]:bg-green-600 data-[state=active]:text-white">
                One-time
              </TabsTrigger>
              <TabsTrigger
                value="recurring"
                className="data-[state=active]:bg-purple-600 data-[state=active]:text-white"
              >
                Recurring
              </TabsTrigger>
            </TabsList>

            <TabsContent value="all" className="space-y-4">
              {filteredDonations.length === 0 ? (
                <Card className="shadow-lg border-0">
                  <CardContent className="pt-6 text-center py-12">
                    <Heart className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                    <h3 className="text-xl font-semibold text-gray-900 mb-2">No donations found</h3>
                    <p className="text-gray-600 mb-6">
                      {searchTerm || filterStatus !== "all"
                        ? "Try adjusting your search or filters"
                        : "Start making a difference today with your first donation"}
                    </p>
                    <Button asChild className="bg-blue-600 hover:bg-blue-700">
                      <Link href="/donate">Make a Donation</Link>
                    </Button>
                  </CardContent>
                </Card>
              ) : (
                <div className="space-y-4">
                  {filteredDonations.map((donation) => (
                    <Card key={donation._id} className="shadow-lg border-0 hover:shadow-xl transition-all duration-300">
                      <CardContent className="pt-6">
                        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
                          <div className="flex-1">
                            <div className="flex items-center gap-3 mb-2">
                              <div className="p-2 bg-blue-100 rounded-full">
                                <Heart className="w-4 h-4 text-blue-600" />
                              </div>
                              <div>
                                <h3 className="font-semibold text-gray-900">
                                  {donation.campaignId?.title || "General Donation"}
                                </h3>
                                <p className="text-sm text-gray-600">
                                  {donation.campaignId?.category && (
                                    <Badge variant="secondary" className="mr-2">
                                      {donation.campaignId.category}
                                    </Badge>
                                  )}
                                  {new Date(donation.createdAt).toLocaleDateString()}
                                </p>
                              </div>
                            </div>
                            <div className="flex items-center gap-4 text-sm text-gray-600">
                              <span>Receipt: {donation.receiptNumber || "N/A"}</span>
                              <span>•</span>
                              <span>Method: {donation.paymentMethod}</span>
                              {donation.isRecurring && (
                                <>
                                  <span>•</span>
                                  <Badge variant="outline" className="text-purple-600 border-purple-600">
                                    Recurring
                                  </Badge>
                                </>
                              )}
                            </div>
                          </div>
                          <div className="flex items-center gap-4">
                            <div className="text-right">
                              <p className="text-2xl font-bold text-green-600">₹{donation.amount.toLocaleString()}</p>
                              <Badge
                                variant={
                                  donation.status === "completed"
                                    ? "default"
                                    : donation.status === "pending"
                                      ? "secondary"
                                      : "destructive"
                                }
                                className={
                                  donation.status === "completed"
                                    ? "bg-green-100 text-green-800"
                                    : donation.status === "pending"
                                      ? "bg-yellow-100 text-yellow-800"
                                      : ""
                                }
                              >
                                {donation.status}
                              </Badge>
                            </div>
                            {donation.status === "completed" && (
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => downloadReceipt(donation._id)}
                                className="border-blue-600 text-blue-600 hover:bg-blue-50"
                              >
                                <Receipt className="w-4 h-4 mr-2" />
                                Receipt
                              </Button>
                            )}
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}
            </TabsContent>

            <TabsContent value="one-time" className="space-y-4">
              <div className="space-y-4">
                {filteredDonations
                  .filter((d) => !d.isRecurring)
                  .map((donation) => (
                    <Card key={donation._id} className="shadow-lg border-0 hover:shadow-xl transition-all duration-300">
                      <CardContent className="pt-6">
                        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
                          <div className="flex-1">
                            <div className="flex items-center gap-3 mb-2">
                              <div className="p-2 bg-green-100 rounded-full">
                                <CreditCard className="w-4 h-4 text-green-600" />
                              </div>
                              <div>
                                <h3 className="font-semibold text-gray-900">
                                  {donation.campaignId?.title || "General Donation"}
                                </h3>
                                <p className="text-sm text-gray-600">
                                  {donation.campaignId?.category && (
                                    <Badge variant="secondary" className="mr-2">
                                      {donation.campaignId.category}
                                    </Badge>
                                  )}
                                  {new Date(donation.createdAt).toLocaleDateString()}
                                </p>
                              </div>
                            </div>
                          </div>
                          <div className="flex items-center gap-4">
                            <div className="text-right">
                              <p className="text-2xl font-bold text-green-600">₹{donation.amount.toLocaleString()}</p>
                              <Badge variant="default" className="bg-green-100 text-green-800">
                                One-time
                              </Badge>
                            </div>
                            {donation.status === "completed" && (
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => downloadReceipt(donation._id)}
                                className="border-green-600 text-green-600 hover:bg-green-50"
                              >
                                <Receipt className="w-4 h-4 mr-2" />
                                Receipt
                              </Button>
                            )}
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
              </div>
            </TabsContent>

            <TabsContent value="recurring" className="space-y-4">
              <div className="space-y-4">
                {filteredDonations
                  .filter((d) => d.isRecurring)
                  .map((donation) => (
                    <Card key={donation._id} className="shadow-lg border-0 hover:shadow-xl transition-all duration-300">
                      <CardContent className="pt-6">
                        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
                          <div className="flex-1">
                            <div className="flex items-center gap-3 mb-2">
                              <div className="p-2 bg-purple-100 rounded-full">
                                <RefreshCw className="w-4 h-4 text-purple-600" />
                              </div>
                              <div>
                                <h3 className="font-semibold text-gray-900">
                                  {donation.campaignId?.title || "General Donation"}
                                </h3>
                                <p className="text-sm text-gray-600">
                                  {donation.campaignId?.category && (
                                    <Badge variant="secondary" className="mr-2">
                                      {donation.campaignId.category}
                                    </Badge>
                                  )}
                                  {new Date(donation.createdAt).toLocaleDateString()}
                                </p>
                              </div>
                            </div>
                          </div>
                          <div className="flex items-center gap-4">
                            <div className="text-right">
                              <p className="text-2xl font-bold text-purple-600">₹{donation.amount.toLocaleString()}</p>
                              <Badge variant="outline" className="text-purple-600 border-purple-600">
                                Monthly
                              </Badge>
                            </div>
                            <div className="flex gap-2">
                              {donation.status === "completed" && (
                                <Button
                                  variant="outline"
                                  size="sm"
                                  onClick={() => downloadReceipt(donation._id)}
                                  className="border-purple-600 text-purple-600 hover:bg-purple-50"
                                >
                                  <Receipt className="w-4 h-4 mr-2" />
                                  Receipt
                                </Button>
                              )}
                              <Button
                                variant="outline"
                                size="sm"
                                asChild
                                className="border-gray-600 text-gray-600 hover:bg-gray-50 bg-transparent"
                              >
                                <Link href={`/donor/dashboard/subscriptions`}>Manage</Link>
                              </Button>
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  )
}
