import { motion } from "framer-motion";
import { Calendar, Download, TrendingUp, Activity } from "lucide-react";
import { DropOffItem, EventEntry } from "./types";

type Props = {
  views: number;
  completions: number;
  dropOff: DropOffItem[];
  recentEvents: EventEntry[];
};

export default function AnalyticsSection({ views, completions, dropOff, recentEvents }: Props) {
  const hasData = views > 0 || completions > 0 || dropOff.length > 0 || recentEvents.length > 0;
  const completionRate = views > 0 ? Math.round((completions / views) * 100) : 0;

  return (
    <section className="rounded-2xl border border-gray-800 bg-gray-900/50 backdrop-blur-sm p-6 space-y-6 shadow-xl">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <TrendingUp className="w-5 h-5 text-blue-400" />
            <h3 className="text-lg font-semibold text-gray-100">Analytics</h3>
          </div>
          <p className="text-sm text-gray-400">Baseline engagement across all active tours.</p>
        </div>
        <div className="flex gap-2">
          <button className="flex items-center gap-2 px-4 py-2 rounded-lg border border-gray-700 bg-gray-800/50 text-sm text-gray-300 hover:bg-gray-800 hover:border-gray-600 transition-all">
            <Calendar className="w-4 h-4" />
            Last 7 days
          </button>
          <button className="flex items-center gap-2 px-4 py-2 rounded-lg border border-gray-700 bg-gray-800/50 text-sm text-gray-300 hover:bg-gray-800 hover:border-gray-600 transition-all">
            <Download className="w-4 h-4" />
            Export CSV
          </button>
        </div>
      </div>

      {!hasData && (
        <div className="rounded-xl border border-dashed border-gray-700 bg-gray-800/30 p-6 text-center">
          <Activity className="w-12 h-12 text-gray-600 mx-auto mb-3" />
          <p className="text-sm text-gray-400">No analytics yet. Data will appear after your first tour runs.</p>
        </div>
      )}

      {hasData && (
        <>
          <div className="grid md:grid-cols-2 gap-4">
            {/* Views & Completions */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="rounded-xl border border-gray-700 bg-gray-800/40 p-5 space-y-4"
            >
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-gray-300">Total Views</span>
                  <span className="text-2xl font-bold text-gray-100">{views.toLocaleString()}</span>
                </div>
                <div className="h-3 rounded-full bg-gray-700/50 overflow-hidden">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: "82%" }}
                    transition={{ duration: 1, delay: 0.2 }}
                    className="h-full rounded-full bg-linear-to-r from-blue-500 to-blue-400 shadow-lg shadow-blue-500/30"
                  />
                </div>
              </div>

              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-gray-300">Completions</span>
                  <div className="text-right">
                    <div className="text-2xl font-bold text-gray-100">{completions.toLocaleString()}</div>
                    <div className="text-xs text-blue-400">{completionRate}% rate</div>
                  </div>
                </div>
                <div className="h-3 rounded-full bg-gray-700/50 overflow-hidden">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${completionRate}%` }}
                    transition={{ duration: 1, delay: 0.4 }}
                    className="h-full rounded-full bg-linear-to-r from-green-500 to-blue-500 shadow-lg shadow-green-500/30"
                  />
                </div>
              </div>
            </motion.div>

            {/* Drop-off Analysis */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="rounded-xl border border-gray-700 bg-gray-800/40 p-5 space-y-4"
            >
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-gray-300">Drop-off by step</span>
                <span className="text-xs px-2 py-1 rounded-full bg-yellow-500/10 text-yellow-400 border border-yellow-500/20">
                  Highest: Step 3
                </span>
              </div>
              <div className="space-y-3">
                {dropOff.map((item, index) => (
                  <motion.div
                    key={item.step}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.3, delay: 0.2 + index * 0.1 }}
                  >
                    <div className="flex items-center justify-between text-sm mb-1.5">
                      <span className="text-gray-400">Step {item.step}</span>
                      <span className="font-semibold text-gray-200">{item.percent}%</span>
                    </div>
                    <div className="h-2 rounded-full bg-gray-700/50 overflow-hidden">
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${item.percent}%` }}
                        transition={{ duration: 0.8, delay: 0.3 + index * 0.1 }}
                        className="h-full rounded-full bg-linear-to-r from-blue-500 to-blue-400"
                      />
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          </div>

          {/* Recent Events */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="rounded-xl border border-gray-700 bg-gray-800/40 p-5"
          >
            <div className="flex items-center gap-2 mb-4">
              <Activity className="w-4 h-4 text-blue-400" />
              <h4 className="font-semibold text-gray-100">Recent Events</h4>
            </div>
            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-3">
              {recentEvents.map((event, index) => (
                <motion.div
                  key={`${event.tour_id}-${event.step}-${event.action}`}
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.3, delay: 0.3 + index * 0.05 }}
                  className="rounded-lg border border-gray-700 bg-gray-900/50 p-3 font-mono text-xs text-gray-300 hover:border-gray-600 hover:bg-gray-900 transition-all"
                >
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="text-blue-400">tour_id:</span>
                      <span className="text-gray-400 truncate">"{event.tour_id}"</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-blue-400">step:</span>
                      <span className="text-gray-300">{event.step}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-blue-400">action:</span>
                      <span className={`${
                        event.action === 'completed' ? 'text-green-400' :
                        event.action === 'skipped' ? 'text-yellow-400' :
                        'text-gray-400'
                      }`}>
                        "{event.action}"
                      </span>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </>
      )}
    </section>
  );
}