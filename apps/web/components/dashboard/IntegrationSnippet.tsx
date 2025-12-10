import { motion } from "framer-motion";
import { Code, Copy, Check } from "lucide-react";
import { useState } from "react";

type Props = {
  widgetSrc: string;
  tourId: string;
  hasTour: boolean;
};

export default function IntegrationSnippet({ widgetSrc, tourId, hasTour }: Props) {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    const snippet = `<script src="${widgetSrc}" data-tour-id="${tourId}"></script>`;
    navigator.clipboard.writeText(snippet);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="rounded-2xl border border-gray-800 bg-gray-900/50 backdrop-blur-sm p-5 space-y-4 shadow-xl">
      <div className="flex items-center gap-2">
        <Code className="w-5 h-5 text-blue-400" />
        <h3 className="text-lg font-semibold text-gray-100">Integration</h3>
      </div>
      <p className="text-sm text-gray-400 leading-relaxed">
        Hand this snippet to developers once the tour is saved.
      </p>
      
      {hasTour ? (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="space-y-3"
        >
          <div className="rounded-xl border border-gray-700 bg-gray-900/80 p-4 relative group">
            <code className="font-mono text-xs sm:text-sm text-gray-300 break-all block leading-relaxed">
              <span className="text-blue-400">&lt;script</span>{" "}
              <span className="text-green-400">src</span>
              <span className="text-gray-300">=</span>
              <span className="text-yellow-400">&quot;{widgetSrc}&quot;</span>{" "}
              <span className="text-green-400">data-tour-id</span>
              <span className="text-gray-300">=</span>
              <span className="text-yellow-400">&quot;{tourId}&quot;</span>
              <span className="text-blue-400">&gt;&lt;/script&gt;</span>
            </code>
            
            {/* Hover overlay for quick copy */}
            <div className="absolute inset-0 bg-linear-to-r from-blue-600/5 to-blue-500/5 opacity-0 group-hover:opacity-100 transition-opacity rounded-xl pointer-events-none" />
          </div>

          <button
            onClick={handleCopy}
            className="w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg bg-linear-to-r from-blue-600 to-blue-500 text-white font-semibold hover:from-blue-500 hover:to-blue-400 transition-all duration-300 shadow-lg shadow-blue-500/20"
          >
            {copied ? (
              <>
                <Check className="w-4 h-4" />
                Copied!
              </>
            ) : (
              <>
                <Copy className="w-4 h-4" />
                Copy Embed Script
              </>
            )}
          </button>
        </motion.div>
      ) : (
        <div className="rounded-xl border border-dashed border-gray-700 bg-gray-800/30 px-4 py-6 text-center">
          <Code className="w-10 h-10 text-gray-600 mx-auto mb-2" />
          <p className="text-sm text-gray-400">
            Save a tour to generate your embed snippet.
          </p>
        </div>
      )}
    </div>
  );
}