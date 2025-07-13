"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { User, Heart, Calendar, TrendingUp, Download } from "lucide-react"
import { toast } from "sonner"
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts"

interface DonorProfile {
  user: {
    _id: string
    name: string
    email: string
    phone?: string
    address?: string
    profileImage?: string
    createdAt: string
  }
  stats: {
    totalDonated: number
    donationCount: number
    averageDonation: number
  }
  recentDonations: Array<{
    _id: string
    amount: number
    campaignId?: {
      title: string
      image: string
    }
    createdAt: string
    receiptNumber: string
  }>
  donationHistory: Array<{
    _id: {
      year: number
      month: number
    }
    amount: number
    count: number
  }>
}

export default function DonorProfilePage() {
  const [profile, setProfile] = useState<DonorProfile | null>(null)
  const [loading, setLoading] = useState(true)
  const [editing, setEditing] = useState(false)
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    address: "",
    profileImage: "",
  })

  const fetchProfile = async () => {
    try {
      setLoading(true)
      const response = await fetch("/api/donor/profile")
      const data = await response.json()

      if (response.ok) {
        setProfile(data)
        setFormData({
          name: data.user.name,
          phone: data.user.phone || "",
          address: data.user.address || "",
          profileImage: data.user.profileImage || "",
        })
      } else {
        toast.error(data.error || "Failed to fetch profile")
      }
    } catch (error) {
      toast.error("Failed to fetch profile")
    } finally {
      setLoading(false)
    }
  }

  const handleUpdateProfile = async () => {
    try {
      const response = await fetch("/api/donor/profile", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      })

      const data = await response.json()

      if (response.ok) {
        toast.success("Profile updated successfully")
        setEditing(false)
        fetchProfile()
      } else {
        toast.error(data.error || "Failed to update profile")
      }
    } catch (error) {
      toast.error("Failed to update profile")
    }
  }

  const downloadReceipt = async (donationId: string) => {
    try {
      const response = await fetch("/api/donations/receipt", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ donationId }),
      })

      const data = await response.json()

      if (response.ok) {
        // Open receipt in new window
        const receiptWindow = window.open("", "_blank")
        if (receiptWindow) {
          receiptWindow.document.write(atob(data.receipt))
          receiptWindow.document.close()
        } else {
          toast.error("Please allow pop-ups to view the receipt")
        }
      } else {
        toast.error(data.error || "Failed to generate receipt")
      }
    } catch (error) {
      toast.error("Failed to download receipt")
    }
  }

  const formatChartData = (history: DonorProfile["donationHistory"]) => {
    return history.map((item) => ({
      month: `${item._id.year}-${item._id.month.toString().padStart(2, "0")}`,
      amount: item.amount,
      count: item.count,
    }))
  }

  useEffect(() => {
    fetchProfile()
  }, [])

  if (loading) {
    return <div>Loading...</div>
  }

  if (!profile) {
    return <div>Profile not found</div>
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">My Profile</h1>
          <p className="text-muted-foreground">Manage your donor profile and view donation history</p>
        </div>
      </div>

      {/* Profile Card */}
      <Card>
        <CardHeader>
          <CardTitle>Profile Information</CardTitle>
          <CardDescription>Your personal information and account details</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-start gap-6">
            <Avatar className="h-24 w-24">
              <AvatarImage src={profile.user.profileImage || "/placeholder.svg"} />
              <AvatarFallback>
                <User className="h-12 w-12" />
              </AvatarFallback>
            </Avatar>
            <div className="flex-1 space-y-4">
              {editing ? (
                <div className="grid gap-4 md:grid-cols-2">
                  <div>
                    <Label htmlFor="name">Name</Label>
                    <Input
                      id="name"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    />
                  </div>
                  <div>
                    <Label htmlFor="phone">Phone</Label>
                    <Input
                      id="phone"
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    />
                  </div>
                  <div className="md:col-span-2">
                    <Label htmlFor="address">Address</Label>
                    <Textarea
                      id="address"
                      value={formData.address}
                      onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                    />
                  </div>
                  <div className="md:col-span-2">
                    <Label htmlFor="profileImage">Profile Image URL</Label>
                    <Input
                      id="profileImage"
                      value={formData.profileImage}
                      onChange={(e) => setFormData({ ...formData, profileImage: e.target.value })}
                    />
                  </div>
                  <div className="md:col-span-2 flex gap-2">
                    <Button onClick={handleUpdateProfile}>Save Changes</Button>
                    <Button variant="outline" onClick={() => setEditing(false)}>
                      Cancel
                    </Button>
                  </div>
                </div>
              ) : (
                <div className="space-y-2">
                  <h3 className="text-xl font-semibold">{profile.user.name}</h3>
                  <p className="text-muted-foreground">{profile.user.email}</p>
                  {profile.user.phone && <p className="text-muted-foreground">{profile.user.phone}</p>}
                  {profile.user.address && <p className="text-muted-foreground">{profile.user.address}</p>}
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Calendar className="h-4 w-4" />
                    Member since {new Date(profile.user.createdAt).toLocaleDateString()}
                  </div>
                  <Button onClick={() => setEditing(true)} className="mt-4">
                    Edit Profile
                  </Button>
                </div>
              )}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Statistics Cards */}
      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Donated</CardTitle>
            <Heart className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">₹{profile.stats.totalDonated.toLocaleString()}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Donations</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{profile.stats.donationCount}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Average Donation</CardTitle>
            <Heart className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">₹{Math.round(profile.stats.averageDonation).toLocaleString()}</div>
          </CardContent>
        </Card>
      </div>

      {/* Donation History Chart */}
      {profile.donationHistory.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Donation History</CardTitle>
            <CardDescription>Your donation activity over time</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={formatChartData(profile.donationHistory)}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip
                  formatter={(value, name) => [
                    name === "amount" ? `₹${value}` : value,
                    name === "amount" ? "Amount" : "Count",
                  ]}
                />
                <Line type="monotone" dataKey="amount" stroke="#8884d8" strokeWidth={2} />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      )}

      {/* Recent Donations */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Donations</CardTitle>
          <CardDescription>Your latest donation activities</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Campaign</TableHead>
                <TableHead>Amount</TableHead>
                <TableHead>Date</TableHead>
                <TableHead>Receipt</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {profile.recentDonations.map((donation) => (
                <TableRow key={donation._id}>
                  <TableCell>
                    <div className="flex items-center gap-3">
                      {donation.campaignId?.image && (
                        <img
                          src={donation.campaignId.image || "/placeholder.svg"}
                          alt={donation.campaignId.title}
                          className="h-10 w-10 rounded object-cover"
                        />
                      )}
                      <div>
                        <div className="font-medium">{donation.campaignId?.title || "General Donation"}</div>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="font-medium">₹{donation.amount.toLocaleString()}</div>
                  </TableCell>
                  <TableCell>{new Date(donation.createdAt).toLocaleDateString()}</TableCell>
                  <TableCell>
                    <Badge variant="outline">{donation.receiptNumber}</Badge>
                  </TableCell>
                  <TableCell>
                    <Button variant="outline" size="sm" onClick={() => downloadReceipt(donation._id)}>
                      <Download className="h-4 w-4 mr-1" />
                      Receipt
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  )
}
