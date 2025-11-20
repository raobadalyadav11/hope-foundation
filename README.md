# Hope Foundation - Making a Difference Together

[![Next.js](https://img.shields.io/badge/Next.js-15-black.svg?style=flat&logo=next.js)](https://nextjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5-blue.svg?style=flat&logo=typescript)](https://www.typescriptlang.org/)
[![MongoDB](https://img.shields.io/badge/MongoDB-5-green.svg?style=flat&logo=mongodb)](https://www.mongodb.com/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-3-38B2AC.svg?style=flat&logo=tailwind-css)](https://tailwindcss.com/)

A comprehensive platform for managing NGO operations, donations, volunteer coordination, and community engagement. Built with modern technologies to create meaningful impact in communities worldwide.

## 🌟 Features

### ✅ **Implemented Features**

#### **Core Platform**
- [x] **Multi-Role Authentication System**
  - User registration and login with email/password
  - Google OAuth integration
  - Role-based access control (Admin, Donor, Volunteer, Creator)
  - Profile management with customizable preferences

- [x] **Campaign Management**
  - Create and manage fundraising campaigns
  - Goal tracking with progress visualization
  - Category-based organization (education, healthcare, environment, etc.)
  - Featured campaigns support
  - Campaign analytics and reporting

- [x] **Donation System**
  - One-time and recurring donations
  - Razorpay payment integration
  - Donation receipts and history
  - Subscription management for donors
  - Anonymous donation support

- [x] **Event Management**
  - Create and manage events
  - Registration and RSVP system
  - Event categories and filtering
  - Attendee tracking and capacity management
  - Free and paid event support

- [x] **Content Management**
  - Blog system with rich text editor
  - Author management and content workflow
  - Comment and like system
  - SEO-friendly URLs and metadata
  - Content categorization and tagging

- [x] **Volunteer Coordination**
  - Volunteer application system
  - Task assignment and tracking
  - Volunteer dashboard with achievements
  - Skills and availability management
  - Progress tracking and reporting

- [x] **Admin Dashboard**
  - Comprehensive analytics and reporting
  - User management system
  - Content moderation tools
  - Financial oversight and reporting
  - System settings and configuration

- [x] **Communication Systems**
  - Newsletter subscription and management
  - Contact forms with admin response system
  - Notification management
  - Email integration for automated communications

- [x] **File Management**
  - Image upload and storage
  - File organization system
  - Gallery management for campaigns and events
  - Avatar and profile image handling

- [x] **UI/UX Features**
  - Responsive design for all devices
  - Dark/light theme support
  - Modern component library (Radix UI + shadcn/ui)
  - Interactive charts and visualizations
  - Loading states and error handling

#### **User Dashboards**
- [x] **Public Website**
  - Home page with featured campaigns and events
  - About, contact, and informational pages
  - Blog listing and individual post pages
  - Campaign and event catalog
  - Impact statistics and testimonials

- [x] **Donor Dashboard**
  - Donation history and receipts
  - Active subscriptions management
  - Personal profile and preferences
  - Blog creation and management
  - Campaign support tracking

- [x] **Volunteer Dashboard**
  - Task assignment and tracking
  - Profile and skill management
  - Event calendar and registration
  - Blog creation and management
  - Achievement and progress tracking

- [x] **Admin Dashboard**
  - Analytics and reporting interface
  - User management and moderation
  - Content management system
  - Financial oversight and reporting
  - System configuration and settings

#### **API Endpoints** (Comprehensive REST API)
- [x] Authentication & User Management
- [x] Campaign CRUD operations
- [x] Donation processing and tracking
- [x] Event management and registration
- [x] Blog content management
- [x] Volunteer coordination
- [x] Newsletter and communication
- [x] File upload and management
- [x] Analytics and reporting
- [x] Admin management functions

#### **Additional Implemented Features**

- [x] **Corporate & Partnership Management**
  - Corporate CSR inquiry system (`/api/corporate/csr-inquiry/route.ts`)
  - Partnership application and management
  - Corporate donation matching system
  - CSR portal for corporate partners
  - Partnership agreement tracking and management

- [x] **Fundraising System**
  - Personal fundraising campaigns (`/api/fundraisers/route.ts`)
  - Fundraiser creation and management tools
  - Team fundraising capabilities
  - Fundraising goal tracking and progress visualization
  - Social sharing and promotion tools

- [x] **Sponsor Management**
  - Sponsor application system (`/api/sponsors/apply/route.ts`)
  - Sponsor program management
  - Corporate sponsorship tracking
  - Sponsor benefits and recognition system

- [x] **Impact & Transparency Features**
  - Impact measurement and reporting
  - Transparency portal with financial disclosures
  - Project milestone tracking
  - Before/after impact documentation
  - Photo and video impact galleries

- [x] **Legal & Compliance Pages**
  - Privacy Policy page (`/app/(public)/privacy/page.tsx`)
  - Terms of Service page (`/app/(public)/terms/page.tsx`)
  - Transparency and accountability reports
  - Annual reports and documentation

- [x] **Advanced Analytics & Reporting**
  - Real-time dashboard analytics (`/api/analytics/dashboard/route.ts`)
  - Donation analytics and insights (`/api/admin/donations/stats/route.ts`)
  - User engagement metrics
  - Campaign effectiveness tracking
  - Financial reporting and exports (`/api/admin/donations/export/route.ts`)

### 🚧 **Remaining Functionality to Implement**

#### **✅ Recently Completed Features**
- [x] **Email Verification System**
  - [x] Email verification during user registration (implemented in `/api/auth/register/route.ts`)
  - [x] Email verification endpoint (`/api/auth/verify-email/route.ts`)
  - [x] Password reset email functionality (`/api/auth/forgot-password/route.ts`)
  - [x] Password reset confirmation (`/api/auth/reset-password/route.ts`)
  - [x] Email template customization in `/lib/email.ts`

- [x] **Advanced Notification System**
  - [x] In-app notification system (completed in `/api/admin/notifications/route.ts`)
  - [x] User notification management (`/api/user/notifications/route.ts`)
  - [x] Enhanced Notification model with read tracking
  - [ ] SMS notification integration (framework ready)
  - [ ] Push notification service (framework ready)
  - [ ] WhatsApp Business API integration (framework ready)
  - [x] Real-time notification delivery

- [x] **International Payment Support**
  - [x] Multi-currency payment processing (implemented in `/api/donations/create-order/route.ts`)
  - [x] Stripe payment gateway integration (`/lib/stripe.ts`)
  - [x] Currency conversion utilities
  - [x] Gateway selection based on currency (Razorpay for INR, Stripe for USD/EUR)
  - [x] Stripe webhook handler (`/api/webhooks/stripe/route.ts`)
  - [ ] PayPal integration (framework ready)

- [x] **Tax Compliance Features**
  - [x] Automated 80G certificate generation (`/api/admin/tax-certificates/route.ts`)
  - [x] Tax Certificate model (`/lib/models/TaxCertificate.ts`)
  - [x] 80G certificate PDF generation (`/lib/pdf.ts`)
  - [x] Tax compliance automation (`/api/admin/tax-compliance/route.ts`)
  - [x] Public certificate verification (`/api/verify-certificate/[id]/route.ts`)
  - [x] Audit trail and compliance reporting
  - [x] Financial compliance tracking

#### **Communication & Engagement Features**
- [ ] **Real-time Communication**
  - [ ] Real-time chat/messaging system
  - [ ] Video call integration for volunteer meetings
  - [ ] Community forums and discussion boards
  - [ ] User-generated content system
  - [ ] Live chat support for donors and volunteers
  - [ ] Group messaging for project teams

- [ ] **Social & Marketing Features**
  - [ ] Social media sharing integration
  - [ ] Social login with Facebook, LinkedIn, Twitter
  - [ ] Referral and referral tracking system
  - [ ] Campaign viral sharing features
  - [ ] Email marketing campaigns
  - [ ] Newsletter automation and segmentation
  - [ ] Social media feed integration
  - [ ] Influencer partnership management

#### **Advanced NGO Operations**
- [ ] **Project Management System**
  - [ ] Multi-phase project planning
  - [ ] Project timeline and milestone tracking
  - [ ] Resource allocation and budgeting
  - [ ] Team collaboration tools
  - [ ] Project reporting and documentation
  - [ ] Risk management and assessment

- [ ] **Beneficiary Management**
  - [ ] Beneficiary registration and profiling
  - [ ] Impact tracking and measurement
  - [ ] Case study management
  - [ ] Beneficiary feedback collection
  - [ ] Success story documentation
  - [ ] Long-term follow-up tracking

- [ ] **Supply Chain & Logistics**
  - [ ] Inventory management system
  - [ ] Supply chain tracking
  - [ ] Distribution management
  - [ ] Warehouse management
  - [ ] Donation in-kind tracking
  - [ ] Emergency supply management

#### **Financial & Compliance Features**
- [ ] **Advanced Financial Management**
  - [ ] Multi-currency support and conversion
  - [ ] Automated financial reporting
  - [ ] Budget allocation and tracking
  - [ ] Expense management system
  - [ ] Financial audit trail
  - [ ] Grant and funding management

- [ ] **Legal & Compliance Management**
  - [ ] 12A and 80G certificate tracking
  - [ ] FCRA compliance automation
  - [ ] Annual report generation
  - [ ] Legal document management
  - [ ] Compliance calendar and reminders
  - [ ] Regulatory filing automation

- [ ] **Tax & Documentation**
  - [ ] Automated tax calculation
  - [ ] Receipt generation system
  - [ ] Donation certificate automation
  - [ ] Financial year reporting
  - [ ] Tax filing assistance
  - [ ] Document templating system

#### **NGO-Specific Advanced Features**
- [ ] **Grant Management System**
  - [ ] Grant application and tracking
  - [ ] Funding source management
  - [ ] Compliance and reporting for grants
  - [ ] Multi-year project tracking

- [ ] **Impact Tracking System**
  - [ ] Beneficiary registration and tracking
  - [ ] Project milestone tracking
  - [ ] Before/after impact measurement
  - [ ] Photo and video documentation system

- [ ] **Corporate Partnership Features**
  - [ ] Corporate donation matching system
  - [ ] CSR portal for corporate partners
  - [ ] Automated donation allocation to campaigns
  - [ ] Partnership agreement tracking

- [ ] **Resource Management**
  - [ ] Inventory management for physical goods
  - [ ] Resource allocation and tracking
  - [ ] Warehouse management system
  - [ ] Supply chain optimization

#### **Compliance & Legal Features**
- [ ] **Legal Compliance**
  - [ ] 12A and 80G certificate management
  - [ ] FCRA compliance tracking
  - [ ] Annual report generation system
  - [ ] Advanced audit trail and documentation

- [ ] **Data Protection & Privacy**
  - [ ] GDPR compliance features
  - [ ] Data anonymization tools
  - [ ] Privacy policy management
  - [ ] Data export and deletion requests

#### **Automation & Integration**
- [ ] **Email Automation**
  - [ ] Automated thank you email sequences
  - [ ] Donor retention campaigns
  - [ ] Newsletter automation
  - [ ] Event reminder automation

- [ ] **Third-Party Integrations**
  - [ ] CRM integration (Salesforce, HubSpot)
  - [ ] Accounting software integration (Tally, QuickBooks)
  - [ ] Email marketing tools (Mailchimp, ConvertKit)
  - [ ] Social media API integration
  - [ ] Google Workspace integration

- [ ] **Advanced Analytics**
  - [ ] Donor retention analysis
  - [ ] Volunteer performance metrics
  - [ ] Campaign effectiveness analysis
  - [ ] Impact measurement and tracking
  - [ ] Financial forecasting and budgeting

## 🚀 Tech Stack

### **Frontend**
- **Framework**: Next.js 15 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **UI Components**: Radix UI + shadcn/ui
- **State Management**: React Query (TanStack Query)
- **Icons**: Lucide React
- **Charts**: Recharts
- **Rich Text Editor**: TipTap

### **Backend**
- **Runtime**: Next.js API Routes
- **Database**: MongoDB with Mongoose ODM
- **Authentication**: NextAuth.js
- **File Upload**: Cloudinary
- **Email**: Nodemailer
- **Payments**: Razorpay

### **Development Tools**
- **Package Manager**: npm
- **Code Quality**: ESLint
- **Type Checking**: TypeScript
- **Styling**: PostCSS + Autoprefixer

## 📁 Project Structure

```
hopefoundation/
├── app/                          # Next.js App Router
│   ├── (admin)/                 # Admin routes
│   │   └── admin/
│   │       └── dashboard/       # Admin dashboard pages
│   │           ├── analytics/   # Analytics and reporting
│   │           ├── blog/        # Blog management
│   │           ├── campaigns/   # Campaign management
│   │           ├── contacts/    # Contact management
│   │           ├── donations/   # Donation oversight
│   │           ├── events/      # Event management
│   │           ├── files/       # File management
│   │           ├── notifications/ # Notification management
│   │           ├── payments/    # Payment oversight
│   │           ├── settings/    # System settings
│   │           ├── subscriptions/ # Subscription management
│   │           ├── users/       # User management
│   │           └── volunteers/  # Volunteer management
│   ├── (auth)/                  # Authentication routes
│   │   ├── signin/             # Login page
│   │   └── signup/             # Registration page
│   ├── (donor)/                # Donor routes
│   │   └── donor/
│   │       └── dashboard/      # Donor dashboard
│   ├── (public)/               # Public website
│   │   ├── about/              # About us page
│   │   ├── blog/               # Blog listing
│   │   ├── campaigns/          # Campaign catalog
│   │   ├── contact/            # Contact page
│   │   ├── donate/             # Donation page
│   │   ├── events/             # Event catalog
│   │   ├── my-donations/       # Donor history
│   │   └── ...                 # Other public pages
│   ├── (volunteer)/            # Volunteer routes
│   │   ├── volunteer/
│   │   │   ├── apply/          # Volunteer application
│   │   │   └── dashboard/      # Volunteer dashboard
│   └── api/                    # API routes
│       ├── admin/              # Admin API endpoints
│       ├── analytics/          # Analytics API
│       ├── auth/               # Authentication API
│       ├── blogs/              # Blog API
│       ├── campaigns/          # Campaign API
│       ├── contact/            # Contact API
│       ├── donations/          # Donation API
│       ├── events/             # Event API
│       ├── upload/             # File upload API
│       ├── user/               # User management API
│       └── volunteer/          # Volunteer API
├── components/                 # React components
│   ├── admin/                  # Admin-specific components
│   ├── ui/                     # Reusable UI components
│   ├── blog-editor.tsx         # Rich text editor
│   ├── donation-history.tsx    # Donation display
│   ├── footer.tsx              # Site footer
│   ├── navbar.tsx              # Navigation bar
│   └── providers.tsx           # App providers
├── hooks/                      # Custom React hooks
├── lib/                        # Utility libraries
│   ├── models/                 # Database models
│   ├── auth.ts                 # Authentication config
│   ├── cloudinary.ts           # File upload config
│   ├── email.ts                # Email utilities
│   ├── mongodb.ts              # Database connection
│   ├── pdf.ts                  # PDF generation
│   ├── razorpay.ts             # Payment integration
│   └── utils.ts                # General utilities
├── public/                     # Static assets
├── docs/                       # Documentation
└── scripts/                    # Build and utility scripts
```

## 🛠️ Setup Instructions

### **Prerequisites**
- Node.js 18+ and npm
- MongoDB account (Atlas recommended)
- Cloudinary account for file uploads
- Razorpay account for payments

### **1. Clone the Repository**
```bash
git clone <repository-url>
cd hopefoundation
```

### **2. Install Dependencies**
```bash
npm install
```

### **3. Environment Variables**
Create a `.env.local` file in the root directory:

```env
# Database
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/hopefoundation

# Authentication
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=your-secret-key-here
GOOGLE_CLIENT_ID=your-google-client-id
GOOGLE_CLIENT_SECRET=your-google-client-secret

# File Upload
CLOUDINARY_CLOUD_NAME=your-cloud-name
CLOUDINARY_API_KEY=your-api-key
CLOUDINARY_API_SECRET=your-api-secret

# Payments
RAZORPAY_KEY_ID=your-razorpay-key-id
RAZORPAY_KEY_SECRET=your-razorpay-secret

# Email
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=your-email@gmail.com
EMAIL_PASS=your-app-password
```

### **4. Database Setup**
The application uses MongoDB with Mongoose. Ensure your MongoDB URI is configured in the environment variables.

### **5. Run Development Server**
```bash
npm run dev
```

The application will be available at `http://localhost:3000`

### **6. Build for Production**
```bash
npm run build
npm start
```

## 📊 API Documentation

### **Authentication Endpoints**
- `POST /api/auth/register` - User registration
- `POST /api/auth/signin` - User login
- `POST /api/auth/signout` - User logout
- `GET /api/auth/session` - Get current session

### **Campaign Endpoints**
- `GET /api/campaigns` - List campaigns (with filters)
- `POST /api/campaigns` - Create campaign
- `GET /api/campaigns/[id]` - Get campaign details
- `PUT /api/campaigns/[id]` - Update campaign
- `DELETE /api/campaigns/[id]` - Delete campaign

### **Donation Endpoints**
- `POST /api/donations` - Create donation
- `GET /api/donations/user/[userId]` - User donation history
- `POST /api/donations/verify` - Verify payment
- `GET /api/donations/receipt/[donationId]` - Get donation receipt

### **Event Endpoints**
- `GET /api/events` - List events
- `POST /api/events` - Create event
- `POST /api/events/[id]/register` - Event registration
- `GET /api/events/[id]/rsvp` - Event RSVPs

### **Blog Endpoints**
- `GET /api/blogs` - List blog posts
- `POST /api/blogs` - Create blog post
- `GET /api/blogs/[slug]` - Get blog post
- `POST /api/blogs/[slug]/like` - Like blog post

### **Volunteer Endpoints**
- `POST /api/volunteer/apply` - Apply as volunteer
- `GET /api/volunteer/dashboard` - Volunteer dashboard data
- `PUT /api/volunteer/tasks/[id]/status` - Update task status
- `GET /api/volunteer/[id]/assign` - Assign volunteer

## 🎨 Customization

### **Theming**
The application uses CSS custom properties for theming. Modify colors in `app/globals.css`:

```css
:root {
  --background: 0 0% 100%;
  --foreground: 0 0% 3.9%;
  /* Customize other color variables */
}
```

### **Adding New Features**
1. Create models in `lib/models/`
2. Add API routes in `app/api/`
3. Create components in `components/`
4. Add pages in the appropriate route group
5. Update navigation and routing as needed

## 🔒 Security Features

- **Authentication**: Secure session-based auth with JWT
- **Password Hashing**: Bcrypt for password security
- **Input Validation**: Zod schema validation
- **SQL Injection Prevention**: MongoDB parameterized queries
- **XSS Protection**: Built-in Next.js protection
- **CSRF Protection**: NextAuth.js built-in protection

## 📱 Responsive Design

The application is fully responsive and optimized for:
- Desktop computers (1920px+)
- Laptops (1024px - 1919px)
- Tablets (768px - 1023px)
- Mobile phones (320px - 767px)

## 🚀 Deployment

### **Vercel (Recommended)**
1. Connect your GitHub repository to Vercel
2. Configure environment variables in Vercel dashboard
3. Deploy automatically on push to main branch

### **Other Platforms**
- **Netlify**: Configure build settings for Next.js
- **Railway**: Connect repository and set environment variables
- **DigitalOcean App Platform**: Use Next.js template
- **AWS/GCP/Azure**: Deploy using container services

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

### **Development Guidelines**
- Follow TypeScript best practices
- Use conventional commit messages
- Add tests for new features
- Update documentation as needed
- Ensure responsive design compatibility

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 👥 Team

This project is developed and maintained by the Hope Foundation development team.

## 🙏 Acknowledgments

- Next.js team for the excellent framework
- Vercel for hosting and deployment
- MongoDB for the robust database solution
- Radix UI for accessible component primitives
- Tailwind CSS for the utility-first styling approach

## 📞 Support

For support and questions:
- 📧 Email: support@hopefoundation.org
- 📱 WhatsApp: +91-XXXXXXXXXX
- 🌐 Website: https://hopefoundation.org
- 📍 Address: [Your Organization Address]

## 🗺️ Roadmap

### **Phase 1: Core Platform (Current)**
- ✅ User management and authentication
- ✅ Basic donation and campaign system
- ✅ Volunteer coordination
- ✅ Content management

### **Phase 2: Enhanced Features (Q2 2024)**
- 🚧 Mobile application
- 🚧 Advanced analytics
- 🚧 Multi-language support
- 🚧 AI-powered donor insights

### **Phase 3: Scale & Optimize (Q3-Q4 2024)**
- 📋 Automated workflows
- 📋 Advanced reporting
- 📋 Third-party integrations
- 📋 Performance optimization

---

**Made with ❤️ for communities worldwide**

*This README will be updated as new features are implemented and the platform evolves.*
