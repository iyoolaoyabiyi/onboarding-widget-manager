import { Metric } from "./types";

type Props = {
  metrics: Metric[];
};

export default function MetricsGrid({ metrics }: Props) {
  return (
    <section className="grid gap-4 md:grid-cols-3">
      {metrics.map((metric) => (
        <div
          key={metric.label}
          className="rounded-2xl border border-white/10 bg-white/5 p-5 shadow-[0_10px_50px_-35px_rgba(0,0,0,0.8)]"
        >
          <p className="text-sm text-gray-400">{metric.label}</p>
          <p className="text-2xl font-semibold mt-2">
            {metric.value}
            {metric.suffix ?? ""}
          </p>
          {metric.label === "Completion Rate" && (
            <div className="mt-3 h-2 rounded-full bg-white/10">
              <div
                className="h-full rounded-full bg-linear-to-r from-[#00FF9C] to-[#0070F3]"
                style={{ width: "65%" }}
              />
            </div>
          )}
        </div>
      ))}
    </section>
  );
}

