import { useEffect, useState } from 'react';
import { AnalyticsQueryService } from '@/lib/analyticsQuery';
import { FirestoreService } from '@/lib/firestore';
import { DropOffItem, EventEntry } from "./types";

type Props = {
  tourId: string;
};

const Skeleton = ({ className }: { className?: string }) => (
  <div className={`animate-pulse rounded-md bg-white/10 ${className ?? ''}`} />
);

const formatDuration = (ms: number) => {
  if (!ms) return '—';
  const totalSeconds = Math.round(ms / 1000);
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;
  if (minutes === 0) return `${seconds}s`;
  return `${minutes}m ${seconds.toString().padStart(2, '0')}s`;
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

const initialAnalyticsState: AnalyticsState = {
  views: 0,
  completions: 0,
  completionRate: 0,
  averageDuration: 0,
  dropOff: [],
  recentEvents: [],
  loading: true,
};

export default function AnalyticsSection({ tourId }: Props) {
  const [analytics, setAnalytics] = useState<AnalyticsState>(initialAnalyticsState);

  useEffect(() => {
    let isCurrent = true;

    const loadAnalytics = async () => {
      try {
        const [metrics, recentEvents, tour] = await Promise.all([
          AnalyticsQueryService.getTourMetrics(tourId, 7),
          AnalyticsQueryService.getRecentEvents(tourId, 20),
          FirestoreService.getTour(tourId),
        ]);

        const titleMap =
          tour?.steps?.reduce((acc, step) => {
            if (typeof step.order === 'number') {
              acc[step.order] = step.title || step.content || `Step ${step.order}`;
            }
            return acc;
          }, {} as Record<number, string>) || {};

        if (isCurrent) {
          setAnalytics({
            views: metrics.totalViews,
            completions: metrics.totalCompletions,
            completionRate: metrics.completionRate,
            averageDuration: metrics.averageDuration,
            dropOff: metrics.dropOffByStep,
            recentEvents: recentEvents.map((event) => {
              const stepNum = parseInt(event.step_id?.split('_').pop() || '0', 10);
              return {
                tour_id: event.tour_id,
                step: Number.isFinite(stepNum) ? stepNum : 0,
                action: event.action,
                step_title: titleMap[stepNum],
              };
            }),
            loading: false,
          });
        }
      } catch (error) {
        console.error('Failed to load analytics:', error);
        if (isCurrent) {
          setAnalytics((prev) => ({ ...prev, loading: false }));
        }
      }
    };

    if (tourId) {
      loadAnalytics();
    }

    return () => {
      isCurrent = false;
    };
  }, [tourId]);

  const { views, completions, completionRate, dropOff, recentEvents, loading } = analytics;
  const hasData = views > 0 || completions > 0 || dropOff.length > 0 || recentEvents.length > 0;

  const sortedDropOff = [...dropOff].sort((a, b) => b.percent - a.percent);
  const topDrop = sortedDropOff[0];
  const stats = [
    { label: 'Views', value: views.toLocaleString(), helper: 'Started sessions' },
    { label: 'Completions', value: completions.toLocaleString(), helper: 'Finished the tour' },
    {
      label: 'Completion rate',
      value: `${Math.min(100, Math.max(0, completionRate)).toFixed(1)}%`,
      helper: 'Of all starters',
      progress: Math.min(100, Math.max(0, completionRate)),
    },
    { label: 'Avg duration', value: formatDuration(analytics.averageDuration), helper: 'Per completed tour' },
  ];

  return (
    <section className="rounded-2xl border border-white/10 bg-white/5 p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold">Analytics</h3>
          <p className="text-sm text-gray-400">Tour engagement and conversion metrics over the last 7 days.</p>
        </div>
      </div>

      {loading && (
        <div className="space-y-4">
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {[...Array(4)].map((_, idx) => (
              <div key={idx} className="rounded-xl border border-white/10 bg-black/30 p-4 space-y-3">
                <Skeleton className="h-3 w-16" />
                <Skeleton className="h-6 w-24" />
                <Skeleton className="h-3 w-20" />
                <Skeleton className="h-2 w-full" />
              </div>
            ))}
          </div>
          <div className="grid md:grid-cols-2 gap-4">
            <div className="rounded-xl border border-white/10 bg-black/30 p-4 space-y-3">
              <Skeleton className="h-3 w-32" />
              <Skeleton className="h-2 w-full" />
              <Skeleton className="h-2 w-5/6" />
              <Skeleton className="h-2 w-4/6" />
            </div>
            <div className="rounded-xl border border-white/10 bg-black/30 p-4 space-y-3">
              <Skeleton className="h-3 w-28" />
              <div className="grid sm:grid-cols-2 gap-3">
                {[...Array(4)].map((_, idx) => (
                  <div key={idx} className="rounded-lg border border-white/10 bg-white/5 p-3 space-y-2">
                    <Skeleton className="h-3 w-16" />
                    <Skeleton className="h-3 w-12" />
                    <Skeleton className="h-2 w-full" />
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {!loading && !hasData && (
        <div className="rounded-xl border border-dashed border-white/15 bg-black/20 p-4 text-sm text-gray-400">
          No analytics yet. Data will appear after your first tour runs.
        </div>
      )}

      {!loading && hasData && (
        <>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {stats.map((stat) => (
              <div key={stat.label} className="rounded-xl border border-white/10 bg-black/30 p-4">
                <p className="text-xs uppercase tracking-wide text-gray-400">{stat.label}</p>
                <p className="text-2xl font-semibold mt-1">{stat.value}</p>
                <p className="text-xs text-gray-400 mt-1">{stat.helper}</p>
                {stat.progress !== undefined && (
                  <div className="mt-3 h-2 rounded-full bg-white/10">
                    <div
                      className="h-full rounded-full bg-linear-to-r from-[#00FF9C] to-[#0070F3]"
                      style={{ width: `${stat.progress}%` }}
                    />
                  </div>
                )}
              </div>
            ))}
          </div>

          <div className="grid md:grid-cols-2 gap-4">
            <div className="rounded-xl border border-white/10 bg-black/30 p-4 space-y-3">
              <div className="flex items-center justify-between text-sm text-gray-300">
                <div>
                  <p className="font-semibold">Drop-off by step</p>
                  <p className="text-xs text-gray-400">Where users are leaving the tour</p>
                </div>
                <span className="text-xs rounded-full border border-white/10 bg-white/5 px-3 py-1">
                  {topDrop ? `Biggest drop: Step ${topDrop.step}` : 'No data'}
                </span>
              </div>
              <div className="space-y-2">
                {dropOff.length === 0 && (
                  <p className="text-sm text-gray-400">We need more runs to calculate drop-off.</p>
                )}
                {dropOff.slice(0, 5).map((item) => (
                  <div key={item.step} className="rounded-lg border border-white/5 bg-white/5 p-3">
                    <div className="flex items-center justify-between text-sm text-gray-300">
                      <span>Step {item.step}</span>
                      <span className="text-gray-200 font-semibold">{item.percent}%</span>
                    </div>
                    <p className="text-xs text-gray-500">Stopped before this step</p>
                    <div className="mt-2 h-2 rounded-full bg-white/10">
                      <div
                        className="h-full rounded-full bg-linear-to-r from-[#ffb347] via-[#ff7757] to-[#e73827]"
                        style={{ width: `${item.percent}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="rounded-xl border border-white/10 bg-black/30 p-4">
              <div className="flex items-center justify-between mb-3">
                <h4 className="font-semibold">Recent events</h4>
                <span className="text-xs text-gray-400">{recentEvents.length ? 'Last 12 events' : 'Waiting for data'}</span>
              </div>
              {recentEvents.length === 0 ? (
                <p className="text-sm text-gray-400">No recent events</p>
              ) : (
                <div className="grid sm:grid-cols-2 gap-3 text-sm text-gray-300">
                  {recentEvents.slice(0, 12).map((event, index) => (
                    <div
                      key={`${event.tour_id}-${event.step}-${event.action}-${index}`}
                      className="rounded-lg border border-white/10 bg-white/5 p-3 text-xs"
                    >
                      <div className="flex items-center justify-between">
                        <span className="rounded-full bg-white/10 px-2 py-0.5 text-[10px] uppercase tracking-wide">{event.action}</span>
                        <span className="text-gray-400 truncate max-w-[120px]" title={event.step_title || `Step ${event.step}`}>
                          {event.step_title || `Step ${event.step}`}
                        </span>
                      </div>
                      <p className="mt-2 font-mono text-[11px] text-gray-200 break-all">
                        {event.tour_id.substring(0, 8)}…
                      </p>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </>
      )}
    </section>
  );
}
