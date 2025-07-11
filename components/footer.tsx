import { Mail, Phone, MapPin } from "lucide-react"

export function Footer() {
  return (
    <footer className="bg-gray-100 py-12 border-t">
      <div className="container mx-auto px-4 grid md:grid-cols-3 gap-8">
        {/* Contact Info */}
        <div>
          <h3 className="font-semibold text-lg mb-3">Contact Us</h3>
          <div className="space-y-2 text-sm">
            <p className="flex items-center gap-2">
              <MapPin className="w-4 h-4 text-gray-500" />
              123 Hope Street, Mumbai, India
            </p>
            <p className="flex items-center gap-2">
              <Mail className="w-4 h-4 text-gray-500" />
              info@hopefoundation.org
            </p>
            <p className="flex items-center gap-2">
              <Phone className="w-4 h-4 text-gray-500" />
              +91 98765 43210
            </p>
          </div>
        </div>

        {/* Quick Links */}
        <div>
          <h3 className="font-semibold text-lg mb-3">Quick Links</h3>
          <ul className="space-y-2 text-sm">
            <li>
              <a href="/about" className="hover:text-blue-600 transition-colors">
                About Us
              </a>
            </li>
            <li>
              <a href="/campaigns" className="hover:text-blue-600 transition-colors">
                Campaigns
              </a>
            </li>
            <li>
              <a href="/events" className="hover:text-blue-600 transition-colors">
                Events
              </a>
            </li>
            <li>
              <a href="/blog" className="hover:text-blue-600 transition-colors">
                Blog
              </a>
            </li>
            <li>
              <a href="/contact" className="hover:text-blue-600 transition-colors">
                Contact
              </a>
            </li>
          </ul>
        </div>

        {/* Newsletter Signup */}
        <div>
          <h3 className="font-semibold text-lg mb-3">Subscribe to Newsletter</h3>
          <p className="text-sm text-gray-600 mb-4">
            Stay updated with our latest stories, impact reports, and updates directly in your inbox.
          </p>
          <div className="flex flex-col sm:flex-row gap-2">
            <input
              type="email"
              placeholder="Enter your email"
              className="border rounded-md px-3 py-2 text-sm text-gray-700 flex-grow"
            />
            <button className="bg-blue-600 text-white rounded-md px-4 py-2 text-sm hover:bg-blue-700 transition-colors">
              Subscribe
            </button>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 mt-8 text-center text-sm text-gray-500">
        &copy; {new Date().getFullYear()} Hope Foundation. All rights reserved. |
        <a href="/privacy" className="hover:underline ml-2">
          Privacy Policy
        </a>
        |
        <a href="/terms" className="hover:underline ml-2">
          Terms of Service
        </a>
      </div>
    </footer>
  )
}
