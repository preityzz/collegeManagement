import { NextResponse } from "next/server";
import clientPromise from "@/lib/db";

export async function GET(request: Request) {
  try {
    const client = await clientPromise;
    const db = client.db("college");
    const marksCollection = db.collection("marks");

    const { searchParams } = new URL(request.url);
    const studentId = searchParams.get("studentId");
    const marks = await marksCollection.find({ studentId }).toArray();

    return NextResponse.json(marks);
  } catch  {
    return NextResponse.json(
      { error: "Failed to fetch marks" },
      { status: 500 }
    );
  }
}
