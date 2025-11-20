/**
 * Comprehensive SEO utilities and configurations for Hope Foundation
 */
import { ICampaign } from './models/Campaign'

// Base configuration
export const siteConfig = {
  name: "Hope Foundation",
  description: "Join us in our mission to create positive change in communities worldwide. Support our campaigns, volunteer with us, and help build a better tomorrow through sustainable development and humanitarian aid.",
  url: process.env.NEXTAUTH_URL || "https://hopefoundation.org",
  ogImage: "/og-image.jpg",
  twitterImage: "/og-image.jpg",
  keywords: [
    "NGO",
    "charity",
    "donation",
    "volunteer",
    "social impact",
    "community development",
    "education",
    "healthcare",
    "environment",
    "humanitarian aid",
    "non-profit",
    "social change",
    "sustainability",
    "Hope Foundation",
    "donate online",
    "volunteer opportunities"
  ],
  authors: [
    {
      name: "Hope Foundation",
      url: "https://hopefoundation.org"
    }
  ],
  creator: "Hope Foundation",
  publisher: "Hope Foundation",
  category: "nonprofit",
  twitterHandle: "@hopefoundation",
  facebookPage: "https://facebook.com/hopefoundation",
  linkedinPage: "https://linkedin.com/company/hopefoundation",
  address: {
    street: "123 Hope Street",
    city: "Mumbai",
    state: "Maharashtra",
    postalCode: "400001",
    country: "India"
  },
  phone: "+91-22-1234-5678",
  email: "info@hopefoundation.org",
  donationPhone: "+91-800-HOPE-NOW",
  organization: {
    name: "Hope Foundation",
    legalName: "Hope Foundation Charitable Trust",
    taxId: "12ABCDE3456F",
    established: "2010",
    registrationNumber: "MH/2010/123456",
    nonprofitStatus: "501(c)(3)",
    focusAreas: [
      "Education",
      "Healthcare",
      "Community Development",
      "Environmental Sustainability",
      "Disaster Relief",
      "Women Empowerment"
    ]
  },
  verification: {
    google: process.env.GOOGLE_SITE_VERIFICATION,
    yandex: process.env.YANDEX_VERIFICATION,
    bing: process.env.BING_VERIFICATION
  },
  analytics: {
    googleAnalyticsId: process.env.GOOGLE_ANALYTICS_ID,
    googleTagManagerId: process.env.GOOGLE_TAG_MANAGER_ID,
    facebookPixelId: process.env.FACEBOOK_PIXEL_ID
  }
}

// Default metadata template
export function getDefaultMetadata(): any {
  return {
    title: {
      default: `${siteConfig.name} - Making a Difference`,
      template: `%s | ${siteConfig.name}`
    },
    description: siteConfig.description,
    keywords: siteConfig.keywords,
    authors: siteConfig.authors,
    creator: siteConfig.creator,
    publisher: siteConfig.publisher,
    formatDetection: {
      email: false,
      address: false,
      telephone: false,
    },
    metadataBase: new URL(siteConfig.url),
    alternates: {
      canonical: "/",
    },
    openGraph: {
      type: "website",
      locale: "en_US",
      url: "/",
      title: `${siteConfig.name} - Making a Difference`,
      description: siteConfig.description,
      siteName: siteConfig.name,
      images: [
        {
          url: siteConfig.ogImage,
          width: 1200,
          height: 630,
          alt: `${siteConfig.name} - Making a Difference`,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: `${siteConfig.name} - Making a Difference`,
      description: siteConfig.description,
      images: [siteConfig.twitterImage],
      creator: siteConfig.twitterHandle,
      site: siteConfig.twitterHandle,
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
    verification: siteConfig.verification,
    category: siteConfig.category,
    referrer: "origin-when-cross-origin",
    other: {
      "mobile-web-app-capable": "yes",
      "apple-mobile-web-app-capable": "yes",
      "apple-mobile-web-app-status-bar-style": "default",
      "apple-mobile-web-app-title": siteConfig.name,
      "application-name": siteConfig.name,
      "msapplication-TileColor": "#2563eb",
      "theme-color": "#2563eb",
      "msapplication-config": "/browserconfig.xml",
    },
    manifest: "/manifest.json",
    icons: {
      icon: [
        { url: "/favicon-16x16.png", sizes: "16x16", type: "image/png" },
        { url: "/favicon-32x32.png", sizes: "32x32", type: "image/png" },
      ],
      apple: [
        { url: "/apple-touch-icon.png", sizes: "180x180", type: "image/png" },
      ],
      other: [
        { rel: "mask-icon", url: "/safari-pinned-tab.svg", color: "#2563eb" },
      ],
    },
  }
}

// Page-specific metadata generators
export const metadataGenerators = {
  // Home page
  home: () => ({
    title: "Hope Foundation - Creating Hope, Changing Lives",
    description: "Join us in our mission to create positive change in communities worldwide. Together, we can build a better tomorrow through sustainable development and humanitarian aid.",
    keywords: [...siteConfig.keywords, "make a difference", "support charity", "donate today"],
    alternates: { canonical: "/" },
    openGraph: {
      title: "Hope Foundation - Creating Hope, Changing Lives",
      description: "Join us in our mission to create positive change in communities worldwide. Together, we can build a better tomorrow through sustainable development and humanitarian aid.",
      url: "/",
      images: [
        {
          url: "/og-home.jpg",
          width: 1200,
          height: 630,
          alt: "Hope Foundation - Creating Hope, Changing Lives",
        },
      ],
    },
    twitter: {
      title: "Hope Foundation - Creating Hope, Changing Lives",
      description: "Join us in our mission to create positive change in communities worldwide. Together, we can build a better tomorrow through sustainable development and humanitarian aid.",
    },
  }),

  // About page
  about: () => ({
    title: "About Us - Our Mission, Vision & Impact",
    description: "Learn about Hope Foundation's journey since 2010, our mission to empower underserved communities, and our vision of creating a world where everyone has access to basic necessities and opportunities to thrive.",
    keywords: [...siteConfig.keywords, "about hope foundation", "our mission", "nonprofit impact", "charity transparency", "our team"],
    alternates: { canonical: "/about" },
    openGraph: {
      title: "About Us - Our Mission, Vision & Impact",
      description: "Learn about Hope Foundation's journey since 2010, our mission to empower underserved communities, and our vision of creating a world where everyone has access to basic necessities and opportunities to thrive.",
      url: "/about",
      images: [
        {
          url: "/og-about.jpg",
          width: 1200,
          height: 630,
          alt: "About Hope Foundation - Our Mission and Impact",
        },
      ],
    },
  }),

  // Donation page
  donate: () => ({
    title: "Donate Now - Make a Difference Today",
    description: "Support Hope Foundation's mission with your donation. 95% of donations go directly to programs helping communities worldwide. Secure online donations with tax benefits.",
    keywords: [...siteConfig.keywords, "donate online", "charity donation", "tax deductible", "secure donation", "support cause"],
    alternates: { canonical: "/donate" },
    openGraph: {
      title: "Donate Now - Make a Difference Today",
      description: "Support Hope Foundation's mission with your donation. 95% of donations go directly to programs helping communities worldwide. Secure online donations with tax benefits.",
      url: "/donate",
      images: [
        {
          url: "/og-donate.jpg",
          width: 1200,
          height: 630,
          alt: "Donate to Hope Foundation - Make a Difference Today",
        },
      ],
    },
    twitter: {
      title: "Donate Now - Make a Difference Today",
      description: "Support Hope Foundation's mission with your donation. 95% of donations go directly to programs helping communities worldwide.",
    },
  }),

  // Volunteer page
  volunteer: () => ({
    title: "Volunteer With Us - Join Our Mission",
    description: "Join Hope Foundation's volunteer program and be part of creating positive change. Find volunteer opportunities in education, healthcare, community development, and more.",
    keywords: [...siteConfig.keywords, "volunteer opportunities", "join volunteer program", "volunteer work", "community service", "make a difference"],
    alternates: { canonical: "/volunteer" },
    openGraph: {
      title: "Volunteer With Us - Join Our Mission",
      description: "Join Hope Foundation's volunteer program and be part of creating positive change. Find volunteer opportunities in education, healthcare, community development, and more.",
      url: "/volunteer",
      images: [
        {
          url: "/og-volunteer.jpg",
          width: 1200,
          height: 630,
          alt: "Volunteer with Hope Foundation - Join Our Mission",
        },
      ],
    },
  }),

  // Campaign detail page
  campaign: (campaign: ICampaign) => ({
    title: `${campaign.title} - Support This Cause`,
    description: campaign.description || `Help achieve the goal of ${campaign.goal ? `₹${campaign.goal.toLocaleString()}` : 'supporting this important cause'}. Every donation makes a difference.`,
    keywords: [
      ...siteConfig.keywords,
      campaign.category,
      campaign.title,
      "support campaign",
      "donate to cause",
      campaign.location,
    ].filter(Boolean),
    alternates: { canonical: `/campaigns/${campaign._id}` },
    openGraph: {
      title: `${campaign.title} - Support This Cause`,
      description: campaign.description || `Help achieve the goal of supporting this important cause. Every donation makes a difference.`,
      url: `/campaigns/${campaign._id}`,
      images: [
        {
          url: campaign.image || "/event.png",
          width: 1200,
          height: 630,
          alt: campaign.title,
        },
      ],
      type: "article",
      article: {
        publishedTime: campaign.createdAt,
        modifiedTime: campaign.updatedAt,
        authors: [typeof campaign.createdBy === 'object' && 'name' in campaign.createdBy ? campaign.createdBy.name : undefined].filter(Boolean),
        section: campaign.category,
        tags: campaign.tags,
      },
    },
    twitter: {
      title: `${campaign.title} - Support This Cause`,
      description: campaign.description || `Help achieve the goal of supporting this important cause. Every donation makes a difference.`,
    },
  }),

  // Blog post page
  blogPost: (post: any) => ({
    title: post.title,
    description: post.excerpt,
    keywords: [
      ...siteConfig.keywords,
      ...(post.tags || []),
      post.category,
      "hope foundation blog",
      "inspiring stories",
      "social impact stories"
    ].filter(Boolean),
    alternates: { canonical: `/blog/${post.slug}` },
    openGraph: {
      title: post.title,
      description: post.excerpt,
      url: `/blog/${post.slug}`,
      images: [
        {
          url: post.featuredImage || "/event.png",
          width: 1200,
          height: 630,
          alt: post.title,
        },
      ],
      type: "article",
      article: {
        publishedTime: post.publishedAt,
        modifiedTime: post.updatedAt,
        authors: [post.authorName].filter(Boolean),
        section: post.category,
        tags: post.tags,
      },
    },
    twitter: {
      title: post.title,
      description: post.excerpt,
    },
  }),

  // Event detail page
  event: (event: any) => ({
    title: `${event.title} - Join Our Event`,
    description: event.description,
    keywords: [
      ...siteConfig.keywords,
      event.category,
      event.title,
      "event registration",
      "community event",
      "volunteer event",
      event.location
    ].filter(Boolean),
    alternates: { canonical: `/events/${event._id}` },
    openGraph: {
      title: `${event.title} - Join Our Event`,
      description: event.description,
      url: `/events/${event._id}`,
      images: [
        {
          url: event.image || "/event.png",
          width: 1200,
          height: 630,
          alt: event.title,
        },
      ],
      type: "event",
      event: {
        startTime: event.date,
        location: event.location,
        attendanceMode: "offline",
      },
    },
    twitter: {
      title: `${event.title} - Join Our Event`,
      description: event.description,
    },
  }),

  // Impact/Transparency page
  impact: () => ({
    title: "Our Impact & Transparency - See Your Donations at Work",
    description: "Track our impact with complete transparency. See how your donations are making a difference in communities worldwide with detailed reports and real-time statistics.",
    keywords: [...siteConfig.keywords, "transparency reports", "impact tracking", "donation tracking", "charity accountability", "annual reports"],
    alternates: { canonical: "/impact" },
    openGraph: {
      title: "Our Impact & Transparency - See Your Donations at Work",
      description: "Track our impact with complete transparency. See how your donations are making a difference in communities worldwide with detailed reports and real-time statistics.",
      url: "/impact",
      images: [
        {
          url: "/og-impact.jpg",
          width: 1200,
          height: 630,
          alt: "Hope Foundation Impact and Transparency Reports",
        },
      ],
    },
  }),

  // Privacy policy
  privacy: () => ({
    title: "Privacy Policy - Hope Foundation",
    description: "Read Hope Foundation's privacy policy to understand how we collect, use, and protect your personal information in accordance with data protection regulations.",
    keywords: [...siteConfig.keywords, "privacy policy", "data protection", "personal information", "GDPR compliance"],
    alternates: { canonical: "/privacy" },
    robots: {
      index: true,
      follow: false,
    },
  }),

  // Terms of service
  terms: () => ({
    title: "Terms of Service - Hope Foundation",
    description: "Review Hope Foundation's terms of service and conditions for using our platform, making donations, and participating in our programs.",
    keywords: [...siteConfig.keywords, "terms of service", "user agreement", "conditions", "legal terms"],
    alternates: { canonical: "/terms" },
    robots: {
      index: true,
      follow: false,
    },
  }),

  // Contact page
  contact: () => ({
    title: "Contact Us - Get in Touch with Hope Foundation",
    description: "Contact Hope Foundation for any questions about donations, volunteering, partnerships, or our programs. We're here to help and answer your questions.",
    keywords: [...siteConfig.keywords, "contact charity", "get in touch", "customer support", "partnership inquiry", "volunteer contact"],
    alternates: { canonical: "/contact" },
    openGraph: {
      title: "Contact Us - Get in Touch with Hope Foundation",
      description: "Contact Hope Foundation for any questions about donations, volunteering, partnerships, or our programs. We're here to help and answer your questions.",
      url: "/contact",
      images: [
        {
          url: "/og-contact.jpg",
          width: 1200,
          height: 630,
          alt: "Contact Hope Foundation",
        },
      ],
    },
  }),
}

// Structured data generators
export const structuredData = {
  // Organization schema
  organization: () => ({
    "@context": "https://schema.org",
    "@type": "NGO",
    "name": siteConfig.organization.legalName,
    "alternateName": siteConfig.name,
    "url": siteConfig.url,
    "logo": `${siteConfig.url}/logo.png`,
    "foundingDate": siteConfig.organization.established,
    "taxID": siteConfig.organization.taxId,
    "registrationNumber": siteConfig.organization.registrationNumber,
    "nonprofitStatus": siteConfig.organization.nonprofitStatus,
    "address": {
      "@type": "PostalAddress",
      "streetAddress": siteConfig.address.street,
      "addressLocality": siteConfig.address.city,
      "addressRegion": siteConfig.address.state,
      "postalCode": siteConfig.address.postalCode,
      "addressCountry": siteConfig.address.country,
    },
    "contactPoint": [
      {
        "@type": "ContactPoint",
        "telephone": siteConfig.phone,
        "contactType": "customer service",
        "email": siteConfig.email,
      },
      {
        "@type": "ContactPoint",
        "telephone": siteConfig.donationPhone,
        "contactType": "donations",
        "email": siteConfig.email,
      }
    ],
    "sameAs": [
      siteConfig.facebookPage,
      siteConfig.linkedinPage,
      `https://twitter.com/${siteConfig.twitterHandle.replace('@', '')}`
    ].filter(Boolean),
    "hasOfferCatalog": {
      "@type": "OfferCatalog",
      "name": "Our Programs",
      "itemListElement": siteConfig.organization.focusAreas.map((area, index) => ({
        "@type": "Offer",
        "itemOffered": {
          "@type": "Service",
          "name": area,
          "description": `${area} programs and initiatives`
        }
      }))
    },
    "aggregateRating": {
      "@type": "AggregateRating",
      "ratingValue": "4.8",
      "reviewCount": "247",
      "bestRating": "5",
      "worstRating": "1"
    },
    "slogan": "Creating Hope, Changing Lives",
    "description": siteConfig.description,
    "founder": {
      "@type": "Person",
      "name": "Dr. Sarah Johnson",
      "jobTitle": "Founder & CEO"
    },
    "numberOfEmployees": "50-100",
    "areaServed": "Worldwide",
    "keywords": siteConfig.keywords.join(", ")
  }),

  // Website schema
  website: () => ({
    "@context": "https://schema.org",
    "@type": "WebSite",
    "name": siteConfig.name,
    "url": siteConfig.url,
    "description": siteConfig.description,
    "publisher": {
      "@type": "Organization",
      "name": siteConfig.name,
    },
    "potentialAction": [
      {
        "@type": "SearchAction",
        "target": {
          "@type": "EntryPoint",
          "urlTemplate": `${siteConfig.url}/search?q={search_term_string}`
        },
        "query-input": "required name=search_term_string"
      }
    ],
    "inLanguage": "en",
    "copyrightYear": new Date().getFullYear(),
    "copyrightHolder": {
      "@type": "Organization",
      "name": siteConfig.name,
    }
  }),

  // Breadcrumb schema
  breadcrumb: (items: Array<{name: string, url: string}>) => ({
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "itemListElement": items.map((item, index) => ({
      "@type": "ListItem",
      "position": index + 1,
      "name": item.name,
      "item": item.url
    }))
  }),

  // Article schema for blog posts
  article: (post: any) => ({
    "@context": "https://schema.org",
    "@type": "Article",
    "headline": post.title,
    "description": post.excerpt,
    "image": post.featuredImage ? `${siteConfig.url}${post.featuredImage}` : undefined,
    "author": {
      "@type": "Person",
      "name": post.authorName,
    },
    "publisher": {
      "@type": "Organization",
      "name": siteConfig.name,
      "logo": {
        "@type": "ImageObject",
        "url": `${siteConfig.url}/logo.png`,
      },
    },
    "datePublished": post.publishedAt,
    "dateModified": post.updatedAt || post.publishedAt,
    "mainEntityOfPage": {
      "@type": "WebPage",
      "@id": `${siteConfig.url}/blog/${post.slug}`,
    },
    "articleSection": post.category,
    "keywords": post.tags?.join(", "),
    "wordCount": post.content?.split(' ').length || 0,
    "timeRequired": post.readTime || "5 min read",
    "url": `${siteConfig.url}/blog/${post.slug}`,
    "sameAs": [
      `${siteConfig.url}/blog/${post.slug}`,
      post.socialShareUrl
    ].filter(Boolean),
    "interactionStatistic": [
      {
        "@type": "InteractionCounter",
        "interactionType": "https://schema.org/ReadAction",
        "userInteractionCount": post.views || 0
      },
      {
        "@type": "InteractionCounter",
        "interactionType": "https://schema.org/LikeAction",
        "userInteractionCount": post.likes || 0
      }
    ]
  }),

  // Event schema
  event: (event: any) => ({
    "@context": "https://schema.org",
    "@type": "Event",
    "name": event.title,
    "description": event.description,
    "image": event.image ? `${siteConfig.url}${event.image}` : undefined,
    "startDate": event.date,
    "endDate": event.endDate || event.date,
    "eventStatus": "https://schema.org/EventScheduled",
    "eventAttendanceMode": "https://schema.org/OfflineEventAttendanceMode",
    "location": {
      "@type": "Place",
      "name": event.location,
      "address": {
        "@type": "PostalAddress",
        "addressLocality": event.location,
        "addressCountry": "India"
      }
    },
    "organizer": {
      "@type": "Organization",
      "name": siteConfig.name,
      "url": siteConfig.url,
    },
    "offers": {
      "@type": "Offer",
      "url": `${siteConfig.url}/events/${event._id}`,
      "price": event.ticketPrice || "0",
      "priceCurrency": "INR",
      "availability": "https://schema.org/InStock",
      "validFrom": new Date().toISOString()
    },
    "maximumAttendeeCapacity": event.maxAttendees,
    "isAccessibleForFree": event.isFree,
    "url": `${siteConfig.url}/events/${event._id}`
  }),

  // Fundraiser/Campaign schema
  fundraiser: (campaign: ICampaign) => ({
    "@context": "https://schema.org",
    "@type": "Fundraiser",
    "name": campaign.title,
    "description": campaign.description,
    "image": campaign.image ? `${siteConfig.url}${campaign.image}` : undefined,
    "url": `${siteConfig.url}/campaigns/${campaign._id}`,
    "startDate": campaign.startDate,
    "endDate": campaign.endDate,
    "organizer": {
      "@type": "Organization",
      "name": siteConfig.name,
      "url": siteConfig.url,
    },
    "location": {
      "@type": "Place",
      "name": campaign.location,
    },
    "donationAmount": {
      "@type": "MonetaryAmount",
      "currency": "INR",
      "value": campaign.goal || 0
    },
    "donationReceived": {
      "@type": "MonetaryAmount",
      "currency": "INR",
      "value": campaign.raised || 0
    },
    "beneficiary": campaign.beneficiaries,
    "category": campaign.category,
    "targetAudience": {
      "@type": "Audience",
      "audienceType": "General Public"
    }
  }),

  // FAQ schema
  faq: (faqs: Array<{question: string, answer: string}>) => ({
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": faqs.map(faq => ({
      "@type": "Question",
      "name": faq.question,
      "acceptedAnswer": {
        "@type": "Answer",
        "text": faq.answer
      }
    }))
  }),

  // Review schema
  review: (testimonial: any) => ({
    "@context": "https://schema.org",
    "@type": "Review",
    "reviewRating": {
      "@type": "Rating",
      "ratingValue": testimonial.rating || 5,
      "bestRating": 5,
      "worstRating": 1
    },
    "author": {
      "@type": "Person",
      "name": testimonial.name
    },
    "reviewBody": testimonial.content,
    "itemReviewed": {
      "@type": "Organization",
      "name": siteConfig.name,
      "url": siteConfig.url
    }
  })
}

// Performance optimization helpers
export const performance = {
  // Generate preload links for critical resources
  getPreloadLinks: (paths: string[]) => {
    return paths.map(path => ({
      rel: "preload",
      href: path,
      as: "fetch",
      crossOrigin: "anonymous"
    }))
  },

  // Generate DNS prefetch for external resources
  getDnsPrefetch: (domains: string[]) => {
    return domains.map(domain => ({
      rel: "dns-prefetch",
      href: domain
    }))
  },

  // Generate preconnect for external resources
  getPreconnect: (domains: string[]) => {
    return domains.map(domain => ({
      rel: "preconnect",
      href: domain
    }))
  }
}

// Accessibility helpers
export const accessibility = {
  // Generate skip link
  skipLink: () => ({
    rel: "skip",
    href: "#main-content",
    children: "Skip to main content"
  }),

  // Generate ARIA labels for common elements
  ariaLabels: {
    donate: "Make a donation to support our cause",
    volunteer: "Join our volunteer program",
    share: "Share this content",
    donateButton: "Donate now to support this campaign",
    volunteerButton: "Apply to volunteer for this opportunity",
    newsletter: "Subscribe to our newsletter for updates",
    search: "Search our website",
    menu: "Main navigation menu",
    close: "Close dialog or menu",
    readMore: "Read full article",
    viewAll: "View all items in this section"
  }
}

// Analytics helpers
export const analytics = {
  // Google Analytics event tracking
  trackEvent: (eventName: string, params?: Record<string, any>) => {
    if (typeof window !== 'undefined' && (window as any).gtag) {
      (window as any).gtag('event', eventName, params)
    }
  },

  // Track page view
  trackPageView: (path: string, title?: string) => {
    if (typeof window !== 'undefined' && (window as any).gtag) {
      (window as any).gtag('config', siteConfig.analytics.googleAnalyticsId, {
        page_path: path,
        page_title: title
      })
    }
  },

  // Track donation
  trackDonation: (amount: number, campaignId?: string) => {
    analytics.trackEvent('donation', {
      currency: 'INR',
      value: amount,
      campaign_id: campaignId
    })
  },

  // Track volunteer signup
  trackVolunteer: (interestArea: string) => {
    analytics.trackEvent('volunteer_signup', {
      interest_area: interestArea
    })
  },

  // Track newsletter signup
  trackNewsletter: (source: string = 'website') => {
    analytics.trackEvent('newsletter_signup', {
      source: source
    })
  }
}

export default {
  siteConfig,
  getDefaultMetadata,
  metadataGenerators,
  structuredData,
  performance,
  accessibility,
  analytics
}