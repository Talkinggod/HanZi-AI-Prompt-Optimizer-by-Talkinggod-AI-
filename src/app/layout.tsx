import "@/styles/globals.css";
import { type Metadata } from "next";
import { TRPCReactProvider } from "@/trpc/react";
import { headers } from "next/headers";

export const metadata: Metadata = {
  title: "HanZi Prompt Optimizer",
  description: "AI-powered token economy & prompt engineering by Talkinggod AI",
  icons: [
    { rel: "icon", url: "/favicon.ico" },
    { rel: "apple-touch-icon", url: "/icons/icon-192x192.png" },
  ],
  manifest: "/manifest.json",
  themeColor: "#1e293b",
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "HanZi Optimizer",
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <TRPCReactProvider headers={headers()}>
          {children}
        </TRPCReactProvider>
      </body>
    </html>
  );
}
