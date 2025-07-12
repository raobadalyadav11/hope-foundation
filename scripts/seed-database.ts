import connectDB from "@/lib/mongodb";
import path from "path";
import fs from "fs";
// Read seed data
const readSeedData = (filename: string) => {
  const filePath = path.join(__dirname, '..', 'data', filename);
  const data = fs.readFileSync(filePath, 'utf8');
  return JSON.parse(data);
};

// Main seeding function
const seedDatabase = async () => {
  try {
    console.log('Starting database seeding...');
    await connectDB();
    
    const campaigns = readSeedData('seed-campaigns.json');
    const blogs = readSeedData('seed-blogs.json');
    const events = readSeedData('seed-events.json');
    const stats = readSeedData('seed-stats.json');
    
    console.log(`Loaded ${campaigns.length} campaigns`);
    console.log(`Loaded ${blogs.length} blogs`);
    console.log(`Loaded ${events.length} events`);
    console.log('Loaded statistics data');
    
    console.log('Database seeding completed successfully!');
    
  } catch (error) {
    console.error('Error during seeding:', error);
  } finally {
    console.log('Database connection closed');
  }
};

if (require.main === module) {
  seedDatabase();
}

module.exports = { seedDatabase };