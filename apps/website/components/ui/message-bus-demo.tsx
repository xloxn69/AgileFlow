"use client"

import { forwardRef, useRef } from "react"
import { AnimatedBeam } from "@/components/ui/animated-beam"
import { cn } from "@/lib/cn"

const Circle = forwardRef<
  HTMLDivElement,
  { className?: string; children?: React.ReactNode; label?: string }
>(({ className, children, label }, ref) => {
  return (
    <div className="relative flex flex-col items-center gap-2">
      <div
        ref={ref}
        className={cn(
          "z-10 flex size-12 items-center justify-center rounded-full border-2 border-[var(--border-default)] bg-white p-2.5 shadow-[0_0_20px_-12px_rgba(0,0,0,0.8)]",
          className,
        )}
      >
        {children}
      </div>
      {label && (
        <div className="absolute -bottom-7 left-1/2 -translate-x-1/2 whitespace-nowrap rounded-md border border-[var(--border-default)] bg-white px-2 py-0.5 text-[10px] font-medium text-[var(--text-muted)] shadow-sm">
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
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="2" y="3" width="20" height="14" rx="2" ry="2"/>
      <line x1="8" y1="21" x2="16" y2="21"/>
      <line x1="12" y1="17" x2="12" y2="21"/>
    </svg>
  )
}

function ServerIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="2" y="2" width="20" height="8" rx="2" ry="2"/>
      <rect x="2" y="14" width="20" height="8" rx="2" ry="2"/>
      <line x1="6" y1="6" x2="6.01" y2="6"/>
      <line x1="6" y1="18" x2="6.01" y2="18"/>
    </svg>
  )
}

function WorkflowIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
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
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M14.5 2v17.5c0 1.4-1.1 2.5-2.5 2.5s-2.5-1.1-2.5-2.5V2"/>
      <path d="M8.5 2h7"/>
      <path d="M14.5 16h-5"/>
    </svg>
  )
}

function BusIcon() {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
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

  return (
    <div
      className={cn(
        "relative flex w-full items-center justify-center overflow-hidden rounded-lg bg-gradient-to-br from-white/50 to-white/80 p-10",
        className,
      )}
      ref={containerRef}
    >
      <div className="flex size-full max-h-[200px] max-w-lg flex-col items-stretch justify-between gap-10">
        <div className="flex flex-row items-center justify-between">
          <Circle ref={agent1} label="AG-UI">
            <MonitorIcon />
          </Circle>
          <Circle ref={agent2} label="AG-API">
            <ServerIcon />
          </Circle>
        </div>
        <div className="flex flex-row items-center justify-between">
          <Circle ref={agent3} label="AG-CI">
            <WorkflowIcon />
          </Circle>
          <Circle ref={bus} className="size-16" label="Message Bus">
            <BusIcon />
          </Circle>
          <Circle ref={agent4} label="AG-QA">
            <TestTubeIcon />
          </Circle>
        </div>
      </div>

      {/* Animated beams */}
      <AnimatedBeam
        containerRef={containerRef}
        fromRef={agent1}
        toRef={bus}
        curvature={-75}
        endYOffset={-10}
        duration={5}
        delay={0}
      />
      <AnimatedBeam
        containerRef={containerRef}
        fromRef={agent2}
        toRef={bus}
        curvature={75}
        endYOffset={-10}
        duration={5}
        delay={1.25}
      />
      <AnimatedBeam
        containerRef={containerRef}
        fromRef={agent3}
        toRef={bus}
        duration={5}
        delay={2.5}
      />
      <AnimatedBeam
        containerRef={containerRef}
        fromRef={agent4}
        toRef={bus}
        duration={5}
        delay={3.75}
      />
    </div>
  )
}
