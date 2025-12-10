"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import ProtectedRoute from "@/components/auth/ProtectedRoute";
import TourEditorNew from "@/components/dashboard/TourEditorNew";
import ToursPanelNew from "@/components/dashboard/ToursPanelNew";
import { FirestoreService } from "@/lib/firestore";
import type { Tour, Step } from "@/components/dashboard/types";

export default function Dashboard() {
  const router = useRouter();
  const [tours, setTours] = useState<Tour[]>([]);
  const [currentTour, setCurrentTour] = useState<Tour | null>(null);
  const [steps, setSteps] = useState<Step[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const widgetSrc =
    process.env.NEXT_PUBLIC_WIDGET_URL ?? "http://localhost:5173/widget.js";

  // Load tours from Firestore
  useEffect(() => {
    const loadTours = async () => {
      try {
        setLoading(true);
        setError(null);
        const userTours = await FirestoreService.getUserTours();

        // Convert Firestore format to dashboard format
        const convertedTours: Tour[] = userTours.map((tour) => ({
          id: tour.id,
          name: tour.name,
          description: tour.description,
          allowed_domains: tour.allowed_domains || [],
          steps: tour.steps?.length || 0,
          completion: tour.completion_rate || 0,
          status: tour.status,
          updated: new Date(tour.updated_at).toLocaleDateString(),
          theme: tour.theme,
          owner_id: tour.owner_id,
          avatar_enabled: tour.avatar_enabled,
          min_steps: tour.min_steps || 5,
          total_views: tour.total_views || 0,
          total_completions: tour.total_completions || 0,
          completion_rate: tour.completion_rate || 0,
          created_at: tour.created_at,
          updated_at: tour.updated_at,
        }));

        setTours(convertedTours);

        if (convertedTours.length > 0) {
          setCurrentTour(convertedTours[0]);
          // Load steps for the current tour
          const tourData = await FirestoreService.getTour(convertedTours[0].id);
          if (tourData?.steps) {
            const convertedSteps: Step[] = tourData.steps.map((step) => ({
              order: step.order,
              target: step.target_element,
              text: step.title,
              position: step.position,
            }));
            setSteps(convertedSteps);
          }
        }
      } catch (err) {
        const message = err instanceof Error ? err.message : "Failed to load tours";
        setError(message);
        console.error("Error loading tours:", err);
      } finally {
        setLoading(false);
      }
    };

    loadTours();
  }, []);

  const handleSelectTour = async (tour: Tour) => {
    try {
      setCurrentTour(tour);
      const tourData = await FirestoreService.getTour(tour.id);
      if (tourData?.steps) {
        const convertedSteps: Step[] = tourData.steps.map((step) => ({
          order: step.order,
          target: step.target_element,
          text: step.title,
          position: step.position,
        }));
        setSteps(convertedSteps);
      }
    } catch (err) {
      console.error("Error loading tour:", err);
    }
  };

  const handleSaveTour = async (updates: Partial<Tour>) => {
    if (!currentTour) {
      throw new Error("No tour selected");
    }

    try {
      // Prepare data for Firestore format
      const updateData = {
        name: updates.name,
        description: updates.description,
        theme: updates.theme,
        avatar_enabled: updates.avatar_enabled,
        allowed_domains: updates.allowed_domains,
        status: updates.status,
        updated_at: new Date().toISOString(),
        // Note: steps are preserved from existing tour
      };

      await FirestoreService.updateTour(currentTour.id, updateData);

      // Update local state
      const updated: Tour = {
        ...currentTour,
        ...updates,
        updated: new Date().toLocaleDateString(),
      };

      setCurrentTour(updated);
      setTours(tours.map((t) => (t.id === currentTour.id ? updated : t)));
    } catch (err) {
      throw new Error(err instanceof Error ? err.message : "Failed to save tour");
    }
  };

  const handleAddStep = () => {
    if (!currentTour) return;

    const newOrder = steps.length + 1;
    if (newOrder > 10) {
      alert("Maximum 10 steps allowed");
      return;
    }

    const newStep: Step = {
      order: newOrder,
      target: "#element-id",
      text: `Step ${newOrder}`,
      position: "bottom",
    };

    setSteps([...steps, newStep]);
  };

  const handleDeleteTour = async (tourId: string) => {
    if (!confirm('Are you sure you want to delete this tour? This action cannot be undone.')) {
      return;
    }

    try {
      await FirestoreService.deleteTour(tourId);
      
      // Remove from local state
      const updatedTours = tours.filter(t => t.id !== tourId);
      setTours(updatedTours);
      
      // Select another tour or clear selection
      if (currentTour?.id === tourId) {
        if (updatedTours.length > 0) {
          handleSelectTour(updatedTours[0]);
        } else {
          setCurrentTour(null);
          setSteps([]);
        }
      }
    } catch (err) {
      alert('Failed to delete tour: ' + (err instanceof Error ? err.message : 'Unknown error'));
      console.error('Error deleting tour:', err);
    }
  };

  if (loading) {
    return (
      <ProtectedRoute>
        <div className="min-h-screen bg-[radial-gradient(circle_at_20%_20%,#1a1a1a_0%,#0a0a0a_50%)] text-white flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-white mx-auto mb-4"></div>
            <p className="text-gray-400">Loading tours...</p>
          </div>
        </div>
      </ProtectedRoute>
    );
  }

  if (error) {
    return (
      <ProtectedRoute>
        <div className="min-h-screen bg-[radial-gradient(circle_at_20%_20%,#1a1a1a_0%,#0a0a0a_50%)] text-white flex items-center justify-center">
          <div className="text-center">
            <p className="text-red-400 mb-4">{error}</p>
            <button
              onClick={() => window.location.reload()}
              className="px-4 py-2 rounded-lg bg-white text-black font-semibold hover:opacity-90"
            >
              Retry
            </button>
          </div>
        </div>
      </ProtectedRoute>
    );
  }

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-[radial-gradient(circle_at_20%_20%,#1a1a1a_0%,#0a0a0a_50%)] text-white">
        <div className="max-w-7xl mx-auto px-6 py-10 space-y-8">
          {/* Header */}
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold">Dashboard</h1>
              <p className="text-gray-400 mt-2">Manage and analyze your onboarding tours</p>
            </div>
            <button
              onClick={() => router.push("/dashboard/create")}
              className="px-6 py-3 rounded-lg bg-white text-black font-semibold hover:opacity-90"
            >
              + Create Tour
            </button>
          </div>

          {tours.length === 0 ? (
            <div className="rounded-2xl border border-white/10 bg-white/5 p-12 text-center">
              <h2 className="text-2xl font-semibold mb-2">No tours yet</h2>
              <p className="text-gray-400 mb-6">Create your first onboarding tour to get started</p>
              <button
                onClick={() => router.push("/dashboard/create")}
                className="px-6 py-3 rounded-lg bg-white text-black font-semibold hover:opacity-90 inline-block"
              >
                Create Your First Tour
              </button>
            </div>
          ) : (
            <div className="grid gap-6 lg:grid-cols-3">
              {/* Tour List */}
              <div className="lg:col-span-1">
                <ToursPanelNew
                  tours={tours}
                  onSelectTour={handleSelectTour}
                  onDeleteTour={handleDeleteTour}
                  selectedId={currentTour?.id}
                />
              </div>

              {/* Tour Editor */}
              {currentTour && (
                <div className="lg:col-span-2">
                  <TourEditorNew
                    tour={currentTour}
                    steps={steps}
                    onSave={handleSaveTour}
                    onAddStep={handleAddStep}
                  />
                </div>
              )}
            </div>
          )}

          {/* Integration Help */}
          {currentTour && steps.length >= 5 && (
            <div className="rounded-2xl border border-green-500/30 bg-green-500/5 p-6">
              <h3 className="text-lg font-semibold text-green-400 mb-4">Ready to Deploy</h3>
              <p className="text-gray-300 mb-4">
                Your tour is ready! Copy this script and add it to your website to start the tour:
              </p>
              <div className="bg-black/50 rounded-lg p-4 border border-white/10 font-mono text-sm overflow-x-auto">
                <code className="text-green-400">
                  {`<script src="${widgetSrc}" data-tour-id="${currentTour.id}"><\/script>`}
                </code>
              </div>
              <p className="text-xs text-gray-400 mt-3">
                Make sure {currentTour.allowed_domains.join(", ")} are added to your tour's allowed domains.
              </p>
            </div>
          )}
        </div>
      </div>
    </ProtectedRoute>
  );
}
