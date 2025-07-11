import { Mail, Phone, MapPin, Heart, Facebook, Twitter, Instagram, Linkedin, Send } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import Link from "next/link"

export function Footer() {
  return (
    <footer className="bg-gradient-to-br from-gray-900 to-blue-900 text-white relative overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-10 left-10 w-20 h-20 bg-white rounded-full animate-pulse"></div>
        <div className="absolute top-32 right-20 w-16 h-16 bg-blue-300 rounded-full animate-bounce delay-1000"></div>
        <div className="absolute bottom-20 left-1/4 w-12 h-12 bg-green-300 rounded-full animate-pulse delay-500"></div>
      </div>

      <div className="container mx-auto px-4 py-16 relative z-10">
        <div className="grid md:grid-cols-4 gap-12">
          {/* Organization Info */}
          <div className="space-y-6">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-full flex items-center justify-center">
                <Heart className="w-6 h-6 text-white" />
              </div>
              <div>
                <div className="text-2xl font-bold">Hope Foundation</div>
                <div className="text-sm text-blue-200">Creating Change Together</div>
              </div>
            </div>
            <p className="text-gray-300 leading-relaxed">
              Making a difference in communities worldwide through sustainable development, education, and humanitarian
              aid. Join us in creating positive change that lasts.
            </p>
            <div className="flex space-x-4">
              <Button
                size="sm"
                variant="ghost"
                className="w-10 h-10 p-0 rounded-full bg-white/10 hover:bg-white/20 transition-colors"
              >
                <Facebook className="w-5 h-5" />
              </Button>
              <Button
                size="sm"
                variant="ghost"
                className="w-10 h-10 p-0 rounded-full bg-white/10 hover:bg-white/20 transition-colors"
              >
                <Twitter className="w-5 h-5" />
              </Button>
              <Button
                size="sm"
                variant="ghost"
                className="w-10 h-10 p-0 rounded-full bg-white/10 hover:bg-white/20 transition-colors"
              >
                <Instagram className="w-5 h-5" />
              </Button>
              <Button
                size="sm"
                variant="ghost"
                className="w-10 h-10 p-0 rounded-full bg-white/10 hover:bg-white/20 transition-colors"
              >
                <Linkedin className="w-5 h-5" />
              </Button>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-xl font-semibold mb-6 text-white">Quick Links</h3>
            <ul className="space-y-3">
              {[
                { href: "/about", label: "About Us" },
                { href: "/campaigns", label: "Our Campaigns" },
                { href: "/events", label: "Events" },
                { href: "/volunteer", label: "Volunteer" },
                { href: "/blog", label: "Blog" },
                { href: "/impact", label: "Our Impact" },
              ].map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-gray-300 hover:text-white transition-colors hover:translate-x-1 transform duration-200 inline-block"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Get Involved */}
          <div>
            <h3 className="text-xl font-semibold mb-6 text-white">Get Involved</h3>
            <ul className="space-y-3">
              {[
                { href: "/donate", label: "Make a Donation" },
                { href: "/sponsor", label: "Become a Sponsor" },
                { href: "/partnership", label: "Partnership" },
                { href: "/corporate", label: "Corporate CSR" },
                { href: "/fundraise", label: "Start Fundraising" },
              ].map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-gray-300 hover:text-white transition-colors hover:translate-x-1 transform duration-200 inline-block"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Newsletter & Contact */}
          <div>
            <h3 className="text-xl font-semibold mb-6 text-white">Stay Connected</h3>
            <div className="space-y-6">
              <div>
                <p className="text-gray-300 mb-4">Subscribe to our newsletter for updates</p>
                <div className="flex gap-2">
                  <Input
                    placeholder="Enter your email"
                    className="bg-white/10 border-white/20 text-white placeholder-gray-400 focus:border-blue-400"
                  />
                  <Button className="bg-gradient-to-r from-blue-500 to-indigo-500 hover:from-blue-600 hover:to-indigo-600 px-4">
                    <Send className="w-4 h-4" />
                  </Button>
                </div>
              </div>

              <div className="space-y-4">
                <div className="flex items-center gap-3 text-gray-300">
                  <div className="w-10 h-10 bg-white/10 rounded-full flex items-center justify-center">
                    <MapPin className="w-5 h-5 text-blue-400" />
                  </div>
                  <span>123 Hope Street, Mumbai, India 400001</span>
                </div>
                <div className="flex items-center gap-3 text-gray-300">
                  <div className="w-10 h-10 bg-white/10 rounded-full flex items-center justify-center">
                    <Phone className="w-5 h-5 text-green-400" />
                  </div>
                  <span>+91 98765 43210</span>
                </div>
                <div className="flex items-center gap-3 text-gray-300">
                  <div className="w-10 h-10 bg-white/10 rounded-full flex items-center justify-center">
                    <Mail className="w-5 h-5 text-purple-400" />
                  </div>
                  <span>info@hopefoundation.org</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="border-t border-white/20 mt-12 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
            <div className="text-center md:text-left">
              <p className="text-gray-400">© 2024 Hope Foundation. All rights reserved.</p>
              <p className="text-gray-500 text-sm mt-1">
                Designed with ❤️ by{" "}
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
              <Link href="/privacy" className="text-gray-400 hover:text-white transition-colors">
                Privacy Policy
              </Link>
              <Link href="/terms" className="text-gray-400 hover:text-white transition-colors">
                Terms of Service
              </Link>
              <Link href="/transparency" className="text-gray-400 hover:text-white transition-colors">
                Transparency
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}
