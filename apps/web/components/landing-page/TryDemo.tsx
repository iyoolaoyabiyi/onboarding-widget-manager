export default function TryDemo() {
  return (
    <section className="py-24 px-6 flex flex-col items-center text-center">
      <h2 className="text-3xl md:text-5xl font-bold mb-4">
        Try the Interactive Demo
      </h2>

      <p className="text-lg md:text-xl max-w-2xl mb-12">
        Experience how your users will navigate through smooth, guided
        onboarding steps — right inside your product.
      </p>
      <div className="w-full max-w-3xl bg-black/10 dark:bg-white/5 rounded-xl p-8 mb-10 shadow-lg border">
        <p className="text-lg mb-4 font-semibold">Demo Preview</p>

        <div className="bg-white dark:bg-neutral-900 rounded-lg p-6 border shadow flex flex-col gap-4">
          <div className="p-4 bg-neutral-100 dark:bg-neutral-800 rounded-md text-left">
            <p className="font-medium">
              Step 1: Welcome to your first tour!
            </p>
            <p className="text-sm mt-1 opacity-80">
              Use steps like this to guide users through your interface.
            </p>
          </div>

          <button className="self-end px-5 py-2 rounded-lg font-medium ">
            Next Step
          </button>
        </div>
      </div>
      <button className="px-8 py-3 rounded-lg font-medium ">
        Start Demo Tour
      </button>
    </section>
  );
}
