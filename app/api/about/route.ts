import { NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/mongodb";
import About from "@/lib/models/About";

export async function GET() {
  try {
    await connectToDatabase();
    
    // Get about data from database
    const aboutData = await About.findOne({});
    
    // If no data exists, return 404
    if (!aboutData) {
      return NextResponse.json({ error: "About data not found" }, { status: 404 });
    }
    
    return NextResponse.json(aboutData);
  } catch (error) {
    console.error("Error fetching about data:", error);
    return NextResponse.json({ error: "Failed to fetch about data" }, { status: 500 });
  }
}