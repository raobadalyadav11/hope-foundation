"use client"

import { useState, useEffect } from "react"
import { useSession } from "next-auth/react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Switch } from "@/components/ui/switch"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Separator } from "@/components/ui/separator"
import { toast } from "@/hooks/use-toast"
import { Globe, Mail, Bell, Shield, Palette, CreditCard, Save, RefreshCw, AlertTriangle } from "lucide-react"

interface SystemSettings {
  general: {
    organizationName: string
    description: string
    website: string
    email: string
    phone: string
    address: string
    timezone: string
    currency: string
  }
  email: {
    smtpHost: string
    smtpPort: number
    smtpUser: string
    smtpPassword: string
    fromEmail: string
    fromName: string
    enableEmailNotifications: boolean
  }
  notifications: {
    enablePushNotifications: boolean
    enableSMSNotifications: boolean
    donationNotifications: boolean
    campaignNotifications: boolean
    volunteerNotifications: boolean
  }
  security: {
    enableTwoFactor: boolean
    sessionTimeout: number
    passwordPolicy: {
      minLength: number
      requireUppercase: boolean
      requireNumbers: boolean
      requireSymbols: boolean
    }
  }
  payment: {
    razorpayKeyId: string
    razorpayKeySecret: string
    enableRecurringDonations: boolean
    minimumDonationAmount: number
    processingFee: number
  }
  appearance: {
    primaryColor: string
    secondaryColor: string
    logoUrl: string
    faviconUrl: string
    customCSS: string
  }
}

export default function SettingsPage() {
  const { data: session } = useSession()
  const [settings, setSettings] = useState<SystemSettings | null>(null)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [activeTab, setActiveTab] = useState("general")

  useEffect(() => {
    fetchSettings()
  }, [])

  const fetchSettings = async () => {
    try {
      const response = await fetch("/api/admin/settings")
      const data = await response.json()
      setSettings(data)
    } catch (error) {
      console.error("Error fetching settings:", error)
      toast({
        title: "Error",
        description: "Failed to load settings",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  const saveSettings = async () => {
    if (!settings) return

    setSaving(true)
    try {
      const response = await fetch("/api/admin/settings", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(settings),
      })

      if (response.ok) {
        toast({
          title: "Success",
          description: "Settings saved successfully",
        })
      } else {
        throw new Error("Failed to save settings")
      }
    } catch (error) {
      console.error("Error saving settings:", error)
      toast({
        title: "Error",
        description: "Failed to save settings",
        variant: "destructive",
      })
    } finally {
      setSaving(false)
    }
  }

  const updateSettings = (section: keyof SystemSettings, field: string, value: any) => {
    if (!settings) return

    setSettings({
      ...settings,
      [section]: {
        ...settings[section],
        [field]: value,
      },
    })
  }

  const updateNestedSettings = (section: keyof SystemSettings, subsection: string, field: string, value: any) => {
    if (!settings) return

    setSettings({
      ...settings,
      [section]: {
        ...settings[section],
        [subsection]: {
          ...(settings[section] as any)[subsection],
          [field]: value,
        },
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

  if (!settings) {
    return <div className="text-center py-12">Failed to load settings</div>
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            System Settings
          </h1>
          <p className="text-gray-600 mt-2">Configure your organization's system preferences</p>
        </div>
        <Button onClick={saveSettings} disabled={saving} className="bg-blue-600 hover:bg-blue-700">
          {saving ? (
            <>
              <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
              Saving...
            </>
          ) : (
            <>
              <Save className="w-4 h-4 mr-2" />
              Save Changes
            </>
          )}
        </Button>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-6 bg-gray-100">
          <TabsTrigger value="general" className="data-[state=active]:bg-blue-600 data-[state=active]:text-white">
            <Globe className="w-4 h-4 mr-2" />
            General
          </TabsTrigger>
          <TabsTrigger value="email" className="data-[state=active]:bg-green-600 data-[state=active]:text-white">
            <Mail className="w-4 h-4 mr-2" />
            Email
          </TabsTrigger>
          <TabsTrigger
            value="notifications"
            className="data-[state=active]:bg-yellow-600 data-[state=active]:text-white"
          >
            <Bell className="w-4 h-4 mr-2" />
            Notifications
          </TabsTrigger>
          <TabsTrigger value="security" className="data-[state=active]:bg-red-600 data-[state=active]:text-white">
            <Shield className="w-4 h-4 mr-2" />
            Security
          </TabsTrigger>
          <TabsTrigger value="payment" className="data-[state=active]:bg-purple-600 data-[state=active]:text-white">
            <CreditCard className="w-4 h-4 mr-2" />
            Payment
          </TabsTrigger>
          <TabsTrigger value="appearance" className="data-[state=active]:bg-pink-600 data-[state=active]:text-white">
            <Palette className="w-4 h-4 mr-2" />
            Appearance
          </TabsTrigger>
        </TabsList>

        <TabsContent value="general" className="space-y-6">
          <Card className="shadow-lg border-0">
            <CardHeader className="bg-gradient-to-r from-blue-50 to-blue-100 rounded-t-lg">
              <CardTitle className="text-blue-800 flex items-center">
                <Globe className="w-5 h-5 mr-2" />
                General Settings
              </CardTitle>
              <CardDescription className="text-blue-600">Basic organization information</CardDescription>
            </CardHeader>
            <CardContent className="pt-6 space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="orgName">Organization Name</Label>
                  <Input
                    id="orgName"
                    value={settings.general.organizationName}
                    onChange={(e) => updateSettings("general", "organizationName", e.target.value)}
                    className="border-gray-300 focus:border-blue-500"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="website">Website</Label>
                  <Input
                    id="website"
                    value={settings.general.website}
                    onChange={(e) => updateSettings("general", "website", e.target.value)}
                    className="border-gray-300 focus:border-blue-500"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    value={settings.general.email}
                    onChange={(e) => updateSettings("general", "email", e.target.value)}
                    className="border-gray-300 focus:border-blue-500"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="phone">Phone</Label>
                  <Input
                    id="phone"
                    value={settings.general.phone}
                    onChange={(e) => updateSettings("general", "phone", e.target.value)}
                    className="border-gray-300 focus:border-blue-500"
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  value={settings.general.description}
                  onChange={(e) => updateSettings("general", "description", e.target.value)}
                  className="border-gray-300 focus:border-blue-500"
                  rows={4}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="address">Address</Label>
                <Textarea
                  id="address"
                  value={settings.general.address}
                  onChange={(e) => updateSettings("general", "address", e.target.value)}
                  className="border-gray-300 focus:border-blue-500"
                  rows={3}
                />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="timezone">Timezone</Label>
                  <Input
                    id="timezone"
                    value={settings.general.timezone}
                    onChange={(e) => updateSettings("general", "timezone", e.target.value)}
                    className="border-gray-300 focus:border-blue-500"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="currency">Currency</Label>
                  <Input
                    id="currency"
                    value={settings.general.currency}
                    onChange={(e) => updateSettings("general", "currency", e.target.value)}
                    className="border-gray-300 focus:border-blue-500"
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="email" className="space-y-6">
          <Card className="shadow-lg border-0">
            <CardHeader className="bg-gradient-to-r from-green-50 to-green-100 rounded-t-lg">
              <CardTitle className="text-green-800 flex items-center">
                <Mail className="w-5 h-5 mr-2" />
                Email Configuration
              </CardTitle>
              <CardDescription className="text-green-600">SMTP settings for email notifications</CardDescription>
            </CardHeader>
            <CardContent className="pt-6 space-y-6">
              <div className="flex items-center justify-between p-4 bg-green-50 rounded-lg">
                <div>
                  <Label htmlFor="emailNotifications" className="text-sm font-medium">
                    Enable Email Notifications
                  </Label>
                  <p className="text-sm text-gray-600">Send automated emails for donations, campaigns, etc.</p>
                </div>
                <Switch
                  id="emailNotifications"
                  checked={settings.email.enableEmailNotifications}
                  onCheckedChange={(checked) => updateSettings("email", "enableEmailNotifications", checked)}
                />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="smtpHost">SMTP Host</Label>
                  <Input
                    id="smtpHost"
                    value={settings.email.smtpHost}
                    onChange={(e) => updateSettings("email", "smtpHost", e.target.value)}
                    className="border-gray-300 focus:border-green-500"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="smtpPort">SMTP Port</Label>
                  <Input
                    id="smtpPort"
                    type="number"
                    value={settings.email.smtpPort}
                    onChange={(e) => updateSettings("email", "smtpPort", Number.parseInt(e.target.value))}
                    className="border-gray-300 focus:border-green-500"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="smtpUser">SMTP Username</Label>
                  <Input
                    id="smtpUser"
                    value={settings.email.smtpUser}
                    onChange={(e) => updateSettings("email", "smtpUser", e.target.value)}
                    className="border-gray-300 focus:border-green-500"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="smtpPassword">SMTP Password</Label>
                  <Input
                    id="smtpPassword"
                    type="password"
                    value={settings.email.smtpPassword}
                    onChange={(e) => updateSettings("email", "smtpPassword", e.target.value)}
                    className="border-gray-300 focus:border-green-500"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="fromEmail">From Email</Label>
                  <Input
                    id="fromEmail"
                    type="email"
                    value={settings.email.fromEmail}
                    onChange={(e) => updateSettings("email", "fromEmail", e.target.value)}
                    className="border-gray-300 focus:border-green-500"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="fromName">From Name</Label>
                  <Input
                    id="fromName"
                    value={settings.email.fromName}
                    onChange={(e) => updateSettings("email", "fromName", e.target.value)}
                    className="border-gray-300 focus:border-green-500"
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="notifications" className="space-y-6">
          <Card className="shadow-lg border-0">
            <CardHeader className="bg-gradient-to-r from-yellow-50 to-yellow-100 rounded-t-lg">
              <CardTitle className="text-yellow-800 flex items-center">
                <Bell className="w-5 h-5 mr-2" />
                Notification Settings
              </CardTitle>
              <CardDescription className="text-yellow-600">Configure notification preferences</CardDescription>
            </CardHeader>
            <CardContent className="pt-6 space-y-6">
              <div className="space-y-4">
                <div className="flex items-center justify-between p-4 bg-yellow-50 rounded-lg">
                  <div>
                    <Label className="text-sm font-medium">Push Notifications</Label>
                    <p className="text-sm text-gray-600">Browser push notifications for real-time updates</p>
                  </div>
                  <Switch
                    checked={settings.notifications.enablePushNotifications}
                    onCheckedChange={(checked) => updateSettings("notifications", "enablePushNotifications", checked)}
                  />
                </div>
                <div className="flex items-center justify-between p-4 bg-yellow-50 rounded-lg">
                  <div>
                    <Label className="text-sm font-medium">SMS Notifications</Label>
                    <p className="text-sm text-gray-600">Text message notifications for important events</p>
                  </div>
                  <Switch
                    checked={settings.notifications.enableSMSNotifications}
                    onCheckedChange={(checked) => updateSettings("notifications", "enableSMSNotifications", checked)}
                  />
                </div>
                <Separator />
                <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                  <div>
                    <Label className="text-sm font-medium">Donation Notifications</Label>
                    <p className="text-sm text-gray-600">Notify when new donations are received</p>
                  </div>
                  <Switch
                    checked={settings.notifications.donationNotifications}
                    onCheckedChange={(checked) => updateSettings("notifications", "donationNotifications", checked)}
                  />
                </div>
                <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                  <div>
                    <Label className="text-sm font-medium">Campaign Notifications</Label>
                    <p className="text-sm text-gray-600">Notify about campaign milestones and updates</p>
                  </div>
                  <Switch
                    checked={settings.notifications.campaignNotifications}
                    onCheckedChange={(checked) => updateSettings("notifications", "campaignNotifications", checked)}
                  />
                </div>
                <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                  <div>
                    <Label className="text-sm font-medium">Volunteer Notifications</Label>
                    <p className="text-sm text-gray-600">Notify about volunteer applications and activities</p>
                  </div>
                  <Switch
                    checked={settings.notifications.volunteerNotifications}
                    onCheckedChange={(checked) => updateSettings("notifications", "volunteerNotifications", checked)}
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="security" className="space-y-6">
          <Card className="shadow-lg border-0">
            <CardHeader className="bg-gradient-to-r from-red-50 to-red-100 rounded-t-lg">
              <CardTitle className="text-red-800 flex items-center">
                <Shield className="w-5 h-5 mr-2" />
                Security Settings
              </CardTitle>
              <CardDescription className="text-red-600">Configure security and authentication settings</CardDescription>
            </CardHeader>
            <CardContent className="pt-6 space-y-6">
              <div className="flex items-center justify-between p-4 bg-red-50 rounded-lg">
                <div>
                  <Label className="text-sm font-medium">Two-Factor Authentication</Label>
                  <p className="text-sm text-gray-600">Require 2FA for admin accounts</p>
                </div>
                <Switch
                  checked={settings.security.enableTwoFactor}
                  onCheckedChange={(checked) => updateSettings("security", "enableTwoFactor", checked)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="sessionTimeout">Session Timeout (minutes)</Label>
                <Input
                  id="sessionTimeout"
                  type="number"
                  value={settings.security.sessionTimeout}
                  onChange={(e) => updateSettings("security", "sessionTimeout", Number.parseInt(e.target.value))}
                  className="border-gray-300 focus:border-red-500"
                />
              </div>
              <Separator />
              <div className="space-y-4">
                <h4 className="font-medium text-gray-900">Password Policy</h4>
                <div className="space-y-2">
                  <Label htmlFor="minLength">Minimum Length</Label>
                  <Input
                    id="minLength"
                    type="number"
                    value={settings.security.passwordPolicy.minLength}
                    onChange={(e) =>
                      updateNestedSettings("security", "passwordPolicy", "minLength", Number.parseInt(e.target.value))
                    }
                    className="border-gray-300 focus:border-red-500"
                  />
                </div>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <Label className="text-sm">Require Uppercase Letters</Label>
                    <Switch
                      checked={settings.security.passwordPolicy.requireUppercase}
                      onCheckedChange={(checked) =>
                        updateNestedSettings("security", "passwordPolicy", "requireUppercase", checked)
                      }
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <Label className="text-sm">Require Numbers</Label>
                    <Switch
                      checked={settings.security.passwordPolicy.requireNumbers}
                      onCheckedChange={(checked) =>
                        updateNestedSettings("security", "passwordPolicy", "requireNumbers", checked)
                      }
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <Label className="text-sm">Require Symbols</Label>
                    <Switch
                      checked={settings.security.passwordPolicy.requireSymbols}
                      onCheckedChange={(checked) =>
                        updateNestedSettings("security", "passwordPolicy", "requireSymbols", checked)
                      }
                    />
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="payment" className="space-y-6">
          <Card className="shadow-lg border-0">
            <CardHeader className="bg-gradient-to-r from-purple-50 to-purple-100 rounded-t-lg">
              <CardTitle className="text-purple-800 flex items-center">
                <CreditCard className="w-5 h-5 mr-2" />
                Payment Settings
              </CardTitle>
              <CardDescription className="text-purple-600">Configure payment gateway and processing</CardDescription>
            </CardHeader>
            <CardContent className="pt-6 space-y-6">
              <div className="flex items-center gap-2 p-4 bg-amber-50 border border-amber-200 rounded-lg">
                <AlertTriangle className="w-5 h-5 text-amber-600" />
                <p className="text-sm text-amber-800">
                  Payment credentials are encrypted and stored securely. Only update when necessary.
                </p>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="razorpayKeyId">Razorpay Key ID</Label>
                  <Input
                    id="razorpayKeyId"
                    value={settings.payment.razorpayKeyId}
                    onChange={(e) => updateSettings("payment", "razorpayKeyId", e.target.value)}
                    className="border-gray-300 focus:border-purple-500"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="razorpayKeySecret">Razorpay Key Secret</Label>
                  <Input
                    id="razorpayKeySecret"
                    type="password"
                    value={settings.payment.razorpayKeySecret}
                    onChange={(e) => updateSettings("payment", "razorpayKeySecret", e.target.value)}
                    className="border-gray-300 focus:border-purple-500"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="minDonation">Minimum Donation Amount (₹)</Label>
                  <Input
                    id="minDonation"
                    type="number"
                    value={settings.payment.minimumDonationAmount}
                    onChange={(e) =>
                      updateSettings("payment", "minimumDonationAmount", Number.parseInt(e.target.value))
                    }
                    className="border-gray-300 focus:border-purple-500"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="processingFee">Processing Fee (%)</Label>
                  <Input
                    id="processingFee"
                    type="number"
                    step="0.01"
                    value={settings.payment.processingFee}
                    onChange={(e) => updateSettings("payment", "processingFee", Number.parseFloat(e.target.value))}
                    className="border-gray-300 focus:border-purple-500"
                  />
                </div>
              </div>
              <div className="flex items-center justify-between p-4 bg-purple-50 rounded-lg">
                <div>
                  <Label className="text-sm font-medium">Enable Recurring Donations</Label>
                  <p className="text-sm text-gray-600">Allow donors to set up monthly/yearly subscriptions</p>
                </div>
                <Switch
                  checked={settings.payment.enableRecurringDonations}
                  onCheckedChange={(checked) => updateSettings("payment", "enableRecurringDonations", checked)}
                />
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="appearance" className="space-y-6">
          <Card className="shadow-lg border-0">
            <CardHeader className="bg-gradient-to-r from-pink-50 to-pink-100 rounded-t-lg">
              <CardTitle className="text-pink-800 flex items-center">
                <Palette className="w-5 h-5 mr-2" />
                Appearance Settings
              </CardTitle>
              <CardDescription className="text-pink-600">Customize the look and feel of your platform</CardDescription>
            </CardHeader>
            <CardContent className="pt-6 space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="primaryColor">Primary Color</Label>
                  <div className="flex gap-2">
                    <Input
                      id="primaryColor"
                      type="color"
                      value={settings.appearance.primaryColor}
                      onChange={(e) => updateSettings("appearance", "primaryColor", e.target.value)}
                      className="w-16 h-10 border-gray-300"
                    />
                    <Input
                      value={settings.appearance.primaryColor}
                      onChange={(e) => updateSettings("appearance", "primaryColor", e.target.value)}
                      className="flex-1 border-gray-300 focus:border-pink-500"
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="secondaryColor">Secondary Color</Label>
                  <div className="flex gap-2">
                    <Input
                      id="secondaryColor"
                      type="color"
                      value={settings.appearance.secondaryColor}
                      onChange={(e) => updateSettings("appearance", "secondaryColor", e.target.value)}
                      className="w-16 h-10 border-gray-300"
                    />
                    <Input
                      value={settings.appearance.secondaryColor}
                      onChange={(e) => updateSettings("appearance", "secondaryColor", e.target.value)}
                      className="flex-1 border-gray-300 focus:border-pink-500"
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="logoUrl">Logo URL</Label>
                  <Input
                    id="logoUrl"
                    value={settings.appearance.logoUrl}
                    onChange={(e) => updateSettings("appearance", "logoUrl", e.target.value)}
                    className="border-gray-300 focus:border-pink-500"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="faviconUrl">Favicon URL</Label>
                  <Input
                    id="faviconUrl"
                    value={settings.appearance.faviconUrl}
                    onChange={(e) => updateSettings("appearance", "faviconUrl", e.target.value)}
                    className="border-gray-300 focus:border-pink-500"
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="customCSS">Custom CSS</Label>
                <Textarea
                  id="customCSS"
                  value={settings.appearance.customCSS}
                  onChange={(e) => updateSettings("appearance", "customCSS", e.target.value)}
                  className="border-gray-300 focus:border-pink-500 font-mono"
                  rows={8}
                  placeholder="/* Add your custom CSS here */"
                />
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
