import { cookies } from "next/headers";

export const GET = async () => {
  const token = (await cookies()).get("auth-token")?.value;

  if (!token) return Response.json({ message: "nothing" });

  const response = await fetch(
    `http://localhost:3001/api/auth/user?session=${token}`,
    {
      headers: {
        "Content-Type": "application/json",
      },
    }
  );

  const data = await response.json();

  return Response.json(data);
};
