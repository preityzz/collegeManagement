import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { compare } from "bcrypt";
import { sign } from "jsonwebtoken";
import { ObjectId } from "mongodb";
import clientPromise from "@/lib/db";

export async function POST(request: Request) {
  try {
    const { email, password, remember } = await request.json();

    // Validate input
    if (!email || !password) {
      return NextResponse.json(
        { error: "Email and password are required" },
        { status: 400 }
      );
    }

    // Connect to MongoDB
    const client = await clientPromise;
    const db = client.db("college");
    const usersCollection = db.collection("users");

    // Find user by email
    const user = await usersCollection.findOne({ email });

    // Check if user exists
    if (!user) {
      return NextResponse.json(
        { error: "Invalid email or password" },
        { status: 401 }
      );
    }

    // Verify password
    const passwordMatch = await compare(password, user.password);
    if (!passwordMatch) {
      return NextResponse.json(
        { error: "Invalid email or password" },
        { status: 401 }
      );
    }

    // Check if teacher account is pending approval
    if (user.role === "pending_teacher") {
      return NextResponse.json(
        { error: "Your teacher account is pending approval by the HOD" },
        { status: 403 }
      );
    }

    // Create session token
    const token = sign(
      {
        id: user._id.toString(),
        email: user.email,
        role: user.role,
        name: user.name,
      },
      process.env.JWT_SECRET || "your-secret-key",
      { expiresIn: remember ? "30d" : "24h" }
    );

    // Set cookie expiration
    const cookieExpiration = new Date();
    cookieExpiration.setDate(cookieExpiration.getDate() + (remember ? 30 : 1));

    // Set authentication cookie
    const cookieStore = await cookies();
    cookieStore.set({
      name: "auth_token",
      value: token,
      httpOnly: true,
      expires: cookieExpiration,
      path: "/",
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
    });

    // Prepare user data for response (exclude sensitive info)
    const userData = {
      id: user._id.toString(),
      name: user.name,
      email: user.email,
      role: user.role,
      department: user.department || null,
      semester: user.semester || null,
      rollNumber: user.rollNumber || null,
    };

    // Track login for analytics (optional)
    await usersCollection.updateOne(
      { _id: new ObjectId(user._id) },
      {
        $set: { lastLogin: new Date() },
        $inc: { loginCount: 1 },
      }
    );

    // Return success with user data
    return NextResponse.json({
      success: true,
      message: "Login successful",
      user: userData,
    });
  } catch (error) {
    console.error("Login error:", error);
    return NextResponse.json(
      { error: "An error occurred during login" },
      { status: 500 }
    );
  }
}
