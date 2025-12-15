"use client"

import { forwardRef, useRef } from "react"
import { AnimatedBeam } from "@/components/ui/animated-beam"
import { cn } from "@/lib/cn"

const Circle = forwardRef<
  HTMLDivElement,
  { className?: string; children?: React.ReactNode; label?: string }
>(({ className, children, label }, ref) => {
  return (
    <div className="relative flex flex-col items-center gap-1.5">
      <div
        ref={ref}
        className={cn(
          "z-10 flex size-9 items-center justify-center rounded-full border-2 border-[var(--border-default)] bg-white p-1.5 shadow-[0_0_20px_-12px_rgba(0,0,0,0.8)]",
          className,
        )}
      >
        {children}
      </div>
      {label && (
        <div className="absolute -bottom-6 left-1/2 -translate-x-1/2 whitespace-nowrap rounded-md border border-[var(--border-default)] bg-white px-1.5 py-0.5 text-[9px] font-medium text-[var(--text-muted)] shadow-sm">
          {label}
        </div>
      )}
    </div>
  )
})

Circle.displayName = "Circle"

// Better SVG icons
function MonitorIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="2" y="3" width="20" height="14" rx="2" ry="2"/>
      <line x1="8" y1="21" x2="16" y2="21"/>
      <line x1="12" y1="17" x2="12" y2="21"/>
    </svg>
  )
}

function ServerIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="2" y="2" width="20" height="8" rx="2" ry="2"/>
      <rect x="2" y="14" width="20" height="8" rx="2" ry="2"/>
      <line x1="6" y1="6" x2="6.01" y2="6"/>
      <line x1="6" y1="18" x2="6.01" y2="18"/>
    </svg>
  )
}

function WorkflowIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="8" y="8" width="8" height="8" rx="2"/>
      <path d="M4 8V6a2 2 0 0 1 2-2h2"/>
      <path d="M4 16v2a2 2 0 0 0 2 2h2"/>
      <path d="M16 4h2a2 2 0 0 1 2 2v2"/>
      <path d="M16 20h2a2 2 0 0 0 2-2v-2"/>
    </svg>
  )
}

function TestTubeIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M14.5 2v17.5c0 1.4-1.1 2.5-2.5 2.5s-2.5-1.1-2.5-2.5V2"/>
      <path d="M8.5 2h7"/>
      <path d="M14.5 16h-5"/>
    </svg>
  )
}

function PaletteIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="13.5" cy="6.5" r=".5" fill="currentColor"/>
      <circle cx="17.5" cy="10.5" r=".5" fill="currentColor"/>
      <circle cx="8.5" cy="7.5" r=".5" fill="currentColor"/>
      <circle cx="6.5" cy="12.5" r=".5" fill="currentColor"/>
      <path d="M12 2C6.5 2 2 6.5 2 12s4.5 10 10 10c.926 0 1.648-.746 1.648-1.688 0-.437-.18-.835-.437-1.125-.29-.289-.438-.652-.438-1.125a1.64 1.64 0 0 1 1.668-1.668h1.996c3.051 0 5.555-2.503 5.555-5.554C21.965 6.012 17.461 2 12 2z"/>
    </svg>
  )
}

function RocketIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M4.5 16.5c-1.5 1.26-2 5-2 5s3.74-.5 5-2c.71-.84.7-2.13-.09-2.91a2.18 2.18 0 0 0-2.91-.09z"/>
      <path d="m12 15-3-3a22 22 0 0 1 2-3.95A12.88 12.88 0 0 1 22 2c0 2.72-.78 7.5-6 11a22.35 22.35 0 0 1-4 2z"/>
      <path d="M9 12H4s.55-3.03 2-4c1.62-1.08 5 0 5 0"/>
      <path d="M12 15v5s3.03-.55 4-2c1.08-1.62 0-5 0-5"/>
    </svg>
  )
}

function DatabaseIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <ellipse cx="12" cy="5" rx="9" ry="3"/>
      <path d="M3 5V19A9 3 0 0 0 21 19V5"/>
      <path d="M3 12A9 3 0 0 0 21 12"/>
    </svg>
  )
}

function BusIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M8 6v6"/>
      <path d="M15 6v6"/>
      <path d="M2 12h19.6"/>
      <path d="M18 18h3s.5-1.7.8-2.8c.1-.4.2-.8.2-1.2 0-.4-.1-.8-.2-1.2l-1.4-5C20.1 6.8 19.1 6 18 6H4a2 2 0 0 0-2 2v10h3"/>
      <circle cx="7" cy="18" r="2"/>
      <circle cx="16" cy="18" r="2"/>
    </svg>
  )
}

export function MessageBusDemo({ className }: { className?: string }) {
  const containerRef = useRef<HTMLDivElement>(null)
  const bus = useRef<HTMLDivElement>(null)
  const agent1 = useRef<HTMLDivElement>(null)
  const agent2 = useRef<HTMLDivElement>(null)
  const agent3 = useRef<HTMLDivElement>(null)
  const agent4 = useRef<HTMLDivElement>(null)
  const agent5 = useRef<HTMLDivElement>(null)
  const agent6 = useRef<HTMLDivElement>(null)
  const agent7 = useRef<HTMLDivElement>(null)

  return (
    <div
      className={cn(
        "relative flex h-[300px] w-full items-center justify-center overflow-hidden rounded-lg bg-gradient-to-br from-white/50 to-white/80 p-8",
        className,
      )}
      ref={containerRef}
    >
      <div className="relative flex size-full items-center justify-center">
        {/* Central bus */}
        <Circle ref={bus} className="size-12" label="Message Bus">
          <BusIcon />
        </Circle>

        {/* Top left */}
        <div className="absolute left-[5%] top-[8%]">
          <Circle ref={agent1} label="AG-UI">
            <MonitorIcon />
          </Circle>
        </div>

        {/* Top center */}
        <div className="absolute left-1/2 top-[2%] -translate-x-1/2">
          <Circle ref={agent2} label="AG-API">
            <ServerIcon />
          </Circle>
        </div>

        {/* Top right */}
        <div className="absolute right-[5%] top-[8%]">
          <Circle ref={agent3} label="AG-DESIGN">
            <PaletteIcon />
          </Circle>
        </div>

        {/* Left */}
        <div className="absolute left-[2%] top-1/2 -translate-y-1/2">
          <Circle ref={agent4} label="AG-CI">
            <WorkflowIcon />
          </Circle>
        </div>

        {/* Right */}
        <div className="absolute right-[2%] top-1/2 -translate-y-1/2">
          <Circle ref={agent5} label="AG-QA">
            <TestTubeIcon />
          </Circle>
        </div>

        {/* Bottom left */}
        <div className="absolute bottom-[8%] left-[8%]">
          <Circle ref={agent6} label="AG-DEVOPS">
            <RocketIcon />
          </Circle>
        </div>

        {/* Bottom right */}
        <div className="absolute bottom-[8%] right-[8%]">
          <Circle ref={agent7} label="AG-DB">
            <DatabaseIcon />
          </Circle>
        </div>
      </div>

      {/* Animated beams */}
      <AnimatedBeam
        containerRef={containerRef}
        fromRef={agent1}
        toRef={bus}
        curvature={-50}
        duration={5}
        delay={0}
      />
      <AnimatedBeam
        containerRef={containerRef}
        fromRef={agent2}
        toRef={bus}
        duration={5}
        delay={0.7}
      />
      <AnimatedBeam
        containerRef={containerRef}
        fromRef={agent3}
        toRef={bus}
        curvature={50}
        duration={5}
        delay={1.4}
      />
      <AnimatedBeam
        containerRef={containerRef}
        fromRef={agent4}
        toRef={bus}
        curvature={-50}
        duration={5}
        delay={2.1}
      />
      <AnimatedBeam
        containerRef={containerRef}
        fromRef={agent5}
        toRef={bus}
        duration={5}
        delay={2.8}
      />
      <AnimatedBeam
        containerRef={containerRef}
        fromRef={agent6}
        toRef={bus}
        duration={5}
        delay={3.5}
      />
      <AnimatedBeam
        containerRef={containerRef}
        fromRef={agent7}
        toRef={bus}
        curvature={50}
        duration={5}
        delay={4.2}
      />
    </div>
  )
}
