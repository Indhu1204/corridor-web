import type { Metadata } from "next"; import { Outfit } from "next/font/google"; import "./globals.css"; import Frame from "@/components/layout/Frame";
const outfit = Outfit({ subsets: ["latin"] });
export const metadata: Metadata = { title: "Corridor · Cross-border SME payments", description: "Stablecoin settlement intelligence (demo)" };
export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (<html lang="en"><body className={outfit.className}><Frame>{children}</Frame></body></html>);
}
