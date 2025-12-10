import { motion } from "framer-motion";
import { TrendingUp, Users, AlertTriangle, BarChart3 } from "lucide-react";
import { Metric } from "./types";

type Props = {
  metrics: Metric[];
};

const metricIcons: Record<string, any> = {
  "Total Views": Users,
  "Completion Rate": TrendingUp,
  "Highest Drop-off": AlertTriangle,
};

export default function MetricsGrid({ metrics }: Props) {
  if (!metrics.length) {
    return (
      <section className="rounded-2xl border border-dashed border-gray-700 bg-gray-800/30 p-8 text-center">
        <BarChart3 className="w-12 h-12 text-gray-600 mx-auto mb-3" />
        <p className="text-sm text-gray-400">
          No analytics yet. Launch a tour to start collecting data.
        </p>
      </section>
    );
  }

  return (
    <section className="grid gap-4 md:grid-cols-3 w-full">
      {metrics.map((metric, index) => {
        const Icon = metricIcons[metric.label] || BarChart3;
        const isCompletionRate = metric.label === "Completion Rate";
        const completionValue = typeof metric.value === "number" ? metric.value : 0;

        return (
          <motion.div
            key={metric.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: index * 0.1 }}
            className="rounded-2xl border border-gray-800 bg-gray-900/50 backdrop-blur-sm p-6 shadow-xl hover:shadow-2xl hover:border-gray-700 transition-all duration-300"
          >
            <div className="flex items-start justify-between mb-3">
              <p className="text-sm font-medium text-gray-400">{metric.label}</p>
              <div className="p-2 rounded-lg bg-blue-500/10 border border-blue-500/20">
                <Icon className="w-4 h-4 text-blue-400" />
              </div>
            </div>

            <p className="text-3xl font-bold text-gray-100 mb-1">
              {metric.value}
              {metric.suffix ?? ""}
            </p>

            {isCompletionRate && (
              <div className="mt-4">
                <div className="h-2 rounded-full bg-gray-700/50 overflow-hidden">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${completionValue}%` }}
                    transition={{ duration: 1, delay: 0.3 + index * 0.1 }}
                    className="h-full rounded-full bg-linear-to-r from-green-500 to-blue-500 shadow-lg shadow-green-500/30"
                  />
                </div>
                <div className="flex justify-between mt-1.5 text-xs text-gray-500">
                  <span>0%</span>
                  <span>100%</span>
                </div>
              </div>
            )}

            {metric.label === "Highest Drop-off" && (
              <div className="mt-3 flex items-center gap-2">
                <span className="px-2 py-1 rounded-full bg-yellow-500/10 text-yellow-400 text-xs font-medium border border-yellow-500/20">
                  Needs attention
                </span>
              </div>
            )}

            {metric.label === "Total Views" && (
              <div className="mt-3 flex items-center gap-2 text-xs text-gray-500">
                <div className="flex items-center gap-1">
                  <div className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />
                  <span>Live tracking</span>
                </div>
              </div>
            )}
          </motion.div>
        );
      })}
    </section>
  );
}