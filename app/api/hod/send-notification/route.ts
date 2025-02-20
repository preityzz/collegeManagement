import { NextResponse } from "next/server";
import clientPromise from "@/lib/db";

export async function POST(request: Request) {
  try {
    const client = await clientPromise;
    const db = client.db("college");
    const notificationCollection = db.collection("notifications");

    const { message, studentIds } = await request.json();
    await notificationCollection.insertOne({ message, studentIds });

    return NextResponse.json({ message: "Notification sent successfully" });
  } catch  {
    return NextResponse.json(
      { error: "Failed to send notification" },
      { status: 500 }
    );
  }
}
