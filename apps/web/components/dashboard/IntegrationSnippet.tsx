type Props = {
  widgetSrc: string;
  tourId: string;
  hasTour: boolean;
};

export default function IntegrationSnippet({ widgetSrc, tourId, hasTour }: Props) {
  return (
    <div className="rounded-2xl border border-white/10 bg-white/5 p-5 space-y-3">
      <h3 className="text-lg font-semibold">Integration</h3>
      <p className="text-sm text-gray-400">Hand this snippet to developers once the tour is saved.</p>
      {hasTour ? (
        <>
          <code className="rounded-xl border border-white/10 bg-black/40 p-4 font-mono text-sm break-all block">
            {`<script src="${widgetSrc}" data-tour-id="${tourId}"></script>`}
          </code>
          <button className="w-full px-4 py-2 rounded-lg bg-white text-black font-semibold hover:opacity-90">
            Copy Embed Script
          </button>
        </>
      ) : (
        <div className="rounded-xl border border-dashed border-white/15 bg-black/20 px-4 py-6 text-sm text-gray-400">
          Save a tour to generate your embed snippet.
        </div>
      )}
    </div>
  );
}

