"use client";

import { useState } from "react";

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
      <div className="min-h-screen bg-[radial-gradient(circle_at_20%_20%,#1a1a1a_0%,#0a0a0a_50%)] text-white">
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
