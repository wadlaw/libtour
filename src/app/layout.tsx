import { ClerkProvider } from "@clerk/nextjs";
import "~/styles/globals.css";

import { Inter } from "next/font/google";
import { ViewTransitions } from "next-view-transitions";
import { TRPCReactProvider } from "~/trpc/react";
import { PageHeader } from "~/components/PageHeader";
import { Separator } from "~/components/ui/separator";
import { Toaster } from "~/components/ui/toaster";
import { CSPostHogProvider, ThemeProvider } from "./providers";
import { SidebarProvider, SidebarInset } from "~/components/ui/sidebar";
import { AppSidebar } from "~/components/app-sidebar";
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
      <ViewTransitions>
        <html lang="en" suppressHydrationWarning>
          <CSPostHogProvider>
            <body className={`font-sans ${inter.variable}`}>
              <ThemeProvider
                attribute="class"
                defaultTheme="system"
                enableSystem
                disableTransitionOnChange
              >
                <TRPCReactProvider>
                  <SidebarProvider>
                    <AppSidebar />

                    <SidebarInset>
                      <PostHogPageView />
                      {/* <div className="w-full"> */}
                      <PageHeader />
                      <Separator />
                      {children}
                      <Toaster />
                      {/* </div> */}
                    </SidebarInset>
                  </SidebarProvider>
                </TRPCReactProvider>
              </ThemeProvider>
            </body>
          </CSPostHogProvider>
        </html>
      </ViewTransitions>
    </ClerkProvider>
  );
}
