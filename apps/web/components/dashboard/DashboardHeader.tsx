type Props = {
  onCreate: () => void;
};

export default function DashboardHeader({ onCreate }: Props) {
  return (
    <header className="flex flex-col gap-3 w-full">
      {/* <div className="flex items-center gap-3 text-sm text-gray-300">
        <span className="px-2 py-1 rounded-full bg-white/5 border border-white/10">
          Creator Dashboard
        </span>
        <span className="px-2 py-1 rounded-full bg-white/5 border border-white/10">
          Live demo UI
        </span>
      </div> */}
      <div className="flex flex-col gap-2">
        <h1 className="text-3xl md:text-4xl font-semibold">Onboarding Dashboard</h1>
        <p className="text-gray-300 max-w-3xl">
          Build, preview, and hand off guided tours without leaving this workspace.
          Everything here is wired for the flow in the product brief—tour creation,
          embed delivery, and baseline analytics.
        </p>
      </div>
      <div className="flex flex-wrap gap-3">
        <button
          className="px-4 py-2 rounded-lg bg-white text-black font-semibold hover:opacity-90"
          onClick={onCreate}
        >
          + Create New Tour
        </button>
        <button className="px-4 py-2 rounded-lg border border-white/20 text-white hover:bg-white/5">
          Preview Widget
        </button>
        <button className="px-4 py-2 rounded-lg border border-white/20 text-white hover:bg-white/5">
          Share with Devs
        </button>
      </div>
    </header>
  );
}

