import { Footer } from '@/components/Footer';
import { Header } from '@/components/Header';
import { Hero } from '@/components/Hero';
import { HowItWorks } from '@/components/HowItWorks';
import { BentoFeatures } from '@/components/BentoFeatures';
import { WorkflowDemo } from '@/components/WorkflowDemo';
import { Integrations } from '@/components/Integrations';
import { TestimonialsCarousel } from '@/components/TestimonialsCarousel';
import { Pricing } from '@/components/Pricing';
import { FAQ } from '@/components/FAQ';
import { FinalCTA } from '@/components/FinalCTA';
import { ProofStrip } from '@/components/ProofStrip';
import { ScrollDepthTracker } from '@/components/ScrollDepthTracker';
import { AmbientGridDriver } from '@/components/AmbientGridDriver';

export default function Page() {
  return (
    <div className="relative">
      <AmbientGridDriver />
      <ScrollDepthTracker />
      <Header />
      <main>
        <Hero />
        <ProofStrip />
        <HowItWorks />
        <BentoFeatures />
        <WorkflowDemo />
        <Integrations />
        <TestimonialsCarousel />
        <Pricing />
        <FAQ />
        <FinalCTA />
      </main>
      <Footer />
    </div>
  );
}

