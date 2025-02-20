import { NextResponse } from "next/server";
import clientPromise from "@/lib/db";

export async function POST(request: Request) {
  try {
    const client = await clientPromise;
    const db = client.db("college");
    const attendanceCollection = db.collection("attendance");

    const { studentId, paperId, date, status } = await request.json();
    await attendanceCollection.insertOne({ studentId, paperId, date, status });

    return NextResponse.json({ message: "Attendance added successfully" });
  } catch {
    return NextResponse.json(
      { error: "Failed to add attendance" },
      { status: 500 }
    );
  }
}
