import { NextResponse } from "next/server";
import { createUser } from "@/lib/mock-users";
import { z } from "zod";

const registerSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Invalid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

export async function POST(request: Request) {
  try {
    const body = await request.json();
    
    // Validate input
    const validation = registerSchema.safeParse(body);
    if (!validation.success) {
      return NextResponse.json(
        { error: validation.error.errors[0].message },
        { status: 400 }
      );
    }

    const { name, email, password } = validation.data;

    // Create user (email is lowercased in createUser)
    const normalizedEmail = email.toLowerCase().trim();
    const user = await createUser(normalizedEmail, name, password);

    // Verify user was created (for debugging)
    const { findUserByEmail } = await import("@/lib/mock-users");
    const verifyUser = findUserByEmail(normalizedEmail);
    
    if (!verifyUser) {
      console.error("User creation verification failed");
      return NextResponse.json(
        { error: "User creation failed verification" },
        { status: 500 }
      );
    }

    return NextResponse.json(
      { 
        message: "User created successfully", 
        userId: user.id,
        email: user.email // Return normalized email for client
      },
      { status: 201 }
    );
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || "Registration failed" },
      { status: 400 }
    );
  }
}

