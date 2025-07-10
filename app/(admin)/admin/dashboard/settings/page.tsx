"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Switch } from "@/components/ui/switch"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Separator } from "@/components/ui/separator"
import {
  Settings,
  Globe,
  Mail,
  Shield,
  Bell,
  Palette,
  Database,
  CreditCard,
  Save,
  RefreshCw,
  AlertTriangle,
  CheckCircle,
  Upload,
} from "lucide-react"
import { toast } from "sonner"

interface SystemSettings {
  general: {
    organizationName: string
    description: string
    website: string
    contactEmail: string
    contactPhone: string
    address: string
    logo: string
    favicon: string
  }
  email: {
    provider: string
    smtpHost: string
    smtpPort: number
    smtpUser: string
    smtpPassword: string
    fromEmail: string
    fromName: string
  }
  payment: {
    razorpayKeyId: string
    razorpaySecret: string
    currency: string
    taxRate: number
    processingFee: number
  }
  notifications: {
    emailNotifications: boolean
    smsNotifications: boolean
    pushNotifications: boolean
    donationAlerts: boolean
    campaignUpdates: boolean
    volunteerNotifications: boolean
  }
  security: {
    twoFactorAuth: boolean
    sessionTimeout: number
    passwordPolicy: {
      minLength: number
      requireUppercase: boolean
      requireNumbers: boolean
      requireSymbols: boolean
    }
    ipWhitelist: string[]
  }
  appearance: {
    theme: string
    primaryColor: string
    secondaryColor: string
    accentColor: string
    fontFamily: string
    logoPosition: string
  }
  integrations: {
    googleAnalytics: string
    facebookPixel: string
    cloudinaryCloudName: string
    cloudinaryApiKey: string
    cloudinaryApiSecret: string
  }
}

export default function SettingsPage() {
  const [settings, setSettings] = useState<SystemSettings | null>(null)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [activeTab, setActiveTab] = useState("general")

  useEffect(() => {
    fetchSettings()
  }, [])

  const fetchSettings = async () => {
    try {
      setLoading(true)
      const response = await fetch("/api/admin/settings")
      const data = await response.json()
      setSettings(data.settings)
    } catch (error) {
      console.error("Error fetching settings:", error)
      toast.error("Failed to load settings")
    } finally {
      setLoading(false)
    }
  }

  const saveSettings = async () => {
    if (!settings) return

    try {
      setSaving(true)
      const response = await fetch("/api/admin/settings", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(settings),
      })

      if (response.ok) {
        toast.success("Settings saved successfully")
      } else {
        throw new Error("Failed to save settings")
      }
    } catch (error) {
      console.error("Error saving settings:", error)
      toast.error("Failed to save settings")
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
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
      </div>
    )
  }

  if (!settings) {
    return (
      <div className="text-center py-12">
        <Settings className="w-12 h-12 text-gray-400 mx-auto mb-4" />
        <h3 className="text-lg font-semibold">Failed to load settings</h3>
        <Button onClick={fetchSettings} className="mt-4">
          <RefreshCw className="w-4 h-4 mr-2" />
          Retry
        </Button>
      </div>
    )
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            System Settings
          </h1>
          <p className="text-gray-600 mt-2">Configure your organization's system preferences and integrations</p>
        </div>

        <div className="flex items-center gap-4">
          <Button
            variant="outline"
            onClick={fetchSettings}
            className="border-blue-200 text-blue-600 hover:bg-blue-50 bg-transparent"
          >
            <RefreshCw className="w-4 h-4 mr-2" />
            Reset
          </Button>

          <Button
            onClick={saveSettings}
            disabled={saving}
            className="bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700"
          >
            {saving ? <RefreshCw className="w-4 h-4 mr-2 animate-spin" /> : <Save className="w-4 h-4 mr-2" />}
            Save Changes
          </Button>
        </div>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-7 bg-gray-100 rounded-xl p-1">
          <TabsTrigger value="general" className="rounded-lg">
            General
          </TabsTrigger>
          <TabsTrigger value="email" className="rounded-lg">
            Email
          </TabsTrigger>
          <TabsTrigger value="payment" className="rounded-lg">
            Payment
          </TabsTrigger>
          <TabsTrigger value="notifications" className="rounded-lg">
            Notifications
          </TabsTrigger>
          <TabsTrigger value="security" className="rounded-lg">
            Security
          </TabsTrigger>
          <TabsTrigger value="appearance" className="rounded-lg">
            Appearance
          </TabsTrigger>
          <TabsTrigger value="integrations" className="rounded-lg">
            Integrations
          </TabsTrigger>
        </TabsList>

        <TabsContent value="general" className="space-y-6">
          <Card className="hover:shadow-xl transition-all duration-300 border-0 shadow-lg">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Globe className="w-5 h-5 text-blue-600" />
                Organization Information
              </CardTitle>
              <CardDescription>Basic information about your organization</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="orgName">Organization Name</Label>
                  <Input
                    id="orgName"
                    value={settings.general.organizationName}
                    onChange={(e) => updateSettings("general", "organizationName", e.target.value)}
                    placeholder="Enter organization name"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="website">Website URL</Label>
                  <Input
                    id="website"
                    value={settings.general.website}
                    onChange={(e) => updateSettings("general", "website", e.target.value)}
                    placeholder="https://example.com"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  value={settings.general.description}
                  onChange={(e) => updateSettings("general", "description", e.target.value)}
                  placeholder="Brief description of your organization"
                  rows={3}
                />
              </div>

              <div className="grid md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="contactEmail">Contact Email</Label>
                  <Input
                    id="contactEmail"
                    type="email"
                    value={settings.general.contactEmail}
                    onChange={(e) => updateSettings("general", "contactEmail", e.target.value)}
                    placeholder="contact@example.com"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="contactPhone">Contact Phone</Label>
                  <Input
                    id="contactPhone"
                    value={settings.general.contactPhone}
                    onChange={(e) => updateSettings("general", "contactPhone", e.target.value)}
                    placeholder="+1 (555) 123-4567"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="address">Address</Label>
                <Textarea
                  id="address"
                  value={settings.general.address}
                  onChange={(e) => updateSettings("general", "address", e.target.value)}
                  placeholder="Organization address"
                  rows={2}
                />
              </div>

              <Separator />

              <div className="grid md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="logo">Logo URL</Label>
                  <div className="flex gap-2">
                    <Input
                      id="logo"
                      value={settings.general.logo}
                      onChange={(e) => updateSettings("general", "logo", e.target.value)}
                      placeholder="Logo image URL"
                    />
                    <Button variant="outline" size="sm">
                      <Upload className="w-4 h-4" />
                    </Button>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="favicon">Favicon URL</Label>
                  <div className="flex gap-2">
                    <Input
                      id="favicon"
                      value={settings.general.favicon}
                      onChange={(e) => updateSettings("general", "favicon", e.target.value)}
                      placeholder="Favicon image URL"
                    />
                    <Button variant="outline" size="sm">
                      <Upload className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="email" className="space-y-6">
          <Card className="hover:shadow-xl transition-all duration-300 border-0 shadow-lg">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Mail className="w-5 h-5 text-green-600" />
                Email Configuration
              </CardTitle>
              <CardDescription>Configure SMTP settings for sending emails</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="emailProvider">Email Provider</Label>
                  <Select
                    value={settings.email.provider}
                    onValueChange={(value) => updateSettings("email", "provider", value)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select provider" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="gmail">Gmail</SelectItem>
                      <SelectItem value="outlook">Outlook</SelectItem>
                      <SelectItem value="sendgrid">SendGrid</SelectItem>
                      <SelectItem value="mailgun">Mailgun</SelectItem>
                      <SelectItem value="custom">Custom SMTP</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="smtpHost">SMTP Host</Label>
                  <Input
                    id="smtpHost"
                    value={settings.email.smtpHost}
                    onChange={(e) => updateSettings("email", "smtpHost", e.target.value)}
                    placeholder="smtp.gmail.com"
                  />
                </div>
              </div>

              <div className="grid md:grid-cols-3 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="smtpPort">SMTP Port</Label>
                  <Input
                    id="smtpPort"
                    type="number"
                    value={settings.email.smtpPort}
                    onChange={(e) => updateSettings("email", "smtpPort", Number.parseInt(e.target.value))}
                    placeholder="587"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="smtpUser">SMTP Username</Label>
                  <Input
                    id="smtpUser"
                    value={settings.email.smtpUser}
                    onChange={(e) => updateSettings("email", "smtpUser", e.target.value)}
                    placeholder="username@gmail.com"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="smtpPassword">SMTP Password</Label>
                  <Input
                    id="smtpPassword"
                    type="password"
                    value={settings.email.smtpPassword}
                    onChange={(e) => updateSettings("email", "smtpPassword", e.target.value)}
                    placeholder="••••••••"
                  />
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="fromEmail">From Email</Label>
                  <Input
                    id="fromEmail"
                    type="email"
                    value={settings.email.fromEmail}
                    onChange={(e) => updateSettings("email", "fromEmail", e.target.value)}
                    placeholder="noreply@example.com"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="fromName">From Name</Label>
                  <Input
                    id="fromName"
                    value={settings.email.fromName}
                    onChange={(e) => updateSettings("email", "fromName", e.target.value)}
                    placeholder="Hope Foundation"
                  />
                </div>
              </div>

              <div className="flex items-center justify-between p-4 rounded-xl bg-blue-50 border border-blue-200">
                <div className="flex items-center gap-3">
                  <Mail className="w-5 h-5 text-blue-600" />
                  <div>
                    <div className="font-semibold text-blue-900">Test Email Configuration</div>
                    <div className="text-sm text-blue-700">Send a test email to verify your settings</div>
                  </div>
                </div>
                <Button variant="outline" className="border-blue-300 text-blue-700 hover:bg-blue-100 bg-transparent">
                  Send Test Email
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="payment" className="space-y-6">
          <Card className="hover:shadow-xl transition-all duration-300 border-0 shadow-lg">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <CreditCard className="w-5 h-5 text-purple-600" />
                Payment Gateway Settings
              </CardTitle>
              <CardDescription>Configure Razorpay and payment processing settings</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="razorpayKeyId">Razorpay Key ID</Label>
                  <Input
                    id="razorpayKeyId"
                    value={settings.payment.razorpayKeyId}
                    onChange={(e) => updateSettings("payment", "razorpayKeyId", e.target.value)}
                    placeholder="rzp_test_..."
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="razorpaySecret">Razorpay Secret</Label>
                  <Input
                    id="razorpaySecret"
                    type="password"
                    value={settings.payment.razorpaySecret}
                    onChange={(e) => updateSettings("payment", "razorpaySecret", e.target.value)}
                    placeholder="••••••••"
                  />
                </div>
              </div>

              <div className="grid md:grid-cols-3 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="currency">Currency</Label>
                  <Select
                    value={settings.payment.currency}
                    onValueChange={(value) => updateSettings("payment", "currency", value)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select currency" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="INR">INR (₹)</SelectItem>
                      <SelectItem value="USD">USD ($)</SelectItem>
                      <SelectItem value="EUR">EUR (€)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="taxRate">Tax Rate (%)</Label>
                  <Input
                    id="taxRate"
                    type="number"
                    step="0.01"
                    value={settings.payment.taxRate}
                    onChange={(e) => updateSettings("payment", "taxRate", Number.parseFloat(e.target.value))}
                    placeholder="0.00"
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
                    placeholder="2.50"
                  />
                </div>
              </div>

              <div className="flex items-center justify-between p-4 rounded-xl bg-green-50 border border-green-200">
                <div className="flex items-center gap-3">
                  <CheckCircle className="w-5 h-5 text-green-600" />
                  <div>
                    <div className="font-semibold text-green-900">Payment Gateway Status</div>
                    <div className="text-sm text-green-700">Connected and operational</div>
                  </div>
                </div>
                <Badge className="bg-green-100 text-green-700">Active</Badge>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="notifications" className="space-y-6">
          <Card className="hover:shadow-xl transition-all duration-300 border-0 shadow-lg">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Bell className="w-5 h-5 text-yellow-600" />
                Notification Preferences
              </CardTitle>
              <CardDescription>Configure how and when notifications are sent</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-6">
                <div className="flex items-center justify-between p-4 rounded-xl bg-gray-50 border border-gray-200">
                  <div>
                    <div className="font-semibold text-gray-900">Email Notifications</div>
                    <div className="text-sm text-gray-600">Send notifications via email</div>
                  </div>
                  <Switch
                    checked={settings.notifications.emailNotifications}
                    onCheckedChange={(checked) => updateSettings("notifications", "emailNotifications", checked)}
                  />
                </div>

                <div className="flex items-center justify-between p-4 rounded-xl bg-gray-50 border border-gray-200">
                  <div>
                    <div className="font-semibold text-gray-900">SMS Notifications</div>
                    <div className="text-sm text-gray-600">Send notifications via SMS</div>
                  </div>
                  <Switch
                    checked={settings.notifications.smsNotifications}
                    onCheckedChange={(checked) => updateSettings("notifications", "smsNotifications", checked)}
                  />
                </div>

                <div className="flex items-center justify-between p-4 rounded-xl bg-gray-50 border border-gray-200">
                  <div>
                    <div className="font-semibold text-gray-900">Push Notifications</div>
                    <div className="text-sm text-gray-600">Send browser push notifications</div>
                  </div>
                  <Switch
                    checked={settings.notifications.pushNotifications}
                    onCheckedChange={(checked) => updateSettings("notifications", "pushNotifications", checked)}
                  />
                </div>
              </div>

              <Separator />

              <div className="space-y-4">
                <h4 className="font-semibold text-gray-900">Notification Types</h4>

                <div className="space-y-4">
                  <div className="flex items-center justify-between p-4 rounded-xl bg-blue-50 border border-blue-200">
                    <div>
                      <div className="font-semibold text-blue-900">Donation Alerts</div>
                      <div className="text-sm text-blue-700">Notify when donations are received</div>
                    </div>
                    <Switch
                      checked={settings.notifications.donationAlerts}
                      onCheckedChange={(checked) => updateSettings("notifications", "donationAlerts", checked)}
                    />
                  </div>

                  <div className="flex items-center justify-between p-4 rounded-xl bg-green-50 border border-green-200">
                    <div>
                      <div className="font-semibold text-green-900">Campaign Updates</div>
                      <div className="text-sm text-green-700">Notify about campaign milestones</div>
                    </div>
                    <Switch
                      checked={settings.notifications.campaignUpdates}
                      onCheckedChange={(checked) => updateSettings("notifications", "campaignUpdates", checked)}
                    />
                  </div>

                  <div className="flex items-center justify-between p-4 rounded-xl bg-purple-50 border border-purple-200">
                    <div>
                      <div className="font-semibold text-purple-900">Volunteer Notifications</div>
                      <div className="text-sm text-purple-700">Notify about volunteer activities</div>
                    </div>
                    <Switch
                      checked={settings.notifications.volunteerNotifications}
                      onCheckedChange={(checked) => updateSettings("notifications", "volunteerNotifications", checked)}
                    />
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="security" className="space-y-6">
          <Card className="hover:shadow-xl transition-all duration-300 border-0 shadow-lg">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Shield className="w-5 h-5 text-red-600" />
                Security Settings
              </CardTitle>
              <CardDescription>Configure security and access control settings</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center justify-between p-4 rounded-xl bg-red-50 border border-red-200">
                <div>
                  <div className="font-semibold text-red-900">Two-Factor Authentication</div>
                  <div className="text-sm text-red-700">Require 2FA for admin accounts</div>
                </div>
                <Switch
                  checked={settings.security.twoFactorAuth}
                  onCheckedChange={(checked) => updateSettings("security", "twoFactorAuth", checked)}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="sessionTimeout">Session Timeout (minutes)</Label>
                <Input
                  id="sessionTimeout"
                  type="number"
                  value={settings.security.sessionTimeout}
                  onChange={(e) => updateSettings("security", "sessionTimeout", Number.parseInt(e.target.value))}
                  placeholder="30"
                />
              </div>

              <Separator />

              <div className="space-y-4">
                <h4 className="font-semibold text-gray-900">Password Policy</h4>

                <div className="grid md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="minLength">Minimum Length</Label>
                    <Input
                      id="minLength"
                      type="number"
                      value={settings.security.passwordPolicy.minLength}
                      onChange={(e) =>
                        updateNestedSettings("security", "passwordPolicy", "minLength", Number.parseInt(e.target.value))
                      }
                      placeholder="8"
                    />
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="flex items-center justify-between p-4 rounded-xl bg-gray-50 border border-gray-200">
                    <div>
                      <div className="font-semibold text-gray-900">Require Uppercase Letters</div>
                      <div className="text-sm text-gray-600">Password must contain uppercase letters</div>
                    </div>
                    <Switch
                      checked={settings.security.passwordPolicy.requireUppercase}
                      onCheckedChange={(checked) =>
                        updateNestedSettings("security", "passwordPolicy", "requireUppercase", checked)
                      }
                    />
                  </div>

                  <div className="flex items-center justify-between p-4 rounded-xl bg-gray-50 border border-gray-200">
                    <div>
                      <div className="font-semibold text-gray-900">Require Numbers</div>
                      <div className="text-sm text-gray-600">Password must contain numbers</div>
                    </div>
                    <Switch
                      checked={settings.security.passwordPolicy.requireNumbers}
                      onCheckedChange={(checked) =>
                        updateNestedSettings("security", "passwordPolicy", "requireNumbers", checked)
                      }
                    />
                  </div>

                  <div className="flex items-center justify-between p-4 rounded-xl bg-gray-50 border border-gray-200">
                    <div>
                      <div className="font-semibold text-gray-900">Require Symbols</div>
                      <div className="text-sm text-gray-600">Password must contain special characters</div>
                    </div>
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

        <TabsContent value="appearance" className="space-y-6">
          <Card className="hover:shadow-xl transition-all duration-300 border-0 shadow-lg">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Palette className="w-5 h-5 text-pink-600" />
                Appearance Settings
              </CardTitle>
              <CardDescription>Customize the look and feel of your platform</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="theme">Theme</Label>
                  <Select
                    value={settings.appearance.theme}
                    onValueChange={(value) => updateSettings("appearance", "theme", value)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select theme" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="light">Light</SelectItem>
                      <SelectItem value="dark">Dark</SelectItem>
                      <SelectItem value="auto">Auto</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="fontFamily">Font Family</Label>
                  <Select
                    value={settings.appearance.fontFamily}
                    onValueChange={(value) => updateSettings("appearance", "fontFamily", value)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select font" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="inter">Inter</SelectItem>
                      <SelectItem value="roboto">Roboto</SelectItem>
                      <SelectItem value="opensans">Open Sans</SelectItem>
                      <SelectItem value="poppins">Poppins</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="grid md:grid-cols-3 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="primaryColor">Primary Color</Label>
                  <div className="flex gap-2">
                    <Input
                      id="primaryColor"
                      value={settings.appearance.primaryColor}
                      onChange={(e) => updateSettings("appearance", "primaryColor", e.target.value)}
                      placeholder="#3B82F6"
                    />
                    <div
                      className="w-10 h-10 rounded border border-gray-300"
                      style={{ backgroundColor: settings.appearance.primaryColor }}
                    ></div>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="secondaryColor">Secondary Color</Label>
                  <div className="flex gap-2">
                    <Input
                      id="secondaryColor"
                      value={settings.appearance.secondaryColor}
                      onChange={(e) => updateSettings("appearance", "secondaryColor", e.target.value)}
                      placeholder="#10B981"
                    />
                    <div
                      className="w-10 h-10 rounded border border-gray-300"
                      style={{ backgroundColor: settings.appearance.secondaryColor }}
                    ></div>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="accentColor">Accent Color</Label>
                  <div className="flex gap-2">
                    <Input
                      id="accentColor"
                      value={settings.appearance.accentColor}
                      onChange={(e) => updateSettings("appearance", "accentColor", e.target.value)}
                      placeholder="#F59E0B"
                    />
                    <div
                      className="w-10 h-10 rounded border border-gray-300"
                      style={{ backgroundColor: settings.appearance.accentColor }}
                    ></div>
                  </div>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="logoPosition">Logo Position</Label>
                <Select
                  value={settings.appearance.logoPosition}
                  onValueChange={(value) => updateSettings("appearance", "logoPosition", value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select position" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="left">Left</SelectItem>
                    <SelectItem value="center">Center</SelectItem>
                    <SelectItem value="right">Right</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="integrations" className="space-y-6">
          <Card className="hover:shadow-xl transition-all duration-300 border-0 shadow-lg">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Database className="w-5 h-5 text-indigo-600" />
                Third-Party Integrations
              </CardTitle>
              <CardDescription>Configure external service integrations</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <h4 className="font-semibold text-gray-900">Analytics & Tracking</h4>

                <div className="grid md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="googleAnalytics">Google Analytics ID</Label>
                    <Input
                      id="googleAnalytics"
                      value={settings.integrations.googleAnalytics}
                      onChange={(e) => updateSettings("integrations", "googleAnalytics", e.target.value)}
                      placeholder="GA-XXXXXXXXX-X"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="facebookPixel">Facebook Pixel ID</Label>
                    <Input
                      id="facebookPixel"
                      value={settings.integrations.facebookPixel}
                      onChange={(e) => updateSettings("integrations", "facebookPixel", e.target.value)}
                      placeholder="123456789012345"
                    />
                  </div>
                </div>
              </div>

              <Separator />

              <div className="space-y-4">
                <h4 className="font-semibold text-gray-900">File Storage (Cloudinary)</h4>

                <div className="grid md:grid-cols-3 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="cloudinaryCloudName">Cloud Name</Label>
                    <Input
                      id="cloudinaryCloudName"
                      value={settings.integrations.cloudinaryCloudName}
                      onChange={(e) => updateSettings("integrations", "cloudinaryCloudName", e.target.value)}
                      placeholder="your-cloud-name"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="cloudinaryApiKey">API Key</Label>
                    <Input
                      id="cloudinaryApiKey"
                      value={settings.integrations.cloudinaryApiKey}
                      onChange={(e) => updateSettings("integrations", "cloudinaryApiKey", e.target.value)}
                      placeholder="123456789012345"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="cloudinaryApiSecret">API Secret</Label>
                    <Input
                      id="cloudinaryApiSecret"
                      type="password"
                      value={settings.integrations.cloudinaryApiSecret}
                      onChange={(e) => updateSettings("integrations", "cloudinaryApiSecret", e.target.value)}
                      placeholder="••••••••"
                    />
                  </div>
                </div>
              </div>

              <div className="flex items-center justify-between p-4 rounded-xl bg-yellow-50 border border-yellow-200">
                <div className="flex items-center gap-3">
                  <AlertTriangle className="w-5 h-5 text-yellow-600" />
                  <div>
                    <div className="font-semibold text-yellow-900">Integration Status</div>
                    <div className="text-sm text-yellow-700">Some integrations require verification</div>
                  </div>
                </div>
                <Button
                  variant="outline"
                  className="border-yellow-300 text-yellow-700 hover:bg-yellow-100 bg-transparent"
                >
                  Test Connections
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
