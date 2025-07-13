import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Download, FileText, RefreshCw } from "lucide-react"
import { format } from "date-fns"
import { toast } from "sonner"

interface DonationHistoryProps {
  userId: string
}

export function DonationHistory({ userId }: DonationHistoryProps) {
  const [donations, setDonations] = useState<any[]>([])
  const [loading, setLoading] = useState(false)
  const [loaded, setLoaded] = useState(false)

  const fetchDonations = async () => {
    setLoading(true)
    try {
      const response = await fetch("/api/user/donations")
      if (response.ok) {
        const data = await response.json()
        setDonations(data.donations)
        setLoaded(true)
      } else {
        toast.error("Failed to load donation history")
      }
    } catch (error) {
      console.error("Error fetching donations:", error)
      toast.error("Failed to load donation history")
    } finally {
      setLoading(false)
    }
  }

  const downloadReceipt = async (donationId: string) => {
    try {
      const response = await fetch("/api/donations/receipt", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ donationId }),
      })

      const data = await response.json()

      if (response.ok) {
        // Open receipt in new window
        const receiptWindow = window.open("", "_blank")
        if (receiptWindow) {
          receiptWindow.document.write(atob(data.receipt))
          receiptWindow.document.close()
        } else {
          toast.error("Please allow pop-ups to view the receipt")
        }
      } else {
        toast.error(data.error || "Failed to generate receipt")
      }
    } catch (error) {
      console.error("Error downloading receipt:", error)
      toast.error("Failed to download receipt")
    }
  }

  if (!loaded && !loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Donation History</CardTitle>
        </CardHeader>
        <CardContent className="text-center py-6">
          <Button onClick={fetchDonations}>
            <RefreshCw className="w-4 h-4 mr-2" />
            Load Donation History
          </Button>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>Donation History</CardTitle>
        <Button variant="outline" size="sm" onClick={fetchDonations} disabled={loading}>
          <RefreshCw className={`w-4 h-4 mr-2 ${loading ? "animate-spin" : ""}`} />
          Refresh
        </Button>
      </CardHeader>
      <CardContent>
        {loading ? (
          <div className="text-center py-8">
            <RefreshCw className="w-8 h-8 animate-spin mx-auto text-blue-500" />
            <p className="mt-2 text-sm text-gray-500">Loading your donation history...</p>
          </div>
        ) : donations.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            <FileText className="w-12 h-12 mx-auto text-gray-300 mb-2" />
            <p>You haven't made any donations yet.</p>
          </div>
        ) : (
          <div className="space-y-4">
            {donations.map((donation) => (
              <div
                key={donation._id}
                className="border rounded-lg p-4 flex flex-col md:flex-row md:items-center justify-between"
              >
                <div className="space-y-1 mb-3 md:mb-0">
                  <div className="font-medium">
                    ₹{donation.amount.toLocaleString()} - {donation.cause ? donation.cause : "General Fund"}
                  </div>
                  <div className="text-sm text-gray-500">
                    {format(new Date(donation.createdAt), "PPP")} • {donation.status}
                  </div>
                  {donation.receiptNumber && (
                    <div className="text-xs text-gray-500">Receipt #{donation.receiptNumber}</div>
                  )}
                </div>
                {donation.status === "completed" && (
                  <Button size="sm" variant="outline" onClick={() => downloadReceipt(donation._id)}>
                    <Download className="w-4 h-4 mr-2" />
                    Receipt
                  </Button>
                )}
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  )
}