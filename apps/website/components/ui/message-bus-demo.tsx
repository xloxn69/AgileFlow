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
        "z-10 flex h-12 w-12 items-center justify-center rounded-full border-2 border-[var(--border-default)] bg-white p-3 shadow-[0_0_20px_-12px_rgba(0,0,0,0.8)]",
        className,
      )}
    >
      {children}
    </div>
  )
})

Circle.displayName = "Circle"

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
        "relative flex w-full items-center justify-center overflow-hidden rounded-lg bg-background p-10",
        className,
      )}
      ref={containerRef}
    >
      <div className="flex h-full w-full flex-col items-stretch justify-between gap-10">
        <div className="flex flex-row items-center justify-between">
          <Circle ref={agent1} className="h-16 w-16">
            <span className="text-xs font-semibold text-[var(--text-primary)]">AG-UI</span>
          </Circle>
          <Circle ref={agent2} className="h-16 w-16">
            <span className="text-xs font-semibold text-[var(--text-primary)]">AG-API</span>
          </Circle>
        </div>
        <div className="flex flex-row items-center justify-center">
          <Circle ref={bus} className="h-20 w-20 border-[var(--accent)]">
            <div className="text-center">
              <div className="text-[10px] font-bold text-[var(--accent)]">MESSAGE</div>
              <div className="text-[10px] font-bold text-[var(--accent)]">BUS</div>
            </div>
          </Circle>
        </div>
        <div className="flex flex-row items-center justify-between">
          <Circle ref={agent3} className="h-16 w-16">
            <span className="text-xs font-semibold text-[var(--text-primary)]">AG-CI</span>
          </Circle>
          <Circle ref={agent4} className="h-16 w-16">
            <span className="text-xs font-semibold text-[var(--text-primary)]">AG-QA</span>
          </Circle>
        </div>
      </div>

      {/* Animated beams */}
      <AnimatedBeam
        containerRef={containerRef}
        fromRef={agent1}
        toRef={bus}
        curvature={-20}
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
        curvature={20}
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
        curvature={-20}
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
        curvature={20}
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
