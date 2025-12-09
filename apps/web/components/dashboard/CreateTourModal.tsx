type Props = {
  open: boolean;
  onClose: () => void;
  onSave: () => void;
};

export default function CreateTourModal({ open, onClose, onSave }: Props) {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-40 flex items-center justify-center bg-black/60 backdrop-blur-sm px-4">
      <div className="w-full max-w-2xl rounded-2xl border border-white/10 bg-[#0f0f0f] p-6 shadow-2xl space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-xs text-gray-400">New tour</p>
            <h3 className="text-2xl font-semibold">Create your onboarding tour</h3>
          </div>
          <button
            className="text-sm px-3 py-2 rounded-lg border border-white/15 hover:bg-white/5"
            onClick={onClose}
          >
            Close
          </button>
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

        <div className="rounded-xl border border-dashed border-white/15 bg-black/20 px-4 py-3 text-sm text-gray-400">
          Steps are required to launch. We’ll start you with example steps—edit them after saving.
        </div>

        <div className="flex justify-end gap-3">
          <button className="px-4 py-2 rounded-lg border border-white/15 hover:bg-white/5" onClick={onClose}>
            Cancel
          </button>
          <button
            className="px-5 py-2 rounded-lg bg-white text-black font-semibold hover:opacity-90"
            onClick={onSave}
          >
            Save & Continue
          </button>
        </div>
      </div>
    </div>
  );
}

