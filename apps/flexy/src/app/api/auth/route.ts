import { cookies } from "next/headers";
import { NextRequest } from "next/server";

export const GET = async (request: NextRequest) => {
  const code = request.nextUrl.searchParams.get("code");

  if (!code) return;

  const response = await fetch("http://localhost:3001/api/auth/exchange-code", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      code,
      secret: "52665f83-4a09-4d98-9bd3-c03fb60cbf05",
    }),
  });

  const { session } = (await response.json()) as { session: string };

  // Set cookie

  (await cookies()).set("auth-token", session, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: 60 * 60 * 24 * 7, // 7 days
  });

  return Response.redirect("http://localhost:3002");
};
