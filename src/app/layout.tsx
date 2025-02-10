import "~/styles/globals.css";

import { ClerkProvider } from "@clerk/nextjs";
import { GeistSans } from "geist/font/sans";
import { type Metadata } from "next";
import { PostHogProvider } from "./_providers/posthog-provider";
import { ToastContainer } from "react-toastify";

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
          <body>
            <main>{children}</main>
            <ToastContainer />
          </body>
        </PostHogProvider>
      </html>
    </ClerkProvider>
  );
}
