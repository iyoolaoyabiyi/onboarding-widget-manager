import { Step } from "./types";

type Props = {
  steps: Step[];
};

export default function TourEditor({ steps }: Props) {
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
            defaultValue="My App Onboarding"
            placeholder="Name your tour"
          />
        </label>

        <label className="flex flex-col gap-2">
          <span className="text-sm text-gray-300">Base URL</span>
          <input
            className="px-4 py-3 rounded-lg bg-black/30 border border-white/10 focus:outline-none focus:border-white/30"
            defaultValue="https://myapp.com"
            placeholder="https://your-app.com"
          />
        </label>

        <label className="flex flex-col gap-2">
          <span className="text-sm text-gray-300">Theme Color</span>
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-lg border border-white/10" style={{ background: "#0070F3" }} />
            <input
              className="flex-1 px-4 py-3 rounded-lg bg-black/30 border border-white/10 focus:outline-none focus:border-white/30"
              defaultValue="#0070F3"
              placeholder="#0070F3"
            />
          </div>
        </label>

        <label className="flex flex-col gap-2">
          <span className="text-sm text-gray-300">CTA Copy</span>
          <input
            className="px-4 py-3 rounded-lg bg-black/30 border border-white/10 focus:outline-none focus:border-white/30"
            defaultValue="Take a quick tour?"
            placeholder="Prompt users to start the tour"
          />
        </label>
      </div>

      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h3 className="font-semibold">Steps</h3>
          <button className="px-3 py-2 rounded-lg border border-white/15 text-sm hover:bg-white/5">+ Add Step</button>
        </div>

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
      </div>

      <div className="flex flex-wrap gap-3">
        <button className="px-5 py-3 rounded-lg bg-white text-black font-semibold hover:opacity-90">Save Tour</button>
        <button className="px-5 py-3 rounded-lg border border-white/20 hover:bg-white/5">Get Embed Code</button>
        <button className="px-5 py-3 rounded-lg border border-white/20 hover:bg-white/5">Launch Draft</button>
      </div>
    </div>
  );
}

