import { NextResponse } from "next/server";
import clientPromise from "@/lib/db";
import { ObjectId } from "mongodb";

export async function POST(request: Request) {
  try {
    const client = await clientPromise;
    const db = client.db("college");
    const userCollection = db.collection("users");

    const { teacherId } = await request.json();
    await userCollection.updateOne(
      { _id: new ObjectId(teacherId) },
      { $set: { role: "teacher" } }
    );

    return NextResponse.json({ message: "Teacher approved successfully" });
  } catch  {
    return NextResponse.json(
      { error: "Failed to approve teacher" },
      { status: 500 }
    );
  }
}
