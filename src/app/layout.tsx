import type { Metadata } from "next";
import "./globals.css";
import { Sidebar } from "@/components/Sidebar";

export const metadata: Metadata = {
  title: "Global Keyword Intelligence",
  description: "Free-first, worldwide, multilingual keyword research. Real suggestions only — volume, CPC and KD are never invented.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <div className="flex min-h-screen">
          <Sidebar active="/" />
          <main className="flex-1 p-4 md:p-8 max-w-6xl w-full">{children}</main>
        </div>
      </body>
    </html>
  );
}
