"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { useMutation } from "@tanstack/react-query"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import { Badge } from "@/components/ui/badge"
import { toast } from "@/components/ui/use-toast"
import { Upload, X, Plus, Save, Eye } from "lucide-react"
import Image from "next/image"

interface CampaignFormData {
  title: string
  description: string
  longDescription: string
  goal: number
  startDate: string
  endDate: string
  location: string
  category: string
  image: string
  gallery: string[]
  featured: boolean
  status: "draft" | "active"
  tags: string[]
  beneficiaries: number
}

const categories = [
  { value: "education", label: "Education" },
  { value: "healthcare", label: "Healthcare" },
  { value: "environment", label: "Environment" },
  { value: "poverty", label: "Poverty Alleviation" },
  { value: "disaster-relief", label: "Disaster Relief" },
  { value: "women-empowerment", label: "Women Empowerment" },
  { value: "child-welfare", label: "Child Welfare" },
  { value: "elderly-care", label: "Elderly Care" },
]

export default function NewCampaignPage() {
  const router = useRouter()
  const [formData, setFormData] = useState<CampaignFormData>({
    title: "",
    description: "",
    longDescription: "",
    goal: 0,
    startDate: "",
    endDate: "",
    location: "",
    category: "",
    image: "",
    gallery: [],
    featured: false,
    status: "draft",
    tags: [],
    beneficiaries: 0,
  })
  const [newTag, setNewTag] = useState("")
  const [uploading, setUploading] = useState(false)

  const createCampaignMutation = useMutation({
    mutationFn: async (data: CampaignFormData) => {
      const response = await fetch("/api/campaigns", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      })
      if (!response.ok) throw new Error("Failed to create campaign")
      return response.json()
    },
    onSuccess: (data) => {
      toast({
        title: "Campaign created",
        description: "Your campaign has been successfully created.",
      })
      router.push(`/admin/campaigns/${data._id}`)
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to create campaign. Please try again.",
        variant: "destructive",
      })
    },
  })

  const uploadImage = async (file: File): Promise<string> => {
    const formData = new FormData()
    formData.append("file", file)
    formData.append("type", "campaign")

    const response = await fetch("/api/upload", {
      method: "POST",
      body: formData,
    })

    if (!response.ok) throw new Error("Failed to upload image")
    const data = await response.json()
    return data.url
  }

  const handleImageUpload = async (event: React.ChangeEvent<HTMLInputElement>, type: "main" | "gallery") => {
    const file = event.target.files?.[0]
    if (!file) return

    setUploading(true)
    try {
      const url = await uploadImage(file)
      if (type === "main") {
        setFormData((prev) => ({ ...prev, image: url }))
      } else {
        setFormData((prev) => ({ ...prev, gallery: [...prev.gallery, url] }))
      }
    } catch (error) {
      toast({
        title: "Upload failed",
        description: "Failed to upload image. Please try again.",
        variant: "destructive",
      })
    } finally {
      setUploading(false)
    }
  }

  const removeGalleryImage = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      gallery: prev.gallery.filter((_, i) => i !== index),
    }))
  }

  const addTag = () => {
    if (newTag.trim() && !formData.tags.includes(newTag.trim())) {
      setFormData((prev) => ({
        ...prev,
        tags: [...prev.tags, newTag.trim()],
      }))
      setNewTag("")
    }
  }

  const removeTag = (tag: string) => {
    setFormData((prev) => ({
      ...prev,
      tags: prev.tags.filter((t) => t !== tag),
    }))
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    // Validation
    if (!formData.title || !formData.description || !formData.longDescription) {
      toast({
        title: "Validation Error",
        description: "Please fill in all required fields.",
        variant: "destructive",
      })
      return
    }

    if (formData.goal <= 0) {
      toast({
        title: "Validation Error",
        description: "Goal amount must be greater than 0.",
        variant: "destructive",
      })
      return
    }

    if (new Date(formData.endDate) <= new Date(formData.startDate)) {
      toast({
        title: "Validation Error",
        description: "End date must be after start date.",
        variant: "destructive",
      })
      return
    }

    createCampaignMutation.mutate(formData)
  }

  const handlePreview = () => {
    // Store form data in localStorage for preview
    localStorage.setItem("campaignPreview", JSON.stringify(formData))
    window.open("/admin/campaigns/preview", "_blank")
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Create New Campaign</h1>
          <p className="text-gray-600 mt-2">Fill in the details to create a new fundraising campaign</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={handlePreview}>
            <Eye className="w-4 h-4 mr-2" />
            Preview
          </Button>
          <Button onClick={handleSubmit} disabled={createCampaignMutation.isPending}>
            <Save className="w-4 h-4 mr-2" />
            {createCampaignMutation.isPending ? "Creating..." : "Create Campaign"}
          </Button>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Basic Information */}
        <Card>
          <CardHeader>
            <CardTitle>Basic Information</CardTitle>
            <CardDescription>Essential details about your campaign</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="md:col-span-2">
                <Label htmlFor="title">Campaign Title *</Label>
                <Input
                  id="title"
                  value={formData.title}
                  onChange={(e) => setFormData((prev) => ({ ...prev, title: e.target.value }))}
                  placeholder="Enter campaign title"
                  required
                />
              </div>

              <div className="md:col-span-2">
                <Label htmlFor="description">Short Description *</Label>
                <Textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) => setFormData((prev) => ({ ...prev, description: e.target.value }))}
                  placeholder="Brief description of the campaign (max 500 characters)"
                  maxLength={500}
                  rows={3}
                  required
                />
                <div className="text-sm text-gray-500 mt-1">{formData.description.length}/500 characters</div>
              </div>

              <div className="md:col-span-2">
                <Label htmlFor="longDescription">Detailed Description *</Label>
                <Textarea
                  id="longDescription"
                  value={formData.longDescription}
                  onChange={(e) => setFormData((prev) => ({ ...prev, longDescription: e.target.value }))}
                  placeholder="Detailed description of the campaign, its goals, and impact"
                  rows={6}
                  required
                />
              </div>

              <div>
                <Label htmlFor="category">Category *</Label>
                <Select
                  value={formData.category}
                  onValueChange={(value) => setFormData((prev) => ({ ...prev, category: value }))}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select category" />
                  </SelectTrigger>
                  <SelectContent>
                    {categories.map((category) => (
                      <SelectItem key={category.value} value={category.value}>
                        {category.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="location">Location *</Label>
                <Input
                  id="location"
                  value={formData.location}
                  onChange={(e) => setFormData((prev) => ({ ...prev, location: e.target.value }))}
                  placeholder="Campaign location"
                  required
                />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Financial Details */}
        <Card>
          <CardHeader>
            <CardTitle>Financial & Timeline Details</CardTitle>
            <CardDescription>Set your fundraising goal and campaign timeline</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <Label htmlFor="goal">Fundraising Goal (₹) *</Label>
                <Input
                  id="goal"
                  type="number"
                  value={formData.goal || ""}
                  onChange={(e) => setFormData((prev) => ({ ...prev, goal: Number(e.target.value) }))}
                  placeholder="0"
                  min="1"
                  required
                />
              </div>

              <div>
                <Label htmlFor="startDate">Start Date *</Label>
                <Input
                  id="startDate"
                  type="date"
                  value={formData.startDate}
                  onChange={(e) => setFormData((prev) => ({ ...prev, startDate: e.target.value }))}
                  required
                />
              </div>

              <div>
                <Label htmlFor="endDate">End Date *</Label>
                <Input
                  id="endDate"
                  type="date"
                  value={formData.endDate}
                  onChange={(e) => setFormData((prev) => ({ ...prev, endDate: e.target.value }))}
                  required
                />
              </div>

              <div>
                <Label htmlFor="beneficiaries">Expected Beneficiaries</Label>
                <Input
                  id="beneficiaries"
                  type="number"
                  value={formData.beneficiaries || ""}
                  onChange={(e) => setFormData((prev) => ({ ...prev, beneficiaries: Number(e.target.value) }))}
                  placeholder="0"
                  min="0"
                />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Media */}
        <Card>
          <CardHeader>
            <CardTitle>Campaign Media</CardTitle>
            <CardDescription>Upload images to showcase your campaign</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* Main Image */}
            <div>
              <Label>Main Campaign Image *</Label>
              <div className="mt-2">
                {formData.image ? (
                  <div className="relative w-full h-48 rounded-lg overflow-hidden">
                    <Image
                      src={formData.image || "/event.png"}
                      alt="Campaign main image"
                      fill
                      className="object-cover"
                    />
                    <Button
                      type="button"
                      variant="destructive"
                      size="sm"
                      className="absolute top-2 right-2"
                      onClick={() => setFormData((prev) => ({ ...prev, image: "" }))}
                    >
                      <X className="w-4 h-4" />
                    </Button>
                  </div>
                ) : (
                  <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                    <Upload className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                    <p className="text-gray-600 mb-2">Upload main campaign image</p>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={(e) => handleImageUpload(e, "main")}
                      className="hidden"
                      id="main-image"
                    />
                    <Button type="button" variant="outline" asChild>
                      <label htmlFor="main-image" className="cursor-pointer">
                        Choose File
                      </label>
                    </Button>
                  </div>
                )}
              </div>
            </div>

            {/* Gallery */}
            <div>
              <Label>Gallery Images (Optional)</Label>
              <div className="mt-2 space-y-4">
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  {formData.gallery.map((image, index) => (
                    <div key={index} className="relative aspect-square rounded-lg overflow-hidden">
                      <Image
                        src={image || "/event.png"}
                        alt={`Gallery image ${index + 1}`}
                        fill
                        className="object-cover"
                      />
                      <Button
                        type="button"
                        variant="destructive"
                        size="sm"
                        className="absolute top-1 right-1"
                        onClick={() => removeGalleryImage(index)}
                      >
                        <X className="w-3 h-3" />
                      </Button>
                    </div>
                  ))}

                  {formData.gallery.length < 8 && (
                    <div className="aspect-square border-2 border-dashed border-gray-300 rounded-lg flex items-center justify-center">
                      <input
                        type="file"
                        accept="image/*"
                        onChange={(e) => handleImageUpload(e, "gallery")}
                        className="hidden"
                        id="gallery-image"
                      />
                      <label htmlFor="gallery-image" className="cursor-pointer text-center">
                        <Plus className="w-6 h-6 text-gray-400 mx-auto mb-1" />
                        <span className="text-sm text-gray-600">Add Image</span>
                      </label>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Tags and Settings */}
        <Card>
          <CardHeader>
            <CardTitle>Tags and Settings</CardTitle>
            <CardDescription>Add tags and configure campaign settings</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* Tags */}
            <div>
              <Label>Tags</Label>
              <div className="flex gap-2 mt-2">
                <Input
                  value={newTag}
                  onChange={(e) => setNewTag(e.target.value)}
                  placeholder="Add a tag"
                  onKeyPress={(e) => e.key === "Enter" && (e.preventDefault(), addTag())}
                />
                <Button type="button" onClick={addTag}>
                  <Plus className="w-4 h-4" />
                </Button>
              </div>
              {formData.tags.length > 0 && (
                <div className="flex flex-wrap gap-2 mt-2">
                  {formData.tags.map((tag) => (
                    <Badge key={tag} variant="secondary" className="cursor-pointer" onClick={() => removeTag(tag)}>
                      {tag} <X className="w-3 h-3 ml-1" />
                    </Badge>
                  ))}
                </div>
              )}
            </div>

            {/* Settings */}
            <div className="space-y-4">
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="featured"
                  checked={formData.featured}
                  onCheckedChange={(checked) => setFormData((prev) => ({ ...prev, featured: !!checked }))}
                />
                <Label htmlFor="featured">Mark as featured campaign</Label>
              </div>

              <div>
                <Label>Campaign Status</Label>
                <Select
                  value={formData.status}
                  onValueChange={(value: "draft" | "active") => setFormData((prev) => ({ ...prev, status: value }))}
                >
                  <SelectTrigger className="w-48">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="draft">Draft</SelectItem>
                    <SelectItem value="active">Active</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Submit Buttons */}
        <div className="flex justify-end gap-4">
          <Button type="button" variant="outline" onClick={() => router.back()}>
            Cancel
          </Button>
          <Button type="submit" disabled={createCampaignMutation.isPending || uploading}>
            {createCampaignMutation.isPending ? "Creating..." : "Create Campaign"}
          </Button>
        </div>
      </form>
    </div>
  )
}
