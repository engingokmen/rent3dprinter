import {
  createUser,
  findUserByEmail,
  findUserById,
  verifyPassword,
  getAllUsers,
  clearAllUsers,
} from "@/lib/mock-users";

// Clear users before each test
beforeEach(() => {
  clearAllUsers();
});

describe("Mock Users", () => {
  describe("createUser", () => {
    it("should create a new user with hashed password", async () => {
      const user = await createUser("test@example.com", "Test User", "password123");

      expect(user).toBeDefined();
      expect(user.email).toBe("test@example.com");
      expect(user.name).toBe("Test User");
      expect(user.password).not.toBe("password123"); // Should be hashed
      expect(user.password.length).toBeGreaterThan(20); // bcrypt hash is long
      expect(user.id).toBeDefined();
      expect(user.createdAt).toBeInstanceOf(Date);
    });

    it("should lowercase email addresses", async () => {
      const user = await createUser("TEST@EXAMPLE.COM", "Test User", "password123");

      expect(user.email).toBe("test@example.com");
    });

    it("should throw error if user already exists", async () => {
      await createUser("duplicate@example.com", "User 1", "password123");

      await expect(
        createUser("duplicate@example.com", "User 2", "password456")
      ).rejects.toThrow("User with this email already exists");
    });

    it("should throw error for case-insensitive duplicate emails", async () => {
      await createUser("test@example.com", "User 1", "password123");

      await expect(
        createUser("TEST@EXAMPLE.COM", "User 2", "password456")
      ).rejects.toThrow("User with this email already exists");
    });
  });

  describe("findUserByEmail", () => {
    beforeEach(async () => {
      await createUser("find@example.com", "Find User", "password123");
    });

    it("should find user by email", () => {
      const user = findUserByEmail("find@example.com");

      expect(user).toBeDefined();
      expect(user?.email).toBe("find@example.com");
      expect(user?.name).toBe("Find User");
    });

    it("should be case-insensitive", () => {
      const user = findUserByEmail("FIND@EXAMPLE.COM");

      expect(user).toBeDefined();
      expect(user?.email).toBe("find@example.com");
    });

    it("should return undefined for non-existent user", () => {
      const user = findUserByEmail("nonexistent@example.com");

      expect(user).toBeUndefined();
    });
  });

  describe("findUserById", () => {
    it("should find user by ID", async () => {
      const createdUser = await createUser("id@example.com", "ID User", "password123");
      const user = findUserById(createdUser.id);

      expect(user).toBeDefined();
      expect(user?.id).toBe(createdUser.id);
      expect(user?.email).toBe("id@example.com");
    });

    it("should return undefined for non-existent ID", () => {
      const user = findUserById("nonexistent-id");

      expect(user).toBeUndefined();
    });
  });

  describe("verifyPassword", () => {
    it("should verify correct password", async () => {
      const user = await createUser("verify@example.com", "Verify User", "correctpassword");

      const isValid = await verifyPassword("correctpassword", user.password);
      expect(isValid).toBe(true);
    });

    it("should reject incorrect password", async () => {
      const user = await createUser("verify@example.com", "Verify User", "correctpassword");

      const isValid = await verifyPassword("wrongpassword", user.password);
      expect(isValid).toBe(false);
    });

    it("should handle different passwords correctly", async () => {
      const user1 = await createUser("user1@example.com", "User 1", "password1");
      const user2 = await createUser("user2@example.com", "User 2", "password2");

      expect(await verifyPassword("password1", user1.password)).toBe(true);
      expect(await verifyPassword("password2", user2.password)).toBe(true);
      expect(await verifyPassword("password1", user2.password)).toBe(false);
      expect(await verifyPassword("password2", user1.password)).toBe(false);
    });
  });
});

