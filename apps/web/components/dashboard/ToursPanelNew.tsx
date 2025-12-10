'use client';

import { Tour } from './types';

// Theme color mappings for display
const THEME_COLORS: Record<string, string> = {
  greyscale: '#1a1a1a',
  blue: '#1e3a8a',
  green: '#14532d',
  red: '#7f1d1d',
};

interface ToursPanelProps {
  tours: Tour[];
  onSelectTour?: (tour: Tour) => void;
  onDeleteTour?: (tourId: string) => void;
  selectedId?: string;
}

export default function ToursPanel({ tours, onSelectTour, onDeleteTour, selectedId }: ToursPanelProps) {
  const hasTours = tours.length > 0;

  const handleDelete = (e: React.MouseEvent, tourId: string) => {
    e.stopPropagation(); // Prevent tour selection when clicking delete
    onDeleteTour?.(tourId);
  };

  return (
    <div className="rounded-2xl border border-white/10 bg-white/5 p-5 sticky top-6" id="tour-list">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="text-lg font-semibold">Tours</h3>
          <p className="text-sm text-gray-400">Your onboarding tours</p>
        </div>
      </div>
      {hasTours ? (
        <div className="space-y-3">
          {tours.map((tour) => (
            <div
              key={tour.id}
              onClick={() => onSelectTour?.(tour)}
              className={`rounded-xl border p-4 flex flex-col gap-2 cursor-pointer transition-all ${
                selectedId === tour.id
                  ? 'border-white/30 bg-white/10'
                  : 'border-white/10 bg-black/30 hover:border-white/20 hover:bg-black/40'
              }`}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <span
                    className="h-3 w-3 rounded-full"
                    style={{ background: THEME_COLORS[tour.theme] }}
                    title={tour.theme}
                  />
                  <p className="font-semibold text-sm">{tour.name}</p>
                </div>
                <div className="flex items-center gap-2">
                  <span
                    className={`text-xs px-2 py-1 rounded-full ${
                      tour.status === 'active'
                        ? 'bg-green-500/20 border border-green-500/50 text-green-300'
                        : tour.status === 'draft'
                          ? 'bg-yellow-500/20 border border-yellow-500/50 text-yellow-300'
                          : 'bg-white/5 border border-white/10'
                    }`}
                  >
                    {tour.status}
                  </span>
                  {onDeleteTour && (
                    <button
                      onClick={(e) => handleDelete(e, tour.id)}
                      className="p-1 rounded hover:bg-red-500/20 text-red-400 transition-colors"
                      title="Delete tour"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                      </svg>
                    </button>
                  )}
                </div>
              </div>
              <div className="text-xs text-gray-400">
                <span>{tour.steps} steps</span> • <span>{tour.completion_rate}% completion</span>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="rounded-xl border border-dashed border-white/15 bg-black/20 px-4 py-6 text-sm text-gray-400">
          No tours yet
        </div>
      )}
    </div>
  );
}
