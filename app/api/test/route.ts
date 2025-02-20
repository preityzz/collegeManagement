import { NextResponse } from "next/server";
import clientPromise from "@/lib/db";

export async function GET() {
  try {
    const client = await clientPromise;
    const db = client.db("college");

    // Simple ping to check connection
    await db.command({ ping: 1 });

    return NextResponse.json({ status: "Connected to MongoDB!" });
  } catch (error) {
    console.error("MongoDB connection error:", error);
    return NextResponse.json(
      { error: "Failed to connect to database" },
      { status: 500 }
    );
  }
}
