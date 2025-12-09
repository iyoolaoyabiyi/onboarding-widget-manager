export default function About() {
  return (
    <div className="px-6 py-16 md:py-24">
      <div className="max-w-4xl mx-auto text-center mb-16">
        <h1 className="text-4xl md:text-6xl font-bold mb-6">
          About Our Onboarding Experience Platform
        </h1>
        <p className="text-lg md:text-xl">
          We help teams deliver smooth, intuitive product tours that guide users
          step-by-step and increase product adoption.
        </p>
      </div>

      <div className="max-w-5xl mx-auto flex flex-col gap-12 md:gap-16">
        <div className="flex flex-col gap-4">
          <h2 className="text-2xl md:text-4xl font-bold">Our Mission</h2>
          <p className="text-lg leading-relaxed">
            Our mission is simple: To make user onboarding effortless for both
            developers and end-users. We believe every product deserves a clear,
            helpful tour that makes users feel confident from the first
            interaction.
          </p>
        </div>

        <div className="flex flex-col gap-4">
          <h2 className="text-2xl md:text-4xl font-bold">What We Are Building</h2>
          <p className="text-lg leading-relaxed">
            We designed a powerful onboarding tool that allows teams to create
            interactive, guided tours. With customizable steps, smooth
            animations, and easy embed integration, our platform helps users
            understand your product faster without reading long documentation.
          </p>
        </div>

        <div className="flex flex-col gap-4">
          <h2 className="text-2xl md:text-4xl font-bold">Why Onboarding Matters</h2>
          <ul className="flex flex-col gap-3 text-lg leading-relaxed">
            <li>First impressions shape product adoption.</li>
            <li>
              Users are more likely to stay when they understand how to use your
              interface.
            </li>
            <li>
              Tooltips, guided steps, and interactive flows reduce confusion and
              support requests.
            </li>
            <li>
              A good onboarding experience improves retention and overall
              product success.
            </li>
          </ul>
        </div>

        <div className="flex flex-col gap-4">
          <h2 className="text-2xl md:text-4xl font-bold">Where We're Headed</h2>
          <p className="text-lg leading-relaxed">
            We're building more than just a tour tool. Our long-term vision is
            to create intelligent, adaptive onboarding experiences that
            personalize guidance based on user behavior and product context.
          </p>
        </div>
      </div>
    </div>
  );
}