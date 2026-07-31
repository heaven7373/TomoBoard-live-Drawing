import { Liveblocks } from "@liveblocks/node";
import { NextRequest } from "next/server";

export const runtime = "nodejs";

const secret = process.env.LIVEBLOCKS_SECRET_KEY;

console.log("LIVEBLOCKS_SECRET_KEY exists:", !!secret);

if (!secret) {
  throw new Error("LIVEBLOCKS_SECRET_KEY is missing");
}

const liveblocks = new Liveblocks({
  secret,
});

export async function POST(request: NextRequest) {
  const session = liveblocks.prepareSession("test-user", {
    userInfo: {
      name: "Test User",
      color: "#85BBF0",
      avatar: "",
    },
  });

  session.allow("liveblocks:examples:*", session.FULL_ACCESS);

  const { body, status } = await session.authorize();

  return new Response(body, { status });
}