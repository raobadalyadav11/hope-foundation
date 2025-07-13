"use client"

import { useState } from "react"
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import { useSession } from "next-auth/react"
import { useParams, useRouter } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Separator } from "@/components/ui/separator"
import { toast } from "@/components/ui/use-toast"
import { Heart, Users, Calendar, MapPin, Share2, MessageCircle } from "lucide-react"
import Link from "next/link"
import Image from "next/image"

interface Campaign {
  _id: string
  title: string
  description: string
  longDescription: string
  goal: number
  raised: number
  image: string
  gallery: string[]
  category: string
  location: string
  beneficiaries: number
  startDate: string
  endDate: string
  status: string
  featured: boolean
  tags: string[]
  updates: Array<{
    _id: string
    title: string
    content: string
    image?: string
    date: string
  }>
  createdBy: {
    _id: string
    name: string
    email: string
  }
  createdAt: string
  progressPercentage: number
  daysLeft: number
  isExpired: boolean
}

interface Donation {
  _id: string
  donorName: string
  amount: number
  message?: string
  isAnonymous: boolean
  createdAt: string
}

export default function CampaignDetailPage() {
  const params = useParams()
  const router = useRouter()
  const { data: session } = useSession()
  const queryClient = useQueryClient()

  const [donationAmount, setDonationAmount] = useState("")
  const [donationMessage, setDonationMessage] = useState("")
  const [isAnonymous, setIsAnonymous] = useState(false)
  const [selectedImage, setSelectedImage] = useState(0)

  const { data: campaign, isLoading } = useQuery({
    queryKey: ["campaign", params.id],
    queryFn: async () => {
      const response = await fetch(`/api/campaigns/${params.id}`)
      if (!response.ok) throw new Error("Failed to fetch campaign")
      return response.json() as Promise<Campaign>
    },
  })

  const { data: donations } = useQuery({
    queryKey: ["campaign-donations", params.id],
    queryFn: async () => {
      const response = await fetch(`/api/campaigns/${params.id}/donations`)
      if (!response.ok) throw new Error("Failed to fetch donations")
      return response.json() as Promise<Donation[]>
    },
  })

  const { data: relatedCampaigns } = useQuery({
    queryKey: ["related-campaigns", campaign?.category],
    queryFn: async () => {
      if (!campaign?.category) return []
      const response = await fetch(`/api/campaigns?category=${campaign.category}&limit=3&exclude=${params.id}`)
      if (!response.ok) throw new Error("Failed to fetch related campaigns")
      const data = await response.json()
      return data.campaigns
    },
    enabled: !!campaign?.category,
  })

  const donateMutation = useMutation({
    mutationFn: async (donationData: any) => {
      const response = await fetch("/api/donations/create-order", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(donationData),
      })
      if (!response.ok) throw new Error("Failed to create donation")
      return response.json()
    },
    onSuccess: (data) => {
      // Initialize Razorpay payment
      const options = {
        key: data.key,
        amount: data.amount,
        currency: data.currency,
        order_id: data.orderId,
        name: "Hope Foundation",
        description: `Donation for ${campaign?.title}`,
        handler: async (response: any) => {
          try {
            const verifyResponse = await fetch("/api/donations/verify", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify(response),
            })

            if (verifyResponse.ok) {
              toast({
                title: "Donation Successful!",
                description: "Thank you for your generous contribution.",
              })
              queryClient.invalidateQueries({ queryKey: ["campaign", params.id] })
              queryClient.invalidateQueries({ queryKey: ["campaign-donations", params.id] })
              setDonationAmount("")
              setDonationMessage("")
            }
          } catch (error) {
            toast({
              title: "Payment Verification Failed",
              description: "Please contact support if amount was deducted.",
              variant: "destructive",
            })
          }
        },
        prefill: {
          name: session?.user?.name,
          email: session?.user?.email,
        },
        theme: {
          color: "#3B82F6",
        },
      }

      const razorpay = new (window as any).Razorpay(options)
      razorpay.open()
    },
    onError: () => {
      toast({
        title: "Donation Failed",
        description: "Please try again later.",
        variant: "destructive",
      })
    },
  })

  const handleDonate = () => {
    if (!session) {
      router.push("/auth/signin")
      return
    }

    if (!donationAmount || Number(donationAmount) < 1) {
      toast({
        title: "Invalid Amount",
        description: "Please enter a valid donation amount.",
        variant: "destructive",
      })
      return
    }

    donateMutation.mutate({
      amount: Number(donationAmount),
      campaignId: params.id,
      donorName: session.user.name,
      donorEmail: session.user.email,
      isAnonymous,
      message: donationMessage,
    })
  }

  const shareUrl = typeof window !== "undefined" ? window.location.href : ""

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: campaign?.title,
          text: campaign?.description,
          url: shareUrl,
        })
      } catch (error) {
        // Fallback to copying to clipboard
        navigator.clipboard.writeText(shareUrl)
        toast({
          title: "Link Copied!",
          description: "Campaign link copied to clipboard.",
        })
      }
    } else {
      navigator.clipboard.writeText(shareUrl)
      toast({
        title: "Link Copied!",
        description: "Campaign link copied to clipboard.",
      })
    }
  }

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading campaign details...</p>
        </div>
      </div>
    )
  }

  if (!campaign) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Campaign Not Found</h1>
          <p className="text-gray-600 mb-6">The campaign you're looking for doesn't exist or has been removed.</p>
          <Button asChild>
            <Link href="/campaigns">Browse Other Campaigns</Link>
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative">
        <div className="relative h-96 lg:h-[500px] overflow-hidden">
          <Image
            src={campaign.gallery?.[selectedImage] || campaign.image || "/event.png?height=500&width=1200"}
            alt={campaign.title}
            fill
            className="object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent"></div>

          {/* Image Gallery Navigation */}
          {campaign.gallery && campaign.gallery.length > 1 && (
            <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex gap-2">
              {campaign.gallery.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setSelectedImage(index)}
                  className={`w-3 h-3 rounded-full transition-colors ${
                    selectedImage === index ? "bg-white" : "bg-white/50"
                  }`}
                />
              ))}
            </div>
          )}

          <div className="absolute inset-0 flex items-end">
            <div className="container mx-auto px-4 pb-12">
              <div className="max-w-4xl">
                <div className="flex items-center gap-4 mb-4">
                  <Badge className="bg-white/20 text-white border-white/30">{campaign.category}</Badge>
                  {campaign.featured && <Badge className="bg-red-500 text-white">Featured</Badge>}
                  <Badge variant="outline" className="bg-white/20 text-white border-white/30">
                    {campaign.status}
                  </Badge>
                </div>
                <h1 className="text-4xl lg:text-5xl font-bold text-white mb-4">{campaign.title}</h1>
                <p className="text-xl text-white/90 mb-6 max-w-2xl">{campaign.description}</p>
                <div className="flex items-center gap-6 text-white/80">
                  <div className="flex items-center gap-2">
                    <MapPin className="w-5 h-5" />
                    <span>{campaign.location}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Users className="w-5 h-5" />
                    <span>{campaign.beneficiaries} beneficiaries</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Calendar className="w-5 h-5" />
                    <span>{campaign.daysLeft} days left</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <section className="py-12">
        <div className="container mx-auto px-4">
          <div className="grid lg:grid-cols-3 gap-12">
            {/* Main Content */}
            <div className="lg:col-span-2 space-y-8">
              {/* Progress Card */}
              <Card>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-2xl">Campaign Progress</CardTitle>
                    <Button variant="outline" size="sm" onClick={handleShare}>
                      <Share2 className="w-4 h-4 mr-2" />
                      Share
                    </Button>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex justify-between items-center">
                      <div>
                        <div className="text-3xl font-bold text-gray-900">₹{campaign.raised.toLocaleString()}</div>
                        <div className="text-gray-600">raised of ₹{campaign.goal.toLocaleString()} goal</div>
                      </div>
                      <div className="text-right">
                        <div className="text-2xl font-bold text-blue-600">{campaign.progressPercentage}%</div>
                        <div className="text-gray-600">funded</div>
                      </div>
                    </div>

                    <Progress value={campaign.progressPercentage} className="h-4" />

                    <div className="grid grid-cols-3 gap-4 pt-4 border-t">
                      <div className="text-center">
                        <div className="text-xl font-bold text-gray-900">{donations?.length || 0}</div>
                        <div className="text-sm text-gray-600">Donors</div>
                      </div>
                      <div className="text-center">
                        <div className="text-xl font-bold text-gray-900">{campaign.daysLeft}</div>
                        <div className="text-sm text-gray-600">Days Left</div>
                      </div>
                      <div className="text-center">
                        <div className="text-xl font-bold text-gray-900">
                          ₹{((campaign.goal - campaign.raised) / 1000).toFixed(0)}k
                        </div>
                        <div className="text-sm text-gray-600">Still Needed</div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Campaign Details */}
              <Tabs defaultValue="about" className="w-full">
                <TabsList className="grid w-full grid-cols-4">
                  <TabsTrigger value="about">About</TabsTrigger>
                  <TabsTrigger value="updates">Updates</TabsTrigger>
                  <TabsTrigger value="donors">Donors</TabsTrigger>
                  <TabsTrigger value="gallery">Gallery</TabsTrigger>
                </TabsList>

                <TabsContent value="about" className="space-y-6">
                  <Card>
                    <CardHeader>
                      <CardTitle>About This Campaign</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="prose max-w-none">
                        <p className="text-gray-700 leading-relaxed whitespace-pre-wrap">{campaign.longDescription}</p>
                      </div>

                      {campaign.tags && campaign.tags.length > 0 && (
                        <div className="mt-6">
                          <h4 className="font-semibold mb-3">Tags</h4>
                          <div className="flex flex-wrap gap-2">
                            {campaign.tags.map((tag) => (
                              <Badge key={tag} variant="secondary">
                                {tag}
                              </Badge>
                            ))}
                          </div>
                        </div>
                      )}

                      <div className="mt-6 pt-6 border-t">
                        <h4 className="font-semibold mb-3">Campaign Details</h4>
                        <div className="grid md:grid-cols-2 gap-4 text-sm">
                          <div>
                            <span className="font-medium text-gray-700">Start Date:</span>
                            <span className="ml-2 text-gray-600">
                              {new Date(campaign.startDate).toLocaleDateString()}
                            </span>
                          </div>
                          <div>
                            <span className="font-medium text-gray-700">End Date:</span>
                            <span className="ml-2 text-gray-600">
                              {new Date(campaign.endDate).toLocaleDateString()}
                            </span>
                          </div>
                          <div>
                            <span className="font-medium text-gray-700">Created By:</span>
                            <span className="ml-2 text-gray-600">{campaign.createdBy.name}</span>
                          </div>
                          <div>
                            <span className="font-medium text-gray-700">Campaign ID:</span>
                            <span className="ml-2 text-gray-600 font-mono text-xs">{campaign._id.slice(-8)}</span>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>

                <TabsContent value="updates" className="space-y-4">
                  {campaign.updates && campaign.updates.length > 0 ? (
                    campaign.updates.map((update) => (
                      <Card key={update._id}>
                        <CardHeader>
                          <div className="flex items-start justify-between">
                            <div>
                              <CardTitle className="text-lg">{update.title}</CardTitle>
                              <CardDescription>{new Date(update.date).toLocaleDateString()}</CardDescription>
                            </div>
                            <Badge variant="outline">Update</Badge>
                          </div>
                        </CardHeader>
                        <CardContent>
                          {update.image && (
                            <div className="relative h-48 mb-4 rounded-lg overflow-hidden">
                              <Image
                                src={update.image || "/event.png"}
                                alt={update.title}
                                fill
                                className="object-cover"
                              />
                            </div>
                          )}
                          <p className="text-gray-700 leading-relaxed whitespace-pre-wrap">{update.content}</p>
                        </CardContent>
                      </Card>
                    ))
                  ) : (
                    <Card>
                      <CardContent className="text-center py-12">
                        <MessageCircle className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                        <h3 className="text-lg font-semibold text-gray-900 mb-2">No Updates Yet</h3>
                        <p className="text-gray-600">Check back later for campaign updates and progress reports.</p>
                      </CardContent>
                    </Card>
                  )}
                </TabsContent>

                <TabsContent value="donors" className="space-y-4">
                  {donations && donations.length > 0 ? (
                    <Card>
                      <CardHeader>
                        <CardTitle>Recent Donors</CardTitle>
                        <CardDescription>Thank you to all our generous supporters</CardDescription>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-4">
                          {donations.slice(0, 10).map((donation) => (
                            <div
                              key={donation._id}
                              className="flex items-center justify-between py-3 border-b last:border-b-0"
                            >
                              <div className="flex items-center gap-3">
                                <Avatar>
                                  <AvatarFallback>
                                    {donation.isAnonymous ? "A" : donation.donorName.charAt(0)}
                                  </AvatarFallback>
                                </Avatar>
                                <div>
                                  <div className="font-medium">
                                    {donation.isAnonymous ? "Anonymous Donor" : donation.donorName}
                                  </div>
                                  {donation.message && (
                                    <div className="text-sm text-gray-600 italic">"{donation.message}"</div>
                                  )}
                                  <div className="text-xs text-gray-500">
                                    {new Date(donation.createdAt).toLocaleDateString()}
                                  </div>
                                </div>
                              </div>
                              <div className="text-right">
                                <div className="font-semibold text-green-600">₹{donation.amount.toLocaleString()}</div>
                              </div>
                            </div>
                          ))}
                        </div>
                      </CardContent>
                    </Card>
                  ) : (
                    <Card>
                      <CardContent className="text-center py-12">
                        <Heart className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                        <h3 className="text-lg font-semibold text-gray-900 mb-2">Be the First Donor</h3>
                        <p className="text-gray-600">
                          Your donation can be the first step towards achieving this goal.
                        </p>
                      </CardContent>
                    </Card>
                  )}
                </TabsContent>

                <TabsContent value="gallery">
                  {campaign.gallery && campaign.gallery.length > 0 ? (
                    <div className="grid md:grid-cols-2 gap-4">
                      {campaign.gallery.map((image, index) => (
                        <div key={index} className="relative h-64 rounded-lg overflow-hidden">
                          <Image
                            src={image || "/event.png"}
                            alt={`Campaign image ${index + 1}`}
                            fill
                            className="object-cover hover:scale-105 transition-transform duration-300"
                          />
                        </div>
                      ))}
                    </div>
                  ) : (
                    <Card>
                      <CardContent className="text-center py-12">
                        <div className="w-12 h-12 bg-gray-200 rounded-lg mx-auto mb-4 flex items-center justify-center">
                          <Image src="/event.png" alt="Placeholder" className="w-6 h-6 text-gray-400" />
                        </div>
                        <h3 className="text-lg font-semibold text-gray-900 mb-2">No Gallery Images</h3>
                        <p className="text-gray-600">More images will be added as the campaign progresses.</p>
                      </CardContent>
                    </Card>
                  )}
                </TabsContent>
              </Tabs>
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              {/* Donation Form */}
              <Card className="sticky top-6">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Heart className="w-5 h-5 text-red-500" />
                    Make a Donation
                  </CardTitle>
                  <CardDescription>Support this cause and help make a difference</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <label className="text-sm font-medium mb-2 block">Donation Amount (₹)</label>
                    <Input
                      type="number"
                      placeholder="Enter amount"
                      value={donationAmount}
                      onChange={(e) => setDonationAmount(e.target.value)}
                      min="1"
                    />
                  </div>

                  <div className="grid grid-cols-3 gap-2">
                    {[500, 1000, 2500].map((amount) => (
                      <Button
                        key={amount}
                        variant="outline"
                        size="sm"
                        onClick={() => setDonationAmount(amount.toString())}
                      >
                        ₹{amount}
                      </Button>
                    ))}
                  </div>

                  <div>
                    <label className="text-sm font-medium mb-2 block">Message (Optional)</label>
                    <Textarea
                      placeholder="Leave a message of support..."
                      value={donationMessage}
                      onChange={(e) => setDonationMessage(e.target.value)}
                      rows={3}
                    />
                  </div>

                  <div className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      id="anonymous"
                      checked={isAnonymous}
                      onChange={(e) => setIsAnonymous(e.target.checked)}
                      className="rounded"
                    />
                    <label htmlFor="anonymous" className="text-sm">
                      Donate anonymously
                    </label>
                  </div>

                  <Button
                    className="w-full"
                    size="lg"
                    onClick={handleDonate}
                    disabled={donateMutation.isPending || !donationAmount}
                  >
                    {donateMutation.isPending ? "Processing..." : "Donate Now"}
                  </Button>

                  <div className="text-xs text-gray-500 text-center">Secure payment powered by Razorpay</div>
                </CardContent>
              </Card>

              {/* Campaign Stats */}
              <Card>
                <CardHeader>
                  <CardTitle>Campaign Impact</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">Goal Amount</span>
                    <span className="font-semibold">₹{campaign.goal.toLocaleString()}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">Amount Raised</span>
                    <span className="font-semibold text-green-600">₹{campaign.raised.toLocaleString()}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">Beneficiaries</span>
                    <span className="font-semibold">{campaign.beneficiaries}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">Days Remaining</span>
                    <span className="font-semibold">{campaign.daysLeft}</span>
                  </div>
                  <Separator />
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">Success Rate</span>
                    <span className="font-semibold text-blue-600">{campaign.progressPercentage}%</span>
                  </div>
                </CardContent>
              </Card>

              {/* Related Campaigns */}
              {relatedCampaigns && relatedCampaigns.length > 0 && (
                <Card>
                  <CardHeader>
                    <CardTitle>Related Campaigns</CardTitle>
                    <CardDescription>Other campaigns you might be interested in</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {relatedCampaigns.map((relatedCampaign: any) => (
                      <div
                        key={relatedCampaign._id}
                        className="border rounded-lg p-3 hover:shadow-md transition-shadow"
                      >
                        <div className="flex gap-3">
                          <div className="relative w-16 h-16 rounded-lg overflow-hidden flex-shrink-0">
                            <Image
                              src={relatedCampaign.image || "/event.png?height=64&width=64"}
                              alt={relatedCampaign.title}
                              fill
                              className="object-cover"
                            />
                          </div>
                          <div className="flex-1 min-w-0">
                            <h4 className="font-medium text-sm line-clamp-2 mb-1">{relatedCampaign.title}</h4>
                            <div className="text-xs text-gray-600 mb-2">
                              ₹{relatedCampaign.raised.toLocaleString()} raised
                            </div>
                            <Progress value={relatedCampaign.progressPercentage} className="h-1" />
                          </div>
                        </div>
                        <Button variant="ghost" size="sm" className="w-full mt-3" asChild>
                          <Link href={`/campaigns/${relatedCampaign._id}`}>View Campaign</Link>
                        </Button>
                      </div>
                    ))}
                  </CardContent>
                </Card>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Razorpay Script */}
      <script src="https://checkout.razorpay.com/v1/checkout.js"></script>
    </div>
  )
}
