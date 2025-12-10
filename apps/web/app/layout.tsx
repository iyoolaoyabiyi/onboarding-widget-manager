"use client";

import "./globals.css";
import { Toaster } from "sonner";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { usePathname } from "next/navigation";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const isAuthRoute =
    pathname.startsWith("/sign-in") || pathname.startsWith("/sign-up");

  return (
    <html lang="en">
      <body>
        {!isAuthRoute && <Navbar />}
        <Toaster position="top-right" richColors closeButton />
        {children}
        {!isAuthRoute && <Footer />}
      </body>
    </html>
  );
}
