import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { useRouter } from "next/navigation";
import { signIn } from "next-auth/react";
import RegisterPage from "@/app/(auth)/register/page";

// Mock next/navigation
jest.mock("next/navigation", () => ({
  useRouter: jest.fn(),
}));

// Mock next-auth/react
jest.mock("next-auth/react", () => ({
  signIn: jest.fn(),
}));

// Mock fetch
global.fetch = jest.fn();

describe("RegisterPage", () => {
  const mockPush = jest.fn();
  const mockRefresh = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
    (useRouter as jest.Mock).mockReturnValue({
      push: mockPush,
      refresh: mockRefresh,
    });
    (fetch as jest.Mock).mockResolvedValue({
      ok: true,
      json: async () => ({ 
        message: "User created successfully", 
        userId: "123",
        email: "test@example.com" // Add email field that the code now uses
      }),
    });
    (signIn as jest.Mock).mockResolvedValue({
      error: null,
      ok: true,
    });
  });

  it("should render registration form", () => {
    render(<RegisterPage />);

    expect(screen.getByLabelText(/^name$/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/^email$/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/^password$/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/confirm password/i)).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /create account/i })).toBeInTheDocument();
  });

  it("should show error if passwords don't match", async () => {
    const user = userEvent.setup();

    render(<RegisterPage />);

    await user.type(screen.getByLabelText(/^name$/i), "Test User");
    await user.type(screen.getByLabelText(/^email$/i), "test@example.com");
    await user.type(screen.getByLabelText(/^password$/i), "password123");
    await user.type(screen.getByLabelText(/confirm password/i), "differentpassword");
    await user.click(screen.getByRole("button", { name: /create account/i }));

    await waitFor(() => {
      expect(screen.getByText(/passwords do not match/i)).toBeInTheDocument();
    });

    expect(fetch).not.toHaveBeenCalled();
  });

  it("should show error if password is too short", async () => {
    const user = userEvent.setup();

    render(<RegisterPage />);

    await user.type(screen.getByLabelText(/^name$/i), "Test User");
    await user.type(screen.getByLabelText(/^email$/i), "test@example.com");
    await user.type(screen.getByLabelText(/^password$/i), "12345"); // Less than 6
    await user.type(screen.getByLabelText(/confirm password/i), "12345");
    await user.click(screen.getByRole("button", { name: /create account/i }));

    await waitFor(() => {
      expect(screen.getByText(/password must be at least 6 characters/i)).toBeInTheDocument();
    });
  });

  it("should register user and auto-login on success", async () => {
    const user = userEvent.setup();

    render(<RegisterPage />);

    await user.type(screen.getByLabelText(/^name$/i), "Test User");
    await user.type(screen.getByLabelText(/^email$/i), "test@example.com");
    await user.type(screen.getByLabelText(/^password$/i), "password123");
    await user.type(screen.getByLabelText(/confirm password/i), "password123");
    await user.click(screen.getByRole("button", { name: /create account/i }));

    await waitFor(() => {
      expect(fetch).toHaveBeenCalledWith("/api/auth/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: "Test User",
          email: "test@example.com",
          password: "password123",
        }),
      });
    }, { timeout: 1000 });

    // Wait for the delay (200ms) + signIn call
    await waitFor(() => {
      expect(signIn).toHaveBeenCalledWith("credentials", {
        email: "test@example.com", // This should match data.email from fetch response
        password: "password123",
        redirect: false,
      });
    }, { timeout: 1000 });

    await waitFor(() => {
      expect(mockPush).toHaveBeenCalledWith("/dashboard");
    }, { timeout: 1000 });
  });

  it("should show error on registration failure", async () => {
    const user = userEvent.setup();
    (fetch as jest.Mock).mockResolvedValue({
      ok: false,
      json: async () => ({ error: "User already exists" }),
    });

    render(<RegisterPage />);

    await user.type(screen.getByLabelText(/^name$/i), "Test User");
    await user.type(screen.getByLabelText(/^email$/i), "test@example.com");
    await user.type(screen.getByLabelText(/^password$/i), "password123");
    await user.type(screen.getByLabelText(/confirm password/i), "password123");
    await user.click(screen.getByRole("button", { name: /create account/i }));

    await waitFor(() => {
      expect(screen.getByText(/user already exists/i)).toBeInTheDocument();
    });
  });

  it("should link to login page", () => {
    render(<RegisterPage />);

    const loginLink = screen.getByRole("link", { name: /login here/i });
    expect(loginLink).toHaveAttribute("href", "/login");
  });

  it("should redirect to login if auto-login fails", async () => {
    const user = userEvent.setup();
    const consoleSpy = jest.spyOn(console, "error").mockImplementation(() => {});
    
    (fetch as jest.Mock).mockResolvedValue({
      ok: true,
      json: async () => ({ 
        message: "User created successfully", 
        userId: "123",
        email: "test@example.com"
      }),
    });
    (signIn as jest.Mock).mockResolvedValue({
      error: "CredentialsSignin",
      ok: false,
    });

    render(<RegisterPage />);

    await user.type(screen.getByLabelText(/^name$/i), "Test User");
    await user.type(screen.getByLabelText(/^email$/i), "test@example.com");
    await user.type(screen.getByLabelText(/^password$/i), "password123");
    await user.type(screen.getByLabelText(/confirm password/i), "password123");
    await user.click(screen.getByRole("button", { name: /create account/i }));

    await waitFor(() => {
      expect(mockPush).toHaveBeenCalledWith(
        expect.stringContaining("/login?registered=true&email=")
      );
    }, { timeout: 1000 });
    
    consoleSpy.mockRestore();
  });
});

