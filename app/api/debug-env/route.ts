// Temporary debug route to check environment variables
// Remove this file after debugging production issues
export async function GET() {
  return Response.json({
    hasSecret: !!process.env.NEXTAUTH_SECRET,
    hasUrl: !!process.env.NEXTAUTH_URL,
    secretLength: process.env.NEXTAUTH_SECRET?.length || 0,
    url: process.env.NEXTAUTH_URL || "not set",
    nodeEnv: process.env.NODE_ENV,
  });
}

