"use client";

import { useEffect, useRef } from "react";
import { Toaster } from "sonner";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { usePathname } from "next/navigation";
import Script from "next/script";

const DASHBOARD_TARGETS = ["#create-tour-section", "#tour-list", "#tour-editor"];

declare global {
  interface Window {
    OnboardingTour?: { init?: () => Promise<void> };
  }
}

export default function LayoutClient({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const isAuthRoute =
    pathname.startsWith("/sign-in") || pathname.startsWith("/sign-up");

  const isDashboard = pathname.startsWith("/dashboard");

  const hasInitialized = useRef(false);
  const tryInitRef = useRef<() => boolean>(() => false);

  useEffect(() => {
    if (!isDashboard || hasInitialized.current) {
      tryInitRef.current = () => false;
      return;
    }

    const tryInit = () => {
      if (hasInitialized.current) return true;

      const hasTarget = DASHBOARD_TARGETS.some((selector) =>
        Boolean(document.querySelector(selector))
      );

      if (!hasTarget || !window.OnboardingTour?.init) return false;

      hasInitialized.current = true;
      window.OnboardingTour.init().catch((err) => {
        console.error("OnboardingTour init failed", err);
      });
      return true;
    };

    tryInitRef.current = tryInit;

    // Fast path: if elements and script are already ready
    if (tryInit()) return;

    const observer = new MutationObserver(() => {
      if (tryInit()) observer.disconnect();
    });

    observer.observe(document.body, { childList: true, subtree: true });

    return () => {
      tryInitRef.current = () => false;
      observer.disconnect();
    };
  }, [isDashboard]);

  return (
    <>
      <Script
        src="https://onboarding-tour-app.web.app/ota-widget.js"
        strategy="lazyOnload"
        data-tour-id="tour_1765362736411"
        onLoad={() => {
          // Attempt init when the widget script becomes available; observer continues if targets aren't ready yet
          tryInitRef.current();
        }}
      />
      {!isAuthRoute && <Navbar />}
      <Toaster position="top-right" richColors closeButton />
      {children}
      {!isAuthRoute && <Footer />}
    </>
  );
}
