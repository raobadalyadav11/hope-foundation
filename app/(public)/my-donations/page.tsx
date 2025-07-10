"use client"

import { useState, useEffect } from "react"
import { useSession } from "next-auth/react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Search, Heart, DollarSign, Receipt, TrendingUp, Award, Target, RefreshCw } from "lucide-react"
import { format } from "date-fns"

export default function MyDonationsPage() {
  const { data: session } = useSession()
  const [donations, setDonations] = useState<any[]>([])
  const [subscriptions, setSubscriptions] = useState<any[]>([])
  const [stats, setStats] = useState<any>({})
  const [isLoading, setIsLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")
  const [sortBy, setSortBy] = useState("date-desc")

  useEffect(() => {
    if (session?.user) {
      fetchDonations()
    }
  }, [session])

  const fetchDonations = async () => {
    try {
      const [donationsRes, subscriptionsRes] = await Promise.all([
        fetch(`/api/donations/user/${session?.user?.id}`),
        fetch(`/api/donor/subscriptions`)
      ])
      
      const donationsData = await donationsRes.json()
      const subscriptionsData = await subscriptionsRes.json()
      
      setDonations(donationsData.donations || [])
      setSubscriptions(subscriptionsData.subscriptions || [])
      setStats(donationsData.stats || {})
    } catch (error) {
      console.error('Failed to fetch donations:', error)
      // Mock data for demo
      setDonations([
        {
          id: '1',
          amount: 5000,
          campaign: { title: 'Education Fund', id: 'edu-1' },
          status: 'completed',
          paymentMethod: 'razorpay',
          transactionId: 'TXN123456789',
          createdAt: '2024-01-15T10:30:00Z',
          receiptUrl: '/receipts/receipt-1.pdf',
          isRecurring: false,
          taxDeductible: true
        },
        {
          id: '2',
          amount: 2500,
          campaign: { title: 'Healthcare Initiative', id: 'health-1' },
          status: 'completed',
          paymentMethod: 'razorpay',
          transactionId: 'TXN123456790',
          createdAt: '2024-01-10T14:20:00Z',
          receiptUrl: '/receipts/receipt-2.pdf',
          isRecurring: true,
          taxDeductible: true
        },
        {
          id: '3',
          amount: 1000,
          campaign: { title: 'Clean Water Project', id: 'water-1' },
          status: 'pending',
          paymentMethod: 'razorpay',
          transactionId: 'TXN123456791',
          createdAt: '2024-01-05T09:15:00Z',
          receiptUrl: null,
          isRecurring: false,
          taxDeductible: true
        }
      ])
      
      setSubscriptions([
        {
          id: 'sub-1',
          amount: 2500,
          campaign: { title: 'Healthcare Initiative', id: 'health-1' },
          status: 'active',
          frequency: 'monthly',
          nextPayment: '2024-02-10T14:20:00Z',
          createdAt: '2024-01-10T14:20:00Z',
          totalPaid: 7500,
          paymentsCount: 3
        }
      ])
      
      setStats({
        totalDonated: 8500,
        donationCount: 3,
        averageDonation: 2833,
        taxSavings: 2125,
        impactScore: 85,
        campaignsSupported: 3,
        recurringDonations: 1,
        thisYearTotal: 8500
      })
    } finally {
      setIsLoading(false)
    }
  }

  const downloadReceipt = async (donationId: string) => {
    try {
      const response = await fetch(`/api/donations/receipt/${donationId}`)
      const blob = await response.blob()
      const url = window.URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = `donation-receipt-${donationId}.pdf`
      document.body.appendChild(a)
      a.click()
      window.URL.revokeObjectURL(url)
      document.body.removeChild(a)
    } catch (error) {
      console.error('Failed to download receipt:', error)
    }
  }

  const filteredDonations = donations.filter(donation => {
    const matchesSearch = donation.campaign.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         donation.transactionId.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesStatus = statusFilter === 'all' || donation.status === statusFilter
    return matchesSearch && matchesStatus
  })

  const sortedDonations = [...filteredDonations].sort((a, b) => {
    switch (sortBy) {
      case 'date-desc':
        return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      case 'date-asc':
        return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
      case 'amount-desc':
        return b.amount - a.amount
      case 'amount-asc':
        return a.amount - b.amount
      default:
        return 0
    }
  })

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 p-6">
        <div className="max-w-6xl mx-auto">
          <div className="animate-pulse space-y-6">
            <div className="h-8 bg-gray-200 rounded w-1/4"></div>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              {[...Array(4)].map((_, i) => (
                <div key={i} className="h-32 bg-gray-200 rounded-xl"></div>
              ))}
            </div>
            <div className="h-96 bg-gray-200 rounded-xl"></div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 p-6">
      <div className="max-w-6xl mx-auto space-y-8">
        {/* Header */}
        <div className="text-center space-y-4">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 bg-clip-text text-transparent">
            My Donations
          </h1>
          <p className="text-gray-600">Track your contributions and impact</p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card className="bg-gradient-to-br from-blue-500 to-blue-600 text-white border-0 shadow-xl hover:shadow-2xl transition-all duration-300 hover:scale-105">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-blue-100 text-sm font-medium">Total Donated</p>
                  <p className="text-3xl font-bold">₹{stats.totalDonated?.toLocaleString()}</p>
                  <div className="flex items-center mt-2">
                    <TrendingUp className="h-4 w-4 mr-1" />
                    <span className="text-sm">This year</span>
                  </div>
                </div>
                <DollarSign className="h-12 w-12 text-blue-200" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-green-500 to-green-600 text-white border-0 shadow-xl hover:shadow-2xl transition-all duration-300 hover:scale-105">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-green-100 text-sm font-medium">Donations Made</p>
                  <p className="text-3xl font-bold">{stats.donationCount}</p>
                  <div className="flex items-center mt-2">
                    <Heart className="h-4 w-4 mr-1" />
                    <span className="text-sm">Avg: ₹{stats.averageDonation?.toLocaleString()}</span>
                  </div>
                </div>
                <Heart className="h-12 w-12 text-green-200" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-purple-500 to-purple-600 text-white border-0 shadow-xl hover:shadow-2xl transition-all duration-300 hover:scale-105">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-purple-100 text-sm font-medium">Tax Savings</p>
                  <p className="text-3xl font-bold">₹{stats.taxSavings?.toLocaleString()}</p>
                  <div className="flex items-center mt-2">
                    <Receipt className="h-4 w-4 mr-1" />
                    <span className="text-sm">80G Benefits</span>
                  </div>
                </div>
                <Receipt className="h-12 w-12 text-purple-200" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-orange-500 to-orange-600 text-white border-0 shadow-xl hover:shadow-2xl transition-all duration-300 hover:scale-105">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-orange-100 text-sm font-medium">Impact Score</p>
                  <p className="text-3xl font-bold">{stats.impactScore}</p>
                  <div className="flex items-center mt-2">
                    <Award className="h-4 w-4 mr-1" />
                    <span className="text-sm">{stats.campaignsSupported} campaigns</span>
                  </div>
                </div>
                <Target className="h-12 w-12 text-orange-200" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Main Content */}
        <Tabs defaultValue="donations" className="space-y-6">
          <TabsList className="bg-white/80 backdrop-blur-sm border border-gray-200 p-1 rounded-xl">
            <TabsTrigger value="donations" className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-blue-500 data-[state=active]:to-purple-500 data-[state=active]:text-white rounded-lg">
              <Heart className="h-4 w-4 mr-2" />
              Donations
            </TabsTrigger>
            <TabsTrigger value="subscriptions" className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-green-500 data-[state=active]:to-teal-500 data-[state=active]:text-white rounded-lg">
              <RefreshCw className="h-4 w-4 mr-2" />
              Recurring
            </TabsTrigger>
          </TabsList>

          <TabsContent value="donations" className="space-y-6">
            <Card className="bg-white/80 backdrop-blur-sm border-gray-200 shadow-xl">
              <CardHeader className="pb-4">
                <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
                  <div>
                    <CardTitle className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                      Donation History
                    </CardTitle>
                    <CardDescription>View and manage all your donations</CardDescription>
                  </div>
                  
                  <div className="flex items-center gap-3">
                    <div className="relative">
                      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                      <Input
                        placeholder="Search donations..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="pl-10 bg-white/80 border-gray-300"
                      />
                    </div>
                    
                    <Select value={statusFilter} onValueChange={setStatusFilter}>
                      <SelectTrigger className="w-32 bg-white/80 border-gray-300">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Status</SelectItem>
                        <SelectItem value="completed">Completed</SelectItem>
                        <SelectItem value="pending">Pending</SelectItem>
                        <SelectItem value="failed">Failed</SelectItem>
                      </SelectContent>
                    </Select>
                    
                    <Select value={sortBy} onValueChange={setSortBy}>
                      <SelectTrigger className="w-40 bg-white/80 border-gray-300">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="date-desc">Latest First</SelectItem>
                        <SelectItem value="date-asc">Oldest First</SelectItem>
                        <SelectItem value="amount-desc">Highest Amount</SelectItem>
                        <SelectItem value="amount-asc">Lowest Amount</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                {sortedDonations.length === 0 ? (
                  <div className="text-center py-12">
                    <Heart className="h-16 w-16 text-gray-300 mx-auto mb-4" />
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">No donations found</h3>
                    <p className="text-gray-500">Start making a difference by donating to a cause you care about.</p>
                    <Button className="mt-4 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700">
                      Make Your First Donation
                    </Button>
                  </div>
                ) : (
                  sortedDonations.map((donation) => (
                    <div key={donation.id} className="p-6 rounded-xl bg-gradient-to-r from-gray-50 to-gray-100 border border-gray-200 hover:shadow-lg transition-all duration-300">
                      <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center space-x-4">
                          <div className="p-3 rounded-full bg-gradient-to-r from-blue-500 to-purple-500">
                            <Heart className="h-6 w-6 text-white" />
                          </div>
                          <div>
                            <h3 className="font-bold text-lg text-gray-900">{donation.campaign.title}</h3>
                            <p className="text-sm text-gray-500">
                              {format(new Date(donation.createdAt), 'PPP')} • {donation.transactionId}
                            </p>
                          </div>
                        </div>
                        
                        <div className="text-right">
                          <div className="text-2xl font-bold text-gray-900">₹{donation.amount.toLocaleString()}</div>
                          <div className="flex items-center space-x-2 mt-1">
                            <Badge 
                              variant={donation.status === 'completed' ? 'default' : 
                                      donation.status === 'pending' ? 'secondary' : 'destructive'}
                              className={
                                donation.status === 'completed' ? 'bg-green-100 text-green-700 border-green-200' :
                                donation.status === 'pending' ? 'bg-yellow-100 text-yellow-700 border-yellow-200' :
                                'bg-red-100 text-red-700 border-red-200'
                              }
                            >\
