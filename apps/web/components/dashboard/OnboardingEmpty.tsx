type Props = {
  onCreate: () => void;
};

export default function OnboardingEmpty({ onCreate }: Props) {
  return (
    <div className="max-w-3xl mx-auto rounded-2xl border border-dashed border-white/15 bg-white/5 p-8 flex flex-col gap-4 items-center text-center">
      <div className="flex items-center gap-2 text-sm text-gray-300">
        <span className="px-2 py-1 rounded-full bg-white/5 border border-white/10">Empty state</span>
        <span className="px-2 py-1 rounded-full bg-white/5 border border-white/10">Action required</span>
      </div>
      <div className="space-y-2">
        <h2 className="text-2xl font-semibold">Create your first tour</h2>
        <p className="text-gray-300 text-sm md:text-base">
          Add a tour name, base URL, and at least five steps. Use the button below to begin.
        </p>
      </div>
      <button
        className="px-5 py-3 rounded-lg bg-white text-black font-semibold hover:opacity-90"
        onClick={onCreate}
      >
        + Create New Tour
      </button>
    </div>
  );
}

