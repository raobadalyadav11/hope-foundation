"use client"

import { useEffect } from "react"
import { structuredData } from "@/lib/seo"

interface StructuredDataProps {
  type: "organization" | "website" | "article" | "event" | "fundraiser" | "faq" | "breadcrumb" | "review"
  data?: any
  faqs?: Array<{question: string, answer: string}>
  breadcrumbItems?: Array<{name: string, url: string}>
  testimonials?: Array<{name: string, content: string, rating: number}>
}

export default function StructuredData({ 
  type, 
  data, 
  faqs, 
  breadcrumbItems, 
  testimonials 
}: StructuredDataProps) {
  useEffect(() => {
    let structuredDataObj: any = null

    switch (type) {
      case "organization":
        structuredDataObj = structuredData.organization()
        break
      case "website":
        structuredDataObj = structuredData.website()
        break
      case "article":
        if (data) structuredDataObj = structuredData.article(data)
        break
      case "event":
        if (data) structuredDataObj = structuredData.event(data)
        break
      case "fundraiser":
        if (data) structuredDataObj = structuredData.fundraiser(data)
        break
      case "faq":
        if (faqs) structuredDataObj = structuredData.faq(faqs)
        break
      case "breadcrumb":
        if (breadcrumbItems) structuredDataObj = structuredData.breadcrumb(breadcrumbItems)
        break
      case "review":
        if (testimonials && testimonials.length > 0) {
          // For multiple testimonials, we'll return the first one as a sample
          structuredDataObj = structuredData.review(testimonials[0])
        }
        break
    }

    if (structuredDataObj) {
      const script = document.createElement("script")
      script.type = "application/ld+json"
      script.textContent = JSON.stringify(structuredDataObj, null, 2)
      document.head.appendChild(script)

      return () => {
        document.head.removeChild(script)
      }
    }
  }, [type, data, faqs, breadcrumbItems, testimonials])

  return null
}

// Breadcrumb component for easy integration
export function BreadcrumbStructuredData({ items }: { items: Array<{name: string, url: string}> }) {
  return <StructuredData type="breadcrumb" breadcrumbItems={items} />
}

// FAQ component for easy integration
export function FAQStructuredData({ faqs }: { faqs: Array<{question: string, answer: string}> }) {
  return <StructuredData type="faq" faqs={faqs} />
}

// Organization schema component
export function OrganizationStructuredData() {
  return <StructuredData type="organization" />
}

// Website schema component
export function WebsiteStructuredData() {
  return <StructuredData type="website" />
}

// Article schema component for blog posts
export function ArticleStructuredData({ post }: { post: any }) {
  return <StructuredData type="article" data={post} />
}

// Event schema component
export function EventStructuredData({ event }: { event: any }) {
  return <StructuredData type="event" data={event} />
}

// Fundraiser schema component for campaigns
export function FundraiserStructuredData({ campaign }: { campaign: any }) {
  return <StructuredData type="fundraiser" data={campaign} />
}

// Review schema component for testimonials
export function ReviewStructuredData({ testimonials }: { testimonials: Array<{name: string, content: string, rating: number}> }) {
  return <StructuredData type="review" testimonials={testimonials} />
}