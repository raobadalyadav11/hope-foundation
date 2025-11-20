import { MetadataRoute } from "next"
import { siteConfig } from "@/lib/seo"

export default function robots(): MetadataRoute.Robots {
  const baseUrl = siteConfig.url

  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: [
        "/admin/",
        "/admin/dashboard/",
        "/api/",
        "/api/*",
        "/(auth)/",
        "/(auth)/*",
        "/(donor)/",
        "/(donor)/*",
        "/(volunteer)/",
        "/(volunteer)/*",
        "/error",
        "/404",
        "/500",
        "/_next/",
        "/_vercel/",
        "/node_modules/",
        "/.git/",
        "/*.json$",
        "/config/",
        "/scripts/",
        "/lib/*",
        "/components/ui/",
        "/hooks/",
        "/styles/",
        "/docs/",
        "/mongo.d.ts",
        "/next-auth.d.ts",
        "/components.json",
        "/postcss.config.mjs",
        "/package.json",
        "/tsconfig.json",
        "/.gitignore",
        "/.env.local",
        "/.env.development.local",
        "/.env.test.local",
        "/.env.production.local"
      ],
    },
    sitemap: `${baseUrl}/sitemap.xml`,
    host: baseUrl
  }
}