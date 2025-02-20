import { NextResponse } from "next/server";
import clientPromise from "@/lib/db";

export async function POST(request: Request) {
  try {
    const client = await clientPromise;
    const db = client.db("college");
    const timetableCollection = db.collection("timetable");

    const { semester, schedule } = await request.json();

    // Validate required fields
    if (!semester || !schedule || !Array.isArray(schedule)) {
      return NextResponse.json(
        { error: "Invalid data format" },
        { status: 400 }
      );
    }

    // Update or insert timetable
    await timetableCollection.updateOne(
      { semester },
      { $set: { semester, schedule } },
      { upsert: true }
    );

    return NextResponse.json(
      { message: "Timetable updated successfully" },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error updating timetable:", error);
    return NextResponse.json(
      { error: "Failed to update timetable" },
      { status: 500 }
    );
  }
}
