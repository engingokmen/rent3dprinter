import { POST } from "@/app/api/auth/register/route";
import { findUserByEmail, verifyPassword, clearAllUsers } from "@/lib/mock-users";

describe("POST /api/auth/register", () => {
  beforeEach(() => {
    clearAllUsers();
  });

  it("should register a new user successfully", async () => {
    const body = JSON.stringify({
      name: "Test User",
      email: "test@example.com",
      password: "password123",
    });
    
    const request = new Request("http://localhost:3000/api/auth/register", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: body,
    });

    const response = await POST(request);
    const data = await response.json();

    expect(response.status).toBe(201);
    expect(data.message).toBe("User created successfully");
    expect(data.userId).toBeDefined();

    // Verify user was created
    const user = findUserByEmail("test@example.com");
    expect(user).toBeDefined();
    expect(user?.email).toBe("test@example.com");
    expect(user?.name).toBe("Test User");

    // Verify password is hashed
    const isValid = await verifyPassword("password123", user!.password);
    expect(isValid).toBe(true);
  });

  it("should reject registration with invalid email", async () => {
    const body = JSON.stringify({
      name: "Test User",
      email: "invalid-email",
      password: "password123",
    });
    
    const request = new Request("http://localhost:3000/api/auth/register", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: body,
    });

    const response = await POST(request);
    const data = await response.json();

    expect(response.status).toBe(400);
    expect(data.error).toContain("email");
  });

  it("should reject registration with short password", async () => {
    const body = JSON.stringify({
      name: "Test User",
      email: "test@example.com",
      password: "12345", // Less than 6 characters
    });
    
    const request = new Request("http://localhost:3000/api/auth/register", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: body,
    });

    const response = await POST(request);
    const data = await response.json();

    expect(response.status).toBe(400);
    expect(data.error).toContain("6 characters");
  });

  it("should reject registration with short name", async () => {
    const body = JSON.stringify({
      name: "A", // Less than 2 characters
      email: "test@example.com",
      password: "password123",
    });
    
    const request = new Request("http://localhost:3000/api/auth/register", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: body,
    });

    const response = await POST(request);
    const data = await response.json();

    expect(response.status).toBe(400);
    expect(data.error).toContain("2 characters");
  });

  it("should reject duplicate email registration", async () => {
    // Register first user
    const body1 = JSON.stringify({
      name: "First User",
      email: "duplicate@example.com",
      password: "password123",
    });
    
    const request1 = new Request("http://localhost:3000/api/auth/register", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: body1,
    });

    await POST(request1);

    // Try to register with same email
    const body2 = JSON.stringify({
      name: "Second User",
      email: "duplicate@example.com",
      password: "password456",
    });
    
    const request2 = new Request("http://localhost:3000/api/auth/register", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: body2,
    });

    const response = await POST(request2);
    const data = await response.json();

    expect(response.status).toBe(400);
    expect(data.error).toContain("already exists");
  });

  it("should handle missing fields", async () => {
    const body = JSON.stringify({
      name: "Test User",
      // Missing email and password
    });
    
    const request = new Request("http://localhost:3000/api/auth/register", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: body,
    });

    const response = await POST(request);
    const data = await response.json();

    expect(response.status).toBe(400);
    expect(data.error).toBeDefined();
  });
});

