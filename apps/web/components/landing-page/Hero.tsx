"use client";

import Link from "next/link";
import { useAuth } from "@/hooks/useAuth";

export default function Hero() {
    const { user, loading } = useAuth();

    return (
        <div className="flex flex-col items-center justify-center min-h-screen px-6 py-12">
            <h1 className="text-4xl md:text-6xl font-bold text-center mb-4 max-w-4xl">
                Create Beautiful Guided Product Tours in Minutes
            </h1>

            <p className="text-lg md:text-xl text-center mb-8 max-w-2xl">
                Enhance user experience with smooth, interactive onboarding flows that are simple to create and effortless to integrate.
            </p>

            {!loading && (
                <div className="flex flex-col sm:flex-row gap-4">
                    {!user && (
                        <Link
                            href="/sign-up"
                            className="px-6 py-3 rounded-lg font-medium hover:opacity-70 transition-opacity"
                        >
                            Get Started
                        </Link>
                    )}

                    {user && (
                        <Link
                            href="/dashboard"
                            className="px-6 py-3 rounded-lg font-medium hover:opacity-70 transition-opacity"
                        >
                            Go to Dashboard
                        </Link>
                    )}

                    <Link
                        href="/documentation"
                        className="px-6 py-3 rounded-lg font-medium hover:opacity-70 transition-opacity"
                    >
                        Read Documentation
                    </Link>
                </div>
            )}
        </div>
    );
}
