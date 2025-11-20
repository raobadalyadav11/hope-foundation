import { MetadataRoute } from "next"
import { siteConfig } from "@/lib/seo"

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = siteConfig.url

  // Static pages
  const staticPages = [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: "daily" as const,
      priority: 1.0,
    },
    {
      url: `${baseUrl}/about`,
      lastModified: new Date(),
      changeFrequency: "weekly" as const,
      priority: 0.8,
    },
    {
      url: `${baseUrl}/donate`,
      lastModified: new Date(),
      changeFrequency: "weekly" as const,
      priority: 0.9,
    },
    {
      url: `${baseUrl}/volunteer`,
      lastModified: new Date(),
      changeFrequency: "weekly" as const,
      priority: 0.8,
    },
    {
      url: `${baseUrl}/campaigns`,
      lastModified: new Date(),
      changeFrequency: "daily" as const,
      priority: 0.9,
    },
    {
      url: `${baseUrl}/events`,
      lastModified: new Date(),
      changeFrequency: "weekly" as const,
      priority: 0.7,
    },
    {
      url: `${baseUrl}/blog`,
      lastModified: new Date(),
      changeFrequency: "daily" as const,
      priority: 0.8,
    },
    {
      url: `${baseUrl}/impact`,
      lastModified: new Date(),
      changeFrequency: "monthly" as const,
      priority: 0.7,
    },
    {
      url: `${baseUrl}/transparency`,
      lastModified: new Date(),
      changeFrequency: "monthly" as const,
      priority: 0.6,
    },
    {
      url: `${baseUrl}/partnership`,
      lastModified: new Date(),
      changeFrequency: "monthly" as const,
      priority: 0.6,
    },
    {
      url: `${baseUrl}/sponsor`,
      lastModified: new Date(),
      changeFrequency: "monthly" as const,
      priority: 0.6,
    },
    {
      url: `${baseUrl}/fundraise`,
      lastModified: new Date(),
      changeFrequency: "monthly" as const,
      priority: 0.7,
    },
    {
      url: `${baseUrl}/contact`,
      lastModified: new Date(),
      changeFrequency: "monthly" as const,
      priority: 0.5,
    },
    {
      url: `${baseUrl}/privacy`,
      lastModified: new Date(),
      changeFrequency: "yearly" as const,
      priority: 0.3,
    },
    {
      url: `${baseUrl}/terms`,
      lastModified: new Date(),
      changeFrequency: "yearly" as const,
      priority: 0.3,
    },
  ]

  try {
    // Fetch dynamic content for sitemaps
    const [campaignsRes, eventsRes, blogsRes] = await Promise.all([
      fetch(`${baseUrl}/api/campaigns?status=active`, { 
        next: { revalidate: 3600 } // Revalidate every hour
      }),
      fetch(`${baseUrl}/api/events?upcoming=true`, { 
        next: { revalidate: 1800 } // Revalidate every 30 minutes
      }),
      fetch(`${baseUrl}/api/blogs?status=published`, { 
        next: { revalidate: 1800 } // Revalidate every 30 minutes
      }),
    ])

    const dynamicUrls: MetadataRoute.Sitemap = []

    // Add campaign URLs
    if (campaignsRes.ok) {
      const campaignsData = await campaignsRes.json()
      const campaigns = campaignsData.campaigns || []
      
      campaigns.forEach((campaign: any) => {
        if (campaign._id && campaign.status === 'active') {
          dynamicUrls.push({
            url: `${baseUrl}/campaigns/${campaign._id}`,
            lastModified: new Date(campaign.updatedAt || campaign.createdAt),
            changeFrequency: "weekly" as const,
            priority: 0.8,
          })
        }
      })
    }

    // Add event URLs
    if (eventsRes.ok) {
      const eventsData = await eventsRes.json()
      const events = eventsData.events || []
      
      events.forEach((event: any) => {
        if (event._id) {
          dynamicUrls.push({
            url: `${baseUrl}/events/${event._id}`,
            lastModified: new Date(event.updatedAt || event.createdAt),
            changeFrequency: "weekly" as const,
            priority: 0.7,
          })
        }
      })
    }

    // Add blog post URLs
    if (blogsRes.ok) {
      const blogsData = await blogsRes.json()
      const blogs = blogsData.blogs || []
      
      blogs.forEach((blog: any) => {
        if (blog.slug && blog.status === 'published') {
          dynamicUrls.push({
            url: `${baseUrl}/blog/${blog.slug}`,
            lastModified: new Date(blog.publishedAt || blog.updatedAt),
            changeFrequency: "weekly" as const,
            priority: 0.7,
          })
        }
      })
    }

    return [...staticPages, ...dynamicUrls]
  } catch (error) {
    console.error("Error generating sitemap:", error)
    return staticPages
  }
}