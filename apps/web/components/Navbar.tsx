"use client";

import Link from "next/link";
import { useAuth } from "@/hooks/useAuth";
import { auth } from "@/lib/firebase";
import { signOut } from "firebase/auth";
import { toast } from "sonner";

export default function Navbar() {
  const { user, loading } = useAuth();

  const handleLogout = async () => {
    try {
      await signOut(auth);
      toast.success("Logged out successfully!");
    } catch (error) {
      toast.error("Failed to log out.");
    }
  };

  return (
    <nav className="flex items-center justify-between px-6 py-4">
      <div className="font-bold text-xl">logo</div>

      <ul className="hidden md:flex items-center gap-8">
        <li>
          <Link href="/" className="hover:opacity-70 transition-opacity">
            Features
          </Link>
        </li>
        <li>
          <Link href="/" className="hover:opacity-70 transition-opacity">
            How it Works
          </Link>
        </li>
        <li>
          <Link href="/documentation" className="hover:opacity-70 transition-opacity">
            Documentation
          </Link>
        </li>
        <li>
          <Link href="/about" className="hover:opacity-70 transition-opacity">
            About
          </Link>
        </li>
      </ul>

      <ul className="flex items-center gap-4">
        {!loading && (
          <>
            {!user && (
              <>
                <li>
                  <Link
                    href="/sign-up"
                    className="px-4 py-2 rounded-lg hover:opacity-70 transition-opacity"
                  >
                    Get Started
                  </Link>
                </li>
                <li>
                  <Link
                    href="/sign-in"
                    className="px-4 py-2 rounded-lg hover:opacity-70 transition-opacity"
                  >
                    Sign In
                  </Link>
                </li>
              </>
            )}
            
            {user && (
              <>
                <li>
                  <Link
                    href="/dashboard"
                    className="px-4 py-2 rounded-lg hover:opacity-70 transition-opacity"
                  >
                    Dashboard
                  </Link>
                </li>

                <li>
                  <button
                    onClick={handleLogout}
                    className="px-4 py-2 rounded-lg hover:opacity-70 transition-opacity"
                  >
                    Logout
                  </button>
                </li>
              </>
            )}
          </>
        )}
      </ul>
    </nav>
  );
}
