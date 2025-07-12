# Seed Data for Hope Foundation

This directory contains seed data files for populating the Hope Foundation NGO website with sample content.

## Files

### `seed-campaigns.json`
Contains sample campaign data including:
- Clean Water for Rural Communities
- Education for Every Child  
- Women Empowerment Through Skills

Each campaign includes:
- Title, description, and detailed information
- Goal and raised amounts
- Location and category
- Tags and beneficiary counts
- Progress updates

### `seed-blogs.json`
Contains sample blog posts covering:
- Impact stories from the field
- Success stories of beneficiaries
- Educational content about social issues
- Event coverage and updates

Each blog includes:
- Title, content, and excerpt
- Author information
- Tags and categories
- View and like counts
- Publication dates

### `seed-events.json`
Contains sample events including:
- Annual Fundraising Gala
- Community Health Camps
- Volunteer Training Workshops
- Environmental Awareness Drives

Each event includes:
- Complete event details and agenda
- Location and contact information
- Registration requirements
- Attendee management

### `seed-stats.json`
Contains comprehensive statistics including:
- Overall impact numbers
- Monthly performance data
- Category-wise breakdown
- Geographical reach
- Volunteer and donor statistics

## Usage

To use this seed data:

1. Run the seeding script:
   ```bash
   node scripts/seed-database.js
   ```

2. Or import individual files in your application:
   ```javascript
   const campaigns = require('./data/seed-campaigns.json');
   const blogs = require('./data/seed-blogs.json');
   const events = require('./data/seed-events.json');
   const stats = require('./data/seed-stats.json');
   ```

## Data Structure

All data follows the MongoDB schema definitions in `lib/models/` and includes:
- Proper data types and validation
- Realistic Indian NGO context
- Diverse categories and locations
- Comprehensive field coverage

## Customization

Feel free to modify the seed data to match your specific requirements:
- Update locations and beneficiary numbers
- Change campaign categories and goals
- Modify event details and schedules
- Adjust statistics to reflect your organization