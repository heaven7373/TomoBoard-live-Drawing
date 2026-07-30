import { SignUp } from "@clerk/nextjs";

export default function Page() {
  return (
    <div style={{ minHeight: "100svh", display: "grid", placeItems: "center", padding: "1rem" }}>
      <SignUp />
    </div>
  );
}
