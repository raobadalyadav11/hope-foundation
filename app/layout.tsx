import type React from "react"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import { Providers } from "@/components/providers"
import { Toaster } from "@/components/ui/toaster"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: {
    default: "Hope Foundation - Making a Difference",
    template: "%s | Hope Foundation"
  },
  description: "Join us in our mission to create positive change in communities worldwide. Support our campaigns, volunteer with us, and help build a better tomorrow through sustainable development and humanitarian aid.",
  keywords: [
    "NGO", "charity", "donation", "volunteer", "social impact", 
    "community development", "education", "healthcare", "environment", 
    "humanitarian aid", "non-profit", "social change", "sustainability",
    "Hope Foundation", "donate online", "volunteer opportunities"
  ],
  authors: [
    {
      name: "Hope Foundation",
      url: "https://hopefoundation.org"
    }
  ],
  creator: "Hope Foundation",
  publisher: "Hope Foundation",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  metadataBase: new URL(process.env.NEXTAUTH_URL || "https://hopefoundation.org"),
  alternates: {
    canonical: "/",
  },
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "/",
    title: "Hope Foundation - Making a Difference",
    description: "Join us in our mission to create positive change in communities worldwide.",
    siteName: "Hope Foundation",
    images: [
      {
        url: "/og-image.jpg",
        width: 1200,
        height: 630,
        alt: "Hope Foundation - Making a Difference",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Hope Foundation - Making a Difference",
    description: "Join us in our mission to create positive change in communities worldwide.",
    images: ["/og-image.jpg"],
    creator: "@hopefoundation",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  verification: {
    google: process.env.GOOGLE_SITE_VERIFICATION,
    yandex: process.env.YANDEX_VERIFICATION,
  },
  category: "nonprofit",
  generator: "Next.js",
  referrer: "origin-when-cross-origin",
  other: {
    "mobile-web-app-capable": "yes",
    "apple-mobile-web-app-capable": "yes",
    "apple-mobile-web-app-status-bar-style": "default",
    "apple-mobile-web-app-title": "Hope Foundation",
    "application-name": "Hope Foundation",
    "msapplication-TileColor": "#2563eb",
    "theme-color": "#2563eb",
  }
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <Providers>
          {children}
          <Toaster />
        </Providers>
      </body>
    </html>
  )
}
