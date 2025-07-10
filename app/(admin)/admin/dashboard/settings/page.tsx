"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Switch } from "@/components/ui/switch"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { useToast } from "@/hooks/use-toast"
import {
  Settings,
  Save,
  Upload,
  Mail,
  Bell,
  Shield,
  CreditCard,
  Palette,
  Globe,
  Key,
  Database,
  Smartphone,
} from "lucide-react"

export default function SettingsPage() {
  const [settings, setSettings] = useState<any>({})
  const [isLoading, setIsLoading] = useState(true)
  const [isSaving, setIsSaving] = useState(false)
  const { toast } = useToast()

  useEffect(() => {
    fetchSettings()
  }, [])

  const fetchSettings = async () => {
    try {
      const response = await fetch("/api/admin/settings")
      const data = await response.json()
      setSettings(data)
    } catch (error) {
      console.error("Failed to fetch settings:", error)
      // Mock data for demo
      setSettings({
        general: {
          organizationName: "Hope Foundation",
          tagline: "Making a difference in communities worldwide",
          description:
            "We are dedicated to creating positive change through sustainable development, education, and humanitarian aid.",
          website: "https://hopefoundation.org",
          phone: "+91 98765 43210",
          address: "123 Hope Street, Mumbai, India 400001",
          timezone: "Asia/Kolkata",
          language: "en",
        },
        email: {
          smtpHost: "smtp.gmail.com",
          smtpPort: "587",
          smtpUser: "noreply@hopefoundation.org",
          smtpSecure: true,
          fromName: "Hope Foundation",
          fromEmail: "noreply@hopefoundation.org",
        },
        notifications: {
          emailNotifications: true,
          smsNotifications: false,
          pushNotifications: true,
          donationAlerts: true,
          campaignUpdates: true,
          eventReminders: true,
          weeklyReports: true,
          monthlyReports: true,
        },
        security: {
          twoFactorAuth: false,
          sessionTimeout: "24",
          passwordPolicy: "strong",
          loginAttempts: "5",
          ipWhitelist: "",
          apiRateLimit: "1000",
        },
        payment: {
          razorpayEnabled: true,
          stripeEnabled: false,
          paypalEnabled: false,
          minimumDonation: "100",
          maximumDonation: "100000",
          currency: "INR",
          taxDeductible: true,
          receiptGeneration: true,
        },
        appearance: {
          primaryColor: "#3B82F6",
          secondaryColor: "#10B981",
          accentColor: "#8B5CF6",
          theme: "light",
          logoUrl: "/placeholder-logo.png",
          faviconUrl: "/favicon.ico",
          customCSS: "",
        },
      })
    } finally {
      setIsLoading(false)
    }
  }

  const saveSettings = async (section: string, data: any) => {
    setIsSaving(true)
    try {
      const response = await fetch("/api/admin/settings", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ section, data }),
      })

      if (response.ok) {
        setSettings((prev: any) => ({ ...prev, [section]: data }))
        toast({
          title: "Settings saved",
          description: "Your changes have been saved successfully.",
        })
      } else {
        throw new Error("Failed to save settings")
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to save settings. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsSaving(false)
    }
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 p-6">
        <div className="max-w-6xl mx-auto">
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
      <div className="max-w-6xl mx-auto space-y-8">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 bg-clip-text text-transparent">
              System Settings
            </h1>
            <p className="text-gray-600 mt-2">Configure your organization's system preferences</p>
          </div>
          <div className="flex items-center space-x-2">
            <Settings className="h-8 w-8 text-blue-600" />
          </div>
        </div>

        {/* Settings Tabs */}
        <Tabs defaultValue="general" className="space-y-6">
          <TabsList className="bg-white/80 backdrop-blur-sm border border-gray-200 p-1 rounded-xl grid grid-cols-3 lg:grid-cols-6 w-full">
            <TabsTrigger
              value="general"
              className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-blue-500 data-[state=active]:to-purple-500 data-[state=active]:text-white rounded-lg"
            >
              <Globe className="h-4 w-4 mr-2" />
              General
            </TabsTrigger>
            <TabsTrigger
              value="email"
              className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-green-500 data-[state=active]:to-teal-500 data-[state=active]:text-white rounded-lg"
            >
              <Mail className="h-4 w-4 mr-2" />
              Email
            </TabsTrigger>
            <TabsTrigger
              value="notifications"
              className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-yellow-500 data-[state=active]:to-orange-500 data-[state=active]:text-white rounded-lg"
            >
              <Bell className="h-4 w-4 mr-2" />
              Notifications
            </TabsTrigger>
            <TabsTrigger
              value="security"
              className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-red-500 data-[state=active]:to-pink-500 data-[state=active]:text-white rounded-lg"
            >
              <Shield className="h-4 w-4 mr-2" />
              Security
            </TabsTrigger>
            <TabsTrigger
              value="payment"
              className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-indigo-500 data-[state=active]:to-purple-500 data-[state=active]:text-white rounded-lg"
            >
              <CreditCard className="h-4 w-4 mr-2" />
              Payment
            </TabsTrigger>
            <TabsTrigger
              value="appearance"
              className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-pink-500 data-[state=active]:to-rose-500 data-[state=active]:text-white rounded-lg"
            >
              <Palette className="h-4 w-4 mr-2" />
              Appearance
            </TabsTrigger>
          </TabsList>

          {/* General Settings */}
          <TabsContent value="general">
            <Card className="bg-white/80 backdrop-blur-sm border-gray-200 shadow-xl">
              <CardHeader className="pb-6">
                <CardTitle className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent flex items-center">
                  <Globe className="h-6 w-6 mr-3 text-blue-600" />
                  General Settings
                </CardTitle>
                <CardDescription>Basic information about your organization</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="orgName" className="text-sm font-medium text-gray-700">
                      Organization Name
                    </Label>
                    <Input
                      id="orgName"
                      value={settings.general?.organizationName || ""}
                      onChange={(e) =>
                        setSettings((prev: any) => ({
                          ...prev,
                          general: { ...prev.general, organizationName: e.target.value },
                        }))
                      }
                      className="bg-white/80 border-gray-300 focus:border-blue-500 focus:ring-blue-500"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="tagline" className="text-sm font-medium text-gray-700">
                      Tagline
                    </Label>
                    <Input
                      id="tagline"
                      value={settings.general?.tagline || ""}
                      onChange={(e) =>
                        setSettings((prev: any) => ({
                          ...prev,
                          general: { ...prev.general, tagline: e.target.value },
                        }))
                      }
                      className="bg-white/80 border-gray-300 focus:border-blue-500 focus:ring-blue-500"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="description" className="text-sm font-medium text-gray-700">
                    Description
                  </Label>
                  <Textarea
                    id="description"
                    rows={4}
                    value={settings.general?.description || ""}
                    onChange={(e) =>
                      setSettings((prev: any) => ({
                        ...prev,
                        general: { ...prev.general, description: e.target.value },
                      }))
                    }
                    className="bg-white/80 border-gray-300 focus:border-blue-500 focus:ring-blue-500"
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="website" className="text-sm font-medium text-gray-700">
                      Website
                    </Label>
                    <Input
                      id="website"
                      type="url"
                      value={settings.general?.website || ""}
                      onChange={(e) =>
                        setSettings((prev: any) => ({
                          ...prev,
                          general: { ...prev.general, website: e.target.value },
                        }))
                      }
                      className="bg-white/80 border-gray-300 focus:border-blue-500 focus:ring-blue-500"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="phone" className="text-sm font-medium text-gray-700">
                      Phone
                    </Label>
                    <Input
                      id="phone"
                      value={settings.general?.phone || ""}
                      onChange={(e) =>
                        setSettings((prev: any) => ({
                          ...prev,
                          general: { ...prev.general, phone: e.target.value },
                        }))
                      }
                      className="bg-white/80 border-gray-300 focus:border-blue-500 focus:ring-blue-500"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="address" className="text-sm font-medium text-gray-700">
                    Address
                  </Label>
                  <Textarea
                    id="address"
                    rows={3}
                    value={settings.general?.address || ""}
                    onChange={(e) =>
                      setSettings((prev: any) => ({
                        ...prev,
                        general: { ...prev.general, address: e.target.value },
                      }))
                    }
                    className="bg-white/80 border-gray-300 focus:border-blue-500 focus:ring-blue-500"
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="timezone" className="text-sm font-medium text-gray-700">
                      Timezone
                    </Label>
                    <Select
                      value={settings.general?.timezone || ""}
                      onValueChange={(value) =>
                        setSettings((prev: any) => ({
                          ...prev,
                          general: { ...prev.general, timezone: value },
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
                    <Label htmlFor="language" className="text-sm font-medium text-gray-700">
                      Language
                    </Label>
                    <Select
                      value={settings.general?.language || ""}
                      onValueChange={(value) =>
                        setSettings((prev: any) => ({
                          ...prev,
                          general: { ...prev.general, language: value },
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
                </div>

                <div className="flex justify-end pt-4">
                  <Button
                    onClick={() => saveSettings("general", settings.general)}
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

          {/* Email Settings */}
          <TabsContent value="email">
            <Card className="bg-white/80 backdrop-blur-sm border-gray-200 shadow-xl">
              <CardHeader className="pb-6">
                <CardTitle className="text-2xl font-bold bg-gradient-to-r from-green-600 to-teal-600 bg-clip-text text-transparent flex items-center">
                  <Mail className="h-6 w-6 mr-3 text-green-600" />
                  Email Configuration
                </CardTitle>
                <CardDescription>Configure SMTP settings for email delivery</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="smtpHost" className="text-sm font-medium text-gray-700">
                      SMTP Host
                    </Label>
                    <Input
                      id="smtpHost"
                      value={settings.email?.smtpHost || ""}
                      onChange={(e) =>
                        setSettings((prev: any) => ({
                          ...prev,
                          email: { ...prev.email, smtpHost: e.target.value },
                        }))
                      }
                      className="bg-white/80 border-gray-300 focus:border-green-500 focus:ring-green-500"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="smtpPort" className="text-sm font-medium text-gray-700">
                      SMTP Port
                    </Label>
                    <Input
                      id="smtpPort"
                      value={settings.email?.smtpPort || ""}
                      onChange={(e) =>
                        setSettings((prev: any) => ({
                          ...prev,
                          email: { ...prev.email, smtpPort: e.target.value },
                        }))
                      }
                      className="bg-white/80 border-gray-300 focus:border-green-500 focus:ring-green-500"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="smtpUser" className="text-sm font-medium text-gray-700">
                      SMTP Username
                    </Label>
                    <Input
                      id="smtpUser"
                      value={settings.email?.smtpUser || ""}
                      onChange={(e) =>
                        setSettings((prev: any) => ({
                          ...prev,
                          email: { ...prev.email, smtpUser: e.target.value },
                        }))
                      }
                      className="bg-white/80 border-gray-300 focus:border-green-500 focus:ring-green-500"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="smtpPass" className="text-sm font-medium text-gray-700">
                      SMTP Password
                    </Label>
                    <Input
                      id="smtpPass"
                      type="password"
                      placeholder="••••••••"
                      className="bg-white/80 border-gray-300 focus:border-green-500 focus:ring-green-500"
                    />
                  </div>
                </div>

                <div className="flex items-center space-x-2 p-4 bg-gradient-to-r from-green-50 to-teal-50 rounded-lg border border-green-200">
                  <Switch
                    id="smtpSecure"
                    checked={settings.email?.smtpSecure || false}
                    onCheckedChange={(checked) =>
                      setSettings((prev: any) => ({
                        ...prev,
                        email: { ...prev.email, smtpSecure: checked },
                      }))
                    }
                  />
                  <Label htmlFor="smtpSecure" className="text-sm font-medium text-gray-700">
                    Use SSL/TLS
                  </Label>
                </div>

                <Separator />

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="fromName" className="text-sm font-medium text-gray-700">
                      From Name
                    </Label>
                    <Input
                      id="fromName"
                      value={settings.email?.fromName || ""}
                      onChange={(e) =>
                        setSettings((prev: any) => ({
                          ...prev,
                          email: { ...prev.email, fromName: e.target.value },
                        }))
                      }
                      className="bg-white/80 border-gray-300 focus:border-green-500 focus:ring-green-500"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="fromEmail" className="text-sm font-medium text-gray-700">
                      From Email
                    </Label>
                    <Input
                      id="fromEmail"
                      type="email"
                      value={settings.email?.fromEmail || ""}
                      onChange={(e) =>
                        setSettings((prev: any) => ({
                          ...prev,
                          email: { ...prev.email, fromEmail: e.target.value },
                        }))
                      }
                      className="bg-white/80 border-gray-300 focus:border-green-500 focus:ring-green-500"
                    />
                  </div>
                </div>

                <div className="flex justify-end pt-4">
                  <Button
                    onClick={() => saveSettings("email", settings.email)}
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

          {/* Notifications Settings */}
          <TabsContent value="notifications">
            <Card className="bg-white/80 backdrop-blur-sm border-gray-200 shadow-xl">
              <CardHeader className="pb-6">
                <CardTitle className="text-2xl font-bold bg-gradient-to-r from-yellow-600 to-orange-600 bg-clip-text text-transparent flex items-center">
                  <Bell className="h-6 w-6 mr-3 text-yellow-600" />
                  Notification Preferences
                </CardTitle>
                <CardDescription>Configure how and when you receive notifications</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="p-4 bg-gradient-to-r from-yellow-50 to-orange-50 rounded-lg border border-yellow-200">
                    <h3 className="font-semibold text-gray-900 mb-4 flex items-center">
                      <Mail className="h-5 w-5 mr-2 text-yellow-600" />
                      Email Notifications
                    </h3>
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <Label htmlFor="emailNotifications" className="text-sm">
                          Enable Email
                        </Label>
                        <Switch
                          id="emailNotifications"
                          checked={settings.notifications?.emailNotifications || false}
                          onCheckedChange={(checked) =>
                            setSettings((prev: any) => ({
                              ...prev,
                              notifications: { ...prev.notifications, emailNotifications: checked },
                            }))
                          }
                        />
                      </div>
                      <div className="flex items-center justify-between">
                        <Label htmlFor="donationAlerts" className="text-sm">
                          Donation Alerts
                        </Label>
                        <Switch
                          id="donationAlerts"
                          checked={settings.notifications?.donationAlerts || false}
                          onCheckedChange={(checked) =>
                            setSettings((prev: any) => ({
                              ...prev,
                              notifications: { ...prev.notifications, donationAlerts: checked },
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
                          checked={settings.notifications?.campaignUpdates || false}
                          onCheckedChange={(checked) =>
                            setSettings((prev: any) => ({
                              ...prev,
                              notifications: { ...prev.notifications, campaignUpdates: checked },
                            }))
                          }
                        />
                      </div>
                    </div>
                  </div>

                  <div className="p-4 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg border border-blue-200">
                    <h3 className="font-semibold text-gray-900 mb-4 flex items-center">
                      <Smartphone className="h-5 w-5 mr-2 text-blue-600" />
                      SMS Notifications
                    </h3>
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <Label htmlFor="smsNotifications" className="text-sm">
                          Enable SMS
                        </Label>
                        <Switch
                          id="smsNotifications"
                          checked={settings.notifications?.smsNotifications || false}
                          onCheckedChange={(checked) =>
                            setSettings((prev: any) => ({
                              ...prev,
                              notifications: { ...prev.notifications, smsNotifications: checked },
                            }))
                          }
                        />
                      </div>
                      <div className="flex items-center justify-between">
                        <Label htmlFor="eventReminders" className="text-sm">
                          Event Reminders
                        </Label>
                        <Switch
                          id="eventReminders"
                          checked={settings.notifications?.eventReminders || false}
                          onCheckedChange={(checked) =>
                            setSettings((prev: any) => ({
                              ...prev,
                              notifications: { ...prev.notifications, eventReminders: checked },
                            }))
                          }
                        />
                      </div>
                    </div>
                  </div>

                  <div className="p-4 bg-gradient-to-r from-purple-50 to-pink-50 rounded-lg border border-purple-200">
                    <h3 className="font-semibold text-gray-900 mb-4 flex items-center">
                      <Bell className="h-5 w-5 mr-2 text-purple-600" />
                      Push Notifications
                    </h3>
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <Label htmlFor="pushNotifications" className="text-sm">
                          Enable Push
                        </Label>
                        <Switch
                          id="pushNotifications"
                          checked={settings.notifications?.pushNotifications || false}
                          onCheckedChange={(checked) =>
                            setSettings((prev: any) => ({
                              ...prev,
                              notifications: { ...prev.notifications, pushNotifications: checked },
                            }))
                          }
                        />
                      </div>
                    </div>
                  </div>
                </div>

                <Separator />

                <div className="space-y-4">
                  <h3 className="font-semibold text-gray-900">Report Frequency</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="flex items-center justify-between p-3 bg-gradient-to-r from-gray-50 to-gray-100 rounded-lg">
                      <Label htmlFor="weeklyReports" className="text-sm font-medium">
                        Weekly Reports
                      </Label>
                      <Switch
                        id="weeklyReports"
                        checked={settings.notifications?.weeklyReports || false}
                        onCheckedChange={(checked) =>
                          setSettings((prev: any) => ({
                            ...prev,
                            notifications: { ...prev.notifications, weeklyReports: checked },
                          }))
                        }
                      />
                    </div>
                    <div className="flex items-center justify-between p-3 bg-gradient-to-r from-gray-50 to-gray-100 rounded-lg">
                      <Label htmlFor="monthlyReports" className="text-sm font-medium">
                        Monthly Reports
                      </Label>
                      <Switch
                        id="monthlyReports"
                        checked={settings.notifications?.monthlyReports || false}
                        onCheckedChange={(checked) =>
                          setSettings((prev: any) => ({
                            ...prev,
                            notifications: { ...prev.notifications, monthlyReports: checked },
                          }))
                        }
                      />
                    </div>
                  </div>
                </div>

                <div className="flex justify-end pt-4">
                  <Button
                    onClick={() => saveSettings("notifications", settings.notifications)}
                    disabled={isSaving}
                    className="bg-gradient-to-r from-yellow-600 to-orange-600 hover:from-yellow-700 hover:to-orange-700 text-white shadow-lg"
                  >
                    <Save className="h-4 w-4 mr-2" />
                    {isSaving ? "Saving..." : "Save Changes"}
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Security Settings */}
          <TabsContent value="security">
            <Card className="bg-white/80 backdrop-blur-sm border-gray-200 shadow-xl">
              <CardHeader className="pb-6">
                <CardTitle className="text-2xl font-bold bg-gradient-to-r from-red-600 to-pink-600 bg-clip-text text-transparent flex items-center">
                  <Shield className="h-6 w-6 mr-3 text-red-600" />
                  Security Settings
                </CardTitle>
                <CardDescription>Configure security and access control settings</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="p-4 bg-gradient-to-r from-red-50 to-pink-50 rounded-lg border border-red-200">
                    <h3 className="font-semibold text-gray-900 mb-4 flex items-center">
                      <Key className="h-5 w-5 mr-2 text-red-600" />
                      Authentication
                    </h3>
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <Label htmlFor="twoFactorAuth" className="text-sm">
                          Two-Factor Authentication
                        </Label>
                        <Switch
                          id="twoFactorAuth"
                          checked={settings.security?.twoFactorAuth || false}
                          onCheckedChange={(checked) =>
                            setSettings((prev: any) => ({
                              ...prev,
                              security: { ...prev.security, twoFactorAuth: checked },
                            }))
                          }
                        />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="sessionTimeout" className="text-sm">
                          Session Timeout (hours)
                        </Label>
                        <Select
                          value={settings.security?.sessionTimeout || ""}
                          onValueChange={(value) =>
                            setSettings((prev: any) => ({
                              ...prev,
                              security: { ...prev.security, sessionTimeout: value },
                            }))
                          }
                        >
                          <SelectTrigger className="bg-white/80 border-gray-300">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="1">1 hour</SelectItem>
                            <SelectItem value="8">8 hours</SelectItem>
                            <SelectItem value="24">24 hours</SelectItem>
                            <SelectItem value="168">1 week</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                  </div>

                  <div className="p-4 bg-gradient-to-r from-orange-50 to-yellow-50 rounded-lg border border-orange-200">
                    <h3 className="font-semibold text-gray-900 mb-4 flex items-center">
                      <Database className="h-5 w-5 mr-2 text-orange-600" />
                      Access Control
                    </h3>
                    <div className="space-y-4">
                      <div className="space-y-2">
                        <Label htmlFor="passwordPolicy" className="text-sm">
                          Password Policy
                        </Label>
                        <Select
                          value={settings.security?.passwordPolicy || ""}
                          onValueChange={(value) =>
                            setSettings((prev: any) => ({
                              ...prev,
                              security: { ...prev.security, passwordPolicy: value },
                            }))
                          }
                        >
                          <SelectTrigger className="bg-white/80 border-gray-300">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="basic">Basic</SelectItem>
                            <SelectItem value="strong">Strong</SelectItem>
                            <SelectItem value="very-strong">Very Strong</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="loginAttempts" className="text-sm">
                          Max Login Attempts
                        </Label>
                        <Input
                          id="loginAttempts"
                          type="number"
                          value={settings.security?.loginAttempts || ""}
                          onChange={(e) =>
                            setSettings((prev: any) => ({
                              ...prev,
                              security: { ...prev.security, loginAttempts: e.target.value },
                            }))
                          }
                          className="bg-white/80 border-gray-300 focus:border-orange-500 focus:ring-orange-500"
                        />
                      </div>
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="ipWhitelist" className="text-sm font-medium text-gray-700">
                      IP Whitelist (comma-separated)
                    </Label>
                    <Textarea
                      id="ipWhitelist"
                      rows={3}
                      placeholder="192.168.1.1, 10.0.0.1"
                      value={settings.security?.ipWhitelist || ""}
                      onChange={(e) =>
                        setSettings((prev: any) => ({
                          ...prev,
                          security: { ...prev.security, ipWhitelist: e.target.value },
                        }))
                      }
                      className="bg-white/80 border-gray-300 focus:border-red-500 focus:ring-red-500"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="apiRateLimit" className="text-sm font-medium text-gray-700">
                      API Rate Limit (requests/hour)
                    </Label>
                    <Input
                      id="apiRateLimit"
                      type="number"
                      value={settings.security?.apiRateLimit || ""}
                      onChange={(e) =>
                        setSettings((prev: any) => ({
                          ...prev,
                          security: { ...prev.security, apiRateLimit: e.target.value },
                        }))
                      }
                      className="bg-white/80 border-gray-300 focus:border-red-500 focus:ring-red-500"
                    />
                  </div>
                </div>

                <div className="flex justify-end pt-4">
                  <Button
                    onClick={() => saveSettings("security", settings.security)}
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

          {/* Payment Settings */}
          <TabsContent value="payment">
            <Card className="bg-white/80 backdrop-blur-sm border-gray-200 shadow-xl">
              <CardHeader className="pb-6">
                <CardTitle className="text-2xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent flex items-center">
                  <CreditCard className="h-6 w-6 mr-3 text-indigo-600" />
                  Payment Configuration
                </CardTitle>
                <CardDescription>Configure payment gateways and donation settings</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="p-4 bg-gradient-to-r from-indigo-50 to-purple-50 rounded-lg border border-indigo-200">
                    <div className="flex items-center justify-between mb-3">
                      <h3 className="font-semibold text-gray-900">Razorpay</h3>
                      <Badge variant={settings.payment?.razorpayEnabled ? "default" : "secondary"}>
                        {settings.payment?.razorpayEnabled ? "Active" : "Inactive"}
                      </Badge>
                    </div>
                    <Switch
                      checked={settings.payment?.razorpayEnabled || false}
                      onCheckedChange={(checked) =>
                        setSettings((prev: any) => ({
                          ...prev,
                          payment: { ...prev.payment, razorpayEnabled: checked },
                        }))
                      }
                    />
                  </div>

                  <div className="p-4 bg-gradient-to-r from-blue-50 to-cyan-50 rounded-lg border border-blue-200">
                    <div className="flex items-center justify-between mb-3">
                      <h3 className="font-semibold text-gray-900">Stripe</h3>
                      <Badge variant={settings.payment?.stripeEnabled ? "default" : "secondary"}>
                        {settings.payment?.stripeEnabled ? "Active" : "Inactive"}
                      </Badge>
                    </div>
                    <Switch
                      checked={settings.payment?.stripeEnabled || false}
                      onCheckedChange={(checked) =>
                        setSettings((prev: any) => ({
                          ...prev,
                          payment: { ...prev.payment, stripeEnabled: checked },
                        }))
                      }
                    />
                  </div>

                  <div className="p-4 bg-gradient-to-r from-yellow-50 to-orange-50 rounded-lg border border-yellow-200">
                    <div className="flex items-center justify-between mb-3">
                      <h3 className="font-semibold text-gray-900">PayPal</h3>
                      <Badge variant={settings.payment?.paypalEnabled ? "default" : "secondary"}>
                        {settings.payment?.paypalEnabled ? "Active" : "Inactive"}
                      </Badge>
                    </div>
                    <Switch
                      checked={settings.payment?.paypalEnabled || false}
                      onCheckedChange={(checked) =>
                        setSettings((prev: any) => ({
                          ...prev,
                          payment: { ...prev.payment, paypalEnabled: checked },
                        }))
                      }
                    />
                  </div>
                </div>

                <Separator />

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="minimumDonation" className="text-sm font-medium text-gray-700">
                      Minimum Donation (₹)
                    </Label>
                    <Input
                      id="minimumDonation"
                      type="number"
                      value={settings.payment?.minimumDonation || ""}
                      onChange={(e) =>
                        setSettings((prev: any) => ({
                          ...prev,
                          payment: { ...prev.payment, minimumDonation: e.target.value },
                        }))
                      }
                      className="bg-white/80 border-gray-300 focus:border-indigo-500 focus:ring-indigo-500"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="maximumDonation" className="text-sm font-medium text-gray-700">
                      Maximum Donation (₹)
                    </Label>
                    <Input
                      id="maximumDonation"
                      type="number"
                      value={settings.payment?.maximumDonation || ""}
                      onChange={(e) =>
                        setSettings((prev: any) => ({
                          ...prev,
                          payment: { ...prev.payment, maximumDonation: e.target.value },
                        }))
                      }
                      className="bg-white/80 border-gray-300 focus:border-indigo-500 focus:ring-indigo-500"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="currency" className="text-sm font-medium text-gray-700">
                    Currency
                  </Label>
                  <Select
                    value={settings.payment?.currency || ""}
                    onValueChange={(value) =>
                      setSettings((prev: any) => ({
                        ...prev,
                        payment: { ...prev.payment, currency: value },
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

                <div className="space-y-4">
                  <h3 className="font-semibold text-gray-900">Additional Settings</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="flex items-center justify-between p-3 bg-gradient-to-r from-gray-50 to-gray-100 rounded-lg">
                      <Label htmlFor="taxDeductible" className="text-sm font-medium">
                        Tax Deductible Receipts
                      </Label>
                      <Switch
                        id="taxDeductible"
                        checked={settings.payment?.taxDeductible || false}
                        onCheckedChange={(checked) =>
                          setSettings((prev: any) => ({
                            ...prev,
                            payment: { ...prev.payment, taxDeductible: checked },
                          }))
                        }
                      />
                    </div>
                    <div className="flex items-center justify-between p-3 bg-gradient-to-r from-gray-50 to-gray-100 rounded-lg">
                      <Label htmlFor="receiptGeneration" className="text-sm font-medium">
                        Auto Receipt Generation
                      </Label>
                      <Switch
                        id="receiptGeneration"
                        checked={settings.payment?.receiptGeneration || false}
                        onCheckedChange={(checked) =>
                          setSettings((prev: any) => ({
                            ...prev,
                            payment: { ...prev.payment, receiptGeneration: checked },
                          }))
                        }
                      />
                    </div>
                  </div>
                </div>

                <div className="flex justify-end pt-4">
                  <Button
                    onClick={() => saveSettings("payment", settings.payment)}
                    disabled={isSaving}
                    className="bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white shadow-lg"
                  >
                    <Save className="h-4 w-4 mr-2" />
                    {isSaving ? "Saving..." : "Save Changes"}
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Appearance Settings */}
          <TabsContent value="appearance">
            <Card className="bg-white/80 backdrop-blur-sm border-gray-200 shadow-xl">
              <CardHeader className="pb-6">
                <CardTitle className="text-2xl font-bold bg-gradient-to-r from-pink-600 to-rose-600 bg-clip-text text-transparent flex items-center">
                  <Palette className="h-6 w-6 mr-3 text-pink-600" />
                  Appearance Settings
                </CardTitle>
                <CardDescription>Customize the look and feel of your website</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="primaryColor" className="text-sm font-medium text-gray-700">
                      Primary Color
                    </Label>
                    <div className="flex items-center space-x-2">
                      <Input
                        id="primaryColor"
                        type="color"
                        value={settings.appearance?.primaryColor || "#3B82F6"}
                        onChange={(e) =>
                          setSettings((prev: any) => ({
                            ...prev,
                            appearance: { ...prev.appearance, primaryColor: e.target.value },
                          }))
                        }
                        className="w-16 h-10 border-gray-300"
                      />
                      <Input
                        value={settings.appearance?.primaryColor || "#3B82F6"}
                        onChange={(e) =>
                          setSettings((prev: any) => ({
                            ...prev,
                            appearance: { ...prev.appearance, primaryColor: e.target.value },
                          }))
                        }
                        className="bg-white/80 border-gray-300 focus:border-pink-500 focus:ring-pink-500"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="secondaryColor" className="text-sm font-medium text-gray-700">
                      Secondary Color
                    </Label>
                    <div className="flex items-center space-x-2">
                      <Input
                        id="secondaryColor"
                        type="color"
                        value={settings.appearance?.secondaryColor || "#10B981"}
                        onChange={(e) =>
                          setSettings((prev: any) => ({
                            ...prev,
                            appearance: { ...prev.appearance, secondaryColor: e.target.value },
                          }))
                        }
                        className="w-16 h-10 border-gray-300"
                      />
                      <Input
                        value={settings.appearance?.secondaryColor || "#10B981"}
                        onChange={(e) =>
                          setSettings((prev: any) => ({
                            ...prev,
                            appearance: { ...prev.appearance, secondaryColor: e.target.value },
                          }))
                        }
                        className="bg-white/80 border-gray-300 focus:border-pink-500 focus:ring-pink-500"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="accentColor" className="text-sm font-medium text-gray-700">
                      Accent Color
                    </Label>
                    <div className="flex items-center space-x-2">
                      <Input
                        id="accentColor"
                        type="color"
                        value={settings.appearance?.accentColor || "#8B5CF6"}
                        onChange={(e) =>
                          setSettings((prev: any) => ({
                            ...prev,
                            appearance: { ...prev.appearance, accentColor: e.target.value },
                          }))
                        }
                        className="w-16 h-10 border-gray-300"
                      />
                      <Input
                        value={settings.appearance?.accentColor || "#8B5CF6"}
                        onChange={(e) =>
                          setSettings((prev: any) => ({
                            ...prev,
                            appearance: { ...prev.appearance, accentColor: e.target.value },
                          }))
                        }
                        className="bg-white/80 border-gray-300 focus:border-pink-500 focus:ring-pink-500"
                      />
                    </div>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="theme" className="text-sm font-medium text-gray-700">
                    Theme
                  </Label>
                  <Select
                    value={settings.appearance?.theme || ""}
                    onValueChange={(value) =>
                      setSettings((prev: any) => ({
                        ...prev,
                        appearance: { ...prev.appearance, theme: value },
                      }))
                    }
                  >
                    <SelectTrigger className="bg-white/80 border-gray-300">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="light">Light</SelectItem>
                      <SelectItem value="dark">Dark</SelectItem>
                      <SelectItem value="auto">Auto</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <Separator />

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="logoUrl" className="text-sm font-medium text-gray-700">
                      Logo URL
                    </Label>
                    <div className="flex items-center space-x-2">
                      <Input
                        id="logoUrl"
                        value={settings.appearance?.logoUrl || ""}
                        onChange={(e) =>
                          setSettings((prev: any) => ({
                            ...prev,
                            appearance: { ...prev.appearance, logoUrl: e.target.value },
                          }))
                        }
                        className="bg-white/80 border-gray-300 focus:border-pink-500 focus:ring-pink-500"
                      />
                      <Button variant="outline" size="sm">
                        <Upload className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="faviconUrl" className="text-sm font-medium text-gray-700">
                      Favicon URL
                    </Label>
                    <div className="flex items-center space-x-2">
                      <Input
                        id="faviconUrl"
                        value={settings.appearance?.faviconUrl || ""}
                        onChange={(e) =>
                          setSettings((prev: any) => ({
                            ...prev,
                            appearance: { ...prev.appearance, faviconUrl: e.target.value },
                          }))
                        }
                        className="bg-white/80 border-gray-300 focus:border-pink-500 focus:ring-pink-500"
                      />
                      <Button variant="outline" size="sm">
                        <Upload className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="customCSS" className="text-sm font-medium text-gray-700">
                    Custom CSS
                  </Label>
                  <Textarea
                    id="customCSS"
                    rows={6}
                    placeholder="/* Add your custom CSS here */"
                    value={settings.appearance?.customCSS || ""}
                    onChange={(e) =>
                      setSettings((prev: any) => ({
                        ...prev,
                        appearance: { ...prev.appearance, customCSS: e.target.value },
                      }))
                    }
                    className="bg-white/80 border-gray-300 focus:border-pink-500 focus:ring-pink-500 font-mono text-sm"
                  />
                </div>

                <div className="flex justify-end pt-4">
                  <Button
                    onClick={() => saveSettings("appearance", settings.appearance)}
                    disabled={isSaving}
                    className="bg-gradient-to-r from-pink-600 to-rose-600 hover:from-pink-700 hover:to-rose-700 text-white shadow-lg"
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
