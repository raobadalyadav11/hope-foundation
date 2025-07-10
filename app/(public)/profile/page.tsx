"use client"

import { useState, useEffect } from "react"
import { useSession } from "next-auth/react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { toast } from "@/hooks/use-toast"
import { User, Calendar, Heart, Target, Award, Edit, Save, Camera, Shield, Bell, CreditCard } from "lucide-react"

interface UserProfile {
  id: string
  name: string
  email: string
  phone?: string
  address?: string
  bio?: string
  avatar?: string
  role: string
  joinedAt: string
  stats: {
    totalDonated: number
    donationCount: number
    campaignsSupported: number
    volunteerHours: number
  }
  preferences: {
    emailNotifications: boolean
    smsNotifications: boolean
    newsletter: boolean
  }
}

export default function ProfilePage() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const [profile, setProfile] = useState<UserProfile | null>(null)
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
  }, [session, status, router])

  const fetchProfile = async () => {
    try {
      const response = await fetch("/api/user/profile")
      const data = await response.json()
      setProfile(data)
    } catch (error) {
      console.error("Error fetching profile:", error)
      toast({
        title: "Error",
        description: "Failed to load profile",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  const saveProfile = async () => {
    if (!profile) return

    setSaving(true)
    try {
      const response = await fetch("/api/user/profile", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(profile),
      })

      if (response.ok) {
        toast({
          title: "Success",
          description: "Profile updated successfully",
        })
        setEditing(false)
      } else {
        throw new Error("Failed to save profile")
      }
    } catch (error) {
      console.error("Error saving profile:", error)
      toast({
        title: "Error",
        description: "Failed to save profile",
        variant: "destructive",
      })
    } finally {
      setSaving(false)
    }
  }

  const updateProfile = (field: keyof UserProfile, value: any) => {
    if (!profile) return
    setProfile({ ...profile, [field]: value })
  }

  const updatePreferences = (field: string, value: boolean) => {
    if (!profile) return
    setProfile({
      ...profile,
      preferences: {
        ...profile.preferences,
        [field]: value,
      },
    })
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
      </div>
    )
  }

  if (!profile) {
    return <div className="text-center py-12">Failed to load profile</div>
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto space-y-8">
          {/* Header */}
          <div className="text-center">
            <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              My Profile
            </h1>
            <p className="text-gray-600 mt-2">Manage your account settings and preferences</p>
          </div>

          {/* Profile Header Card */}
          <Card className="shadow-xl border-0 bg-gradient-to-r from-blue-600 to-purple-600 text-white">
            <CardContent className="pt-6">
              <div className="flex flex-col md:flex-row items-center gap-6">
                <div className="relative">
                  <Avatar className="w-24 h-24 border-4 border-white shadow-lg">
                    <AvatarImage src={profile.avatar || "/placeholder.svg"} alt={profile.name} />
                    <AvatarFallback className="text-2xl bg-white text-blue-600">
                      {profile.name.charAt(0).toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                  <Button
                    size="sm"
                    className="absolute -bottom-2 -right-2 rounded-full w-8 h-8 bg-white text-blue-600 hover:bg-gray-100"
                  >
                    <Camera className="w-4 h-4" />
                  </Button>
                </div>
                <div className="text-center md:text-left flex-1">
                  <h2 className="text-2xl font-bold">{profile.name}</h2>
                  <p className="text-blue-100">{profile.email}</p>
                  <div className="flex items-center justify-center md:justify-start gap-2 mt-2">
                    <Badge variant="secondary" className="bg-white/20 text-white border-white/30">
                      {profile.role}
                    </Badge>
                    <Badge variant="secondary" className="bg-white/20 text-white border-white/30">
                      <Calendar className="w-3 h-3 mr-1" />
                      Joined {new Date(profile.joinedAt).getFullYear()}
                    </Badge>
                  </div>
                </div>
                <div className="flex gap-2">
                  {editing ? (
                    <>
                      <Button
                        onClick={saveProfile}
                        disabled={saving}
                        className="bg-white text-blue-600 hover:bg-gray-100"
                      >
                        <Save className="w-4 h-4 mr-2" />
                        {saving ? "Saving..." : "Save"}
                      </Button>
                      <Button
                        onClick={() => setEditing(false)}
                        variant="outline"
                        className="border-white text-white hover:bg-white/10"
                      >
                        Cancel
                      </Button>
                    </>
                  ) : (
                    <Button onClick={() => setEditing(true)} className="bg-white text-blue-600 hover:bg-gray-100">
                      <Edit className="w-4 h-4 mr-2" />
                      Edit Profile
                    </Button>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <Card className="shadow-lg border-0 hover:shadow-xl transition-shadow">
              <CardContent className="pt-6 text-center">
                <div className="p-3 bg-green-100 rounded-full w-fit mx-auto mb-3">
                  <CreditCard className="w-6 h-6 text-green-600" />
                </div>
                <div className="text-2xl font-bold text-gray-900">₹{profile.stats.totalDonated.toLocaleString()}</div>
                <p className="text-sm text-gray-600">Total Donated</p>
              </CardContent>
            </Card>
            <Card className="shadow-lg border-0 hover:shadow-xl transition-shadow">
              <CardContent className="pt-6 text-center">
                <div className="p-3 bg-blue-100 rounded-full w-fit mx-auto mb-3">
                  <Heart className="w-6 h-6 text-blue-600" />
                </div>
                <div className="text-2xl font-bold text-gray-900">{profile.stats.donationCount}</div>
                <p className="text-sm text-gray-600">Donations Made</p>
              </CardContent>
            </Card>
            <Card className="shadow-lg border-0 hover:shadow-xl transition-shadow">
              <CardContent className="pt-6 text-center">
                <div className="p-3 bg-purple-100 rounded-full w-fit mx-auto mb-3">
                  <Target className="w-6 h-6 text-purple-600" />
                </div>
                <div className="text-2xl font-bold text-gray-900">{profile.stats.campaignsSupported}</div>
                <p className="text-sm text-gray-600">Campaigns Supported</p>
              </CardContent>
            </Card>
            <Card className="shadow-lg border-0 hover:shadow-xl transition-shadow">
              <CardContent className="pt-6 text-center">
                <div className="p-3 bg-orange-100 rounded-full w-fit mx-auto mb-3">
                  <Award className="w-6 h-6 text-orange-600" />
                </div>
                <div className="text-2xl font-bold text-gray-900">{profile.stats.volunteerHours}</div>
                <p className="text-sm text-gray-600">Volunteer Hours</p>
              </CardContent>
            </Card>
          </div>

          {/* Profile Details */}
          <Tabs defaultValue="personal" className="w-full">
            <TabsList className="grid w-full grid-cols-3 bg-gray-100">
              <TabsTrigger value="personal" className="data-[state=active]:bg-blue-600 data-[state=active]:text-white">
                <User className="w-4 h-4 mr-2" />
                Personal Info
              </TabsTrigger>
              <TabsTrigger
                value="preferences"
                className="data-[state=active]:bg-green-600 data-[state=active]:text-white"
              >
                <Bell className="w-4 h-4 mr-2" />
                Preferences
              </TabsTrigger>
              <TabsTrigger value="security" className="data-[state=active]:bg-red-600 data-[state=active]:text-white">
                <Shield className="w-4 h-4 mr-2" />
                Security
              </TabsTrigger>
            </TabsList>

            <TabsContent value="personal" className="space-y-6">
              <Card className="shadow-lg border-0">
                <CardHeader className="bg-gradient-to-r from-blue-50 to-blue-100 rounded-t-lg">
                  <CardTitle className="text-blue-800">Personal Information</CardTitle>
                  <CardDescription className="text-blue-600">Update your personal details</CardDescription>
                </CardHeader>
                <CardContent className="pt-6 space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <Label htmlFor="name">Full Name</Label>
                      <Input
                        id="name"
                        value={profile.name}
                        onChange={(e) => updateProfile("name", e.target.value)}
                        disabled={!editing}
                        className="border-gray-300 focus:border-blue-500"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="email">Email Address</Label>
                      <Input
                        id="email"
                        type="email"
                        value={profile.email}
                        disabled
                        className="border-gray-300 bg-gray-50"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="phone">Phone Number</Label>
                      <Input
                        id="phone"
                        value={profile.phone || ""}
                        onChange={(e) => updateProfile("phone", e.target.value)}
                        disabled={!editing}
                        className="border-gray-300 focus:border-blue-500"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="role">Role</Label>
                      <Input id="role" value={profile.role} disabled className="border-gray-300 bg-gray-50" />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="address">Address</Label>
                    <Textarea
                      id="address"
                      value={profile.address || ""}
                      onChange={(e) => updateProfile("address", e.target.value)}
                      disabled={!editing}
                      className="border-gray-300 focus:border-blue-500"
                      rows={3}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="bio">Bio</Label>
                    <Textarea
                      id="bio"
                      value={profile.bio || ""}
                      onChange={(e) => updateProfile("bio", e.target.value)}
                      disabled={!editing}
                      className="border-gray-300 focus:border-blue-500"
                      rows={4}
                      placeholder="Tell us about yourself..."
                    />
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="preferences" className="space-y-6">
              <Card className="shadow-lg border-0">
                <CardHeader className="bg-gradient-to-r from-green-50 to-green-100 rounded-t-lg">
                  <CardTitle className="text-green-800">Notification Preferences</CardTitle>
                  <CardDescription className="text-green-600">Choose how you want to be notified</CardDescription>
                </CardHeader>
                <CardContent className="pt-6 space-y-6">
                  <div className="space-y-4">
                    <div className="flex items-center justify-between p-4 bg-green-50 rounded-lg">
                      <div>
                        <Label className="text-sm font-medium">Email Notifications</Label>
                        <p className="text-sm text-gray-600">Receive updates about donations and campaigns via email</p>
                      </div>
                      <input
                        type="checkbox"
                        checked={profile.preferences.emailNotifications}
                        onChange={(e) => updatePreferences("emailNotifications", e.target.checked)}
                        className="w-4 h-4 text-green-600 rounded focus:ring-green-500"
                      />
                    </div>
                    <div className="flex items-center justify-between p-4 bg-green-50 rounded-lg">
                      <div>
                        <Label className="text-sm font-medium">SMS Notifications</Label>
                        <p className="text-sm text-gray-600">Get important updates via text message</p>
                      </div>
                      <input
                        type="checkbox"
                        checked={profile.preferences.smsNotifications}
                        onChange={(e) => updatePreferences("smsNotifications", e.target.checked)}
                        className="w-4 h-4 text-green-600 rounded focus:ring-green-500"
                      />
                    </div>
                    <div className="flex items-center justify-between p-4 bg-green-50 rounded-lg">
                      <div>
                        <Label className="text-sm font-medium">Newsletter</Label>
                        <p className="text-sm text-gray-600">Subscribe to our monthly newsletter</p>
                      </div>
                      <input
                        type="checkbox"
                        checked={profile.preferences.newsletter}
                        onChange={(e) => updatePreferences("newsletter", e.target.checked)}
                        className="w-4 h-4 text-green-600 rounded focus:ring-green-500"
                      />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="security" className="space-y-6">
              <Card className="shadow-lg border-0">
                <CardHeader className="bg-gradient-to-r from-red-50 to-red-100 rounded-t-lg">
                  <CardTitle className="text-red-800">Security Settings</CardTitle>
                  <CardDescription className="text-red-600">Manage your account security</CardDescription>
                </CardHeader>
                <CardContent className="pt-6 space-y-6">
                  <div className="space-y-4">
                    <div className="p-4 bg-red-50 rounded-lg">
                      <h4 className="font-medium text-red-800 mb-2">Change Password</h4>
                      <p className="text-sm text-red-600 mb-4">Update your password to keep your account secure</p>
                      <Button className="bg-red-600 hover:bg-red-700">Change Password</Button>
                    </div>
                    <div className="p-4 bg-yellow-50 rounded-lg">
                      <h4 className="font-medium text-yellow-800 mb-2">Two-Factor Authentication</h4>
                      <p className="text-sm text-yellow-600 mb-4">Add an extra layer of security to your account</p>
                      <Button
                        variant="outline"
                        className="border-yellow-600 text-yellow-600 hover:bg-yellow-50 bg-transparent"
                      >
                        Enable 2FA
                      </Button>
                    </div>
                    <div className="p-4 bg-gray-50 rounded-lg">
                      <h4 className="font-medium text-gray-800 mb-2">Login Sessions</h4>
                      <p className="text-sm text-gray-600 mb-4">Manage your active login sessions</p>
                      <Button variant="outline">View Sessions</Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  )
}
