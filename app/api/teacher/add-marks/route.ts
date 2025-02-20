import { NextResponse } from "next/server";
import clientPromise from "@/lib/db";

export async function POST(request: Request) {
  try {
    const client = await clientPromise;
    const db = client.db("college");
    const marksCollection = db.collection("marks");

    const { studentId, paperId, marks } = await request.json();
    await marksCollection.insertOne({ studentId, paperId, marks });

    return NextResponse.json({ message: "Marks added successfully" });
  } catch  {
    return NextResponse.json({ error: "Failed to add marks" }, { status: 500 });
  }
}
