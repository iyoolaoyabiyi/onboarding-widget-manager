"use client";

import PublicRoute from "@/components/auth/PublicRoute";

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <PublicRoute>
      <div className="min-h-screen flex items-center justify-center">
        {children}
      </div>
    </PublicRoute>
  );
}
