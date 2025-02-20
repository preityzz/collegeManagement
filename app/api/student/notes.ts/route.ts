import { NextResponse } from "next/server";
import clientPromise from "@/lib/db";

export async function GET(request: Request) {
  try {
    const client = await clientPromise;
    const db = client.db("college");
    const notesCollection = db.collection("notes");

    const { searchParams } = new URL(request.url);
    const studentId = searchParams.get("studentId");
    const notes = await notesCollection.find({ studentId }).toArray();

    return NextResponse.json(notes);
  } catch  {
    return NextResponse.json(
      { error: "Failed to fetch notes" },
      { status: 500 }
    );
  }
}
