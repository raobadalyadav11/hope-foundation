"use client"

import { useState } from "react"
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"
import { toast } from "@/components/ui/use-toast"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Search, Send, Mail, Bell, MessageSquare, XCircle, Clock, Plus, Eye, Trash2, Edit } from "lucide-react"

interface Notification {
  _id: string
  type: "email" | "in-app" | "sms"
  title: string
  message: string
  recipients: {
    type: "all" | "role" | "specific"
    roles?: string[]
    userIds?: string[]
    count: number
  }
  status: "draft" | "scheduled" | "sent" | "failed"
  scheduledAt?: string
  sentAt?: string
  deliveryStats: {
    sent: number
    delivered: number
    failed: number
    opened?: number
    clicked?: number
  }
  template?: string
  createdBy: {
    name: string
    email: string
  }
  createdAt: string
}

interface NotificationTemplate {
  _id: string
  name: string
  subject: string
  content: string
  type: "email" | "in-app" | "sms"
  variables: string[]
  isActive: boolean
  createdAt: string
}

const statusColors = {
  draft: "bg-gray-100 text-gray-800",
  scheduled: "bg-blue-100 text-blue-800",
  sent: "bg-green-100 text-green-800",
  failed: "bg-red-100 text-red-800",
}

const typeIcons = {
  email: Mail,
  "in-app": Bell,
  sms: MessageSquare,
}

export default function AdminNotificationsPage() {
  const queryClient = useQueryClient()
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedType, setSelectedType] = useState("all")
  const [selectedStatus, setSelectedStatus] = useState("all")
  const [currentPage, setCurrentPage] = useState(1)
  const [activeTab, setActiveTab] = useState("notifications")

  // New notification form state
  const [newNotificationDialog, setNewNotificationDialog] = useState(false)
  const [notificationForm, setNotificationForm] = useState({
    type: "email",
    title: "",
    message: "",
    recipientType: "all",
    selectedRoles: [] as string[],
    selectedUsers: [] as string[],
    scheduledAt: "",
    template: "",
  })

  // Template form state
  const [newTemplateDialog, setNewTemplateDialog] = useState(false)
  const [templateForm, setTemplateForm] = useState({
    name: "",
    subject: "",
    content: "",
    type: "email",
    variables: [] as string[],
  })

  const { data: notificationsData, isLoading } = useQuery({
    queryKey: ["admin-notifications", searchTerm, selectedType, selectedStatus, currentPage],
    queryFn: async () => {
      const params = new URLSearchParams({
        search: searchTerm,
        type: selectedType,
        status: selectedStatus,
        page: currentPage.toString(),
        limit: "10",
      })

      const response = await fetch(`/api/admin/notifications?${params}`)
      if (!response.ok) throw new Error("Failed to fetch notifications")
      return response.json()
    },
  })

  const { data: templatesData } = useQuery({
    queryKey: ["notification-templates"],
    queryFn: async () => {
      const response = await fetch("/api/admin/notification-templates")
      if (!response.ok) throw new Error("Failed to fetch templates")
      return response.json()
    },
  })

  const { data: usersData } = useQuery({
    queryKey: ["users-for-notifications"],
    queryFn: async () => {
      const response = await fetch("/api/admin/users?limit=1000&fields=name,email,role")
      if (!response.ok) throw new Error("Failed to fetch users")
      return response.json()
    },
  })

  const sendNotificationMutation = useMutation({
    mutationFn: async (notificationData: any) => {
      const response = await fetch("/api/admin/notifications", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(notificationData),
      })
      if (!response.ok) throw new Error("Failed to send notification")
      return response.json()
    },
    onSuccess: () => {
      toast({
        title: "Notification sent",
        description: "The notification has been sent successfully.",
      })
      queryClient.invalidateQueries({ queryKey: ["admin-notifications"] })
      setNewNotificationDialog(false)
      setNotificationForm({
        type: "email",
        title: "",
        message: "",
        recipientType: "all",
        selectedRoles: [],
        selectedUsers: [],
        scheduledAt: "",
        template: "",
      })
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to send notification. Please try again.",
        variant: "destructive",
      })
    },
  })

  const createTemplateMutation = useMutation({
    mutationFn: async (templateData: any) => {
      const response = await fetch("/api/admin/notification-templates", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(templateData),
      })
      if (!response.ok) throw new Error("Failed to create template")
      return response.json()
    },
    onSuccess: () => {
      toast({
        title: "Template created",
        description: "The notification template has been created successfully.",
      })
      queryClient.invalidateQueries({ queryKey: ["notification-templates"] })
      setNewTemplateDialog(false)
      setTemplateForm({
        name: "",
        subject: "",
        content: "",
        type: "email",
        variables: [],
      })
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to create template. Please try again.",
        variant: "destructive",
      })
    },
  })

  const deleteNotificationMutation = useMutation({
    mutationFn: async (notificationId: string) => {
      const response = await fetch(`/api/admin/notifications/${notificationId}`, {
        method: "DELETE",
      })
      if (!response.ok) throw new Error("Failed to delete notification")
      return response.json()
    },
    onSuccess: () => {
      toast({
        title: "Notification deleted",
        description: "The notification has been deleted successfully.",
      })
      queryClient.invalidateQueries({ queryKey: ["admin-notifications"] })
    },
  })

  const notifications = notificationsData?.notifications || []
  const pagination = notificationsData?.pagination || {}
  const templates = templatesData?.templates || []
  const users = usersData?.users || []

  const handleSendNotification = () => {
    const recipients = {
      type: notificationForm.recipientType,
      ...(notificationForm.recipientType === "role" && { roles: notificationForm.selectedRoles }),
      ...(notificationForm.recipientType === "specific" && { userIds: notificationForm.selectedUsers }),
    }

    sendNotificationMutation.mutate({
      ...notificationForm,
      recipients,
      ...(notificationForm.scheduledAt && { scheduledAt: new Date(notificationForm.scheduledAt).toISOString() }),
    })
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 p-6">
        <div className="max-w-7xl mx-auto">
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
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 bg-clip-text text-transparent">
              Notification Management
            </h1>
            <p className="text-gray-600 mt-2">Send and manage system-wide notifications</p>
          </div>
          <div className="flex gap-2">
            <Dialog open={newTemplateDialog} onOpenChange={setNewTemplateDialog}>
              <DialogTrigger asChild>
                <Button variant="outline" className="bg-white/80 border-gray-300">
                  <Plus className="w-4 h-4 mr-2" />
                  New Template
                </Button>
              </DialogTrigger>
            </Dialog>
            <Dialog open={newNotificationDialog} onOpenChange={setNewNotificationDialog}>
              <DialogTrigger asChild>
                <Button className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white shadow-lg">
                  <Send className="w-4 h-4 mr-2" />
                  Send Notification
                </Button>
              </DialogTrigger>
            </Dialog>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <Card className="bg-white/80 backdrop-blur-sm border-gray-200 shadow-xl hover:shadow-2xl transition-all duration-300">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-gray-700">Total Sent</CardTitle>
              <Send className="h-4 w-4 text-blue-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-gray-900">
                {notifications.filter((n: Notification) => n.status === "sent").length}
              </div>
              <p className="text-xs text-gray-600">Successfully delivered</p>
            </CardContent>
          </Card>

          <Card className="bg-white/80 backdrop-blur-sm border-gray-200 shadow-xl hover:shadow-2xl transition-all duration-300">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-gray-700">Scheduled</CardTitle>
              <Clock className="h-4 w-4 text-yellow-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-gray-900">
                {notifications.filter((n: Notification) => n.status === "scheduled").length}
              </div>
              <p className="text-xs text-gray-600">Pending delivery</p>
            </CardContent>
          </Card>

          <Card className="bg-white/80 backdrop-blur-sm border-gray-200 shadow-xl hover:shadow-2xl transition-all duration-300">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-gray-700">Failed</CardTitle>
              <XCircle className="h-4 w-4 text-red-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-gray-900">
                {notifications.filter((n: Notification) => n.status === "failed").length}
              </div>
              <p className="text-xs text-gray-600">Delivery failed</p>
            </CardContent>
          </Card>

          <Card className="bg-white/80 backdrop-blur-sm border-gray-200 shadow-xl hover:shadow-2xl transition-all duration-300">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-gray-700">Templates</CardTitle>
              <MessageSquare className="h-4 w-4 text-purple-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-gray-900">{templates.length}</div>
              <p className="text-xs text-gray-600">Available templates</p>
            </CardContent>
          </Card>
        </div>

        {/* Main Content */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="bg-white/80 backdrop-blur-sm border border-gray-200 p-1 rounded-xl">
            <TabsTrigger
              value="notifications"
              className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-blue-500 data-[state=active]:to-purple-500 data-[state=active]:text-white rounded-lg"
            >
              <Bell className="h-4 w-4 mr-2" />
              Notifications
            </TabsTrigger>
            <TabsTrigger
              value="templates"
              className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-green-500 data-[state=active]:to-teal-500 data-[state=active]:text-white rounded-lg"
            >
              <MessageSquare className="h-4 w-4 mr-2" />
              Templates
            </TabsTrigger>
          </TabsList>

          <TabsContent value="notifications" className="space-y-6">
            {/* Filters */}
            <Card className="bg-white/80 backdrop-blur-sm border-gray-200 shadow-xl">
              <CardHeader>
                <CardTitle className="text-xl font-bold text-gray-900">Filters</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                    <Input
                      placeholder="Search notifications..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-10 bg-white/80 border-gray-300 focus:border-blue-500 focus:ring-blue-500"
                    />
                  </div>

                  <Select value={selectedType} onValueChange={setSelectedType}>
                    <SelectTrigger className="bg-white/80 border-gray-300">
                      <SelectValue placeholder="Type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Types</SelectItem>
                      <SelectItem value="email">Email</SelectItem>
                      <SelectItem value="in-app">In-App</SelectItem>
                      <SelectItem value="sms">SMS</SelectItem>
                    </SelectContent>
                  </Select>

                  <Select value={selectedStatus} onValueChange={setSelectedStatus}>
                    <SelectTrigger className="bg-white/80 border-gray-300">
                      <SelectValue placeholder="Status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Status</SelectItem>
                      <SelectItem value="draft">Draft</SelectItem>
                      <SelectItem value="scheduled">Scheduled</SelectItem>
                      <SelectItem value="sent">Sent</SelectItem>
                      <SelectItem value="failed">Failed</SelectItem>
                    </SelectContent>
                  </Select>

                  <Button
                    onClick={() => {
                      setSearchTerm("")
                      setSelectedType("all")
                      setSelectedStatus("all")
                    }}
                    variant="outline"
                    className="bg-white/80 border-gray-300 hover:bg-gray-50"
                  >
                    Clear Filters
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Notifications List */}
            <div className="space-y-4">
              {notifications.length === 0 ? (
                <Card className="bg-white/80 backdrop-blur-sm border-gray-200 shadow-xl">
                  <CardContent className="text-center py-12">
                    <Bell className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">No notifications found</h3>
                    <p className="text-gray-600 mb-6">Try adjusting your search criteria or send a new notification.</p>
                    <Button onClick={() => setNewNotificationDialog(true)}>Send Notification</Button>
                  </CardContent>
                </Card>
              ) : (
                notifications.map((notification: Notification) => {
                  const TypeIcon = typeIcons[notification.type]
                  return (
                    <Card
                      key={notification._id}
                      className="bg-white/80 backdrop-blur-sm border-gray-200 shadow-xl hover:shadow-2xl transition-all duration-300"
                    >
                      <CardContent className="p-6">
                        <div className="flex items-start justify-between">
                          <div className="flex items-start gap-4 flex-1">
                            <div className="p-2 rounded-full bg-blue-100">
                              <TypeIcon className="h-5 w-5 text-blue-600" />
                            </div>

                            <div className="flex-1 min-w-0">
                              <div className="flex items-center gap-2 mb-2">
                                <h3 className="text-lg font-semibold text-gray-900">{notification.title}</h3>
                                <Badge className={statusColors[notification.status]}>{notification.status}</Badge>
                                <Badge variant="outline" className="capitalize">
                                  {notification.type}
                                </Badge>
                              </div>

                              <p className="text-gray-600 text-sm mb-3 line-clamp-2">{notification.message}</p>

                              <div className="flex items-center gap-4 text-sm text-gray-500 mb-3">
                                <span>To: {notification.recipients.count} recipients</span>
                                <span>By: {notification.createdBy.name}</span>
                                <span>{new Date(notification.createdAt).toLocaleDateString()}</span>
                                {notification.sentAt && (
                                  <span>Sent: {new Date(notification.sentAt).toLocaleDateString()}</span>
                                )}
                              </div>

                              {/* Delivery Stats */}
                              {notification.status === "sent" && (
                                <div className="flex items-center gap-4 text-sm">
                                  <span className="text-green-600">
                                    ✓ {notification.deliveryStats.delivered} delivered
                                  </span>
                                  {notification.deliveryStats.failed > 0 && (
                                    <span className="text-red-600">✗ {notification.deliveryStats.failed} failed</span>
                                  )}
                                  {notification.deliveryStats.opened && (
                                    <span className="text-blue-600">👁 {notification.deliveryStats.opened} opened</span>
                                  )}
                                </div>
                              )}
                            </div>
                          </div>

                          <div className="flex items-center gap-2">
                            <Button variant="ghost" size="sm">
                              <Eye className="w-4 h-4" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => deleteNotificationMutation.mutate(notification._id)}
                              className="text-red-600 hover:text-red-700"
                            >
                              <Trash2 className="w-4 h-4" />
                            </Button>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  )
                })
              )}
            </div>

            {/* Pagination */}
            {pagination.pages > 1 && (
              <div className="flex justify-center items-center gap-4">
                <Button
                  variant="outline"
                  onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                  disabled={currentPage === 1}
                  className="bg-white/80 border-gray-300"
                >
                  Previous
                </Button>
                <span className="text-sm text-gray-600">
                  Page {pagination.page} of {pagination.pages}
                </span>
                <Button
                  variant="outline"
                  onClick={() => setCurrentPage(Math.min(pagination.pages, currentPage + 1))}
                  disabled={currentPage === pagination.pages}
                  className="bg-white/80 border-gray-300"
                >
                  Next
                </Button>
              </div>
            )}
          </TabsContent>

          <TabsContent value="templates" className="space-y-6">
            {/* Templates List */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {templates.map((template: NotificationTemplate) => {
                const TypeIcon = typeIcons[template.type]
                return (
                  <Card
                    key={template._id}
                    className="bg-white/80 backdrop-blur-sm border-gray-200 shadow-xl hover:shadow-2xl transition-all duration-300"
                  >
                    <CardHeader>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <TypeIcon className="h-5 w-5 text-blue-600" />
                          <CardTitle className="text-lg">{template.name}</CardTitle>
                        </div>
                        <Badge variant={template.isActive ? "default" : "secondary"}>
                          {template.isActive ? "Active" : "Inactive"}
                        </Badge>
                      </div>
                      <CardDescription className="capitalize">{template.type} template</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-3">
                        <div>
                          <p className="text-sm font-medium text-gray-700">Subject:</p>
                          <p className="text-sm text-gray-600 line-clamp-1">{template.subject}</p>
                        </div>
                        <div>
                          <p className="text-sm font-medium text-gray-700">Variables:</p>
                          <div className="flex flex-wrap gap-1 mt-1">
                            {template.variables.map((variable) => (
                              <Badge key={variable} variant="outline" className="text-xs">
                                {variable}
                              </Badge>
                            ))}
                          </div>
                        </div>
                        <div className="flex justify-between items-center pt-2">
                          <span className="text-xs text-gray-500">
                            {new Date(template.createdAt).toLocaleDateString()}
                          </span>
                          <div className="flex gap-1">
                            <Button variant="ghost" size="sm">
                              <Eye className="w-4 h-4" />
                            </Button>
                            <Button variant="ghost" size="sm">
                              <Edit className="w-4 h-4" />
                            </Button>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                )
              })}
            </div>
          </TabsContent>
        </Tabs>

        {/* Send Notification Dialog */}
        <DialogContent className="bg-white/95 backdrop-blur-sm max-w-2xl">
          <DialogHeader>
            <DialogTitle>Send New Notification</DialogTitle>
            <DialogDescription>Create and send a notification to users across the platform.</DialogDescription>
          </DialogHeader>

          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="type">Notification Type</Label>
                <Select
                  value={notificationForm.type}
                  onValueChange={(value) => setNotificationForm((prev) => ({ ...prev, type: value }))}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="email">Email</SelectItem>
                    <SelectItem value="in-app">In-App</SelectItem>
                    <SelectItem value="sms">SMS</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="template">Template (Optional)</Label>
                <Select
                  value={notificationForm.template}
                  onValueChange={(value) => setNotificationForm((prev) => ({ ...prev, template: value }))}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select template" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="none">No template</SelectItem>
                    {templates
                      .filter((t: NotificationTemplate) => t.type === notificationForm.type)
                      .map((template: NotificationTemplate) => (
                        <SelectItem key={template._id} value={template._id}>
                          {template.name}
                        </SelectItem>
                      ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div>
              <Label htmlFor="title">Title</Label>
              <Input
                id="title"
                value={notificationForm.title}
                onChange={(e) => setNotificationForm((prev) => ({ ...prev, title: e.target.value }))}
                placeholder="Notification title"
              />
            </div>

            <div>
              <Label htmlFor="message">Message</Label>
              <Textarea
                id="message"
                value={notificationForm.message}
                onChange={(e) => setNotificationForm((prev) => ({ ...prev, message: e.target.value }))}
                placeholder="Notification message"
                rows={4}
              />
            </div>

            <div>
              <Label>Recipients</Label>
              <Select
                value={notificationForm.recipientType}
                onValueChange={(value) => setNotificationForm((prev) => ({ ...prev, recipientType: value }))}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Users</SelectItem>
                  <SelectItem value="role">By Role</SelectItem>
                  <SelectItem value="specific">Specific Users</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {notificationForm.recipientType === "role" && (
              <div>
                <Label>Select Roles</Label>
                <div className="flex flex-wrap gap-2 mt-2">
                  {["admin", "volunteer", "donor", "creator"].map((role) => (
                    <div key={role} className="flex items-center space-x-2">
                      <Checkbox
                        id={role}
                        checked={notificationForm.selectedRoles.includes(role)}
                        onCheckedChange={(checked) => {
                          if (checked) {
                            setNotificationForm((prev) => ({
                              ...prev,
                              selectedRoles: [...prev.selectedRoles, role],
                            }))
                          } else {
                            setNotificationForm((prev) => ({
                              ...prev,
                              selectedRoles: prev.selectedRoles.filter((r) => r !== role),
                            }))
                          }
                        }}
                      />
                      <Label htmlFor={role} className="capitalize">
                        {role}
                      </Label>
                    </div>
                  ))}
                </div>
              </div>
            )}

            <div>
              <Label htmlFor="scheduledAt">Schedule (Optional)</Label>
              <Input
                id="scheduledAt"
                type="datetime-local"
                value={notificationForm.scheduledAt}
                onChange={(e) => setNotificationForm((prev) => ({ ...prev, scheduledAt: e.target.value }))}
              />
            </div>

            <div className="flex justify-end gap-2">
              <Button variant="outline" onClick={() => setNewNotificationDialog(false)}>
                Cancel
              </Button>
              <Button
                onClick={handleSendNotification}
                disabled={sendNotificationMutation.isPending || !notificationForm.title || !notificationForm.message}
                className="bg-blue-600 hover:bg-blue-700 text-white"
              >
                {sendNotificationMutation.isPending ? "Sending..." : "Send Notification"}
              </Button>
            </div>
          </div>
        </DialogContent>

        {/* Create Template Dialog */}
        <DialogContent className="bg-white/95 backdrop-blur-sm max-w-2xl">
          <DialogHeader>
            <DialogTitle>Create Notification Template</DialogTitle>
            <DialogDescription>Create a reusable template for notifications.</DialogDescription>
          </DialogHeader>

          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="templateName">Template Name</Label>
                <Input
                  id="templateName"
                  value={templateForm.name}
                  onChange={(e) => setTemplateForm((prev) => ({ ...prev, name: e.target.value }))}
                  placeholder="Template name"
                />
              </div>

              <div>
                <Label htmlFor="templateType">Type</Label>
                <Select
                  value={templateForm.type}
                  onValueChange={(value) => setTemplateForm((prev) => ({ ...prev, type: value }))}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="email">Email</SelectItem>
                    <SelectItem value="in-app">In-App</SelectItem>
                    <SelectItem value="sms">SMS</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div>
              <Label htmlFor="templateSubject">Subject</Label>
              <Input
                id="templateSubject"
                value={templateForm.subject}
                onChange={(e) => setTemplateForm((prev) => ({ ...prev, subject: e.target.value }))}
                placeholder="Template subject"
              />
            </div>

            <div>
              <Label htmlFor="templateContent">Content</Label>
              <Textarea
                id="templateContent"
                value={templateForm.content}
                onChange={(e) => setTemplateForm((prev) => ({ ...prev, content: e.target.value }))}
                placeholder="Template content with variables like {{name}}, {{campaign}}"
                rows={6}
              />
            </div>

            <div className="flex justify-end gap-2">
              <Button variant="outline" onClick={() => setNewTemplateDialog(false)}>
                Cancel
              </Button>
              <Button
                onClick={() => createTemplateMutation.mutate(templateForm)}
                disabled={createTemplateMutation.isPending || !templateForm.name || !templateForm.content}
                className="bg-green-600 hover:bg-green-700 text-white"
              >
                {createTemplateMutation.isPending ? "Creating..." : "Create Template"}
              </Button>
            </div>
          </div>
        </DialogContent>
      </div>
    </div>
  )
}
