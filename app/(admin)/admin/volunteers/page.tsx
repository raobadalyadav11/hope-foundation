"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Search, UserCheck, UserX, MessageSquare } from "lucide-react"
import { toast } from "sonner"

interface Volunteer {
  _id: string
  userId: {
    _id: string
    name: string
    email: string
  }
  applicationStatus: "pending" | "approved" | "rejected"
  skills: string[]
  experience: string
  motivation: string
  availability: string
  preferredCauses: string[]
  totalHours: number
  rating: number
  createdAt: string
}

export default function AdminVolunteersPage() {
  const [volunteers, setVolunteers] = useState<Volunteer[]>([])
  const [loading, setLoading] = useState(true)
  const [filters, setFilters] = useState({
    status: "all",
    search: "",
  })
  const [reviewDialog, setReviewDialog] = useState<{
    open: boolean
    volunteer: Volunteer | null
  }>({
    open: false,
    volunteer: null,
  })
  const [reviewData, setReviewData] = useState({
    status: "",
    message: "",
  })

  const fetchVolunteers = async () => {
    try {
      setLoading(true)
      const params = new URLSearchParams()
      if (filters.status !== "all") params.append("status", filters.status)
      if (filters.search) params.append("search", filters.search)

      const response = await fetch(`/api/volunteers?${params}`)
      const data = await response.json()

      if (response.ok) {
        setVolunteers(data.volunteers || [])
      } else {
        toast.error(data.error || "Failed to fetch volunteers")
      }
    } catch (error) {
      toast.error("Failed to fetch volunteers")
    } finally {
      setLoading(false)
    }
  }

  const handleReview = async () => {
    if (!reviewDialog.volunteer) return

    try {
      const response = await fetch(`/api/volunteers/${reviewDialog.volunteer._id}/approve`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          status: reviewData.status,
          message: reviewData.message,
        }),
      })

      if (response.ok) {
        toast.success("Volunteer application reviewed successfully")
        setReviewDialog({ open: false, volunteer: null })
        setReviewData({ status: "", message: "" })
        fetchVolunteers()
      } else {
        const data = await response.json()
        toast.error(data.error || "Failed to review application")
      }
    } catch (error) {
      toast.error("Failed to review application")
    }
  }

  const getStatusBadge = (status: string) => {
    const variants: Record<string, "default" | "secondary" | "destructive" | "outline"> = {
      approved: "default",
      pending: "secondary",
      rejected: "destructive",
    }

    return <Badge variant={variants[status] || "outline"}>{status.charAt(0).toUpperCase() + status.slice(1)}</Badge>
  }

  useEffect(() => {
    fetchVolunteers()
  }, [filters])

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Volunteer Management</h1>
          <p className="text-muted-foreground">Review and manage volunteer applications</p>
        </div>
      </div>

      {/* Filters */}
      <Card>
        <CardHeader>
          <CardTitle>Filters</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-3">
            <div className="relative">
              <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search volunteers..."
                value={filters.search}
                onChange={(e) => setFilters({ ...filters, search: e.target.value })}
                className="pl-8"
              />
            </div>
            <Select value={filters.status} onValueChange={(value) => setFilters({ ...filters, status: value })}>
              <SelectTrigger>
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="pending">Pending</SelectItem>
                <SelectItem value="approved">Approved</SelectItem>
                <SelectItem value="rejected">Rejected</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Volunteers Table */}
      <Card>
        <CardHeader>
          <CardTitle>Volunteers</CardTitle>
          <CardDescription>All volunteer applications and profiles</CardDescription>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="flex items-center justify-center h-32">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Skills</TableHead>
                  <TableHead>Hours</TableHead>
                  <TableHead>Rating</TableHead>
                  <TableHead>Applied</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {volunteers.map((volunteer) => (
                  <TableRow key={volunteer._id}>
                    <TableCell className="font-medium">{volunteer.userId?.name || "Unknown"}</TableCell>
                    <TableCell>{volunteer.userId?.email || "Unknown"}</TableCell>
                    <TableCell>{getStatusBadge(volunteer.applicationStatus)}</TableCell>
                    <TableCell>
                      <div className="flex flex-wrap gap-1">
                        {volunteer.skills.slice(0, 2).map((skill) => (
                          <Badge key={skill} variant="outline" className="text-xs">
                            {skill}
                          </Badge>
                        ))}
                        {volunteer.skills.length > 2 && (
                          <Badge variant="outline" className="text-xs">
                            +{volunteer.skills.length - 2}
                          </Badge>
                        )}
                      </div>
                    </TableCell>
                    <TableCell>{volunteer.totalHours || 0}</TableCell>
                    <TableCell>{volunteer.rating ? volunteer.rating.toFixed(1) : "N/A"}</TableCell>
                    <TableCell>{new Date(volunteer.createdAt).toLocaleDateString()}</TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        {volunteer.applicationStatus === "pending" && (
                          <Dialog
                            open={reviewDialog.open && reviewDialog.volunteer?._id === volunteer._id}
                            onOpenChange={(open) =>
                              setReviewDialog({
                                open,
                                volunteer: open ? volunteer : null,
                              })
                            }
                          >
                            <DialogTrigger asChild>
                              <Button variant="outline" size="sm">
                                <MessageSquare className="h-4 w-4 mr-1" />
                                Review
                              </Button>
                            </DialogTrigger>
                            <DialogContent>
                              <DialogHeader>
                                <DialogTitle>Review Volunteer Application</DialogTitle>
                              </DialogHeader>
                              <div className="space-y-4">
                                <div>
                                  <h4 className="font-semibold">Applicant Details</h4>
                                  <p>Name: {volunteer.userId?.name}</p>
                                  <p>Email: {volunteer.userId?.email}</p>
                                  <p>Experience: {volunteer.experience}</p>
                                  <p>Motivation: {volunteer.motivation}</p>
                                  <p>Availability: {volunteer.availability}</p>
                                </div>
                                <div>
                                  <Label htmlFor="status">Decision</Label>
                                  <Select
                                    value={reviewData.status}
                                    onValueChange={(value) => setReviewData({ ...reviewData, status: value })}
                                  >
                                    <SelectTrigger>
                                      <SelectValue placeholder="Select decision" />
                                    </SelectTrigger>
                                    <SelectContent>
                                      <SelectItem value="approved">Approve</SelectItem>
                                      <SelectItem value="rejected">Reject</SelectItem>
                                    </SelectContent>
                                  </Select>
                                </div>
                                <div>
                                  <Label htmlFor="message">Message to Volunteer</Label>
                                  <Textarea
                                    id="message"
                                    value={reviewData.message}
                                    onChange={(e) => setReviewData({ ...reviewData, message: e.target.value })}
                                    placeholder="Optional message to include in the notification email"
                                  />
                                </div>
                                <Button onClick={handleReview} className="w-full">
                                  Submit Review
                                </Button>
                              </div>
                            </DialogContent>
                          </Dialog>
                        )}
                        {volunteer.applicationStatus === "approved" && (
                          <Button variant="ghost" size="sm" className="text-green-600">
                            <UserCheck className="h-4 w-4" />
                          </Button>
                        )}
                        {volunteer.applicationStatus === "rejected" && (
                          <Button variant="ghost" size="sm" className="text-red-600">
                            <UserX className="h-4 w-4" />
                          </Button>
                        )}
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
