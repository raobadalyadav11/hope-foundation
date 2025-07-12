import mongoose from 'mongoose'
import Campaign from '../lib/models/Campaign'
import Event from '../lib/models/Event'
import Blog from '../lib/models/Blog'
import Contact from '../lib/models/Contact'
import User from '../lib/models/User'
import bcrypt from 'bcryptjs'

// MongoDB connection
const MONGODB_URI = process.env.MONGODB_URI || "mongodb+srv://officialsponza:officialsponza@sponza.4x2civr.mongodb.net/hopefoundation?retryWrites=true&w=majority&appName=hopefoundation"

// Sample user data
const usersData = [
  {
    name: "Admin User",
    email: "admin@hopefoundation.org",
    password: "admin123",
    role: "admin",
    profileImage: "/placeholder-user.jpg",
    isVerified: true
  },
  {
    name: "Dr. Sarah Johnson",
    email: "sarah@hopefoundation.org",
    password: "password123",
    role: "creator",
    profileImage: "/placeholder-user.jpg",
    isVerified: true
  },
  {
    name: "Michael Chen",
    email: "michael@hopefoundation.org",
    password: "password123",
    role: "creator",
    profileImage: "/placeholder-user.jpg",
    isVerified: true
  },
  {
    name: "Dr. Priya Sharma",
    email: "priya@hopefoundation.org",
    password: "password123",
    role: "creator",
    profileImage: "/placeholder-user.jpg",
    isVerified: true
  }
]

// Sample campaigns data
const campaignsData = [
  {
    title: "Clean Water for Rural Villages",
    description: "Providing clean drinking water access to 50 remote villages through well construction and water purification systems.",
    longDescription: "<p>This comprehensive water initiative aims to transform the lives of over 10,000 people in rural communities by providing sustainable access to clean drinking water.</p><p>Our project includes:</p><ul><li>Drilling deep wells in 50 villages</li><li>Installing solar-powered pumps</li><li>Setting up community-managed water purification systems</li><li>Training local communities on maintenance and hygiene practices</li></ul><p>Every donation brings us closer to ensuring no child has to walk miles for clean water.</p>",
    goal: 500000,
    raised: 325000,
    startDate: new Date('2024-01-01'),
    endDate: new Date('2024-12-31'),
    location: "Rural Maharashtra, India",
    category: "healthcare",
    image: "/placeholder.svg?height=400&width=600",
    gallery: ["/placeholder.svg?height=300&width=400", "/placeholder.svg?height=300&width=400"],
    featured: true,
    isActive: true,
    status: "active",
    tags: ["water", "health", "rural development"],
    beneficiaries: 10000,
    updates: [
      {
        title: "First 10 Wells Completed",
        content: "We've successfully completed the first phase with 10 wells now providing clean water to 2,000 people.",
        date: new Date('2024-01-15')
      }
    ]
  },
  {
    title: "Education for Every Child",
    description: "Building schools and providing educational resources to underprivileged children in remote areas.",
    longDescription: "<p>Our education initiative focuses on breaking the cycle of poverty through quality education.</p><p>We provide:</p><ul><li>School construction and infrastructure</li><li>Teacher training programs</li><li>Learning materials and books</li><li>Scholarships for deserving students</li><li>Digital learning tools</li></ul><p>Education is the most powerful weapon to change the world.</p>",
    goal: 750000,
    raised: 450000,
    startDate: new Date('2024-02-01'),
    endDate: new Date('2025-01-31'),
    location: "Rural Rajasthan, India",
    category: "education",
    image: "/placeholder.svg?height=400&width=600",
    gallery: [],
    featured: true,
    isActive: true,
    status: "active",
    tags: ["education", "children", "schools"],
    beneficiaries: 5000,
    updates: []
  },
  {
    title: "Healthcare Mobile Units",
    description: "Bringing medical care to remote communities through mobile healthcare units and trained medical staff.",
    longDescription: "<p>Our mobile healthcare initiative provides essential medical services to communities that lack access to hospitals or clinics.</p><p>Each unit includes:</p><ul><li>Modern medical equipment</li><li>Qualified doctors and nurses</li><li>Essential medicines</li><li>Diagnostic facilities</li><li>Emergency care capabilities</li></ul>",
    goal: 300000,
    raised: 180000,
    startDate: new Date('2024-03-01'),
    endDate: new Date('2024-11-30'),
    location: "Rural Gujarat, India",
    category: "healthcare",
    image: "/placeholder.svg?height=400&width=600",
    gallery: [],
    featured: false,
    isActive: true,
    status: "active",
    tags: ["healthcare", "mobile", "medical"],
    beneficiaries: 15000,
    updates: []
  },
  {
    title: "Women Empowerment Program",
    description: "Providing skill training and microfinance opportunities to empower women in rural communities.",
    longDescription: "<p>This program focuses on economic empowerment of women through comprehensive support.</p><p>We offer:</p><ul><li>Skill development training</li><li>Entrepreneurship workshops</li><li>Microfinance access</li><li>Business mentorship</li><li>Market linkage support</li></ul>",
    goal: 200000,
    raised: 120000,
    startDate: new Date('2024-01-15'),
    endDate: new Date('2024-12-15'),
    location: "Rural Karnataka, India",
    category: "women-empowerment",
    image: "/placeholder.svg?height=400&width=600",
    gallery: [],
    featured: false,
    isActive: true,
    status: "active",
    tags: ["women", "empowerment", "microfinance"],
    beneficiaries: 2000,
    updates: []
  },
  {
    title: "Disaster Relief Fund",
    description: "Emergency relief and rehabilitation support for communities affected by natural disasters.",
    longDescription: "<p>Our disaster relief fund provides immediate emergency assistance and long-term rehabilitation support.</p><p>We provide:</p><ul><li>Emergency food and water</li><li>Temporary shelter</li><li>Medical aid</li><li>Infrastructure rebuilding</li><li>Livelihood restoration</li></ul>",
    goal: 1000000,
    raised: 650000,
    startDate: new Date('2024-01-01'),
    endDate: new Date('2024-12-31'),
    location: "Pan India",
    category: "disaster-relief",
    image: "/placeholder.svg?height=400&width=600",
    gallery: [],
    featured: true,
    isActive: true,
    status: "active",
    tags: ["disaster", "relief", "emergency"],
    beneficiaries: 25000,
    updates: []
  }
]

// Sample events data
const eventsData = [
  {
    title: "Community Health Workshop",
    description: "Learn about basic healthcare, hygiene practices, and preventive measures for common diseases.",
    longDescription: "<p>Join us for a comprehensive health workshop designed to educate communities about essential healthcare practices.</p><p>Topics covered:</p><ul><li>Basic first aid</li><li>Hygiene and sanitation</li><li>Nutrition and wellness</li><li>Disease prevention</li><li>Mental health awareness</li></ul>",
    date: new Date('2024-02-15T10:00:00'),
    endDate: new Date('2024-02-15T16:00:00'),
    location: "Community Center, Mumbai",
    address: "123 Community Street, Mumbai, Maharashtra 400001",
    coordinates: {
      latitude: 19.0760,
      longitude: 72.8777
    },
    maxAttendees: 100,
    currentAttendees: 45,
    attendees: [],
    image: "/placeholder.svg?height=300&width=400",
    gallery: [],
    category: "workshop",
    tags: ["health", "community", "education"],
    isActive: true,
    status: "upcoming",
    isFree: true,
    requirements: ["Bring a notebook", "Wear comfortable clothes"],
    agenda: [
      {
        time: "10:00 AM",
        activity: "Registration and Welcome",
        speaker: "Dr. Sarah Johnson"
      },
      {
        time: "10:30 AM",
        activity: "Basic First Aid Training",
        speaker: "Dr. Priya Sharma"
      },
      {
        time: "12:00 PM",
        activity: "Lunch Break"
      },
      {
        time: "1:00 PM",
        activity: "Hygiene and Sanitation",
        speaker: "Michael Chen"
      },
      {
        time: "3:00 PM",
        activity: "Q&A and Closing"
      }
    ],
    contactPerson: {
      name: "Dr. Sarah Johnson",
      email: "sarah@hopefoundation.org",
      phone: "+91 98765 43210"
    }
  },
  {
    title: "Fundraising Gala Night",
    description: "Join us for an elegant evening of dining, entertainment, and fundraising for our education initiatives.",
    longDescription: "<p>An exclusive fundraising event to support our education programs.</p><p>Evening includes:</p><ul><li>Gourmet dinner</li><li>Live entertainment</li><li>Silent auction</li><li>Keynote speeches</li><li>Networking opportunities</li></ul>",
    date: new Date('2024-03-20T19:00:00'),
    endDate: new Date('2024-03-20T23:00:00'),
    location: "Grand Ballroom, Delhi",
    address: "456 Hotel Street, New Delhi 110001",
    maxAttendees: 200,
    currentAttendees: 120,
    attendees: [],
    image: "/placeholder.svg?height=300&width=400",
    gallery: [],
    category: "fundraiser",
    tags: ["fundraising", "gala", "education"],
    isActive: true,
    status: "upcoming",
    isFree: false,
    ticketPrice: 5000,
    requirements: ["Formal attire required", "RSVP mandatory"],
    agenda: [
      {
        time: "7:00 PM",
        activity: "Welcome Reception"
      },
      {
        time: "8:00 PM",
        activity: "Dinner Service"
      },
      {
        time: "9:30 PM",
        activity: "Keynote Address",
        speaker: "Chief Guest"
      },
      {
        time: "10:30 PM",
        activity: "Entertainment and Auction"
      }
    ],
    contactPerson: {
      name: "Michael Chen",
      email: "michael@hopefoundation.org",
      phone: "+91 98765 43211"
    }
  },
  {
    title: "Volunteer Training Program",
    description: "Comprehensive training for new volunteers joining our various community programs.",
    longDescription: "<p>A full-day training program for new volunteers.</p><p>Training modules:</p><ul><li>Organization overview</li><li>Community engagement</li><li>Project management</li><li>Safety protocols</li><li>Communication skills</li></ul>",
    date: new Date('2024-02-25T09:00:00'),
    endDate: new Date('2024-02-25T17:00:00'),
    location: "Training Center, Bangalore",
    address: "789 Training Road, Bangalore, Karnataka 560001",
    maxAttendees: 50,
    currentAttendees: 30,
    attendees: [],
    image: "/placeholder.svg?height=300&width=400",
    gallery: [],
    category: "training",
    tags: ["volunteer", "training", "community"],
    isActive: true,
    status: "upcoming",
    isFree: true,
    requirements: ["Government ID required", "Commitment letter"],
    agenda: [
      {
        time: "9:00 AM",
        activity: "Registration and Orientation"
      },
      {
        time: "10:00 AM",
        activity: "Organization Overview",
        speaker: "Admin Team"
      },
      {
        time: "2:00 PM",
        activity: "Field Work Training"
      },
      {
        time: "4:00 PM",
        activity: "Certification and Closing"
      }
    ],
    contactPerson: {
      name: "Dr. Priya Sharma",
      email: "priya@hopefoundation.org",
      phone: "+91 98765 43212"
    }
  }
]

// Sample blogs data
const blogsData = [
  {
    title: "Transforming Lives Through Clean Water: A Year in Review",
    slug: "transforming-lives-through-clean-water-year-review",
    content: "<h2>The Impact of Clean Water</h2><p>Over the past year, our clean water initiative has transformed the lives of over 10,000 people across 50 villages. This comprehensive program has not only provided access to clean drinking water but has also improved health outcomes, reduced disease burden, and empowered communities.</p><h3>Key Achievements</h3><ul><li>50 wells constructed and operational</li><li>10,000+ people with access to clean water</li><li>75% reduction in waterborne diseases</li><li>200+ community members trained in maintenance</li></ul><p>The journey hasn't been without challenges, but the resilience and cooperation of local communities have been remarkable. Each well represents hope, health, and a brighter future for entire families.</p><h3>Looking Forward</h3><p>As we move into the next phase, we're expanding our reach to 25 additional villages. With continued support from donors and volunteers, we aim to impact 15,000 more lives in the coming year.</p>",
    excerpt: "Discover how our clean water initiative has impacted over 10,000 lives across 50 villages in the past year. From well construction to community education, see the remarkable transformation happening in rural communities.",
    featuredImage: "/placeholder.svg?height=400&width=600",
    tags: ["water", "health", "impact", "rural development"],
    category: "Impact Stories",
    status: "published",
    authorName: "Dr. Sarah Johnson",
    authorEmail: "sarah@hopefoundation.org",
    views: 1250,
    likes: 89,
    publishedAt: new Date('2024-01-15')
  },
  {
    title: "The Power of Education: Building Schools in Remote Areas",
    slug: "power-of-education-building-schools-remote-areas",
    content: "<h2>Education as a Foundation</h2><p>Education is the cornerstone of development, and our school-building initiative has been making significant strides in remote areas where children previously had no access to formal education.</p><h3>Our Approach</h3><p>We don't just build schools; we create comprehensive educational ecosystems:</p><ul><li>Infrastructure development with modern facilities</li><li>Teacher recruitment and training programs</li><li>Curriculum development suited to local needs</li><li>Community engagement and parent education</li></ul><h3>Success Stories</h3><p>In the village of Khairpur, Rajasthan, we built a school that now serves 200 children. The literacy rate in the village has increased from 15% to 60% in just two years.</p><p>Young Meera, who couldn't read two years ago, is now helping her parents with their small business accounts. These are the transformations that fuel our mission.</p>",
    excerpt: "Learn about our education program that has established 25 new schools and trained over 200 teachers in underserved communities.",
    featuredImage: "/placeholder.svg?height=400&width=600",
    tags: ["education", "schools", "children", "rural"],
    category: "Educational Content",
    status: "published",
    authorName: "Michael Chen",
    authorEmail: "michael@hopefoundation.org",
    views: 980,
    likes: 67,
    publishedAt: new Date('2024-01-10')
  },
  {
    title: "Healthcare Heroes: Mobile Medical Units Making a Difference",
    slug: "healthcare-heroes-mobile-medical-units-making-difference",
    content: "<h2>Bringing Healthcare to Doorsteps</h2><p>Our mobile medical units have become lifelines for remote communities, bringing essential healthcare services directly to those who need them most.</p><h3>The Challenge</h3><p>In many rural areas, the nearest hospital is hours away. For families without transportation or resources, this distance can be the difference between life and death.</p><h3>Our Solution</h3><p>Our fleet of mobile medical units is equipped with:</p><ul><li>Modern diagnostic equipment</li><li>Essential medicines and vaccines</li><li>Qualified medical professionals</li><li>Telemedicine capabilities for specialist consultations</li></ul><h3>Impact in Numbers</h3><ul><li>15,000+ patients treated</li><li>500+ emergency cases handled</li><li>2,000+ children vaccinated</li><li>100+ villages covered monthly</li></ul><p>Dr. Rajesh, one of our mobile unit doctors, shares: 'Every day, we see the relief in people's eyes when they realize they don't have to travel for hours to get medical help. It's what drives us to continue this work.'</p>",
    excerpt: "Meet the dedicated medical professionals bringing healthcare to remote villages through our mobile medical unit program.",
    featuredImage: "/placeholder.svg?height=400&width=600",
    tags: ["healthcare", "mobile units", "rural health", "medical"],
    category: "Impact Stories",
    status: "published",
    authorName: "Dr. Priya Sharma",
    authorEmail: "priya@hopefoundation.org",
    views: 1100,
    likes: 78,
    publishedAt: new Date('2024-01-08')
  },
  {
    title: "Volunteer Spotlight: Stories from the Field",
    slug: "volunteer-spotlight-stories-from-field",
    content: "<h2>The Heart of Our Mission</h2><p>Our volunteers are the backbone of our organization. Their dedication, passion, and selfless service make all our programs possible.</p><h3>Meet Our Volunteers</h3><p><strong>Anita Patel</strong> - A retired teacher who now runs literacy programs in three villages. 'Teaching has always been my passion. Now I get to share that passion with those who need it most.'</p><p><strong>Rahul Kumar</strong> - An engineer who volunteers his weekends to maintain our water systems. 'Every pump I fix means clean water for hundreds of families. It's the most rewarding work I've ever done.'</p><p><strong>Sunita Devi</strong> - A local woman who became a community health worker. 'I lost my child to a preventable disease. Now I work to ensure no other mother goes through what I did.'</p><h3>How You Can Join</h3><p>We're always looking for passionate individuals to join our volunteer family. Whether you have a few hours a week or can commit to longer-term projects, there's a place for you in our mission.</p>",
    excerpt: "Hear inspiring stories from our volunteers who are making a difference in communities around the world.",
    featuredImage: "/placeholder.svg?height=400&width=600",
    tags: ["volunteers", "stories", "community", "inspiration"],
    category: "Volunteer Spotlights",
    status: "published",
    authorName: "Michael Chen",
    authorEmail: "michael@hopefoundation.org",
    views: 750,
    likes: 45,
    publishedAt: new Date('2024-01-05')
  }
]

// Sample contacts data
const contactsData = [
  {
    name: "John Smith",
    email: "john.smith@email.com",
    phone: "+919876543210",
    subject: "Volunteer Opportunity Inquiry",
    message: "I'm interested in volunteering for your education programs. I have 10 years of teaching experience and would like to contribute to your mission.",
    status: "new",
    priority: "medium",
    tags: ["volunteer", "education"],
    source: "website"
  },
  {
    name: "Maria Garcia",
    email: "maria.garcia@email.com",
    subject: "Partnership Proposal",
    message: "Our company would like to explore partnership opportunities for CSR activities. We're particularly interested in your clean water initiatives.",
    status: "new",
    priority: "high",
    tags: ["partnership", "csr"],
    source: "website"
  },
  {
    name: "David Wilson",
    email: "david.wilson@email.com",
    phone: "+919876543211",
    subject: "Donation Receipt Request",
    message: "I made a donation last month but haven't received the tax receipt yet. Could you please help me with this?",
    status: "in-progress",
    priority: "medium",
    tags: ["donation", "receipt"],
    source: "website"
  }
]

async function seedDatabase() {
  try {
    console.log('Connecting to MongoDB...')
    await mongoose.connect(MONGODB_URI)
    console.log('Connected to MongoDB')

    // Clear existing data
    console.log('Clearing existing data...')
    await User.deleteMany({})
    await Campaign.deleteMany({})
    await Event.deleteMany({})
    await Blog.deleteMany({})
    await Contact.deleteMany({})

    // Create users first
    console.log('Creating users...')
    const hashedUsers = await Promise.all(
      usersData.map(async (user) => ({
        ...user,
        password: await bcrypt.hash(user.password, 12)
      }))
    )
    const users = await User.insertMany(hashedUsers)
    console.log(`Inserted ${users.length} users`)

    // Get user IDs for referencing
    const adminUser = users.find(u => u.role === 'admin')
    const creatorUsers = users.filter(u => u.role === 'creator')

    // Insert campaigns with user references
    console.log('Inserting campaigns...')
    const campaignsWithUsers = campaignsData.map((campaign, index) => ({
      ...campaign,
      createdBy: creatorUsers[index % creatorUsers.length]._id
    }))
    const campaigns = await Campaign.insertMany(campaignsWithUsers)
    console.log(`Inserted ${campaigns.length} campaigns`)

    // Insert events with user references
    console.log('Inserting events...')
    const eventsWithUsers = eventsData.map((event, index) => ({
      ...event,
      createdBy: creatorUsers[index % creatorUsers.length]._id
    }))
    const events = await Event.insertMany(eventsWithUsers)
    console.log(`Inserted ${events.length} events`)

    // Insert blogs with user references
    console.log('Inserting blogs...')
    const blogsWithUsers = blogsData.map((blog, index) => ({
      ...blog,
      authorId: creatorUsers[index % creatorUsers.length]._id
    }))
    const blogs = await Blog.insertMany(blogsWithUsers)
    console.log(`Inserted ${blogs.length} blogs`)

    // Insert contacts
    console.log('Inserting contacts...')
    const contacts = await Contact.insertMany(contactsData)
    console.log(`Inserted ${contacts.length} contacts`)

    console.log('Database seeded successfully!')
    console.log('\nLogin credentials:')
    console.log('Admin: admin@hopefoundation.org / admin123')
    console.log('Creator: sarah@hopefoundation.org / password123')
    
    process.exit(0)
  } catch (error) {
    console.error('Error seeding database:', error)
    process.exit(1)
  }
}

seedDatabase()