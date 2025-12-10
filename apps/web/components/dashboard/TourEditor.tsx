import { Step } from "./types";

// Theme definitions matching widget
const THEMES = {
  greyscale: { bg: '#1a1a1a', name: 'Greyscale' },
  blue: { bg: '#1e3a8a', name: 'Blue' },
  green: { bg: '#14532d', name: 'Green' },
  red: { bg: '#7f1d1d', name: 'Red' },
} as const;

type ThemeName = keyof typeof THEMES;

type Props = {
  steps: Step[];
  defaultTourName?: string;
  defaultBaseUrl?: string;
  defaultTheme?: ThemeName;
  defaultCtaCopy?: string;
};

export default function TourEditor({
  steps,
  defaultTourName,
  defaultBaseUrl,
  defaultTheme = 'blue',
  defaultCtaCopy,
}: Props) {
  const hasSteps = steps.length > 0;

  return (
    <div className="lg:col-span-2 rounded-2xl border border-white/10 bg-white/5 p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-semibold">Tour Editor</h2>
          <p className="text-gray-400 text-sm">Define the base URL, theme, and step-by-step messaging.</p>
        </div>
        <span className="px-3 py-1 rounded-full bg-white/5 text-xs border border-white/10">Minimum 5 steps</span>
      </div>

      <div className="grid md:grid-cols-2 gap-4">
        <label className="flex flex-col gap-2">
          <span className="text-sm text-gray-300">Tour Name</span>
          <input
            className="px-4 py-3 rounded-lg bg-black/30 border border-white/10 focus:outline-none focus:border-white/30"
            defaultValue={defaultTourName ?? ""}
            placeholder="Name your tour"
          />
        </label>

        <label className="flex flex-col gap-2">
          <span className="text-sm text-gray-300">Base URL</span>
          <input
            className="px-4 py-3 rounded-lg bg-black/30 border border-white/10 focus:outline-none focus:border-white/30"
            defaultValue={defaultBaseUrl ?? ""}
            placeholder="https://your-app.com"
          />
        </label>

        <label className="flex flex-col gap-2">
          <span className="text-sm text-gray-300">Theme</span>
          <div className="flex items-center gap-3">
            <select
              className="flex-1 px-4 py-3 rounded-lg bg-black/30 border border-white/10 focus:outline-none focus:border-white/30 text-white"
              defaultValue={defaultTheme}
            >
              {(Object.entries(THEMES) as Array<[ThemeName, typeof THEMES[ThemeName]]>).map(([key, { name }]) => (
                <option key={key} value={key} className="bg-black text-white">
                  {name}
                </option>
              ))}
            </select>
            <div
              className="h-10 w-10 rounded-lg border border-white/10 shrink-0"
              style={{ backgroundColor: THEMES[defaultTheme].bg }}
              title={THEMES[defaultTheme].name}
            />
          </div>
        </label>

        <label className="flex flex-col gap-2">
          <span className="text-sm text-gray-300">CTA Copy</span>
          <input
            className="px-4 py-3 rounded-lg bg-black/30 border border-white/10 focus:outline-none focus:border-white/30"
            defaultValue={defaultCtaCopy ?? ""}
            placeholder="Prompt users to start the tour"
          />
        </label>
      </div>

      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h3 className="font-semibold">Steps</h3>
          <button className="px-3 py-2 rounded-lg border border-white/15 text-sm hover:bg-white/5">+ Add Step</button>
        </div>

        {hasSteps ? (
          <div className="space-y-3">
            {steps.map((step) => (
              <div
                key={step.order}
                className="flex flex-col md:flex-row md:items-center md:justify-between gap-3 rounded-xl border border-white/10 bg-black/30 px-4 py-3"
              >
                <div className="flex items-center gap-3">
                  <div className="h-9 w-9 rounded-full bg-white/10 border border-white/10 flex items-center justify-center font-semibold">
                    {step.order}
                  </div>
                  <div>
                    <p className="font-semibold">{step.text}</p>
                    <p className="text-sm text-gray-400">
                      Target: {step.target} · Position: {step.position}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <button className="px-3 py-2 rounded-lg border border-white/15 text-sm hover:bg-white/5">Edit</button>
                  <button className="px-3 py-2 rounded-lg border border-white/15 text-sm hover:bg-white/5">Preview</button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="rounded-xl border border-dashed border-white/15 bg-black/20 px-4 py-6 text-sm text-gray-400">
            No steps yet. Add at least 5 steps to launch your first tour.
          </div>
        )}
      </div>

      <div className="flex flex-wrap gap-3">
        <button className="px-5 py-3 rounded-lg bg-white text-black font-semibold hover:opacity-90">Save Tour</button>
        <button className="px-5 py-3 rounded-lg border border-white/20 hover:bg-white/5">Get Embed Code</button>
        <button className="px-5 py-3 rounded-lg border border-white/20 hover:bg-white/5">Launch Draft</button>
      </div>
    </div>
  );
}

