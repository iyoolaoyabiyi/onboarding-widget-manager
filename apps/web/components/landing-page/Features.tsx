export default function Features() {
  return (
    <div className="px-6 py-16 md:py-24">
      <h2 className="text-3xl md:text-5xl font-bold text-center mb-12 md:mb-16 max-w-4xl mx-auto">
        Powerful Features for Faster User Onboarding
      </h2>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-12 max-w-6xl mx-auto">
        <div className="flex flex-col gap-3">
          <h3 className="text-xl md:text-2xl font-semibold mb-2">
            No Code Installation
          </h3>
          <p>A single script tag is all you need.</p>
          <p>Paste it into your site and your tour is live instantly.</p>
        </div>

        <div className="flex flex-col gap-3">
          <h3 className="text-xl md:text-2xl font-semibold mb-2">
            Fully Customizable Steps
          </h3>
          <p>Define steps, target elements, and messages.</p>
          <p>Perfect for any product layout.</p>
        </div>

        <div className="flex flex-col gap-3">
          <h3 className="text-xl md:text-2xl font-semibold mb-2">
            Lightweight & Fast
          </h3>
          <p>Optimized embed script.</p>
          <p>Loads instantly without slowing down your app.</p>
        </div>
      </div>
    </div>
  );
}