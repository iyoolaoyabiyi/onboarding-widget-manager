import DocumentationPreview from "@/components/landing-page/DocumentationPreview";
import Features from "@/components/landing-page/Features";
import Footer from "@/components/Footer";
import Hero from "@/components/landing-page/Hero";
import HowItWorks from "@/components/landing-page/HowItWorks";
import Navbar from "@/components/Navbar";
import TryDemo from "@/components/landing-page/TryDemo";

export default function Home() {
  return (
    <div>
      <Hero />
      <Features />
      <HowItWorks />
      <TryDemo />
      <DocumentationPreview />
    </div>
  );
}
