import "~/styles/globals.css";

import { GeistSans } from "geist/font/sans";
import { ClerkProvider } from "@clerk/nextjs";
import { type Metadata } from "next";
import { PostHogProvider } from "./_providers/posthog-provider";

export const metadata: Metadata = {
  title: "Mercedes Drive",
  description: "A feature-rich platform for driving experiences.",
  icons: [{ rel: "icon", url: "/favicon.ico" }],
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <ClerkProvider>
      <html lang="en" className={`${GeistSans.variable}`}>
        <PostHogProvider>
          <body>{children}</body>
        </PostHogProvider>
      </html>
    </ClerkProvider>
  );
}
