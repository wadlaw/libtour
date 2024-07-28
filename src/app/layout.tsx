import { ClerkProvider } from "@clerk/nextjs";
import "~/styles/globals.css";

import { Inter } from "next/font/google";

import { TRPCReactProvider } from "~/trpc/react";
import { PageHeader } from "~/components/PageHeader";
import { Separator } from "~/components/ui/separator";
import { Toaster } from "~/components/ui/toaster";
import { CSPostHogProvider } from "./providers";
import dynamic from "next/dynamic";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-sans",
});

export const metadata = {
  metadataBase: new URL("https://libtour.net"),
  title: "Libtour ",
  description: "A summer-long series of events at Redlibbets",
  alternates: {
    canonical: "/",
    languages: {
      "en-GB": "/en-GB",
    },
  },
};

const PostHogPageView = dynamic(() => import("./PostHogPageView"), {
  ssr: false,
});

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ClerkProvider
      appearance={{
        elements: {
          footer: "hidden",
        },
      }}
    >
      <html lang="en">
        <CSPostHogProvider>
          <body className={`font-sans ${inter.variable}`}>
            <PostHogPageView />
            <TRPCReactProvider>
              <PageHeader />
              <Separator />
              {children}
              <Toaster />
            </TRPCReactProvider>
          </body>
        </CSPostHogProvider>
      </html>
    </ClerkProvider>
  );
}
