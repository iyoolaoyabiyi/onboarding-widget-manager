"use client";

import { useState } from "react";
import { motion } from "framer-motion";

import AnalyticsSection from "@/components/dashboard/AnalyticsSection";
import DashboardHeader from "@/components/dashboard/DashboardHeader";
import IntegrationSnippet from "@/components/dashboard/IntegrationSnippet";
import MetricsGrid from "@/components/dashboard/MetricsGrid";
import OnboardingEmpty from "@/components/dashboard/OnboardingEmpty";
import TourEditor from "@/components/dashboard/TourEditor";
import ToursPanel from "@/components/dashboard/ToursPanel";
import CreateTourModal from "@/components/dashboard/CreateTourModal";
import {
  DropOffItem,
  EventEntry,
  Metric,
  Step,
  Tour,
} from "@/components/dashboard/types";
import ProtectedRoute from "@/components/auth/ProtectedRoute";

const mockTours: Tour[] = [
  {
    id: "tour_888",
    name: "My App Onboarding",
    baseUrl: "https://myapp.com",
    steps: 5,
    completion: 65,
    status: "Live",
    updated: "2h ago",
    color: "#0070F3",
  },
  {
    id: "tour_456",
    name: "Settings Walkthrough",
    baseUrl: "https://myapp.com/settings",
    steps: 4,
    completion: 52,
    status: "Draft",
    updated: "Yesterday",
    color: "#00FF9C",
  },
];

const mockSteps: Step[] = [
  {
    order: 1,
    target: "#nav-logo",
    text: "Welcome to the app!",
    position: "Bottom",
  },
  {
    order: 2,
    target: "#settings-btn",
    text: "Configure your profile here.",
    position: "Left",
  },
  {
    order: 3,
    target: "#chart",
    text: "Track your product health.",
    position: "Right",
  },
];

const mockMetrics: Metric[] = [
  { label: "Total Views", value: 1200 },
  { label: "Completion Rate", value: 65, suffix: "%" },
  { label: "Highest Drop-off", value: "Step 3" },
];

const mockDropOff: DropOffItem[] = [
  { step: 1, percent: 93 },
  { step: 2, percent: 86 },
  { step: 3, percent: 79 },
  { step: 4, percent: 72 },
  { step: 5, percent: 65 },
];

const mockEvents: EventEntry[] = [
  { tour_id: "tour_888", step: 1, action: "completed" },
  { tour_id: "tour_888", step: 2, action: "completed" },
  { tour_id: "tour_888", step: 3, action: "skipped" },
  { tour_id: "tour_456", step: 1, action: "completed" },
];

export default function Dashboard() {
  const [tours, setTours] = useState<Tour[]>([]);
  const [steps, setSteps] = useState<Step[]>([]);
  const [metrics, setMetrics] = useState<Metric[]>([]);
  const [dropOff, setDropOff] = useState<DropOffItem[]>([]);
  const [recentEvents, setRecentEvents] = useState<EventEntry[]>([]);
  const [views, setViews] = useState<number>(0);
  const [completions, setCompletions] = useState<number>(0);
  const [showCreate, setShowCreate] = useState<boolean>(false);

  const activeTour = tours[0];

  const widgetSrc =
    process.env.NEXT_PUBLIC_WIDGET_URL ?? "http://localhost:5173/widget.js";
  const hasTours = tours.length > 0;

  return (
    <ProtectedRoute>
      <div className="relative min-h-screen w-full text-white overflow-hidden">
        {/* Grid Background */}
        <div className="fixed inset-0 w-full bg-[linear-gradient(to_right,#111_1px,transparent_1px),linear-gradient(to_bottom,#111_1px,transparent_1px)] bg-size-[4rem_4rem] opacity-20 pointer-events-none" />
        
        {/* Animated Gradient Orbs */}
        <div className="fixed inset-0 overflow-hidden pointer-events-none">
          <motion.div
            className="absolute -top-40 -left-40 w-60 h-60 sm:w-80 sm:h-80 bg-linear-to-br from-blue-600/20 to-blue-400/10 rounded-full blur-3xl"
            animate={{ x: [0, 100, 0], y: [0, -50, 0] }}
            transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
          />
          <motion.div
            className="absolute -bottom-40 -right-40 w-60 h-60 sm:w-80 sm:h-80 bg-linear-to-br from-blue-500/20 to-blue-600/10 rounded-full blur-3xl"
            animate={{ x: [0, -100, 0], y: [0, 50, 0] }}
            transition={{ duration: 25, repeat: Infinity, ease: "linear" }}
          />
          <motion.div
            className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-72 h-72 sm:w-96 sm:h-96 bg-linear-to-br from-blue-700/10 to-blue-500/5 rounded-full blur-3xl"
            animate={{ scale: [1, 1.2, 1] }}
            transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
          />
        </div>

        {/* Floating Elements */}
        <div className="fixed inset-0 pointer-events-none">
          {[...Array(8)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute w-2 h-2 bg-blue-500/30 rounded-full"
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
              }}
              animate={{ y: [0, -20, 0], opacity: [0.3, 0.6, 0.3] }}
              transition={{ duration: 2 + Math.random() * 2, delay: i * 0.2, repeat: Infinity }}
            />
          ))}
        </div>

        {/* Main Content */}
        <div className="relative z-10">
          {!hasTours ? (
            <div className="flex items-center justify-center min-h-screen px-6 py-10">
              <div className="w-full max-w-6xl">
                <OnboardingEmpty onCreate={() => setShowCreate(true)} />
              </div>
            </div>
          ) : (
            <div className="max-w-6xl mx-auto px-6 py-10 space-y-10">
              <DashboardHeader onCreate={() => setShowCreate(true)} />
              <MetricsGrid metrics={metrics} />

              <section className="grid gap-6 lg:grid-cols-3">
                <TourEditor
                  steps={steps}
                  defaultTourName={activeTour?.name}
                  defaultBaseUrl={activeTour?.baseUrl}
                  defaultThemeColor={activeTour?.color}
                  defaultCtaCopy="Take a quick tour?"
                />
                <div className="space-y-4">
                  <ToursPanel tours={tours} />
                  <IntegrationSnippet
                    widgetSrc={widgetSrc}
                    tourId="tour_888"
                    hasTour={!!activeTour}
                  />
                </div>
              </section>

              <AnalyticsSection
                views={views}
                completions={completions}
                dropOff={dropOff}
                recentEvents={recentEvents}
              />
            </div>
          )}
        </div>

        <CreateTourModal
          open={showCreate}
          onClose={() => setShowCreate(false)}
          onSave={(tourData: { tour: Tour; steps: Step[] }) => {
            setTours([tourData.tour]);
            setSteps(tourData.steps);
            setMetrics(mockMetrics);
            setDropOff(mockDropOff);
            setRecentEvents(mockEvents);
            setViews(1200);
            setCompletions(780);
            setShowCreate(false);
          }}
        />
      </div>
    </ProtectedRoute>
  );
}