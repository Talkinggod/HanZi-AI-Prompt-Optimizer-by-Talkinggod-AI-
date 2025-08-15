import "@/styles/globals.css";

import { type Metadata } from "next";
import { api } from "@/utils/api";

export const metadata: Metadata = {
  title: "HanZi Prompt Optimizer",
  description: "AI-powered token economy & prompt engineering by Talkinggod AI",
  icons: [{ rel: "icon", url: "/favicon.ico" }],
};

function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        {children}
      </body>
    </html>
  );
}

export default api.withTRPC(RootLayout);
