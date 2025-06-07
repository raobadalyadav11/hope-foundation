import Link from "next/link"
import { Heart, Mail, Phone, MapPin, Facebook, Twitter, Instagram, Linkedin } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"

export function Footer() {
  return (
    <footer className="bg-gray-900 text-white">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Organization Info */}
          <div className="space-y-4">
            <div className="flex items-center space-x-2">
              <Heart className="h-8 w-8 text-blue-400" />
              <span className="text-xl font-bold">Hope Foundation</span>
            </div>
            <p className="text-gray-300 text-sm leading-relaxed">
              Making a difference in communities worldwide through sustainable development, education, and humanitarian
              aid. Join us in creating positive change.
            </p>
            <div className="flex space-x-4">
              <Facebook className="h-5 w-5 text-gray-400 hover:text-blue-400 cursor-pointer transition-colors" />
              <Twitter className="h-5 w-5 text-gray-400 hover:text-blue-400 cursor-pointer transition-colors" />
              <Instagram className="h-5 w-5 text-gray-400 hover:text-blue-400 cursor-pointer transition-colors" />
              <Linkedin className="h-5 w-5 text-gray-400 hover:text-blue-400 cursor-pointer transition-colors" />
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Quick Links</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/about" className="text-gray-300 hover:text-white transition-colors text-sm">
                  About Us
                </Link>
              </li>
              <li>
                <Link href="/campaigns" className="text-gray-300 hover:text-white transition-colors text-sm">
                  Our Campaigns
                </Link>
              </li>
              <li>
                <Link href="/events" className="text-gray-300 hover:text-white transition-colors text-sm">
                  Events
                </Link>
              </li>
              <li>
                <Link href="/volunteer" className="text-gray-300 hover:text-white transition-colors text-sm">
                  Volunteer
                </Link>
              </li>
              <li>
                <Link href="/blog" className="text-gray-300 hover:text-white transition-colors text-sm">
                  Blog
                </Link>
              </li>
              <li>
                <Link href="/impact" className="text-gray-300 hover:text-white transition-colors text-sm">
                  Our Impact
                </Link>
              </li>
            </ul>
          </div>

          {/* Support */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Get Involved</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/donate" className="text-gray-300 hover:text-white transition-colors text-sm">
                  Make a Donation
                </Link>
              </li>
              <li>
                <Link href="/sponsor" className="text-gray-300 hover:text-white transition-colors text-sm">
                  Become a Sponsor
                </Link>
              </li>
              <li>
                <Link href="/partnership" className="text-gray-300 hover:text-white transition-colors text-sm">
                  Partnership
                </Link>
              </li>
              <li>
                <Link href="/corporate" className="text-gray-300 hover:text-white transition-colors text-sm">
                  Corporate CSR
                </Link>
              </li>
              <li>
                <Link href="/fundraise" className="text-gray-300 hover:text-white transition-colors text-sm">
                  Start Fundraising
                </Link>
              </li>
            </ul>
          </div>

          {/* Newsletter & Contact */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Stay Connected</h3>
            <div className="space-y-4">
              <div className="space-y-2">
                <p className="text-sm text-gray-300">Subscribe to our newsletter</p>
                <div className="flex space-x-2">
                  <Input
                    placeholder="Enter your email"
                    className="bg-gray-800 border-gray-700 text-white placeholder-gray-400 text-sm"
                  />
                  <Button size="sm" className="bg-blue-600 hover:bg-blue-700">
                    Subscribe
                  </Button>
                </div>
              </div>

              <div className="space-y-3">
                <div className="flex items-center space-x-3">
                  <MapPin className="h-4 w-4 text-blue-400 flex-shrink-0" />
                  <span className="text-gray-300 text-sm">123 Hope Street, Mumbai, India 400001</span>
                </div>
                <div className="flex items-center space-x-3">
                  <Phone className="h-4 w-4 text-blue-400 flex-shrink-0" />
                  <span className="text-gray-300 text-sm">+91 98765 43210</span>
                </div>
                <div className="flex items-center space-x-3">
                  <Mail className="h-4 w-4 text-blue-400 flex-shrink-0" />
                  <span className="text-gray-300 text-sm">info@hopefoundation.org</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="border-t border-gray-800 mt-8 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
            <div className="text-center md:text-left">
              <p className="text-gray-400 text-sm">© 2024 Hope Foundation. All rights reserved.</p>
              <p className="text-gray-500 text-xs mt-1">
                Designed and developed by{" "}
                <a
                  href="https://pracharprashar.in"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-400 hover:text-blue-300 transition-colors"
                >
                  Prachar Prashar Team
                </a>
              </p>
            </div>
            <div className="flex space-x-6">
              <Link href="/privacy" className="text-gray-400 hover:text-white text-sm transition-colors">
                Privacy Policy
              </Link>
              <Link href="/terms" className="text-gray-400 hover:text-white text-sm transition-colors">
                Terms of Service
              </Link>
              <Link href="/transparency" className="text-gray-400 hover:text-white text-sm transition-colors">
                Transparency
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}
