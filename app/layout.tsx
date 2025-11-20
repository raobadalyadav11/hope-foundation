import type React from "react"
import type { Metadata } from "next"
import { Poppins } from "next/font/google"
import "./globals.css"
import { Providers } from "@/components/providers"
import { Toaster } from "@/components/ui/toaster"
import { getDefaultMetadata, performance, analytics } from "@/lib/seo"
import Script from "next/script"

const poppins = Poppins({
  subsets: ["latin"],
  weight: ["100", "200", "300", "400", "500", "600", "700", "800", "900"],
  display: "swap",
  variable: "--font-poppins",
})

export const metadata: Metadata = getDefaultMetadata()

// Performance optimization: DNS prefetch for external resources
const dnsPrefetchDomains = [
  "fonts.googleapis.com",
  "fonts.gstatic.com",
  "checkout.razorpay.com",
  "cdn.razorpay.com",
  "js.stripe.com",
  "maps.googleapis.com",
  "www.google-analytics.com",
  "analytics.google.com",
]

// Preconnect to critical external domains
const preconnectDomains = [
  "fonts.googleapis.com",
  "fonts.gstatic.com",
  "checkout.razorpay.com",
  "www.google-analytics.com",
]

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <head>
        {/* DNS Prefetch for performance */}
        {dnsPrefetchDomains.map((domain) => (
          <link key={domain} rel="dns-prefetch" href={`https://${domain}`} />
        ))}
        
        {/* Preconnect to critical resources */}
        {preconnectDomains.map((domain) => (
          <link key={domain} rel="preconnect" href={`https://${domain}`} crossOrigin="anonymous" />
        ))}
        
        {/* Font preloading for optimal performance */}
        <link
          rel="preload"
          href="https://fonts.googleapis.com/css2?family=Poppins:wght@100;200;300;400;500;600;700;800;900&display=swap"
          as="style"
        />
        <noscript>
          <link
            rel="stylesheet"
            href="https://fonts.googleapis.com/css2?family=Poppins:wght@100;200;300;400;500;600;700;800;900&display=swap"
          />
        </noscript>
        
        {/* Google Analytics */}
        {process.env.GOOGLE_ANALYTICS_ID && (
          <>
            <Script
              src={`https://www.googletagmanager.com/gtag/js?id=${process.env.GOOGLE_ANALYTICS_ID}`}
              strategy="afterInteractive"
            />
            <Script id="google-analytics" strategy="afterInteractive">
              {`
                window.dataLayer = window.dataLayer || [];
                function gtag(){dataLayer.push(arguments);}
                gtag('js', new Date());
                gtag('config', '${process.env.GOOGLE_ANALYTICS_ID}', {
                  page_title: document.title,
                  page_location: window.location.href,
                });
              `}
            </Script>
          </>
        )}

        {/* Google Tag Manager */}
        {process.env.GOOGLE_TAG_MANAGER_ID && (
          <Script id="google-tag-manager" strategy="afterInteractive">
            {`
              (function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
              new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
              j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
              'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
              })(window,document,'script','dataLayer','${process.env.GOOGLE_TAG_MANAGER_ID}');
            `}
          </Script>
        )}

        {/* Facebook Pixel */}
        {process.env.FACEBOOK_PIXEL_ID && (
          <Script id="facebook-pixel" strategy="afterInteractive">
            {`
              !function(f,b,e,v,n,t,s)
              {if(f.fbq)return;n=f.fbq=function(){n.callMethod?
              n.callMethod.apply(n,arguments):n.queue.push(arguments)};
              if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
              n.queue=[];t=b.createElement(e);t.async=!0;
              t.src=v;s=b.getElementsByTagName(e)[0];
              s.parentNode.insertBefore(t,s)}(window,document,'script',
              'https://connect.facebook.net/en_US/fbevents.js');
              fbq('init', '${process.env.FACEBOOK_PIXEL_ID}');
              fbq('track', 'PageView');
            `}
          </Script>
        )}

        {/* Structured Data - Organization */}
        <Script
          id="structured-data-organization"
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "NGO",
              "name": "Hope Foundation",
              "url": process.env.NEXTAUTH_URL || "https://hopefoundation.org",
              "logo": `${process.env.NEXTAUTH_URL || "https://hopefoundation.org"}/logo.png`,
              "description": "Join us in our mission to create positive change in communities worldwide. Support our campaigns, volunteer with us, and help build a better tomorrow through sustainable development and humanitarian aid.",
              "address": {
                "@type": "PostalAddress",
                "streetAddress": "123 Hope Street",
                "addressLocality": "Mumbai",
                "addressRegion": "Maharashtra",
                "postalCode": "400001",
                "addressCountry": "India"
              },
              "contactPoint": {
                "@type": "ContactPoint",
                "telephone": "+91-22-1234-5678",
                "contactType": "customer service",
                "email": "info@hopefoundation.org"
              },
              "sameAs": [
                "https://facebook.com/hopefoundation",
                "https://linkedin.com/company/hopefoundation",
                "https://twitter.com/hopefoundation"
              ]
            })
          }}
        />
      </head>
      <body className={poppins.className}>
        {/* Google Tag Manager (no-script) */}
        {process.env.GOOGLE_TAG_MANAGER_ID && (
          <noscript>
            <iframe
              src={`https://www.googletagmanager.com/ns.html?id=${process.env.GOOGLE_TAG_MANAGER_ID}`}
              height="0"
              width="0"
              style={{ display: 'none', visibility: 'hidden' }}
            />
          </noscript>
        )}

        {/* Skip to main content for accessibility */}
        <a
          href="#main-content"
          className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 bg-blue-600 text-white px-4 py-2 rounded z-50"
        >
          Skip to main content
        </a>

        <Providers>
          <main id="main-content" role="main">
            {children}
          </main>
          <Toaster />
        </Providers>
      </body>
    </html>
  )
}
