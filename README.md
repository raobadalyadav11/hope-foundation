# Hope Foundation NGO Website

A comprehensive non-profit organization website built with Next.js, featuring donation processing, volunteer management, campaign tracking, and impact reporting.

## 🌟 Features

### Core Functionality
- **User Authentication & Authorization** - Secure login with email/password and Google OAuth
- **Multi-role System** - Admin, Donor, Volunteer, and Creator roles with appropriate permissions
- **Donation System** - Multiple payment gateways (Stripe for international, Razorpay for India)
- **Campaign Management** - Create, manage, and track fundraising campaigns
- **Event Management** - Event creation, registration, and RSVP system
- **Volunteer Management** - Application processing, task assignment, and tracking
- **Blog System** - Content management with approval workflow
- **Impact Tracking** - Comprehensive impact reporting and analytics
- **File Management** - Secure file upload and storage system
- **Newsletter System** - Email subscription management
- **Admin Dashboard** - Complete admin interface for managing all aspects

### Security Features
- **Rate Limiting** - Protection against brute force attacks
- **Session Management** - Secure JWT-based sessions with proper expiration
- **Input Validation** - Comprehensive validation on all forms
- **CSRF Protection** - Built-in Next.js CSRF protection
- **Secure Headers** - Security headers for production deployment
- **Password Hashing** - Bcrypt for secure password storage

### Performance Features
- **Server-Side Rendering** - Fast initial page loads
- **Image Optimization** - Next.js automatic image optimization
- **Code Splitting** - Automatic code splitting for better performance
- **Database Optimization** - Efficient MongoDB queries with indexing
- **Caching Strategy** - React Query for client-side caching

## 🚀 Getting Started

### Prerequisites
- Node.js 18.0 or later
- MongoDB 4.4 or later
- Git

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/your-org/hope-foundation-ngo.git
   cd hope-foundation-ngo
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Environment Setup**
   Create a `.env.local` file in the root directory:
   ```env
   # Database
   MONGODB_URI=mongodb://localhost:27017/hope-foundation
   
   # Authentication
   NEXTAUTH_SECRET=your-secret-key-here
   NEXTAUTH_URL=http://localhost:3000
   GOOGLE_CLIENT_ID=your-google-client-id
   GOOGLE_CLIENT_SECRET=your-google-client-secret
   
   # Email Configuration
   EMAIL_SERVER_HOST=smtp.gmail.com
   EMAIL_SERVER_PORT=587
   EMAIL_SERVER_USER=your-email@gmail.com
   EMAIL_SERVER_PASSWORD=your-app-password
   EMAIL_FROM=noreply@hopefoundation.org
   
   # Payment Gateways
   STRIPE_SECRET_KEY=sk_test_your-stripe-secret-key
   RAZORPAY_KEY_ID=rzp_test_your-razorpay-key-id
   RAZORPAY_KEY_SECRET=your-razorpay-secret-key
   
   # File Storage
   CLOUDINARY_CLOUD_NAME=your-cloudinary-cloud-name
   CLOUDINARY_API_KEY=your-cloudinary-api-key
   CLOUDINARY_API_SECRET=your-cloudinary-api-secret
   
   # Admin Configuration
   ADMIN_EMAIL=admin@hopefoundation.org
   
   # Site Configuration
   NEXT_PUBLIC_SITE_NAME=Hope Foundation
   NEXT_PUBLIC_SITE_URL=http://localhost:3000
   ```

4. **Database Setup**
   ```bash
   npm run seed
   ```

5. **Start Development Server**
   ```bash
   npm run dev
   ```

The application will be available at `http://localhost:3000`.

## 📁 Project Structure

```
hope-foundation-ngo/
├── app/                          # Next.js App Router
│   ├── (admin)/                 # Admin dashboard routes
│   ├── (auth)/                  # Authentication routes
│   ├── (donor)/                 # Donor dashboard routes
│   ├── (public)/                # Public-facing routes
│   ├── (volunteer)/             # Volunteer dashboard routes
│   ├── api/                     # API routes
│   ├── globals.css              # Global styles
│   └── layout.tsx               # Root layout
├── components/                   # Reusable components
│   ├── ui/                      # UI components (shadcn/ui)
│   ├── admin/                   # Admin-specific components
│   ├── navbar.tsx               # Navigation component
│   └── footer.tsx               # Footer component
├── lib/                         # Utility libraries
│   ├── models/                  # Database models
│   ├── auth.ts                  # Authentication configuration
│   ├── mongodb.ts               # Database connection
│   ├── email.ts                 # Email utilities
│   ├── stripe.ts                # Stripe integration
│   └── utils.ts                 # General utilities
├── public/                      # Static assets
├── hooks/                       # Custom React hooks
├── types/                       # TypeScript type definitions
└── docs/                        # Documentation
```

## 🔧 API Documentation

### Authentication Endpoints

#### POST `/api/auth/signin`
Authenticate user with credentials.

**Request Body:**
```json
{
  "email": "user@example.com",
  "password": "password123"
}
```

#### POST `/api/auth/signup`
Register new user.

**Request Body:**
```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "password123",
  "role": "donor"
}
```

### Donation Endpoints

#### POST `/api/donations/create-order`
Create Razorpay order for donation.

**Request Body:**
```json
{
  "amount": 1000,
  "currency": "INR",
  "campaignId": "campaign_id"
}
```

#### POST `/api/donations/verify`
Verify payment after Razorpay payment.

### Campaign Endpoints

#### GET `/api/campaigns`
Get campaigns with filtering and pagination.

**Query Parameters:**
- `page` (number): Page number
- `limit` (number): Items per page
- `category` (string): Filter by category
- `search` (string): Search term
- `status` (string): Filter by status

#### POST `/api/campaigns` (Admin only)
Create new campaign.

### Impact Endpoints

#### GET `/api/impact`
Get impact reports with filtering.

#### POST `/api/impact` (Admin/Creator only)
Create new impact report.

## 🎨 UI Components

The website uses a comprehensive component library built with:
- **Radix UI** - Accessible primitive components
- **Tailwind CSS** - Utility-first CSS framework
- **Lucide React** - Beautiful icons
- **Recharts** - Data visualization
- **React Query** - Server state management

### Key Components

#### Button
```tsx
import { Button } from "@/components/ui/button"

<Button variant="outline" size="lg">
  Get Started
</Button>
```

#### Card
```tsx
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

<Card>
  <CardHeader>
    <CardTitle>Campaign Title</CardTitle>
  </CardHeader>
  <CardContent>
    Campaign description...
  </CardContent>
</Card>
```

## 📊 Database Schema

### User Model
```typescript
interface IUser {
  name: string
  email: string
  password?: string
  role: "admin" | "donor" | "volunteer" | "creator"
  phone?: string
  address?: string
  profileImage?: string
  isActive: boolean
  isVerified: boolean
  // ... additional fields
}
```

### Campaign Model
```typescript
interface ICampaign {
  title: string
  description: string
  category: string
  goal: number
  raised: number
  image?: string
  isActive: boolean
  createdBy: ObjectId
  // ... additional fields
}
```

## 🔐 Security

### Authentication
- JWT-based sessions with 30-day expiration
- Google OAuth integration
- Password hashing with bcrypt (12 rounds)
- Rate limiting on login attempts

### Authorization
- Role-based access control (RBAC)
- Route protection middleware
- API endpoint authorization
- Resource-level permissions

### Data Protection
- Input validation and sanitization
- CSRF protection
- Secure HTTP headers
- Environment variable protection

## 🚀 Deployment

### Production Build
```bash
npm run build
npm run start
```

### Docker Deployment
```dockerfile
FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production
COPY . .
RUN npm run build
EXPOSE 3000
CMD ["npm", "start"]
```

### Environment Variables for Production
Ensure all environment variables are properly set in production:
- Database connection strings
- Authentication secrets
- Payment gateway credentials
- Email service configuration
- File storage credentials

## 📈 Monitoring and Analytics

### Built-in Analytics
- User registration and activity tracking
- Donation analytics and reporting
- Campaign performance metrics
- Volunteer engagement tracking
- System performance monitoring

### External Integrations
- Google Analytics (optional)
- Sentry for error tracking
- LogRocket for user session recording

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

### Development Guidelines
- Follow TypeScript strict mode
- Use ESLint and Prettier for code formatting
- Write comprehensive tests
- Follow semantic commit messages
- Update documentation for new features

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🆘 Support

For support and questions:
- Email: support@hopefoundation.org
- Documentation: [docs.hopefoundation.org](https://docs.hopefoundation.org)
- Issues: [GitHub Issues](https://github.com/your-org/hope-foundation-ngo/issues)

## 🙏 Acknowledgments

- Next.js team for the amazing framework
- Radix UI for accessible components
- Tailwind CSS for utility-first styling
- MongoDB for flexible database solution
- All contributors and supporters of Hope Foundation

---

Built with ❤️ for making a difference in the world.
