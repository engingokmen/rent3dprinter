import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { useRouter, useSearchParams } from "next/navigation";
import { signIn } from "next-auth/react";
import LoginPage from "@/app/(auth)/login/page";

// Mock next/navigation
jest.mock("next/navigation", () => ({
  useRouter: jest.fn(),
  useSearchParams: jest.fn(),
}));

// Mock next-auth/react
jest.mock("next-auth/react", () => ({
  signIn: jest.fn(),
}));

describe("LoginPage", () => {
  const mockPush = jest.fn();
  const mockRefresh = jest.fn();
  const mockGet = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
    (useRouter as jest.Mock).mockReturnValue({
      push: mockPush,
      refresh: mockRefresh,
    });
    (useSearchParams as jest.Mock).mockReturnValue({
      get: mockGet,
    });
    mockGet.mockReturnValue(null); // Default: no search params
  });

  it("should render login form", () => {
    render(<LoginPage />);

    expect(screen.getByLabelText(/email/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/password/i)).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /sign in/i })).toBeInTheDocument();
  });

  it("should show error on failed login", async () => {
    const user = userEvent.setup();
    (signIn as jest.Mock).mockResolvedValue({
      error: "CredentialsSignin",
      ok: false,
    });

    render(<LoginPage />);

    await user.type(screen.getByLabelText(/email/i), "test@example.com");
    await user.type(screen.getByLabelText(/password/i), "wrongpassword");
    await user.click(screen.getByRole("button", { name: /sign in/i }));

    await waitFor(() => {
      expect(screen.getByText(/invalid email or password/i)).toBeInTheDocument();
    });
  });

  it("should redirect on successful login", async () => {
    const user = userEvent.setup();
    (signIn as jest.Mock).mockResolvedValue({
      error: null,
      ok: true,
    });

    render(<LoginPage />);

    await user.type(screen.getByLabelText(/email/i), "test@example.com");
    await user.type(screen.getByLabelText(/password/i), "password123");
    await user.click(screen.getByRole("button", { name: /sign in/i }));

    await waitFor(() => {
      expect(mockPush).toHaveBeenCalledWith("/dashboard");
      expect(mockRefresh).toHaveBeenCalled();
    });
  });

  it("should disable form during submission", async () => {
    const user = userEvent.setup();
    (signIn as jest.Mock).mockImplementation(
      () => new Promise((resolve) => setTimeout(() => resolve({ ok: true }), 100))
    );

    render(<LoginPage />);

    // Fill out the form first
    await user.type(screen.getByLabelText(/email/i), "test@example.com");
    await user.type(screen.getByLabelText(/password/i), "password123");
    
    const submitButton = screen.getByRole("button", { name: /sign in/i });
    await user.click(submitButton);

    // Wait for the button to be disabled and loading text to appear
    await waitFor(() => {
      expect(submitButton).toBeDisabled();
      expect(screen.getByText(/signing in/i)).toBeInTheDocument();
    });
  });

  it("should link to register page", () => {
    render(<LoginPage />);

    const registerLink = screen.getByRole("link", { name: /register here/i });
    expect(registerLink).toHaveAttribute("href", "/register");
  });

  it("should show success message after registration", () => {
    mockGet.mockImplementation((key: string) => {
      if (key === "registered") return "true";
      if (key === "email") return "test@example.com";
      return null;
    });

    render(<LoginPage />);

    expect(screen.getByText(/registration successful/i)).toBeInTheDocument();
    expect(screen.getByDisplayValue("test@example.com")).toBeInTheDocument();
  });
});

