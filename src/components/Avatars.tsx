"use client";

"use client";

import { useOthers, useSelf } from "@liveblocks/react/suspense";
import styles from "./Avatars.module.css";

const defaultAvatar = (name: string) => {
  const initials = name
    .split(" ")
    .filter(Boolean)
    .map((part) => part[0].toUpperCase())
    .slice(0, 2)
    .join("") || "U";

  return `data:image/svg+xml,${encodeURIComponent(
    `<svg xmlns="http://www.w3.org/2000/svg" width="64" height="64"><rect width="100%" height="100%" rx="16" fill="#e2e8f0"/><text x="50%" y="55%" text-anchor="middle" dominant-baseline="middle" font-family="Arial, Helvetica, sans-serif" font-size="28" fill="#475569">${initials}</text></svg>`
  )}`;
};

export function Avatars() {
  const users = useOthers();
  const currentUser = useSelf();

  return (
    <div className={styles.avatars}>
      {users.map(({ connectionId, info }) => {
        return (
          <Avatar key={connectionId} picture={info.avatar} name={info.name} />
        );
      })}

      {currentUser && (
        <Avatar
          picture={currentUser.info.avatar}
          name={currentUser.info.name}
        />
      )}
    </div>
  );
}

export function Avatar({ picture, name }: { picture?: string; name?: string }) {
  const displayName = name || "User";
  const fallback = defaultAvatar(displayName);
  const src = picture?.trim() ? picture : fallback;

  return (
    <div className={styles.avatar} data-tooltip={displayName}>
      <img
        alt={displayName}
        src={src}
        className={styles.avatar_picture}
        data-tooltip={displayName}
        onError={(event) => {
          event.currentTarget.src = fallback;
        }}
      />
    </div>
  );
}
