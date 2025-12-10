"use client";

import { useCallback, useEffect, useRef } from "react";
import { Toaster } from "sonner";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { usePathname } from "next/navigation";
import Script from "next/script";

export default function LayoutClient({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const isAuthRoute =
    pathname.startsWith("/sign-in") || pathname.startsWith("/sign-up");

  const hasTriedInit = useRef(false);

  const isDashboard = pathname.startsWith("/dashboard");

  const hasBootstrapTargets = useCallback(() => {
    // Known dashboard anchors; adjust if dashboard structure changes
    const selectors = ["#create-tour-section", "#tour-list", "#tour-editor"];
    return selectors.some((sel) => Boolean(document.querySelector(sel)));
  }, []);

  const tryInit = useCallback(() => {
    if (hasTriedInit.current) return true;
    if (!isDashboard) return false; // avoid initializing on routes without targets

    const tourApi = window as typeof window & {
      OnboardingTour?: { init?: () => Promise<void> };
    };

    if (tourApi.OnboardingTour?.init) {
      if (!hasBootstrapTargets()) {
        // Wait until known elements are in the DOM
        return false;
      }
      hasTriedInit.current = true;
      tourApi.OnboardingTour.init().catch((err) => {
        console.error("OnboardingTour init failed", err);
      });
      return true;
    }
    return false;
  }, [hasBootstrapTargets, isDashboard]);

  const scheduleInit = useCallback(() => {
    let attempts = 0;
    const maxAttempts = 20; // ~6s (20 * 300ms)
    const tick = () => {
      if (tryInit()) return;
      attempts += 1;
      if (attempts >= maxAttempts) return;
      window.setTimeout(tick, 300);
    };

    if (document.readyState === "complete") {
      tick();
    } else {
      window.addEventListener(
        "load",
        () => {
          tick();
        },
        { once: true }
      );
    }
  }, [tryInit]);

  // Fallback: if script was cached and onLoad didn't fire in SPA nav, re-attempt on mount
  useEffect(() => {
    scheduleInit();
  }, [scheduleInit]);

  return (
    <>
      <Script
        src="https://onboarding-tour-app.web.app/ota-widget.js"
        strategy="lazyOnload"
        data-tour-id="tour_1765362736411"
        onLoad={scheduleInit}
      />
      {!isAuthRoute && <Navbar />}
      <Toaster position="top-right" richColors closeButton />
      {children}
      {!isAuthRoute && <Footer />}
    </>
  );
}
