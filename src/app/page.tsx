"use client";

import { Room } from "@/app/Room";
import { StorageTldraw } from "@/components/StorageTldraw";
import { StudentLearningHub } from "@/components/StudentLearningHub";
import { UserButton } from "@clerk/nextjs";
import { useState } from "react";

/**
 * IMPORTANT: LICENSE REQUIRED
 * To use tldraw commercially, you must first purchase a license
 * Learn more: https://tldraw.dev/community/license
 */

export default function Home() {
  const clerkEnabled = Boolean(process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY);
  const [hubOpen, setHubOpen] = useState(false);

  return (
    <Room>
      {clerkEnabled ? (
        <div className="corner-actions">
          <UserButton />
        </div>
      ) : null}

      <div className="corner-actions" style={{ left: 12, right: "auto" }}>
        <button
          onClick={() => setHubOpen(true)}
          style={{
            background: "#0ea5a3",
            color: "white",
            border: "none",
            padding: "8px 12px",
            borderRadius: 8,
            cursor: "pointer",
          }}
        >
          Study Hub
        </button>
      </div>

      <StudentLearningHub open={hubOpen} onClose={() => setHubOpen(false)} />
      <StorageTldraw />
    </Room>
  );
}
