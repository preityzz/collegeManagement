import { NextResponse } from "next/server";
import { hash } from "bcrypt";
import clientPromise from "@/lib/db";

export async function POST(request: Request) {
  try {
    // Parse request body
    const { name, email, password, role } = await request.json();

    // Validate required fields
    if (!name || !email || !password) {
      return NextResponse.json(
        { error: "Name, email and password are required" },
        { status: 400 }
      );
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { error: "Please provide a valid email address" },
        { status: 400 }
      );
    }

    // Validate password strength
    if (password.length < 6) {
      return NextResponse.json(
        { error: "Password must be at least 6 characters long" },
        { status: 400 }
      );
    }

    // Validate role
    const allowedRoles = ["student", "pending_teacher"];
    if (!allowedRoles.includes(role)) {
      return NextResponse.json(
        { error: "Invalid role specified" },
        { status: 400 }
      );
    }

    // Connect to database
    const client = await clientPromise;
    const db = client.db("college");
    const usersCollection = db.collection("users");

    // Check if user already exists
    const existingUser = await usersCollection.findOne({ email });
    if (existingUser) {
      return NextResponse.json(
        { error: "Email already registered" },
        { status: 409 }
      );
    }

    // Hash password
    const saltRounds = 10;
    const hashedPassword = await hash(password, saltRounds);

    // Create user object with role-specific fields
    const userData = {
      name,
      email,
      password: hashedPassword,
      role,
      createdAt: new Date(),
      updatedAt: new Date(),
      verified: false,
    };

    // Add role-specific fields
    if (role === "student") {
      Object.assign(userData, {
        rollNumber: null,
        semester: null,
        department: null,
        studentDetails: {
          parentName: null,
          parentContact: null,
          dateOfBirth: null,
          address: null,
        },
      });
    } else if (role === "pending_teacher") {
      Object.assign(userData, {
        department: null,
        qualification: null,
        specialization: null,
        experience: null,
        teacherDetails: {
          subjects: [],
          joinedAt: new Date(),
          status: "pending",
        },
      });
    }

    // Insert user into database
    const result = await usersCollection.insertOne(userData);

    if (!result.insertedId) {
      return NextResponse.json(
        { error: "Failed to create user" },
        { status: 500 }
      );
    }

    // Return success response (omit sensitive data)
    return NextResponse.json({
      success: true,
      message:
        role === "pending_teacher"
          ? "Registration successful. Your teacher account is pending approval."
          : "Registration successful. Please sign in.",
      user: {
        id: result.insertedId.toString(),
        name,
        email,
        role,
      },
    });
  } catch (error) {
    console.error("Registration error:", error);
    return NextResponse.json(
      { error: "An error occurred during registration" },
      { status: 500 }
    );
  }
}
