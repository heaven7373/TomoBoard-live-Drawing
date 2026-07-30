import { Liveblocks } from "@liveblocks/node";
import { NextRequest } from "next/server";
import { getUser, createUser } from "@/database";
import { auth, currentUser } from "@clerk/nextjs/server";

// Authenticating your Liveblocks application
// https://liveblocks.io/docs/authentication

const liveblocks = new Liveblocks({
  secret: process.env.LIVEBLOCKS_SECRET_KEY as string,
});

// Random color function
function getRandomColor() {
  const colors = ["#D583F0", "#F08385", "#F0D885", "#85EED6", "#85BBF0", "#8594F0", "#85DBF0", "#87EE85"];
  return colors[Math.floor(Math.random() * colors.length)];
}

export async function POST(request: NextRequest) {
  const { userId } = await auth();
  const clerkUser = await currentUser();

  const effectiveUserId = userId || "guest-user";
  const userName = clerkUser?.firstName || "Guest User";
  const userAvatar = clerkUser?.imageUrl || "";

  let user = await getUser(effectiveUserId);

  if (!user) {
    const color = getRandomColor();
    await createUser(effectiveUserId, userName, userAvatar, color);
    user = await getUser(effectiveUserId);
  }

  if (!user) {
    return new Response(JSON.stringify({ error: "Unable to resolve user." }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }

  // Create a session for the current user
  // userInfo is made available in Liveblocks presence hooks, e.g. useOthers
  const session = liveblocks.prepareSession(`${user.id}`, {
    userInfo: {
      name: user.name,
      color: user.color,
      avatar: user.avatar,
    },
  });

  // Use a naming pattern to allow access to rooms with a wildcard
  session.allow(`liveblocks:examples:*`, session.FULL_ACCESS);

  // Authorize the user and return the result
  const { body, status } = await session.authorize();
  return new Response(body, { status });
}
