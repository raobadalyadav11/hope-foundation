"use client"

import type React from "react"

import { useState } from "react"
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { toast } from "@/components/ui/use-toast"
import {
  Search,
  Upload,
  ImageIcon,
  FileText,
  Video,
  Music,
  Download,
  Trash2,
  Eye,
  Copy,
  Grid,
  List,
  MoreHorizontal,
  FolderOpen,
  HardDrive,
} from "lucide-react"
import Image from "next/image"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"

interface FileItem {
  _id: string
  filename: string
  originalName: string
  url: string
  publicId: string
  size: number
  format: string
  resourceType: "image" | "video" | "raw"
  width?: number
  height?: number
  duration?: number
  usageCount: number
  usedIn: Array<{
    type: "campaign" | "event" | "blog" | "user"
    id: string
    title: string
  }>
  uploadedBy: {
    _id: string
    name: string
    email: string
  }
  tags: string[]
  createdAt: string
  updatedAt: string
}

interface StorageStats {
  totalFiles: number
  totalSize: number
  usedStorage: number
  storageLimit: number
  filesByType: {
    images: number
    videos: number
    documents: number
    others: number
  }
  sizeByType: {
    images: number
    videos: number
    documents: number
    others: number
  }
}

const fileTypeIcons = {
  image: ImageIcon,
  video: Video,
  audio: Music,
  document: FileText,
  other: FileText,
}

const getFileType = (format: string, resourceType: string) => {
  if (resourceType === "image") return "image"
  if (resourceType === "video") return "video"
  if (["mp3", "wav", "ogg", "m4a"].includes(format.toLowerCase())) return "audio"
  if (["pdf", "doc", "docx", "txt", "rtf"].includes(format.toLowerCase())) return "document"
  return "other"
}

const formatFileSize = (bytes: number) => {
  if (bytes === 0) return "0 Bytes"
  const k = 1024
  const sizes = ["Bytes", "KB", "MB", "GB"]
  const i = Math.floor(Math.log(bytes) / Math.log(k))
  return Number.parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i]
}

export default function AdminFilesPage() {
  const queryClient = useQueryClient()
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedType, setSelectedType] = useState("all")
  const [selectedUsage, setSelectedUsage] = useState("all")
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid")
  const [currentPage, setCurrentPage] = useState(1)
  const [uploadDialog, setUploadDialog] = useState(false)
  const [selectedFiles, setSelectedFiles] = useState<string[]>([])
  const [uploadProgress, setUploadProgress] = useState(0)

  const { data: filesData, isLoading } = useQuery({
    queryKey: ["admin-files", searchTerm, selectedType, selectedUsage, currentPage],
    queryFn: async () => {
      const params = new URLSearchParams({
        search: searchTerm,
        type: selectedType,
        usage: selectedUsage,
        page: currentPage.toString(),
        limit: "20",
      })

      const response = await fetch(`/api/admin/files?${params}`)
      if (!response.ok) throw new Error("Failed to fetch files")
      return response.json()
    },
  })

  const { data: storageStats } = useQuery({
    queryKey: ["storage-stats"],
    queryFn: async () => {
      const response = await fetch("/api/admin/files/stats")
      if (!response.ok) throw new Error("Failed to fetch storage stats")
      return response.json()
    },
  })

  const uploadFilesMutation = useMutation({
    mutationFn: async (files: FileList) => {
      const formData = new FormData()
      Array.from(files).forEach((file) => {
        formData.append("files", file)
      })

      const response = await fetch("/api/admin/files/upload", {
        method: "POST",
        body: formData,
      })
      if (!response.ok) throw new Error("Failed to upload files")
      return response.json()
    },
    onSuccess: () => {
      toast({
        title: "Files uploaded",
        description: "Files have been uploaded successfully.",
      })
      queryClient.invalidateQueries({ queryKey: ["admin-files"] })
      queryClient.invalidateQueries({ queryKey: ["storage-stats"] })
      setUploadDialog(false)
    },
    onError: () => {
      toast({
        title: "Upload failed",
        description: "Failed to upload files. Please try again.",
        variant: "destructive",
      })
    },
  })

  const deleteFilesMutation = useMutation({
    mutationFn: async (fileIds: string[]) => {
      const response = await fetch("/api/admin/files/delete", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ fileIds }),
      })
      if (!response.ok) throw new Error("Failed to delete files")
      return response.json()
    },
    onSuccess: () => {
      toast({
        title: "Files deleted",
        description: "Selected files have been deleted successfully.",
      })
      queryClient.invalidateQueries({ queryKey: ["admin-files"] })
      queryClient.invalidateQueries({ queryKey: ["storage-stats"] })
      setSelectedFiles([])
    },
    onError: () => {
      toast({
        title: "Delete failed",
        description: "Failed to delete files. Please try again.",
        variant: "destructive",
      })
    },
  })

  const files = filesData?.files || []
  const pagination = filesData?.pagination || {}
  const stats: StorageStats = storageStats || {
    totalFiles: 0,
    totalSize: 0,
    usedStorage: 0,
    storageLimit: 0,
    filesByType: { images: 0, videos: 0, documents: 0, others: 0 },
    sizeByType: { images: 0, videos: 0, documents: 0, others: 0 },
  }

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files
    if (files && files.length > 0) {
      uploadFilesMutation.mutate(files)
    }
  }

  const copyToClipboard = (url: string) => {
    navigator.clipboard.writeText(url)
    toast({
      title: "URL copied",
      description: "File URL has been copied to clipboard.",
    })
  }

  const toggleFileSelection = (fileId: string) => {
    setSelectedFiles((prev) => (prev.includes(fileId) ? prev.filter((id) => id !== fileId) : [...prev, fileId]))
  }

  const selectAllFiles = () => {
    if (selectedFiles.length === files.length) {
      setSelectedFiles([])
    } else {
      setSelectedFiles(files.map((file: FileItem) => file._id))
    }
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
              File Management
            </h1>
            <p className="text-gray-600 mt-2">Manage all uploaded media and documents</p>
          </div>
          <div className="flex gap-2">
            <Button
              variant="outline"
              onClick={() => setViewMode(viewMode === "grid" ? "list" : "grid")}
              className="bg-white/80 border-gray-300"
            >
              {viewMode === "grid" ? <List className="w-4 h-4" /> : <Grid className="w-4 h-4" />}
            </Button>
            <Dialog open={uploadDialog} onOpenChange={setUploadDialog}>
              <DialogTrigger asChild>
                <Button className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white shadow-lg">
                  <Upload className="w-4 h-4 mr-2" />
                  Upload Files
                </Button>
              </DialogTrigger>
              <DialogContent className="bg-white/95 backdrop-blur-sm">
                <DialogHeader>
                  <DialogTitle>Upload Files</DialogTitle>
                  <DialogDescription>Select files to upload to the media library.</DialogDescription>
                </DialogHeader>
                <div className="space-y-4">
                  <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
                    <Upload className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                    <p className="text-gray-600 mb-4">Drag and drop files here or click to browse</p>
                    <input
                      type="file"
                      multiple
                      accept="image/*,video/*,.pdf,.doc,.docx,.txt"
                      onChange={handleFileUpload}
                      className="hidden"
                      id="file-upload"
                    />
                    <Label htmlFor="file-upload" className="cursor-pointer">
                      <Button type="button" variant="outline">
                        Choose Files
                      </Button>
                    </Label>
                  </div>
                  {uploadFilesMutation.isPending && (
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span>Uploading...</span>
                        <span>{uploadProgress}%</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div
                          className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                          style={{ width: `${uploadProgress}%` }}
                        />
                      </div>
                    </div>
                  )}
                </div>
              </DialogContent>
            </Dialog>
          </div>
        </div>

        {/* Storage Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <Card className="bg-white/80 backdrop-blur-sm border-gray-200 shadow-xl hover:shadow-2xl transition-all duration-300">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-gray-700">Total Files</CardTitle>
              <FolderOpen className="h-4 w-4 text-blue-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-gray-900">{stats.totalFiles.toLocaleString()}</div>
              <p className="text-xs text-gray-600">Across all types</p>
            </CardContent>
          </Card>

          <Card className="bg-white/80 backdrop-blur-sm border-gray-200 shadow-xl hover:shadow-2xl transition-all duration-300">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-gray-700">Storage Used</CardTitle>
              <HardDrive className="h-4 w-4 text-green-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-gray-900">{formatFileSize(stats.usedStorage)}</div>
              <div className="w-full bg-gray-200 rounded-full h-2 mt-2">
                <div
                  className="bg-green-600 h-2 rounded-full"
                  style={{ width: `${(stats.usedStorage / stats.storageLimit) * 100}%` }}
                />
              </div>
              <p className="text-xs text-gray-600 mt-1">
                {((stats.usedStorage / stats.storageLimit) * 100).toFixed(1)}% of {formatFileSize(stats.storageLimit)}
              </p>
            </CardContent>
          </Card>

          <Card className="bg-white/80 backdrop-blur-sm border-gray-200 shadow-xl hover:shadow-2xl transition-all duration-300">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-gray-700">Images</CardTitle>
              <ImageIcon className="h-4 w-4 text-purple-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-gray-900">{stats.filesByType.images}</div>
              <p className="text-xs text-gray-600">{formatFileSize(stats.sizeByType.images)}</p>
            </CardContent>
          </Card>

          <Card className="bg-white/80 backdrop-blur-sm border-gray-200 shadow-xl hover:shadow-2xl transition-all duration-300">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-gray-700">Videos</CardTitle>
              <Video className="h-4 w-4 text-orange-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-gray-900">{stats.filesByType.videos}</div>
              <p className="text-xs text-gray-600">{formatFileSize(stats.sizeByType.videos)}</p>
            </CardContent>
          </Card>
        </div>

        {/* Filters and Actions */}
        <Card className="bg-white/80 backdrop-blur-sm border-gray-200 shadow-xl">
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="text-xl font-bold text-gray-900">Files</CardTitle>
              {selectedFiles.length > 0 && (
                <div className="flex items-center gap-2">
                  <span className="text-sm text-gray-600">{selectedFiles.length} selected</span>
                  <Button
                    variant="destructive"
                    size="sm"
                    onClick={() => deleteFilesMutation.mutate(selectedFiles)}
                    disabled={deleteFilesMutation.isPending}
                  >
                    <Trash2 className="w-4 h-4 mr-2" />
                    Delete Selected
                  </Button>
                </div>
              )}
            </div>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <Input
                  placeholder="Search files..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 bg-white/80 border-gray-300 focus:border-blue-500 focus:ring-blue-500"
                />
              </div>

              <Select value={selectedType} onValueChange={setSelectedType}>
                <SelectTrigger className="bg-white/80 border-gray-300">
                  <SelectValue placeholder="File Type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Types</SelectItem>
                  <SelectItem value="image">Images</SelectItem>
                  <SelectItem value="video">Videos</SelectItem>
                  <SelectItem value="document">Documents</SelectItem>
                  <SelectItem value="other">Others</SelectItem>
                </SelectContent>
              </Select>

              <Select value={selectedUsage} onValueChange={setSelectedUsage}>
                <SelectTrigger className="bg-white/80 border-gray-300">
                  <SelectValue placeholder="Usage" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Files</SelectItem>
                  <SelectItem value="used">Used</SelectItem>
                  <SelectItem value="unused">Unused</SelectItem>
                </SelectContent>
              </Select>

              <div className="flex gap-2">
                <Button variant="outline" size="sm" onClick={selectAllFiles} className="bg-white/80 border-gray-300">
                  {selectedFiles.length === files.length ? "Deselect All" : "Select All"}
                </Button>
                <Button
                  onClick={() => {
                    setSearchTerm("")
                    setSelectedType("all")
                    setSelectedUsage("all")
                  }}
                  variant="outline"
                  size="sm"
                  className="bg-white/80 border-gray-300 hover:bg-gray-50"
                >
                  Clear
                </Button>
              </div>
            </div>

            {/* Files Display */}
            {files.length === 0 ? (
              <div className="text-center py-12">
                <FolderOpen className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-gray-900 mb-2">No files found</h3>
                <p className="text-gray-600 mb-6">Upload some files to get started.</p>
                <Button onClick={() => setUploadDialog(true)}>Upload Files</Button>
              </div>
            ) : viewMode === "grid" ? (
              <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
                {files.map((file: FileItem) => {
                  const fileType = getFileType(file.format, file.resourceType)
                  const FileIcon = fileTypeIcons[fileType]
                  const isSelected = selectedFiles.includes(file._id)

                  return (
                    <Card
                      key={file._id}
                      className={`bg-white/80 backdrop-blur-sm border-gray-200 shadow-lg hover:shadow-xl transition-all duration-300 cursor-pointer ${
                        isSelected ? "ring-2 ring-blue-500 bg-blue-50/80" : ""
                      }`}
                      onClick={() => toggleFileSelection(file._id)}
                    >
                      <CardContent className="p-4">
                        <div className="aspect-square relative mb-3 rounded-lg overflow-hidden bg-gray-100">
                          {file.resourceType === "image" ? (
                            <Image
                              src={file.url || "/placeholder.svg"}
                              alt={file.originalName}
                              fill
                              className="object-cover"
                            />
                          ) : (
                            <div className="flex items-center justify-center h-full">
                              <FileIcon className="w-12 h-12 text-gray-400" />
                            </div>
                          )}
                          <div className="absolute top-2 right-2">
                            <DropdownMenu>
                              <DropdownMenuTrigger asChild onClick={(e) => e.stopPropagation()}>
                                <Button variant="ghost" size="sm" className="h-8 w-8 p-0 bg-white/80">
                                  <MoreHorizontal className="w-4 h-4" />
                                </Button>
                              </DropdownMenuTrigger>
                              <DropdownMenuContent align="end">
                                <DropdownMenuItem
                                  onClick={(e) => {
                                    e.stopPropagation()
                                    window.open(file.url, "_blank")
                                  }}
                                >
                                  <Eye className="w-4 h-4 mr-2" />
                                  View
                                </DropdownMenuItem>
                                <DropdownMenuItem
                                  onClick={(e) => {
                                    e.stopPropagation()
                                    copyToClipboard(file.url)
                                  }}
                                >
                                  <Copy className="w-4 h-4 mr-2" />
                                  Copy URL
                                </DropdownMenuItem>
                                <DropdownMenuItem
                                  onClick={(e) => {
                                    e.stopPropagation()
                                    const link = document.createElement("a")
                                    link.href = file.url
                                    link.download = file.originalName
                                    link.click()
                                  }}
                                >
                                  <Download className="w-4 h-4 mr-2" />
                                  Download
                                </DropdownMenuItem>
                                <DropdownMenuItem
                                  onClick={(e) => {
                                    e.stopPropagation()
                                    deleteFilesMutation.mutate([file._id])
                                  }}
                                  className="text-red-600"
                                >
                                  <Trash2 className="w-4 h-4 mr-2" />
                                  Delete
                                </DropdownMenuItem>
                              </DropdownMenuContent>
                            </DropdownMenu>
                          </div>
                        </div>

                        <div className="space-y-2">
                          <h4 className="font-medium text-sm text-gray-900 line-clamp-1">{file.originalName}</h4>
                          <div className="flex items-center justify-between text-xs text-gray-500">
                            <span>{formatFileSize(file.size)}</span>
                            <Badge variant="outline" className="text-xs">
                              {file.format.toUpperCase()}
                            </Badge>
                          </div>
                          {file.usageCount > 0 && (
                            <div className="text-xs text-green-600">
                              Used in {file.usageCount} place{file.usageCount !== 1 ? "s" : ""}
                            </div>
                          )}
                        </div>
                      </CardContent>
                    </Card>
                  )
                })}
              </div>
            ) : (
              <div className="space-y-2">
                {files.map((file: FileItem) => {
                  const fileType = getFileType(file.format, file.resourceType)
                  const FileIcon = fileTypeIcons[fileType]
                  const isSelected = selectedFiles.includes(file._id)

                  return (
                    <Card
                      key={file._id}
                      className={`bg-white/80 backdrop-blur-sm border-gray-200 shadow-lg hover:shadow-xl transition-all duration-300 cursor-pointer ${
                        isSelected ? "ring-2 ring-blue-500 bg-blue-50/80" : ""
                      }`}
                      onClick={() => toggleFileSelection(file._id)}
                    >
                      <CardContent className="p-4">
                        <div className="flex items-center gap-4">
                          <div className="w-12 h-12 rounded-lg overflow-hidden bg-gray-100 flex-shrink-0">
                            {file.resourceType === "image" ? (
                              <Image
                                src={file.url || "/placeholder.svg"}
                                alt={file.originalName}
                                width={48}
                                height={48}
                                className="object-cover w-full h-full"
                              />
                            ) : (
                              <div className="flex items-center justify-center h-full">
                                <FileIcon className="w-6 h-6 text-gray-400" />
                              </div>
                            )}
                          </div>

                          <div className="flex-1 min-w-0">
                            <h4 className="font-medium text-gray-900 line-clamp-1">{file.originalName}</h4>
                            <div className="flex items-center gap-4 text-sm text-gray-500 mt-1">
                              <span>{formatFileSize(file.size)}</span>
                              <span>{file.format.toUpperCase()}</span>
                              <span>Uploaded by {file.uploadedBy.name}</span>
                              <span>{new Date(file.createdAt).toLocaleDateString()}</span>
                            </div>
                            {file.usageCount > 0 && (
                              <div className="text-sm text-green-600 mt-1">
                                Used in {file.usageCount} place{file.usageCount !== 1 ? "s" : ""}
                              </div>
                            )}
                          </div>

                          <div className="flex items-center gap-2">
                            <Badge variant="outline">{file.format.toUpperCase()}</Badge>
                            <DropdownMenu>
                              <DropdownMenuTrigger asChild onClick={(e) => e.stopPropagation()}>
                                <Button variant="ghost" size="sm">
                                  <MoreHorizontal className="w-4 h-4" />
                                </Button>
                              </DropdownMenuTrigger>
                              <DropdownMenuContent align="end">
                                <DropdownMenuItem
                                  onClick={(e) => {
                                    e.stopPropagation()
                                    window.open(file.url, "_blank")
                                  }}
                                >
                                  <Eye className="w-4 h-4 mr-2" />
                                  View
                                </DropdownMenuItem>
                                <DropdownMenuItem
                                  onClick={(e) => {
                                    e.stopPropagation()
                                    copyToClipboard(file.url)
                                  }}
                                >
                                  <Copy className="w-4 h-4 mr-2" />
                                  Copy URL
                                </DropdownMenuItem>
                                <DropdownMenuItem
                                  onClick={(e) => {
                                    e.stopPropagation()
                                    const link = document.createElement("a")
                                    link.href = file.url
                                    link.download = file.originalName
                                    link.click()
                                  }}
                                >
                                  <Download className="w-4 h-4 mr-2" />
                                  Download
                                </DropdownMenuItem>
                                <DropdownMenuItem
                                  onClick={(e) => {
                                    e.stopPropagation()
                                    deleteFilesMutation.mutate([file._id])
                                  }}
                                  className="text-red-600"
                                >
                                  <Trash2 className="w-4 h-4 mr-2" />
                                  Delete
                                </DropdownMenuItem>
                              </DropdownMenuContent>
                            </DropdownMenu>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  )
                })}
              </div>
            )}

            {/* Pagination */}
            {pagination.pages > 1 && (
              <div className="flex justify-center items-center gap-4 mt-8">
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
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
