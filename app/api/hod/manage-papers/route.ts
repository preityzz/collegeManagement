import { NextResponse } from "next/server";
import clientPromise from "@/lib/db";

export async function POST(request: Request) {
  try {
    const client = await clientPromise;
    const db = client.db("college");
    const paperCollection = db.collection("papers");

    const { name, code } = await request.json();

    // Validate required fields
    if (!name || !code) {
      return NextResponse.json(
        { error: "Name and code are required" },
        { status: 400 }
      );
    }

    // Check if paper code already exists
    const existingPaper = await paperCollection.findOne({ code });
    if (existingPaper) {
      return NextResponse.json(
        { error: "Paper code already exists" },
        { status: 409 }
      );
    }

    await paperCollection.insertOne({
      name,
      code,
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    return NextResponse.json(
      { message: "Paper added successfully" },
      { status: 201 }
    );
  } catch (error) {
    console.error("Error adding paper:", error);
    return NextResponse.json({ error: "Failed to add paper" }, { status: 500 });
  }
}
