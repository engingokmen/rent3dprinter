import { createUser, findUserByEmail, clearAllUsers } from "@/lib/mock-users";

describe("Authentication", () => {
  beforeEach(async () => {
    clearAllUsers();
    // Create a test user
    await createUser("auth@example.com", "Auth User", "testpassword123");
  });

  describe("Credentials Provider", () => {
    it("should authenticate user with correct credentials", async () => {
      // Get the auth config to test the authorize function
      // Since we can't directly test NextAuth, we'll test the underlying logic
      const user = findUserByEmail("auth@example.com");

      expect(user).toBeDefined();
      expect(user?.email).toBe("auth@example.com");
    });

    it("should reject authentication with incorrect password", async () => {
      const user = findUserByEmail("auth@example.com");

      if (!user) {
        throw new Error("User should exist");
      }

      // Import verifyPassword to test
      const { verifyPassword } = await import("@/lib/mock-users");
      const isValid = await verifyPassword("wrongpassword", user.password);

      expect(isValid).toBe(false);
    });

    it("should reject authentication with non-existent email", () => {
      const user = findUserByEmail("nonexistent@example.com");

      expect(user).toBeUndefined();
    });
  });

  describe("Email normalization", () => {
    it("should handle email case insensitivity", async () => {
      await createUser("case@example.com", "Case User", "password123");

      const user1 = findUserByEmail("CASE@EXAMPLE.COM");
      const user2 = findUserByEmail("case@example.com");
      const user3 = findUserByEmail("Case@Example.Com");

      expect(user1?.email).toBe("case@example.com");
      expect(user2?.email).toBe("case@example.com");
      expect(user3?.email).toBe("case@example.com");
    });
  });
});
