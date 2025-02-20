import { NextResponse } from "next/server";
import clientPromise from "@/lib/db";

export async function POST(request: Request) {
  try {
    const client = await clientPromise;
    const db = client.db("college");
    const userCollection = db.collection("users");

    const { firstName, lastName, email, password } = await request.json();
    await userCollection.insertOne({
      firstName,
      lastName,
      email,
      password,
      role: "student",
    });

    return NextResponse.json({ message: "Student registered successfully" });
  } catch  {
    return NextResponse.json(
      { error: "Failed to register student" },
      { status: 500 }
    );
  }
}
