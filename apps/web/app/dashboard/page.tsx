"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import ProtectedRoute from "@/components/auth/ProtectedRoute";
import TourEditorNew from "@/components/dashboard/TourEditorNew";
import ToursPanelNew from "@/components/dashboard/ToursPanelNew";
import StepModal from "@/components/dashboard/StepModal";
import AnalyticsSection from "@/components/dashboard/AnalyticsSection";
import { FirestoreService } from "@/lib/firestore";
import type { Tour, Step } from "@/components/dashboard/types";
import { AnalyticsQueryService } from "@/lib/analyticsQuery";
import { useAuth } from "@/hooks/useAuth";
import { Copy, Check } from "lucide-react";

export default function Dashboard() {
  const router = useRouter();
  const { user, loading: authLoading } = useAuth();
  const [tours, setTours] = useState<Tour[]>([]);
  const [currentTour, setCurrentTour] = useState<Tour | null>(null);
  const [steps, setSteps] = useState<Step[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isStepModalOpen, setIsStepModalOpen] = useState(false);
  const [editingStep, setEditingStep] = useState<Step | null>(null);

  const widgetSrc =
    process.env.NEXT_PUBLIC_WIDGET_URL ?? "http://localhost:5173/widget.js";
  const [copied, setCopied] = useState(false);

  // Load tours from Firestore
  useEffect(() => {
    const loadTours = async () => {
      try {
        setLoading(true);
        setError(null);

        if (!user) {
          setTours([]);
          setCurrentTour(null);
          setSteps([]);
          return;
        }

        // Only load tours owned by the current user
        const userTours = await FirestoreService.getUserTours(user.uid);

        // Convert Firestore format to dashboard format & enrich with live metrics
        const convertedTours: Tour[] = await Promise.all(
          userTours.map(async (tour) => {
            let metrics;
            try {
              metrics = await AnalyticsQueryService.getTourMetrics(tour.id, 30);
            } catch (error) {
              console.warn("Failed to load metrics for tour", tour.id, error);
            }

            const completionRate = metrics?.completionRate ?? tour.completion_rate ?? 0;
            const totalViews = metrics?.totalViews ?? tour.total_views ?? 0;
            const totalCompletions = metrics?.totalCompletions ?? tour.total_completions ?? 0;

            return {
              id: tour.id,
              name: tour.name,
              description: tour.description,
              allowed_domains: tour.allowed_domains || [],
              steps: tour.steps?.length || 0,
              completion: completionRate,
              status: tour.status,
              updated: new Date(tour.updated_at).toLocaleDateString(),
              theme: tour.theme,
              owner_id: tour.owner_id,
              avatar_enabled: tour.avatar_enabled,
              min_steps: tour.min_steps || 5,
              total_views: totalViews,
              total_completions: totalCompletions,
              completion_rate: completionRate,
              created_at: tour.created_at,
              updated_at: tour.updated_at,
            };
          })
        );

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
              content: step.content,
              cta_text: step.cta_text,
              cta_url: step.cta_url,
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

    if (!authLoading) {
      loadTours();
    }
  }, [authLoading, user]);

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
          content: step.content,
          cta_text: step.cta_text,
          cta_url: step.cta_url,
        }));
        setSteps(convertedSteps);
      }
    } catch (err) {
      console.error("Error loading tour:", err);
    }
  };

  const handleSaveConfig = async (updates: Partial<Tour>) => {
    if (!currentTour) {
      throw new Error("No tour selected");
    }

    try {
      // Convert Step[] to Firestore TourStep[] format (keeping existing steps)
      const convertedSteps = steps.map((step) => ({
        id: `${currentTour.id}_step_${step.order}`,
        tour_id: currentTour.id,
        order: step.order,
        target_element: step.target,
        position: step.position as 'top' | 'bottom' | 'left' | 'right' | 'center',
        title: step.text,
        content: step.content || step.text,
        ...(step.cta_text && { cta_text: step.cta_text }),
        ...(step.cta_url && { cta_url: step.cta_url }),
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      }));

      // Prepare data for Firestore format (configuration only)
      const updateData = {
        name: updates.name,
        description: updates.description,
        theme: updates.theme,
        avatar_enabled: updates.avatar_enabled,
        status: updates.status,
        steps: convertedSteps,
        updated_at: new Date().toISOString(),
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
      toast.success("Configuration saved successfully");
    } catch (err) {
      const message = err instanceof Error ? err.message : "Failed to save configuration";
      toast.error(message);
      throw new Error(message);
    }
  };

  const handleSaveDomains = async (domains: string[]) => {
    if (!currentTour) {
      throw new Error("No tour selected");
    }

    try {
      // Convert Step[] to Firestore TourStep[] format (keeping existing steps)
      const convertedSteps = steps.map((step) => ({
        id: `${currentTour.id}_step_${step.order}`,
        tour_id: currentTour.id,
        order: step.order,
        target_element: step.target,
        position: step.position as 'top' | 'bottom' | 'left' | 'right' | 'center',
        title: step.text,
        content: step.content || step.text,
        ...(step.cta_text && { cta_text: step.cta_text }),
        ...(step.cta_url && { cta_url: step.cta_url }),
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      }));

      // Prepare data for Firestore format (domains only)
      const updateData = {
        allowed_domains: domains,
        steps: convertedSteps,
        updated_at: new Date().toISOString(),
      };

      await FirestoreService.updateTour(currentTour.id, updateData);

      // Update local state
      const updated: Tour = {
        ...currentTour,
        allowed_domains: domains,
        updated: new Date().toLocaleDateString(),
      };

      setCurrentTour(updated);
      setTours(tours.map((t) => (t.id === currentTour.id ? updated : t)));
      toast.success("Allowed domains saved successfully");
    } catch (err) {
      const message = err instanceof Error ? err.message : "Failed to save domains";
      toast.error(message);
      throw new Error(message);
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

  const handleEditStep = (order: number) => {
    const step = steps.find((s) => s.order === order);
    if (step) {
      setEditingStep(step);
      setIsStepModalOpen(true);
    }
  };

  const handleDeleteStep = (order: number) => {
    const updated = steps
      .filter((s) => s.order !== order)
      .map((s, idx) => ({ ...s, order: idx + 1 }));
    setSteps(updated);
  };

  const handleSaveStep = async (updatedStep: Step) => {
    if (!currentTour) return;

    const newSteps = editingStep
      ? steps.map((s) => (s.order === editingStep.order ? updatedStep : s))
      : [...steps, updatedStep];

    setSteps(newSteps);
    setEditingStep(null);
    setIsStepModalOpen(false);

    // Auto-save to Firestore
    try {
      const convertedSteps = newSteps.map((step) => ({
        id: `${currentTour.id}_step_${step.order}`,
        tour_id: currentTour.id,
        order: step.order,
        target_element: step.target,
        position: step.position as 'top' | 'bottom' | 'left' | 'right' | 'center',
        title: step.text,
        content: step.content || step.text,
        ...(step.cta_text && { cta_text: step.cta_text }),
        ...(step.cta_url && { cta_url: step.cta_url }),
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      }));

      await FirestoreService.updateTour(currentTour.id, {
        steps: convertedSteps,
        updated_at: new Date().toISOString(),
      });
      toast.success("Step saved successfully");
    } catch (err) {
      console.error('Failed to save steps:', err);
      toast.error('Failed to save step changes');
    }
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
      toast.success('Tour deleted successfully');
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Unknown error';
      toast.error(`Failed to delete tour: ${message}`);
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
              id="create-tour-button"
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
                <div className="lg:col-span-2" id="tour-editor">
                  <TourEditorNew
                    tour={currentTour}
                    steps={steps}
                    onSaveConfig={handleSaveConfig}
                    onSaveDomains={handleSaveDomains}
                    onAddStep={handleAddStep}
                    onEditStep={handleEditStep}
                    onDeleteStep={handleDeleteStep}
                  />
                </div>
              )}
            </div>
          )}


          {/* Integration Help */}
          {currentTour && steps.length >= 5 && (
            <div className="rounded-2xl border border-green-500/30 bg-green-500/5 p-6" id="widget-link">
              <h3 className="text-lg font-semibold text-green-400 mb-4">Ready to Deploy</h3>
              <p className="text-gray-300 mb-4">
                Your tour is ready! Copy this script and add it to your website to start the tour:
              </p>
              <div className="bg-black/50 rounded-lg p-4 border border-white/10 font-mono text-sm overflow-x-auto flex items-center justify-between gap-3">
                <code className="text-green-400 break-all">
                  {`<script src="${widgetSrc}" data-tour-id="${currentTour.id}"><\/script>`}
                </code>
                <button
                  onClick={async () => {
                    try {
                      await navigator.clipboard.writeText(
                        `<script src="${widgetSrc}" data-tour-id="${currentTour.id}"></script>`
                      );
                      setCopied(true);
                      setTimeout(() => setCopied(false), 1500);
                      toast.success("Widget snippet copied");
                    } catch {
                      toast.error("Failed to copy snippet");
                    }
                  }}
                  className="shrink-0 inline-flex items-center gap-2 rounded-md border border-white/20 px-3 py-2 text-xs hover:bg-white/10"
                  title="Copy snippet"
                  aria-label="Copy widget snippet"
                >
                  {copied ? (
                    <>
                      <Check className="h-4 w-4" />
                      Copied
                    </>
                  ) : (
                    <>
                      <Copy className="h-4 w-4" />
                      Copy
                    </>
                  )}
                </button>
              </div>
              <p className="text-xs text-gray-400 mt-3">
                Make sure {currentTour.allowed_domains.join(", ")} are added to your tour&apos;s allowed domains.
              </p>
            </div>
          )}

          {/* Analytics Section */}
          {currentTour && (
            <AnalyticsSection key={currentTour.id} tourId={currentTour.id} />
          )}
        </div>
      </div>

      <StepModal
        isOpen={isStepModalOpen}
        step={editingStep}
        onClose={() => {
          setIsStepModalOpen(false);
          setEditingStep(null);
        }}
        onSave={handleSaveStep}
      />
    </ProtectedRoute>
  );
}
