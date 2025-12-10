import { useEffect, useState } from 'react';
import { AnalyticsQueryService } from '@/lib/analyticsQuery';
import { DropOffItem, EventEntry } from "./types";

type Props = {
  tourId: string;
};

interface AnalyticsState {
  views: number;
  completions: number;
  completionRate: number;
  averageDuration: number;
  dropOff: DropOffItem[];
  recentEvents: EventEntry[];
  loading: boolean;
}

export default function AnalyticsSection({ tourId }: Props) {
  const [analytics, setAnalytics] = useState<AnalyticsState>({
    views: 0,
    completions: 0,
    completionRate: 0,
    averageDuration: 0,
    dropOff: [],
    recentEvents: [],
    loading: true,
  });

  useEffect(() => {
    const loadAnalytics = async () => {
      try {
        const metrics = await AnalyticsQueryService.getTourMetrics(tourId, 7);
        const recentEvents = await AnalyticsQueryService.getRecentEvents(tourId, 20);

        setAnalytics({
          views: metrics.totalViews,
          completions: metrics.totalCompletions,
          completionRate: metrics.completionRate,
          averageDuration: metrics.averageDuration,
          dropOff: metrics.dropOffByStep,
          recentEvents: recentEvents.map((event) => ({
            tour_id: event.tour_id,
            step: parseInt(event.step_id?.split('_').pop() || '0', 10),
            action: event.action,
          })),
          loading: false,
        });
      } catch (error) {
        console.error('Failed to load analytics:', error);
        setAnalytics((prev) => ({ ...prev, loading: false }));
      }
    };

    if (tourId) {
      loadAnalytics();
    }
  }, [tourId]);

  const { views, completions, completionRate, dropOff, recentEvents, loading } = analytics;
  const hasData = views > 0 || completions > 0 || dropOff.length > 0 || recentEvents.length > 0;

  return (
    <section className="rounded-2xl border border-white/10 bg-white/5 p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold">Analytics</h3>
          <p className="text-sm text-gray-400">Tour engagement and conversion metrics over the last 7 days.</p>
        </div>
        <div className="flex gap-2">
          <button className="px-3 py-2 rounded-lg border border-white/20 text-sm hover:bg-white/5">Last 7 days</button>
          <button className="px-3 py-2 rounded-lg border border-white/20 text-sm hover:bg-white/5">Export CSV</button>
        </div>
      </div>

      {loading && (
        <div className="rounded-xl border border-dashed border-white/15 bg-black/20 p-4 text-sm text-gray-400">
          Loading analytics...
        </div>
      )}

      {!loading && !hasData && (
        <div className="rounded-xl border border-dashed border-white/15 bg-black/20 p-4 text-sm text-gray-400">
          No analytics yet. Data will appear after your first tour runs.
        </div>
      )}

      {!loading && hasData && (
        <>
          <div className="grid md:grid-cols-2 gap-4">
            <div className="rounded-xl border border-white/10 bg-black/30 p-4 space-y-3">
              <div className="flex items-center justify-between text-sm text-gray-300">
                <span>Views</span>
                <span>{views.toLocaleString()}</span>
              </div>
              <div className="h-2 rounded-full bg-white/10">
                <div className="h-full rounded-full bg-linear-to-r from-[#00FF9C] to-[#0070F3]" style={{ width: "82%" }} />
              </div>

              <div className="flex items-center justify-between text-sm text-gray-300">
                <span>Completions</span>
                <span>{completions.toLocaleString()} ({completionRate.toFixed(1)}%)</span>
              </div>
              <div className="h-2 rounded-full bg-white/10">
                <div className="h-full rounded-full bg-linear-to-r from-[#0070F3] to-[#00FF9C]" style={{ width: `${completionRate}%` }} />
              </div>
            </div>

            <div className="rounded-xl border border-white/10 bg-black/30 p-4 space-y-3">
              <div className="flex items-center justify-between text-sm text-gray-300">
                <span>Drop-off by step</span>
                <span>{dropOff.length > 0 ? `Step ${dropOff[0]?.step}` : 'No data'}</span>
              </div>
              <div className="space-y-2">
                {dropOff.slice(0, 3).map((item) => (
                  <div key={item.step}>
                    <div className="flex items-center justify-between text-sm text-gray-400">
                      <span>Step {item.step}</span>
                      <span>{item.percentage}% drop-off</span>
                    </div>
                    <div className="h-2 rounded-full bg-white/10">
                      <div
                        className="h-full rounded-full bg-linear-to-r from-[#00FF9C] to-[#0070F3]"
                        style={{ width: `${item.percentage}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="rounded-xl border border-white/10 bg-black/30 p-4">
            <h4 className="font-semibold mb-3">Recent events</h4>
            {recentEvents.length === 0 ? (
              <p className="text-sm text-gray-400">No recent events</p>
            ) : (
              <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-3 text-sm text-gray-300">
                {recentEvents.slice(0, 12).map((event, index) => (
                  <div key={`${event.event_id || index}`} className="rounded-lg border border-white/10 bg-white/5 p-3 text-xs break-all">
                    {`{ "tour": "${event.tour_id.substring(0, 8)}", "step": ${event.step}, "action": "${event.action}" }`}
                  </div>
                ))}
              </div>
            )}
          </div>
        </>
      )}
    </section>
  );
}

