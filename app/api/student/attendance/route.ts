import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { verify } from "jsonwebtoken";
import clientPromise from "@/lib/db";

export async function GET() {
  try {
    // Get the auth token from cookies
    const cookieStore = await cookies();
    const token = cookieStore.get("auth_token")?.value;

    if (!token) {
      return NextResponse.json(
        { error: "Authentication required" },
        { status: 401 }
      );
    }

    // Verify the token and extract user info
    interface DecodedToken {
      id: string;
      // add other properties if needed
    }

    const decoded = verify(
      token,
      process.env.JWT_SECRET || "your-secret-key"
    ) as DecodedToken;
    const studentId = decoded.id;

    if (!studentId) {
      return NextResponse.json(
        { error: "Invalid authentication token" },
        { status: 401 }
      );
    }

    // Connect to MongoDB
    const client = await clientPromise;
    const db = client.db("college");
    const marksCollection = db.collection("marks");

    // Fetch marks for the authenticated student
    const marks = await marksCollection.find({ studentId }).toArray();

    // Sort marks by date (most recent first)
    marks.sort(
      (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
    );

    return NextResponse.json(marks);
  } catch (error) {
    console.error("Error fetching marks:", error);
    return NextResponse.json(
      { error: "Failed to fetch marks data" },
      { status: 500 }
    );
  }
}
