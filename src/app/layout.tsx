import type { Metadata } from "next"; import "./globals.css"; import Frame from "@/components/layout/Frame";
export const metadata: Metadata = { title: "Corridor · Cross-border SME payments", description: "Stablecoin settlement intelligence (demo)" };
export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (<html lang="en"><body><Frame>{children}</Frame></body></html>);
}
