import Link from "next/link";
import { Button } from "@/components/ui/button";
import { env } from "@/lib/env";

export default function Home() {
  const generateURL = (pathname: string) => {
    const url = new URL(pathname, env.SERVER_CLIENT_URL);
    url.searchParams.set("clientId", env.FLEXY_CLIENT_ID);
    url.searchParams.set("redirectUrl", env.FLEXY_REDIRECT_URL);
    return url.toString();
  };

  return (
    <div className="h-16 flex items-center justify-end gap-2 p-4">
      <Button asChild>
        <Link href={generateURL("/sign-in")}>Sign in</Link>
      </Button>
      <Button asChild>
        <Link href={generateURL("/sign-up")}>Sign up</Link>
      </Button>
    </div>
  );
}
