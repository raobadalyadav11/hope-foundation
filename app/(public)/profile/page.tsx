"use client"

import { useState, useEffect } from "react"
import { useSession } from "next-auth/react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Separator } from "@/components/ui/separator"
import { User, Calendar, Heart, Users, Target, Award, Edit, Shield } from "lucide-react"
import { toast } from "sonner"

interface UserProfile {
  _id: string
  name: string
  email: string
  phone?: string
  address?: string
  profileImage?: string
  role: string
  skills?: string[]
  availability?: string
  experience?: string
  motivation?: string
  isActive: boolean
  isVerified: boolean
  createdAt: string
  lastLogin?: string
}

interface UserStats {
  totalDonations: number
  totalAmount: number
  volunteerHours: number
  campaignsSupported: number
  eventsAttended: number
  tasksCompleted: number
}

export default function ProfilePage() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const [profile, setProfile] = useState<UserProfile | null>(null)
  const [stats, setStats] = useState<UserStats | null>(null)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [editing, setEditing] = useState(false)

  useEffect(() => {
    if (status === "loading") return

    if (!session) {
      router.push("/auth/signin")
      return
    }

    fetchProfile()
    fetchStats()
  }, [session, status, router])

  const fetchProfile = async () => {
    try {
      const response = await fetch('/api/user/profile')
      const data = await response.json()
      
      if (response.ok) {
        setProfile(data.user)
      } else {
        toast.error(data.error || 'Failed to load profile')
      }
    } catch (error) {
      console.error('Error fetching profile:', error)
      toast.error('Failed to load profile')
    } finally {
      setLoading(false)
    }
  }

  const fetchStats = async () => {
    try {
      const response = await fetch('/api/user/stats')
      const data = await response.json()
      
      if (response.ok) {
        setStats(data.stats)
      }
    } catch (error) {
      console.error('Error fetching stats:', error)
    }
  }

  const updateProfile = async () => {
    if (!profile) return

    try {
      setSaving(true)
      const response = await fetch('/api/user/profile', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(profile)
      })

      if (response.ok) {
        toast.success('Profile updated successfully')
        setEditing(false)
      } else {
        const data = await response.json()
        toast.error(data.error || 'Failed to update profile')
      }
    } catch (error) {
      console.error('Error updating profile:', error)
      toast.error('Failed to update profile')
    } finally {
      setSaving(false)
    }
  }

  const handleInputChange = (field: keyof UserProfile, value: any) => {
    if (!profile) return
    setProfile({ ...profile, [field]: value })
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
      </div>
    )
  }

  if (!profile) {
    return (
      <div className="text-center py-12">
        <User className="w-12 h-12 text-gray-400 mx-auto mb-4" />
        <h3 className="text-lg font-semibold">Profile not found</h3>
        <Button onClick={fetchProfile} className="mt-4">
          Retry
        </Button>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white py-12">
      <div className="container mx-auto px-4 max-w-6xl">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-2">
            My Profile
          </h1>
          <p className="text-gray-600">Manage your account settings and preferences</p>
        </div>

        {/* Profile Header Card */}
        <Card className="mb-8 hover:shadow-xl transition-all duration-300 border-0 shadow-lg overflow-hidden">
          <CardContent className="p-0">
            <div className="h-32 bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 relative">
              <div className="absolute inset-0 bg-black/10"></div>
              <div className="absolute bottom-0 left-0 right-0 p-6">
                <div className="flex items-end gap-6">
                  <Avatar className="w-24 h-24 border-4 border-white shadow-xl">
                    <AvatarImage src={profile.profileImage || "/placeholder.svg"} alt={profile.name} />
                    <AvatarFallback className="text-2xl font-bold bg-gradient-to-r from-blue-500 to-purple-600 text-white">
                      {profile.name.charAt(0).toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1 text-white pb-2">
                    <h2 className="text-2xl font-bold">{profile.name}</h2>
                    <p className="text-blue-100">{profile.email}</p>
                    <div className="flex items-center gap-4 mt-2">
                      <Badge className="bg-white/20 text-white border-white/30">
                        {profile.role.charAt(0).toUpperCase() + profile.role.slice(1)}
                      </Badge>
                      {profile.isVerified && (
                        <Badge className="bg-green-500/20 text-green-100 border-green-300/30">
                          <Shield className="w-3 h-3 mr-1" />
                          Verified
                        </Badge>
                      )}
                    </div>
                  </div>
                  <Button
                    variant="outline"
                    onClick={() => setEditing(!editing)}
                    className="border-white/30 text-white hover:bg-white/10 backdrop-blur-sm"
                  >
                    <Edit className="w-4 h-4 mr-2" />
                    {editing ? 'Cancel' : 'Edit Profile'}
                  </Button>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Stats Cards */}
        {stats && (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 mb-8">
            {[
              { label: "Donations", value: stats.totalDonations, icon: Heart, color: "from-red-500 to-pink-600" },
              { label: "Amount", value: `₹${stats.totalAmount.toLocaleString()}`, icon: Target, color: "from-green-500 to-emerald-600" },
              { label: "Vol. Hours", value: stats.volunteerHours, icon: Users, color: "from-blue-500 to-indigo-600" },
              { label: "Campaigns", value: stats.campaignsSupported, icon: Target, color: "from-purple-500 to-violet-600" },
              { label: "Events", value: stats.eventsAttended, icon: Calendar, color: "from-yellow-500 to-orange-600" },
              { label: "Tasks", value: stats.tasksCompleted, icon: Award, color: "from-teal-500 to-cyan-600" }
            ].map((stat, index) => (
              <Card key={index} className="hover:shadow-lg transition-all duration-300 border-0 shadow-md">
                <CardContent className="p-4 text-center">
                  <div className={`w-10 h-10 mx-auto mb-2 rounded-full bg-gradient-to-r ${stat.color} flex items-center justify-center`}>
                    <stat.icon className="w-5 h-5 text-white" />
                  </div>
                  <div className="text-lg font-bold text-gray-900">{stat.value}</div>
                  <div className="text-xs text-gray-600">{stat.label}</div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        {/* Profile Tabs */}
        <Tabs defaultValue="personal" className="w-full">
          <TabsList className="grid w-full grid-cols-4 bg-gray-100 rounded-xl p-1 mb-8">
            <TabsTrigger value="personal" className="rounded-lg">Personal Info</TabsTrigger>
            <TabsTrigger value="volunteer" className="rounded-lg">Volunteer Info</TabsTrigger>
            <TabsTrigger value="security" className="rounded-lg">Security</TabsTrigger>
            <TabsTrigger value="preferences" className="rounded-lg">Preferences</TabsTrigger>
          </TabsList>

          <TabsContent value="personal" className="space-y-6">
            <Card className="hover:shadow-xl transition-all duration-300 border-0 shadow-lg">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <User className="w-5 h-5 text-blue-600" />
                  Personal Information
                </CardTitle>
                <CardDescription>Update your personal details and contact information</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="name">Full Name</Label>
                    <Input
                      id="name"
                      value={profile.name}
                      onChange={(e) => handleInputChange('name', e.target.value)}
                      disabled={!editing}
                      className={editing ? 'border-blue-300 focus:border-blue-500' : 'bg-gray-50'}
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="email">Email Address</Label>
                    <Input
                      id="email"
                      type="email"
                      value={profile.email}
                      disabled
                      className="bg-gray-50"
                    />
                    <p className="text-xs text-gray-500">Email cannot be changed</p>
                  </div>
                </div>

                <div className="grid md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="phone">Phone Number</Label>
                    <Input
                      id="phone"
                      value={profile.phone || ''}
                      onChange={(e) => handleInputChange('phone', e.target.value)}
                      disabled={!editing}
                      className={editing ? 'border-blue-300 focus:border-blue-500' : 'bg-gray-50'}
                      placeholder="Enter phone number"
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="role">Role</Label>
                    <Input
                      id="role"
                      value={profile.role.charAt(0).toUpperCase() + profile.role.slice(1)}
                      disabled
                      className="bg-gray-50"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="address">Address</Label>
                  <Textarea
                    id="address"
                    value={profile.address || ''}
                    onChange={(e) => handleInputChange('address', e.target.value)}
                    disabled={!editing}
                    className={editing ? 'border-blue-300 focus:border-blue-500' : 'bg-gray-50'}
                    placeholder="Enter your address"
                    rows={3}
                  />
                </div>

                <Separator />

                <div className="space-y-2">
                  <Label htmlFor="profileImage">Profile Image URL</Label>
                  <div className="flex gap-2">
                    <Input
                      id="profileImage"
                      value={profile.profileImage ||
