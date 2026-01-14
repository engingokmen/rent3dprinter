import { auth } from "@/lib/auth";

/**
 * Get the current server session
 */
export async function getServerSession() {
  return await auth();
}

/**
 * Require authentication - throws error if not authenticated
 */
export async function requireAuth() {
  const session = await auth();
  if (!session) {
    throw new Error("Unauthorized");
  }
  return session;
}
