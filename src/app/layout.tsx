import { Metadata } from "next";
import { Inter } from "next/font/google";
import "../globals.css";
import { Providers } from "./Providers";
import { Suspense } from "react";
import { ClerkProvider } from "@clerk/nextjs";

export const metadata: Metadata = {
  title: "TomoBoard",
};

const inter = Inter({
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  display: "swap",
});

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const clerkPublishableKey = process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY;

  const content = (
    <html lang="en" className={inter.className}>
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover" />
        <link
          href="https://liveblocks.io/favicon-32x32.png"
          rel="icon"
          sizes="32x32"
          type="image/png"
        />
        <link
          href="https://liveblocks.io/favicon-16x16.png"
          rel="icon"
          sizes="16x16"
          type="image/png"
        />
      </head>
      <body>
        <Suspense>
          <Providers>{children}</Providers>
        </Suspense>
      </body>
    </html>
  );

  if (!clerkPublishableKey) {
    return content;
  }

  return <ClerkProvider publishableKey={clerkPublishableKey}>{content}</ClerkProvider>;
}
