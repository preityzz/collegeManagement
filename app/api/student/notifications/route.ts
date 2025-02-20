import { NextResponse } from "next/server";
import clientPromise from "@/lib/db";

export async function GET(request: Request) {
  try {
    const client = await clientPromise;
    const db = client.db("college");
    const notificationCollection = db.collection("notifications");

    const { searchParams } = new URL(request.url);
    const studentId = searchParams.get("studentId");
    const notifications = await notificationCollection
      .find({ studentIds: studentId })
      .toArray();

    return NextResponse.json(notifications);
  } catch  {
    return NextResponse.json(
      { error: "Failed to fetch notifications" },
      { status: 500 }
    );
  }
}
