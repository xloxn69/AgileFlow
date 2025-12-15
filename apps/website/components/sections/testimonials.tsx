'use client';

import { Container } from '@/components/ui/container';
import { Marquee } from '@/components/ui/marquee';
import type { LandingContent } from '@/lib/landing-content';
import { cn } from '@/lib/cn';

const TESTIMONIALS = [
  {
    quote: "AgileFlow has completely transformed how I manage my projects. The AI agents are incredibly helpful and the CLI integration is seamless.",
    name: "Sarah Chen",
    role: "Senior Software Engineer"
  },
  {
    quote: "Finally, a project management tool that actually works with my dev workflow instead of against it. The slash commands are a game-changer.",
    name: "Marcus Johnson",
    role: "Tech Lead"
  },
  {
    quote: "I was skeptical about AI-driven development tools, but AgileFlow proved me wrong. It's like having a full agile team in your terminal.",
    name: "Elena Rodriguez",
    role: "Full Stack Developer"
  },
  {
    quote: "The documentation structure and agent system make it so easy to onboard new team members. Best investment we've made this year.",
    name: "David Park",
    role: "Engineering Manager"
  },
  {
    quote: "AgileFlow's epic planning features saved me countless hours. The automated story generation is surprisingly accurate.",
    name: "Lisa Thompson",
    role: "Product Engineer"
  },
  {
    quote: "I love how it lives in my repo. No more context switching between tools. Everything I need is right there in the IDE.",
    name: "Alex Kumar",
    role: "Solo Developer"
  },
  {
    quote: "The CI/CD integration and test automation features are top-notch. Our deployment velocity has doubled since adopting AgileFlow.",
    name: "Rachel Green",
    role: "DevOps Engineer"
  },
  {
    quote: "As someone who works on multiple projects, AgileFlow's organization system keeps me sane. The folder structure just makes sense.",
    name: "Tom Williams",
    role: "Freelance Developer"
  },
  {
    quote: "The specialized agents are brilliant. Each one feels like working with an expert in that particular domain.",
    name: "Nina Patel",
    role: "Frontend Developer"
  },
  {
    quote: "AgileFlow helped our remote team stay aligned like never before. The documentation features are incredible.",
    name: "James Lee",
    role: "Remote Team Lead"
  },
  {
    quote: "I tried every agile tool out there. AgileFlow is the first one that actually fits into a developer's workflow naturally.",
    name: "Sophia Martinez",
    role: "Backend Engineer"
  },
  {
    quote: "The velocity tracking and metrics gave us insights we never had before. Data-driven decisions became so much easier.",
    name: "Chris Anderson",
    role: "Startup CTO"
  }
];

function initials(name: string) {
  const parts = name.split(' ').slice(0, 2);
  return parts.map((p) => p.slice(0, 1).toUpperCase()).join('');
}

function TestimonialCard({ quote, name, role }: { quote: string; name: string; role: string }) {
  return (
    <figure className="surface relative h-full w-full cursor-pointer overflow-hidden rounded-card p-4 shadow-tile transition-shadow hover:shadow-tileHover md:w-64">
      <blockquote className="text-sm leading-6 text-[var(--text-primary)]">&ldquo;{quote}&rdquo;</blockquote>
      <div className="mt-4 flex items-center gap-3">
        <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full border border-[var(--border-default)] bg-[var(--bg-secondary)] font-mono text-xs text-[var(--text-muted)]">
          {initials(name)}
        </div>
        <div className="flex flex-col">
          <figcaption className="text-sm font-semibold tracking-[-0.01em] text-[var(--text-primary)]">
            {name}
          </figcaption>
          <p className="text-xs font-medium text-[var(--text-muted)]">
            {role}
          </p>
        </div>
      </div>
    </figure>
  );
}

export function Testimonials({ content }: { content: LandingContent['testimonials'] }) {
  const column1 = TESTIMONIALS.slice(0, 3);
  const column2 = TESTIMONIALS.slice(3, 6);
  const column3 = TESTIMONIALS.slice(6, 9);
  const column4 = TESTIMONIALS.slice(9, 12);

  return (
    <section id="testimonials" className="scroll-mt-24 bg-dot-grid py-20 sm:py-24 md:py-28">
      <Container>
        <div className="mb-12 max-w-[70ch]">
          <h2 className="text-[28px] font-semibold tracking-[-0.02em] text-[var(--text-primary)] sm:text-[32px]">
            {content.heading}
          </h2>
          <p className="mt-3 text-[15px] leading-7 text-[var(--text-secondary)]">{content.subhead}</p>
        </div>
      </Container>

      <div className="relative flex h-[500px] w-full flex-row items-center justify-center overflow-hidden px-4">
        {/* Mobile: Single column */}
        <div className="flex md:hidden">
          <Marquee pauseOnHover vertical className="[--duration:20s]">
            {TESTIMONIALS.map((testimonial, idx) => (
              <TestimonialCard key={idx} {...testimonial} />
            ))}
          </Marquee>
        </div>

        {/* Desktop: 4 columns */}
        <div className="hidden md:flex md:flex-row">
          <Marquee reverse pauseOnHover vertical className="[--duration:20s]">
            {column1.map((testimonial, idx) => (
              <TestimonialCard key={idx} {...testimonial} />
            ))}
          </Marquee>
          <Marquee pauseOnHover vertical className="[--duration:20s]">
            {column2.map((testimonial, idx) => (
              <TestimonialCard key={idx} {...testimonial} />
            ))}
          </Marquee>
          <Marquee reverse pauseOnHover vertical className="[--duration:20s]">
            {column3.map((testimonial, idx) => (
              <TestimonialCard key={idx} {...testimonial} />
            ))}
          </Marquee>
          <Marquee pauseOnHover vertical className="[--duration:20s]">
            {column4.map((testimonial, idx) => (
              <TestimonialCard key={idx} {...testimonial} />
            ))}
          </Marquee>
        </div>
      </div>
    </section>
  );
}
