"use client";

import type { ReactNode } from "react";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import {
  ArrowRight,
  Play,
  RefreshCw,
  RotateCcw,
  SkipBack,
  SkipForward,
  Sparkles,
  Wand2,
} from "lucide-react";
import { Space_Grotesk } from "next/font/google";

const grotesk = Space_Grotesk({ subsets: ["latin"] });

type TourStep = {
  id: string;
  tour_id?: string;
  order: number;
  target_element: string;
  position: "top" | "bottom" | "left" | "right" | "center";
  title: string;
  content: string;
  cta_text?: string;
  cta_url?: string;
};

type TourConfig = {
  id: string;
  name: string;
  description?: string;
  theme: "greyscale" | "blue" | "green" | "red";
  allowed_domains: string[];
  owner_id: string;
  status: "draft" | "active" | "paused" | "archived";
  avatar_enabled: boolean;
  min_steps: number;
  total_views: number;
  total_completions: number;
  completion_rate: number;
  steps: TourStep[];
  created_at: string;
  updated_at: string;
};

const DEMO_TOUR_ID = "tour_iyofor_demo_canvas";

const demoTourConfig: TourConfig = {
  id: DEMO_TOUR_ID,
  name: "Guided Demo Showcase",
  description: "A live walkthrough of the interactive demo space and controls.",
  owner_id: "AqNtmdjMhVenWyvAbWydJFhdrKk2",
  theme: "green",
  allowed_domains: [
    "localhost",
    "onboarding-widget-app.vercel.app",
    "onboarding-tour-app.web.app",
  ],
  status: "active",
  avatar_enabled: true,
  min_steps: 5,
  total_views: 0,
  total_completions: 0,
  completion_rate: 0,
  created_at: "2025-12-10T21:12:18.427Z",
  updated_at: "2025-12-10T21:12:18.427Z",
  steps: [
    {
      id: "demo_step_hero",
      tour_id: DEMO_TOUR_ID,
      order: 1,
      target_element: "#demo-hero",
      position: "bottom",
      title: "Tour-ready canvas",
      content:
        "This hero area explains the scenario the tour is about to cover. Everything below is targetable by the widget.",
    },
    {
      id: "demo_step_start",
      tour_id: DEMO_TOUR_ID,
      order: 2,
      target_element: "#tour-start-button",
      position: "right",
      title: "Kick things off",
      content:
        "Use this button to launch the tour. It clears old progress so you always get a fresh run.",
      cta_text: "Start tour",
    },
    {
      id: "demo_step_controls",
      tour_id: DEMO_TOUR_ID,
      order: 3,
      target_element: "#tour-control-panel",
      position: "top",
      title: "Manual controls",
      content:
        "Drive the experience yourself with next/back/skip. These call the public widget API under the hood.",
    },
    {
      id: "demo_step_flow",
      tour_id: DEMO_TOUR_ID,
      order: 4,
      target_element: "#tour-flow-map",
      position: "left",
      title: "What the tour covers",
      content:
        "The flow map shows the checkpoints the tour will highlight so you know what to expect.",
    },
    {
      id: "demo_step_reset",
      tour_id: DEMO_TOUR_ID,
      order: 5,
      target_element: "#tour-reset-card",
      position: "top",
      title: "Restart anytime",
      content:
        "Hit reset to clear saved sessions and completion flags, then replay the walkthrough.",
      cta_text: "Reset & replay",
    },
  ],
};

const statusCopy: Record<string, string> = {
  idle: "Waiting to start",
  running: "Tour is live",
  ended: "Tour ended or cleaned up",
};

export default function DemoPage() {
  const [tourReady, setTourReady] = useState(false);
  const [tourStatus, setTourStatus] = useState<"idle" | "running" | "ended">(
    "idle"
  );
  const [lastAction, setLastAction] = useState("Ready when you are");

  useEffect(() => {
    const interval = setInterval(() => {
      if (typeof window === "undefined") return;
      if (window.OnboardingTour?.init) {
        setTourReady(true);
        clearInterval(interval);
      }
    }, 400);

    return () => clearInterval(interval);
  }, []);

  const clearStoredProgress = () => {
    if (typeof window === "undefined") return;

    const keys = [
      `onboarding_tour_${DEMO_TOUR_ID}_completed`,
      `onboarding_tour_${DEMO_TOUR_ID}_session`,
      `onboarding_session_${DEMO_TOUR_ID}`,
    ];

    keys.forEach((key) => localStorage.removeItem(key));
  };

  const startTour = async (withReset = true) => {
    if (!tourReady || !window.OnboardingTour?.init) return;
    if (withReset) {
      clearStoredProgress();
    }
    await window.OnboardingTour.init(demoTourConfig);
    setTourStatus("running");
    setLastAction(withReset ? "Started fresh tour" : "Resumed tour");
  };

  const stopTour = () => {
    window.OnboardingTour?.stop?.();
    setTourStatus("ended");
    setLastAction("Stopped & cleaned up");
  };

  const skipTour = () => {
    window.OnboardingTour?.skip?.();
    setTourStatus("ended");
    setLastAction("Skipped the walkthrough");
  };

  const resetTour = () => {
    stopTour();
    clearStoredProgress();
    setTourStatus("idle");
    setLastAction("Local tour progress cleared");
  };

  const controlButton = (
    label: string,
    onClick: () => void,
    icon: ReactNode,
    variant: "primary" | "ghost" = "primary"
  ) => (
    <button
      onClick={onClick}
      disabled={!tourReady}
      className={`inline-flex items-center gap-2 rounded-lg px-4 py-3 text-sm font-semibold transition-all duration-200 ${
        variant === "primary"
          ? "bg-linear-to-r from-emerald-500 to-lime-400 text-black shadow-lg shadow-emerald-500/20 hover:from-emerald-400 hover:to-lime-300 disabled:opacity-60"
          : "border border-white/10 text-gray-200 hover:border-emerald-400/60 hover:text-white disabled:opacity-50"
      }`}
    >
      {icon}
      {label}
    </button>
  );

  return (
    <main className={`${grotesk.className} relative overflow-hidden`}>
      <div className="absolute inset-0 bg-radial from-emerald-900/20 via-transparent to-black pointer-events-none" />
      <div className="absolute -top-20 -left-10 w-72 h-72 rounded-full bg-emerald-500/10 blur-3xl pointer-events-none" />
      <div className="absolute -bottom-10 right-0 w-80 h-80 rounded-full bg-lime-400/10 blur-3xl pointer-events-none" />

      <section
        id="demo-hero"
        className="relative z-10 max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-14 space-y-10"
      >
        <div className="flex flex-wrap items-center gap-3 text-sm text-emerald-200">
          <span className="inline-flex items-center gap-2 rounded-full border border-emerald-500/30 bg-white/5 px-3 py-2">
            <Sparkles className="w-4 h-4 text-emerald-300" />
            Live guided tour
          </span>
          <span className="inline-flex items-center gap-2 rounded-full border border-white/10 px-3 py-2 text-gray-300">
            Uses the real widget API
          </span>
          <span className="inline-flex items-center gap-2 rounded-full border border-white/10 px-3 py-2 text-gray-300">
            Firebase-linked config
          </span>
        </div>

        <div className="grid lg:grid-cols-2 gap-10 items-center">
          <div className="space-y-6" id="demo-tour-heading">
            <div className="inline-flex items-center gap-2 rounded-full border border-emerald-400/20 bg-emerald-500/10 px-3 py-1 text-emerald-100 text-xs font-semibold">
              <Wand2 className="w-4 h-4" />
              Playable onboarding story
            </div>
            <h1 className="text-4xl sm:text-5xl font-semibold leading-tight text-white">
              Run the full tour on this page, restart it, and drive every step
              with the control bar.
            </h1>
            <p className="text-lg text-gray-300 max-w-2xl">
              We wired the embeddable widget to a Firebase-hosted tour. Use the buttons below to start, resume, or reset without
              leaving the page.
            </p>
            <div className="flex flex-wrap items-center gap-3">
              <button
                id="tour-start-button"
                onClick={() => startTour(true)}
                disabled={!tourReady}
                className="inline-flex items-center gap-3 rounded-full bg-linear-to-r from-emerald-500 to-lime-400 px-6 py-3 text-black font-semibold shadow-lg shadow-emerald-500/20 hover:from-emerald-400 hover:to-lime-300 transition-all disabled:opacity-60"
              >
                <Play className="w-4 h-4" />
                Start the guided tour
              </button>
              <button
                onClick={() => startTour(false)}
                disabled={!tourReady}
                className="inline-flex items-center gap-3 rounded-full border border-white/15 px-5 py-3 text-gray-100 hover:border-emerald-400/60 transition-all disabled:opacity-60"
              >
                <ArrowRight className="w-4 h-4" />
                Resume without reset
              </button>
            </div>
            <div className="flex flex-wrap items-center gap-4 text-sm text-gray-400">
              <div className="inline-flex items-center gap-2">
                <span className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
                {tourReady
                  ? "Widget loaded — ready to launch"
                  : "Loading the widget script"}
              </div>
              <div className="inline-flex items-center gap-2">
                <span className="h-2 w-2 rounded-full bg-white/30" />
                Tour ID: {DEMO_TOUR_ID}
              </div>
            </div>
          </div>

          <motion.div
            id="tour-live-preview"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="relative rounded-2xl border border-white/10 bg-white/5 p-6 shadow-2xl shadow-emerald-500/10 backdrop-blur"
          >
            <div className="absolute inset-0 bg-radial from-emerald-500/10 via-transparent to-transparent rounded-2xl" />
            <div className="relative space-y-6">
              <div className="flex items-center justify-between">
                <p className="text-sm text-gray-400">Live preview</p>
                <span className="rounded-full bg-emerald-500/20 text-emerald-200 text-xs px-3 py-1">
                  Active tour config
                </span>
              </div>
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div className="rounded-xl border border-white/10 bg-black/40 p-4">
                  <p className="text-gray-400 mb-2">Owner</p>
                  <p className="text-white font-semibold break-all">
                    Your Tour
                  </p>
                </div>
                <div className="rounded-xl border border-white/10 bg-black/40 p-4">
                  <p className="text-gray-400 mb-2">Allowed domains</p>
                  <p className="text-white font-semibold">
                    localhost, allowed-domain.tld
                  </p>
                </div>
              </div>
              <div className="rounded-xl border border-white/10 bg-linear-to-r from-emerald-500/10 via-emerald-500/5 to-transparent p-4 space-y-3">
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded-full bg-emerald-500/20 flex items-center justify-center">
                    <Sparkles className="w-5 h-5 text-emerald-300" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-400">Tour summary</p>
                    <p className="text-white font-semibold">
                      5 interactive checkpoints
                    </p>
                  </div>
                </div>
                <ul className="grid grid-cols-2 gap-2 text-xs text-gray-300">
                  {demoTourConfig.steps.map((step) => (
                    <li
                      key={step.id}
                      className="rounded-lg border border-white/10 bg-black/50 px-3 py-2"
                    >
                      <span className="text-emerald-200 font-semibold mr-2">
                        {step.order}.
                      </span>
                      {step.title}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      <section className="relative z-10 max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 pb-16 space-y-8">
        <div className="grid lg:grid-cols-3 gap-6">
          <div
            id="tour-control-panel"
            className="lg:col-span-2 rounded-2xl border border-white/10 bg-white/5 p-6 backdrop-blur space-y-5"
          >
            <div className="flex items-center justify-between gap-3 flex-wrap">
              <div>
                <p className="text-xs text-emerald-200 font-semibold">
                  Direct API controls
                </p>
                <h2 className="text-2xl font-semibold text-white">
                  Drive the tour without leaving the page
                </h2>
              </div>
              <span className="text-sm text-gray-400">
                Status:{" "}
                <span className="text-white font-semibold">
                  {statusCopy[tourStatus]}
                </span>
              </span>
            </div>
            <div className="flex flex-wrap items-center gap-3">
              {controlButton(
                "Next step",
                () => window.OnboardingTour?.next?.(),
                <SkipForward className="w-4 h-4" />
              )}
              {controlButton(
                "Previous",
                () => window.OnboardingTour?.back?.(),
                <SkipBack className="w-4 h-4" />,
                "ghost"
              )}
              {controlButton(
                "Skip tour",
                skipTour,
                <ArrowRight className="w-4 h-4" />,
                "ghost"
              )}
              {controlButton(
                "Stop & clean up",
                stopTour,
                <RotateCcw className="w-4 h-4" />,
                "ghost"
              )}
            </div>
            <div className="rounded-xl border border-white/10 bg-black/40 p-4 flex items-center justify-between flex-wrap gap-3">
              <div className="space-y-1">
                <p className="text-sm text-gray-300">
                  Last action:{" "}
                  <span className="text-white font-semibold">{lastAction}</span>
                </p>
                <p className="text-xs text-gray-400">
                  Buttons call the widget&apos;s public methods (
                  <code>init</code>, <code>next</code>, <code>back</code>,{" "}
                  <code>skip</code>, <code>stop</code>).
                </p>
              </div>
              <div className="flex items-center gap-2 text-xs text-emerald-100">
                <div className="h-6 w-6 rounded-full bg-emerald-500/20 flex items-center justify-center">
                  <RefreshCw className="w-3.5 h-3.5" />
                </div>
                Analytics & sessions are saved to Firestore as you click.
              </div>
            </div>
          </div>

          <div
            id="tour-reset-card"
            className="rounded-2xl border border-white/10 bg-linear-to-br from-black via-black to-emerald-950 p-6 space-y-4"
          >
            <p className="text-sm text-emerald-200 font-semibold">
              Reset & replay
            </p>
            <h3 className="text-xl font-semibold text-white">
              Clear local progress and start again
            </h3>
            <p className="text-gray-300 text-sm">
              Removes completion flags and cached sessions for{" "}
              <code>{DEMO_TOUR_ID}</code>, then lets you restart instantly.
            </p>
            <div className="flex flex-col gap-2">
              <button
                onClick={resetTour}
                className="inline-flex items-center gap-2 rounded-lg bg-white/10 px-4 py-3 text-white hover:bg-white/15 transition-colors"
              >
                <RefreshCw className="w-4 h-4" />
                Reset stored progress
              </button>
              <button
                onClick={() => startTour(true)}
                className="inline-flex items-center gap-2 rounded-lg border border-emerald-400/40 px-4 py-3 text-emerald-100 hover:border-emerald-300 transition-colors"
                disabled={!tourReady}
              >
                <Play className="w-4 h-4" />
                Reset & replay now
              </button>
            </div>
          </div>
        </div>

        <div
          id="tour-flow-map"
          className="rounded-2xl border border-white/10 bg-white/5 p-6 backdrop-blur"
        >
          <div className="flex items-center justify-between mb-6">
            <div>
              <p className="text-xs text-emerald-200 font-semibold">
                Tour flow
              </p>
              <h3 className="text-xl font-semibold text-white">
                Checkpoints this tour will hit
              </h3>
            </div>
            <span className="text-sm text-gray-400">
              Minimum steps: {demoTourConfig.min_steps}
            </span>
          </div>
          <div className="grid md:grid-cols-5 gap-4">
            {demoTourConfig.steps.map((step) => (
              <div
                key={step.id}
                className="rounded-xl border border-white/10 bg-black/50 p-4 space-y-2"
              >
                <div className="flex items-center justify-between">
                  <span className="text-xs text-emerald-200 font-semibold">
                    Step {step.order}
                  </span>
                  <span className="text-[10px] text-gray-400">
                    {step.position}
                  </span>
                </div>
                <p className="text-white font-semibold">{step.title}</p>
                <p className="text-xs text-gray-400">{step.content}</p>
                <p className="text-[10px] text-gray-500">
                  Target: {step.target_element}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}
