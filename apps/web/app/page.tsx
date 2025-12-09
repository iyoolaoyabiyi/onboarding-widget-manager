import DocumentationPreview from "@/components/landing-page/DocumentationPreview";
import Features from "@/components/landing-page/Features";
import Hero from "@/components/landing-page/Hero";
import HowItWorks from "@/components/landing-page/HowItWorks";
import TryDemo from "@/components/landing-page/TryDemo";

export default function Home() {
  return (
    <div>
      <div className="relative">
      <Hero />
      <Features />
      </div>

      <HowItWorks />
      <TryDemo />
      <DocumentationPreview />
    </div>
  );
}
