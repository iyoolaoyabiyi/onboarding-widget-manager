import { DropOffItem, EventEntry } from "./types";

type Props = {
  views: number;
  completions: number;
  dropOff: DropOffItem[];
  recentEvents: EventEntry[];
};

export default function AnalyticsSection({ views, completions, dropOff, recentEvents }: Props) {
  const hasData = views > 0 || completions > 0 || dropOff.length > 0 || recentEvents.length > 0;

  return (
    <section className="rounded-2xl border border-white/10 bg-white/5 p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold">Analytics</h3>
          <p className="text-sm text-gray-400">Baseline engagement across all active tours.</p>
        </div>
        <div className="flex gap-2">
          <button className="px-3 py-2 rounded-lg border border-white/20 text-sm hover:bg-white/5">Last 7 days</button>
          <button className="px-3 py-2 rounded-lg border border-white/20 text-sm hover:bg-white/5">Export CSV</button>
        </div>
      </div>

      {!hasData && (
        <div className="rounded-xl border border-dashed border-white/15 bg-black/20 p-4 text-sm text-gray-400">
          No analytics yet. Data will appear after your first tour runs.
        </div>
      )}

      {hasData && (
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
            <span>{completions.toLocaleString()}</span>
          </div>
          <div className="h-2 rounded-full bg-white/10">
            <div className="h-full rounded-full bg-linear-to-r from-[#0070F3] to-[#00FF9C]" style={{ width: "65%" }} />
          </div>
        </div>

        <div className="rounded-xl border border-white/10 bg-black/30 p-4 space-y-3">
          <div className="flex items-center justify-between text-sm text-gray-300">
            <span>Drop-off by step</span>
            <span>Highest: Step 3</span>
          </div>
          <div className="space-y-2">
            {dropOff.map((item) => (
              <div key={item.step}>
                <div className="flex items-center justify-between text-sm text-gray-400">
                  <span>Step {item.step}</span>
                  <span>{item.percent}%</span>
                </div>
                <div className="h-2 rounded-full bg-white/10">
                  <div
                    className="h-full rounded-full bg-linear-to-r from-[#00FF9C] to-[#0070F3]"
                    style={{ width: `${item.percent}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="rounded-xl border border-white/10 bg-black/30 p-4">
        <h4 className="font-semibold mb-3">Recent events</h4>
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-3 text-sm text-gray-300">
          {recentEvents.map((event) => (
            <div key={`${event.tour_id}-${event.step}-${event.action}`} className="rounded-lg border border-white/10 bg-white/5 p-3">
              {`{ "tour_id": "${event.tour_id}", "step": ${event.step}, "action": "${event.action}" }`}
            </div>
            ))}
          </div>
        </div>
        </>
      )}
    </section>
  );
}

