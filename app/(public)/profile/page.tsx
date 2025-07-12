"use client"

import { useState, useEffect } from "react"
import { useSession } from "next-auth/react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Switch } from "@/components/ui/switch"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Separator } from "@/components/ui/separator"
import { useToast } from "@/hooks/use-toast"
import { User, Save, Mail, Phone, Calendar, Heart, Shield, Bell, Camera, Award, Target } from "lucide-react"

export default function ProfilePage() {
  const { data: session, update } = useSession()
  const [profile, setProfile] = useState<any>({})
  const [isLoading, setIsLoading] = useState(true)
  const [isSaving, setIsSaving] = useState(false)
  const { toast } = useToast()

  useEffect(() => {
    if (session?.user) {
      fetchProfile()
    }
  }, [session])

  const fetchProfile = async () => {
    try {
      const response = await fetch("/api/user/profile")
      if (response.ok) {
        const data = await response.json()
        setProfile(data)
      } else {
        throw new Error('Failed to fetch profile')
      }
    } catch (error) {
      console.error("Failed to fetch profile:", error)
      toast({
        title: "Error",
        description: "Failed to load profile data. Please refresh the page.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const saveProfile = async (section: string, data: any) => {
    setIsSaving(true)
    try {
      const response = await fetch("/api/user/profile", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ section, data }),
      })

      if (response.ok) {
        setProfile((prev: any) => ({ ...prev, [section]: data }))

        // Update session if personal info changed
        if (section === "personal") {
          await update({
            name: data.name,
            image: data.avatar,
          })
        }

        toast({
          title: "Profile updated",
          description: "Your changes have been saved successfully.",
        })
      } else {
        throw new Error("Failed to save profile")
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to save profile. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsSaving(false)
    }
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 p-6">
        <div className="max-w-4xl mx-auto">
          <div className="animate-pulse space-y-6">
            <div className="h-8 bg-gray-200 rounded w-1/4"></div>
            <div className="h-96 bg-gray-200 rounded-xl"></div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 p-6">
      <div className="max-w-4xl mx-auto space-y-8">
        {/* Header */}
        <div className="text-center space-y-4">
          <div className="relative inline-block">
            <Avatar className="h-24 w-24 border-4 border-white shadow-xl">
              <AvatarImage src={profile.personal?.avatar || "/placeholder.svg"} alt={profile.personal?.name} />
              <AvatarFallback className="text-2xl bg-gradient-to-br from-blue-500 to-purple-500 text-white">
                {profile.personal?.name?.charAt(0)?.toUpperCase() || "U"}
              </AvatarFallback>
            </Avatar>
            <Button
              size="sm"
              className="absolute -bottom-2 -right-2 rounded-full h-8 w-8 p-0 bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600"
            >
              <Camera className="h-4 w-4" />
            </Button>
          </div>

          <div>
            <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 bg-clip-text text-transparent">
              {profile.personal?.name || "User Profile"}
            </h1>
            <p className="text-gray-600 mt-1">
              Member since {new Date(profile.stats?.memberSince).toLocaleDateString()}
            </p>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mt-6">
            <Card className="bg-gradient-to-br from-blue-500 to-blue-600 text-white border-0 shadow-lg">
              <CardContent className="p-4 text-center">
                <Heart className="h-6 w-6 mx-auto mb-2 text-blue-200" />
                <div className="text-2xl font-bold">₹{(profile.stats?.totalDonations / 1000).toFixed(0)}K</div>
                <div className="text-xs text-blue-200">Total Donated</div>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-br from-green-500 to-green-600 text-white border-0 shadow-lg">
              <CardContent className="p-4 text-center">
                <Target className="h-6 w-6 mx-auto mb-2 text-green-200" />
                <div className="text-2xl font-bold">{profile.stats?.donationCount}</div>
                <div className="text-xs text-green-200">Donations</div>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-br from-purple-500 to-purple-600 text-white border-0 shadow-lg">
              <CardContent className="p-4 text-center">
                <Award className="h-6 w-6 mx-auto mb-2 text-purple-200" />
                <div className="text-2xl font-bold">{profile.stats?.volunteerHours}</div>
                <div className="text-xs text-purple-200">Volunteer Hours</div>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-br from-orange-500 to-orange-600 text-white border-0 shadow-lg">
              <CardContent className="p-4 text-center">
                <Heart className="h-6 w-6 mx-auto mb-2 text-orange-200" />
                <div className="text-2xl font-bold">{profile.stats?.campaignsSupported}</div>
                <div className="text-xs text-orange-200">Campaigns</div>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-br from-pink-500 to-pink-600 text-white border-0 shadow-lg">
              <CardContent className="p-4 text-center">
                <Calendar className="h-6 w-6 mx-auto mb-2 text-pink-200" />
                <div className="text-2xl font-bold">{profile.stats?.eventsAttended}</div>
                <div className="text-xs text-pink-200">Events</div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Profile Tabs */}
        <Tabs defaultValue="personal" className="space-y-6">
          <TabsList className="bg-white/80 backdrop-blur-sm border border-gray-200 p-1 rounded-xl grid grid-cols-3 w-full">
            <TabsTrigger
              value="personal"
              className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-blue-500 data-[state=active]:to-purple-500 data-[state=active]:text-white rounded-lg"
            >
              <User className="h-4 w-4 mr-2" />
              Personal Info
            </TabsTrigger>
            <TabsTrigger
              value="preferences"
              className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-green-500 data-[state=active]:to-teal-500 data-[state=active]:text-white rounded-lg"
            >
              <Bell className="h-4 w-4 mr-2" />
              Preferences
            </TabsTrigger>
            <TabsTrigger
              value="privacy"
              className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-red-500 data-[state=active]:to-pink-500 data-[state=active]:text-white rounded-lg"
            >
              <Shield className="h-4 w-4 mr-2" />
              Privacy
            </TabsTrigger>
          </TabsList>

          {/* Personal Information */}
          <TabsContent value="personal">
            <Card className="bg-white/80 backdrop-blur-sm border-gray-200 shadow-xl">
              <CardHeader className="pb-6">
                <CardTitle className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent flex items-center">
                  <User className="h-6 w-6 mr-3 text-blue-600" />
                  Personal Information
                </CardTitle>
                <CardDescription>Update your personal details and contact information</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="name" className="text-sm font-medium text-gray-700">
                      Full Name
                    </Label>
                    <Input
                      id="name"
                      value={profile.personal?.name || ""}
                      onChange={(e) =>
                        setProfile((prev: any) => ({
                          ...prev,
                          personal: { ...prev.personal, name: e.target.value },
                        }))
                      }
                      className="bg-white/80 border-gray-300 focus:border-blue-500 focus:ring-blue-500"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="email" className="text-sm font-medium text-gray-700">
                      Email Address
                    </Label>
                    <Input
                      id="email"
                      type="email"
                      value={profile.personal?.email || ""}
                      onChange={(e) =>
                        setProfile((prev: any) => ({
                          ...prev,
                          personal: { ...prev.personal, email: e.target.value },
                        }))
                      }
                      className="bg-white/80 border-gray-300 focus:border-blue-500 focus:ring-blue-500"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="phone" className="text-sm font-medium text-gray-700">
                      Phone Number
                    </Label>
                    <Input
                      id="phone"
                      value={profile.personal?.phone || ""}
                      onChange={(e) =>
                        setProfile((prev: any) => ({
                          ...prev,
                          personal: { ...prev.personal, phone: e.target.value },
                        }))
                      }
                      className="bg-white/80 border-gray-300 focus:border-blue-500 focus:ring-blue-500"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="dateOfBirth" className="text-sm font-medium text-gray-700">
                      Date of Birth
                    </Label>
                    <Input
                      id="dateOfBirth"
                      type="date"
                      value={profile.personal?.dateOfBirth || ""}
                      onChange={(e) =>
                        setProfile((prev: any) => ({
                          ...prev,
                          personal: { ...prev.personal, dateOfBirth: e.target.value },
                        }))
                      }
                      className="bg-white/80 border-gray-300 focus:border-blue-500 focus:ring-blue-500"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="gender" className="text-sm font-medium text-gray-700">
                    Gender
                  </Label>
                  <Select
                    value={profile.personal?.gender || ""}
                    onValueChange={(value) =>
                      setProfile((prev: any) => ({
                        ...prev,
                        personal: { ...prev.personal, gender: value },
                      }))
                    }
                  >
                    <SelectTrigger className="bg-white/80 border-gray-300">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="male">Male</SelectItem>
                      <SelectItem value="female">Female</SelectItem>
                      <SelectItem value="other">Other</SelectItem>
                      <SelectItem value="prefer-not-to-say">Prefer not to say</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="address" className="text-sm font-medium text-gray-700">
                    Address
                  </Label>
                  <Textarea
                    id="address"
                    rows={3}
                    value={profile.personal?.address || ""}
                    onChange={(e) =>
                      setProfile((prev: any) => ({
                        ...prev,
                        personal: { ...prev.personal, address: e.target.value },
                      }))
                    }
                    className="bg-white/80 border-gray-300 focus:border-blue-500 focus:ring-blue-500"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="bio" className="text-sm font-medium text-gray-700">
                    Bio
                  </Label>
                  <Textarea
                    id="bio"
                    rows={4}
                    placeholder="Tell us about yourself..."
                    value={profile.personal?.bio || ""}
                    onChange={(e) =>
                      setProfile((prev: any) => ({
                        ...prev,
                        personal: { ...prev.personal, bio: e.target.value },
                      }))
                    }
                    className="bg-white/80 border-gray-300 focus:border-blue-500 focus:ring-blue-500"
                  />
                </div>

                <div className="flex justify-end pt-4">
                  <Button
                    onClick={() => saveProfile("personal", profile.personal)}
                    disabled={isSaving}
                    className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white shadow-lg"
                  >
                    <Save className="h-4 w-4 mr-2" />
                    {isSaving ? "Saving..." : "Save Changes"}
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Preferences */}
          <TabsContent value="preferences">
            <Card className="bg-white/80 backdrop-blur-sm border-gray-200 shadow-xl">
              <CardHeader className="pb-6">
                <CardTitle className="text-2xl font-bold bg-gradient-to-r from-green-600 to-teal-600 bg-clip-text text-transparent flex items-center">
                  <Bell className="h-6 w-6 mr-3 text-green-600" />
                  Notification Preferences
                </CardTitle>
                <CardDescription>Manage how you receive updates and notifications</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="p-4 bg-gradient-to-r from-green-50 to-teal-50 rounded-lg border border-green-200">
                    <h3 className="font-semibold text-gray-900 mb-4 flex items-center">
                      <Mail className="h-5 w-5 mr-2 text-green-600" />
                      Email Notifications
                    </h3>
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <Label htmlFor="emailNotifications" className="text-sm">
                          General Notifications
                        </Label>
                        <Switch
                          id="emailNotifications"
                          checked={profile.preferences?.emailNotifications || false}
                          onCheckedChange={(checked) =>
                            setProfile((prev: any) => ({
                              ...prev,
                              preferences: { ...prev.preferences, emailNotifications: checked },
                            }))
                          }
                        />
                      </div>
                      <div className="flex items-center justify-between">
                        <Label htmlFor="newsletter" className="text-sm">
                          Newsletter
                        </Label>
                        <Switch
                          id="newsletter"
                          checked={profile.preferences?.newsletter || false}
                          onCheckedChange={(checked) =>
                            setProfile((prev: any) => ({
                              ...prev,
                              preferences: { ...prev.preferences, newsletter: checked },
                            }))
                          }
                        />
                      </div>
                      <div className="flex items-center justify-between">
                        <Label htmlFor="donationReminders" className="text-sm">
                          Donation Reminders
                        </Label>
                        <Switch
                          id="donationReminders"
                          checked={profile.preferences?.donationReminders || false}
                          onCheckedChange={(checked) =>
                            setProfile((prev: any) => ({
                              ...prev,
                              preferences: { ...prev.preferences, donationReminders: checked },
                            }))
                          }
                        />
                      </div>
                    </div>
                  </div>

                  <div className="p-4 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg border border-blue-200">
                    <h3 className="font-semibold text-gray-900 mb-4 flex items-center">
                      <Phone className="h-5 w-5 mr-2 text-blue-600" />
                      SMS & Updates
                    </h3>
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <Label htmlFor="smsNotifications" className="text-sm">
                          SMS Notifications
                        </Label>
                        <Switch
                          id="smsNotifications"
                          checked={profile.preferences?.smsNotifications || false}
                          onCheckedChange={(checked) =>
                            setProfile((prev: any) => ({
                              ...prev,
                              preferences: { ...prev.preferences, smsNotifications: checked },
                            }))
                          }
                        />
                      </div>
                      <div className="flex items-center justify-between">
                        <Label htmlFor="eventUpdates" className="text-sm">
                          Event Updates
                        </Label>
                        <Switch
                          id="eventUpdates"
                          checked={profile.preferences?.eventUpdates || false}
                          onCheckedChange={(checked) =>
                            setProfile((prev: any) => ({
                              ...prev,
                              preferences: { ...prev.preferences, eventUpdates: checked },
                            }))
                          }
                        />
                      </div>
                      <div className="flex items-center justify-between">
                        <Label htmlFor="campaignUpdates" className="text-sm">
                          Campaign Updates
                        </Label>
                        <Switch
                          id="campaignUpdates"
                          checked={profile.preferences?.campaignUpdates || false}
                          onCheckedChange={(checked) =>
                            setProfile((prev: any) => ({
                              ...prev,
                              preferences: { ...prev.preferences, campaignUpdates: checked },
                            }))
                          }
                        />
                      </div>
                    </div>
                  </div>
                </div>

                <Separator />

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="language" className="text-sm font-medium text-gray-700">
                      Language
                    </Label>
                    <Select
                      value={profile.preferences?.language || ""}
                      onValueChange={(value) =>
                        setProfile((prev: any) => ({
                          ...prev,
                          preferences: { ...prev.preferences, language: value },
                        }))
                      }
                    >
                      <SelectTrigger className="bg-white/80 border-gray-300">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="en">English</SelectItem>
                        <SelectItem value="hi">Hindi</SelectItem>
                        <SelectItem value="es">Spanish</SelectItem>
                        <SelectItem value="fr">French</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="timezone" className="text-sm font-medium text-gray-700">
                      Timezone
                    </Label>
                    <Select
                      value={profile.preferences?.timezone || ""}
                      onValueChange={(value) =>
                        setProfile((prev: any) => ({
                          ...prev,
                          preferences: { ...prev.preferences, timezone: value },
                        }))
                      }
                    >
                      <SelectTrigger className="bg-white/80 border-gray-300">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Asia/Kolkata">Asia/Kolkata</SelectItem>
                        <SelectItem value="UTC">UTC</SelectItem>
                        <SelectItem value="America/New_York">America/New_York</SelectItem>
                        <SelectItem value="Europe/London">Europe/London</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="currency" className="text-sm font-medium text-gray-700">
                      Currency
                    </Label>
                    <Select
                      value={profile.preferences?.currency || ""}
                      onValueChange={(value) =>
                        setProfile((prev: any) => ({
                          ...prev,
                          preferences: { ...prev.preferences, currency: value },
                        }))
                      }
                    >
                      <SelectTrigger className="bg-white/80 border-gray-300">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="INR">Indian Rupee (₹)</SelectItem>
                        <SelectItem value="USD">US Dollar ($)</SelectItem>
                        <SelectItem value="EUR">Euro (€)</SelectItem>
                        <SelectItem value="GBP">British Pound (£)</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="flex justify-end pt-4">
                  <Button
                    onClick={() => saveProfile("preferences", profile.preferences)}
                    disabled={isSaving}
                    className="bg-gradient-to-r from-green-600 to-teal-600 hover:from-green-700 hover:to-teal-700 text-white shadow-lg"
                  >
                    <Save className="h-4 w-4 mr-2" />
                    {isSaving ? "Saving..." : "Save Changes"}
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Privacy Settings */}
          <TabsContent value="privacy">
            <Card className="bg-white/80 backdrop-blur-sm border-gray-200 shadow-xl">
              <CardHeader className="pb-6">
                <CardTitle className="text-2xl font-bold bg-gradient-to-r from-red-600 to-pink-600 bg-clip-text text-transparent flex items-center">
                  <Shield className="h-6 w-6 mr-3 text-red-600" />
                  Privacy Settings
                </CardTitle>
                <CardDescription>Control your privacy and what information is visible to others</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="profileVisibility" className="text-sm font-medium text-gray-700">
                    Profile Visibility
                  </Label>
                  <Select
                    value={profile.privacy?.profileVisibility || ""}
                    onValueChange={(value) =>
                      setProfile((prev: any) => ({
                        ...prev,
                        privacy: { ...prev.privacy, profileVisibility: value },
                      }))
                    }
                  >
                    <SelectTrigger className="bg-white/80 border-gray-300">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="public">Public - Anyone can see your profile</SelectItem>
                      <SelectItem value="members">Members Only - Only registered members can see</SelectItem>
                      <SelectItem value="private">Private - Only you can see your profile</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <Separator />

                <div className="space-y-4">
                  <h3 className="font-semibold text-gray-900">Information Visibility</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="flex items-center justify-between p-3 bg-gradient-to-r from-gray-50 to-gray-100 rounded-lg">
                      <Label htmlFor="showDonations" className="text-sm font-medium">
                        Show Donation History
                      </Label>
                      <Switch
                        id="showDonations"
                        checked={profile.privacy?.showDonations || false}
                        onCheckedChange={(checked) =>
                          setProfile((prev: any) => ({
                            ...prev,
                            privacy: { ...prev.privacy, showDonations: checked },
                          }))
                        }
                      />
                    </div>

                    <div className="flex items-center justify-between p-3 bg-gradient-to-r from-gray-50 to-gray-100 rounded-lg">
                      <Label htmlFor="showVolunteerHours" className="text-sm font-medium">
                        Show Volunteer Hours
                      </Label>
                      <Switch
                        id="showVolunteerHours"
                        checked={profile.privacy?.showVolunteerHours || false}
                        onCheckedChange={(checked) =>
                          setProfile((prev: any) => ({
                            ...prev,
                            privacy: { ...prev.privacy, showVolunteerHours: checked },
                          }))
                        }
                      />
                    </div>

                    <div className="flex items-center justify-between p-3 bg-gradient-to-r from-gray-50 to-gray-100 rounded-lg">
                      <Label htmlFor="showEmail" className="text-sm font-medium">
                        Show Email Address
                      </Label>
                      <Switch
                        id="showEmail"
                        checked={profile.privacy?.showEmail || false}
                        onCheckedChange={(checked) =>
                          setProfile((prev: any) => ({
                            ...prev,
                            privacy: { ...prev.privacy, showEmail: checked },
                          }))
                        }
                      />
                    </div>

                    <div className="flex items-center justify-between p-3 bg-gradient-to-r from-gray-50 to-gray-100 rounded-lg">
                      <Label htmlFor="showPhone" className="text-sm font-medium">
                        Show Phone Number
                      </Label>
                      <Switch
                        id="showPhone"
                        checked={profile.privacy?.showPhone || false}
                        onCheckedChange={(checked) =>
                          setProfile((prev: any) => ({
                            ...prev,
                            privacy: { ...prev.privacy, showPhone: checked },
                          }))
                        }
                      />
                    </div>
                  </div>
                </div>

                <Separator />

                <div className="space-y-4">
                  <h3 className="font-semibold text-gray-900">Communication Settings</h3>
                  <div className="flex items-center justify-between p-4 bg-gradient-to-r from-red-50 to-pink-50 rounded-lg border border-red-200">
                    <div>
                      <Label htmlFor="allowMessages" className="text-sm font-medium">
                        Allow Messages from Other Users
                      </Label>
                      <p className="text-xs text-gray-500 mt-1">
                        Other users can send you messages through the platform
                      </p>
                    </div>
                    <Switch
                      id="allowMessages"
                      checked={profile.privacy?.allowMessages || false}
                      onCheckedChange={(checked) =>
                        setProfile((prev: any) => ({
                          ...prev,
                          privacy: { ...prev.privacy, allowMessages: checked },
                        }))
                      }
                    />
                  </div>
                </div>

                <div className="flex justify-end pt-4">
                  <Button
                    onClick={() => saveProfile("privacy", profile.privacy)}
                    disabled={isSaving}
                    className="bg-gradient-to-r from-red-600 to-pink-600 hover:from-red-700 hover:to-pink-700 text-white shadow-lg"
                  >
                    <Save className="h-4 w-4 mr-2" />
                    {isSaving ? "Saving..." : "Save Changes"}
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
