export default function Documentation() {
  return (
    <div className="min-h-screen flex">
      <aside className="hidden md:flex flex-col w-64 border-r px-6 py-8 gap-6 sticky top-0 h-screen">
        <h2 className="text-xl font-semibold">Documentation</h2>

        <nav className="flex flex-col gap-4 text-sm">
          <a href="#introduction" className="hover:opacity-70 transition">
            Introduction
          </a>
          <a href="#installation" className="hover:opacity-70 transition">
            Installation
          </a>
          <a href="#embed" className="hover:opacity-70 transition">
            Embed Script
          </a>
          <a href="#config" className="hover:opacity-70 transition">
            Configuration
          </a>
          <a href="#example" className="hover:opacity-70 transition">
            Example Tour
          </a>
          <a href="#faq" className="hover:opacity-70 transition">
            FAQ
          </a>
        </nav>
      </aside>

      <main className="flex-1 px-6 md:px-12 py-12 max-w-3xl mx-auto">
        <section id="introduction" className="mb-16">
          <h1 className="text-4xl font-bold mb-4">Introduction</h1>
          <p className="text-lg">
            Welcome to the onboarding tour documentation. This guide will show
            you how to embed and configure your interactive onboarding flow.
          </p>
        </section>

        <section id="installation" className="mb-16">
          <h2 className="text-2xl font-semibold mb-3">Installation</h2>
          <p className="mb-4">
            Add the script tag below to your website's <code>&lt;head&gt;</code>{" "}
            section:
          </p>

          <pre className="bg-neutral-900 text-white p-4 rounded-lg text-sm overflow-auto">
            {`<script src="https://cdn.yoursite.com/tour.js"></script>`}
          </pre>
        </section>

        <section id="embed" className="mb-16">
          <h2 className="text-2xl font-semibold mb-3">Embed Script</h2>
          <p className="mb-4">
            Initialize the onboarding tour using the following code snippet:
          </p>

          <pre className="bg-neutral-900 text-white p-4 rounded-lg text-sm overflow-auto">
            {`<script>
  Tour.init({
    steps: [
      { id: "step-1", target: "#hero", content: "Welcome to the product!" },
      { id: "step-2", target: "#feature-one", content: "Check this feature." },
      { id: "step-3", target: "#cta", content: "Try it out here!" }
    ]
  });
</script>`}
          </pre>
        </section>

        <section id="config" className="mb-16">
          <h2 className="text-2xl font-semibold mb-3">Configuration</h2>
          <p className="mb-4">Below are the available configuration options:</p>

          <ul className="list-disc pl-6 space-y-2">
            <li>
              <code>steps</code> — Array of tour steps (required)
            </li>
            <li>
              <code>autoStart</code> — Start the tour automatically
            </li>
            <li>
              <code>theme</code> — Light or dark theme
            </li>
            <li>
              <code>onComplete</code> — Callback when user finishes
            </li>
          </ul>
        </section>

        <section id="example" className="mb-16">
          <h2 className="text-2xl font-semibold mb-3">Example Tour</h2>

          <pre className="bg-neutral-900 text-white p-4 rounded-lg text-sm overflow-auto">
            {`Tour.init({
  autoStart: true,
  steps: [
    { id: "welcome", target: "#header", content: "Welcome to the onboarding tour!" },
    { id: "dashboard", target: "#dashboard", content: "Your dashboard lives here." }
  ]
});`}
          </pre>
        </section>

        <section id="faq" className="mb-16">
          <h2 className="text-2xl font-semibold mb-3">FAQ</h2>

          <p className="font-medium mt-4">Is the tour customizable?</p>
          <p className="opacity-80 mb-4">
            Yes, themes and animations can be modified.
          </p>

          <p className="font-medium">Can I add more than 5 steps?</p>
          <p className="opacity-80">
            Absolutely — the system supports unlimited steps.
          </p>
        </section>
      </main>
    </div>
  );
}
