import { NextResponse } from "next/server";
import clientPromise from "@/lib/db";

export async function POST(request: Request) {
  try {
    const client = await clientPromise;
    const db = client.db("college");
    const notesCollection = db.collection("notes");

    const { paperId, content } = await request.json();
    await notesCollection.insertOne({ paperId, content });

    return NextResponse.json({ message: "Notes added successfully" });
  } catch  {
    return NextResponse.json({ error: "Failed to add notes" }, { status: 500 });
  }
}
