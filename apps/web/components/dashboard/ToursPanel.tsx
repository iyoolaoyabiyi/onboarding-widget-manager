import { Tour } from "./types";

type Props = {
  tours: Tour[];
};

export default function ToursPanel({ tours }: Props) {
  const hasTours = tours.length > 0;

  return (
    <div className="rounded-2xl border border-white/10 bg-gray-900/50  p-5">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="text-lg font-semibold">Tours</h3>
          <p className="text-sm text-gray-400">Overview of live and draft tours.</p>
        </div>
        <button className="text-sm px-3 py-2 rounded-lg border border-white/10 hover:bg-white/5">New</button>
      </div>
      {hasTours ? (
        <div className="space-y-3">
          {tours.map((tour) => (
            <div key={tour.id} className="rounded-xl border border-white/10 bg-black/30 p-4 flex flex-col gap-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <span className="h-3 w-3 rounded-full" style={{ background: tour.color }} />
                  <p className="font-semibold">{tour.name}</p>
                </div>
                <span className="text-xs px-2 py-1 rounded-full bg-white/5 border border-white/10">{tour.status}</span>
              </div>
              <p className="text-sm text-gray-400">{tour.baseUrl}</p>
              <div className="flex flex-wrap items-center gap-3 text-sm text-gray-300">
                <span>{tour.steps} steps</span>
                <span>·</span>
                <span>{tour.completion}% completion</span>
                <span>·</span>
                <span>Updated {tour.updated}</span>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="rounded-xl border border-dashed border-white/15 bg-black/20 px-4 py-6 text-sm text-gray-400">
          No tours yet. Click “New” to create your first onboarding tour.
        </div>
      )}
    </div>
  );
}

