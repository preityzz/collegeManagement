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
  } catch {
    return NextResponse.json(
      { error: "Failed to approve teacher" },
      { status: 500 }
    );
  }
}

export async function GET() {
  try {
    const client = await clientPromise;
    const db = client.db("college");
    const userCollection = db.collection("users");

    // Find users with pending teacher role
    const pendingTeachers = await userCollection
      .find({ role: "pending_teacher" })
      .project({
        _id: 1,
        name: 1,
        email: 1,
        department: 1,
        qualification: 1,
        joinedAt: 1,
      })
      .toArray();

    return NextResponse.json({ teachers: pendingTeachers });
  } catch (error) {
    console.error("Failed to fetch pending teachers:", error);
    return NextResponse.json(
      { error: "Failed to fetch pending teachers" },
      { status: 500 }
    );
  }
}
