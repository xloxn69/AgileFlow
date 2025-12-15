"use client"

import { forwardRef, useRef } from "react"
import { AnimatedBeam } from "@/components/ui/animated-beam"
import { cn } from "@/lib/cn"

const Circle = forwardRef<
  HTMLDivElement,
  { className?: string; children?: React.ReactNode }
>(({ className, children }, ref) => {
  return (
    <div
      ref={ref}
      className={cn(
        "z-10 flex h-12 w-12 items-center justify-center rounded-full border-2 border-[var(--border-default)] bg-white p-2.5 shadow-[0_0_20px_-12px_rgba(0,0,0,0.8)]",
        className,
      )}
    >
      {children}
    </div>
  )
})

Circle.displayName = "Circle"

// Simple SVG icons
function LayoutIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="3" y="3" width="18" height="18" rx="2" ry="2"/>
      <line x1="3" y1="9" x2="21" y2="9"/>
      <line x1="9" y1="21" x2="9" y2="9"/>
    </svg>
  )
}

function DatabaseIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <ellipse cx="12" cy="5" rx="9" ry="3"/>
      <path d="M21 12c0 1.66-4 3-9 3s-9-1.34-9-3"/>
      <path d="M3 5v14c0 1.66 4 3 9 3s9-1.34 9-3V5"/>
    </svg>
  )
}

function SettingsIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="3"/>
      <path d="M12 1v6m0 6v6m9-9h-6m-6 0H3"/>
    </svg>
  )
}

function CheckCircleIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/>
      <polyline points="22 4 12 14.01 9 11.01"/>
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
        "relative flex w-full items-center justify-center p-8",
        className,
      )}
      ref={containerRef}
    >
      <div className="flex h-full w-full max-w-md flex-col items-stretch justify-between gap-8">
        <div className="flex flex-row items-center justify-between px-4">
          <Circle ref={agent1}>
            <LayoutIcon />
          </Circle>
          <Circle ref={agent2}>
            <DatabaseIcon />
          </Circle>
        </div>
        <div className="flex flex-row items-center justify-center">
          <Circle ref={bus} className="h-16 w-16 border-[var(--accent)]">
            <BusIcon />
          </Circle>
        </div>
        <div className="flex flex-row items-center justify-between px-4">
          <Circle ref={agent3}>
            <SettingsIcon />
          </Circle>
          <Circle ref={agent4}>
            <CheckCircleIcon />
          </Circle>
        </div>
      </div>

      {/* Animated beams */}
      <AnimatedBeam
        containerRef={containerRef}
        fromRef={agent1}
        toRef={bus}
        curvature={-40}
        gradientStartColor="#e8683a"
        gradientStopColor="#c15f3c"
        pathColor="#e5e7eb"
        pathWidth={2}
        duration={3}
      />
      <AnimatedBeam
        containerRef={containerRef}
        fromRef={agent2}
        toRef={bus}
        curvature={40}
        gradientStartColor="#e8683a"
        gradientStopColor="#c15f3c"
        pathColor="#e5e7eb"
        pathWidth={2}
        duration={3}
        delay={0.5}
      />
      <AnimatedBeam
        containerRef={containerRef}
        fromRef={bus}
        toRef={agent3}
        curvature={-40}
        reverse
        gradientStartColor="#e8683a"
        gradientStopColor="#c15f3c"
        pathColor="#e5e7eb"
        pathWidth={2}
        duration={3}
        delay={1}
      />
      <AnimatedBeam
        containerRef={containerRef}
        fromRef={bus}
        toRef={agent4}
        curvature={40}
        reverse
        gradientStartColor="#e8683a"
        gradientStopColor="#c15f3c"
        pathColor="#e5e7eb"
        pathWidth={2}
        duration={3}
        delay={1.5}
      />
    </div>
  )
}
