import { NextResponse } from "next/server";
import clientPromise from "@/lib/db";

export async function GET(request: Request) {
  try {
    const client = await clientPromise;
    const db = client.db("college");
    const timetableCollection = db.collection("timetable");

    const { searchParams } = new URL(request.url);
    const semester = searchParams.get("semester");
    const timetable = await timetableCollection.findOne({ semester });

    return NextResponse.json(timetable);
  } catch  {
    return NextResponse.json(
      { error: "Failed to fetch timetable" },
      { status: 500 }
    );
  }
}
