import { NextResponse } from "next/server";
import clientPromise from "@/lib/db";

export async function GET(request: Request) {
  try {
    const client = await clientPromise;
    const db = client.db("college");
    const attendanceCollection = db.collection("attendance");

    const { searchParams } = new URL(request.url);
    const studentId = searchParams.get("studentId");
    const attendance = await attendanceCollection.find({ studentId }).toArray();

    return NextResponse.json(attendance);
  } catch  {
    return NextResponse.json(
      { error: "Failed to fetch attendance" },
      { status: 500 }
    );
  }
}
