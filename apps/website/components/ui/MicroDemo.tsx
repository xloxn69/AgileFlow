'use client';

import { motion } from 'motion/react';
import { cn } from '@/lib/cn';
import { usePrefersReducedMotion } from '@/lib/reducedMotion';

export type MicroDemoName =
  | 'heroSystemBoot'
  | 'terminalTyping'
  | 'docsTreeGrowth'
  | 'commandFlow'
  | 'kanbanToMarkdown'
  | 'adrDecision'
  | 'messageBusPulse'
  | 'velocityPlanning'
  | 'verification'
  | 'configCheck';

function ease() {
  return [0.16, 1, 0.3, 1] as const;
}

export function MicroDemo({
  name,
  className,
  speed = 1,
}: {
  name: MicroDemoName;
  className?: string;
  speed?: number;
}) {
  const reduced = usePrefersReducedMotion();
  const duration = (d: number) => (reduced ? 0 : d / Math.max(0.2, speed));

  if (name === 'terminalTyping') {
    return (
      <svg viewBox="0 0 520 160" className={cn('h-full w-full', className)} aria-hidden>
        <rect x="40" y="30" width="440" height="92" rx="18" fill="white" stroke="#E5E7EB" />
        <rect x="60" y="52" width="140" height="10" rx="5" fill="#0B0D10" opacity="0.14" />
        <rect x="60" y="74" width="220" height="10" rx="5" fill="#0B0D10" opacity="0.12" />
        <rect x="60" y="96" width="180" height="10" rx="5" fill="#0B0D10" opacity="0.12" />
        <motion.rect
          x="210"
          y="72"
          width="10"
          height="22"
          rx="4"
          fill="#0B0D10"
          animate={
            reduced
              ? {}
              : {
                  opacity: [0, 1, 0, 1, 0],
                  x: [210, 250, 330, 210],
                }
          }
          transition={{ duration: duration(2.8), ease: 'linear', repeat: reduced ? 0 : Infinity }}
        />
      </svg>
    );
  }

  if (name === 'docsTreeGrowth') {
    return (
      <svg viewBox="0 0 520 160" className={cn('h-full w-full', className)} aria-hidden>
        <rect x="70" y="80" width="380" height="2" rx="1" fill="#E5E7EB" />
        {[
          { x: 140, y: 64, w: 96, t: 0 },
          { x: 250, y: 96, w: 110, t: 0.2 },
          { x: 360, y: 64, w: 96, t: 0.4 },
        ].map((f) => (
          <motion.g
            key={f.x}
            initial={reduced ? {} : { opacity: 0, y: 10, scale: 0.98 }}
            animate={reduced ? {} : { opacity: 1, y: 0, scale: 1 }}
            transition={{
              duration: duration(0.6),
              ease: ease(),
              delay: reduced ? 0 : f.t,
              repeat: reduced ? 0 : Infinity,
              repeatDelay: reduced ? 0 : duration(1.2),
            }}
          >
            <rect x={f.x} y={f.y} width={f.w} height="44" rx="12" fill="white" stroke="#E5E7EB" />
            <rect x={f.x + 14} y={f.y + 14} width={Math.min(66, f.w - 28)} height="8" rx="4" fill="#0B0D10" opacity="0.12" />
            <rect x={f.x + 14} y={f.y + 28} width={Math.min(54, f.w - 28)} height="8" rx="4" fill="#0B0D10" opacity="0.10" />
          </motion.g>
        ))}
      </svg>
    );
  }

  if (name === 'commandFlow') {
    return (
      <svg viewBox="0 0 520 160" className={cn('h-full w-full', className)} aria-hidden>
        <rect x="70" y="80" width="380" height="2" rx="1" fill="#E5E7EB" />
        <motion.circle
          cx="70"
          cy="80"
          r="9"
          fill="#0B0D10"
          animate={reduced ? {} : { cx: [70, 260, 450, 70] }}
          transition={{ duration: duration(2.6), ease: 'linear', repeat: reduced ? 0 : Infinity }}
        />
        <circle cx="450" cy="80" r="4" fill="#0B0D10" opacity="0.25" />
      </svg>
    );
  }

  if (name === 'kanbanToMarkdown') {
    return (
      <svg viewBox="0 0 520 240" className={cn('h-full w-full', className)} aria-hidden>
        <motion.rect
          x="92"
          y="64"
          width="170"
          height="64"
          rx="14"
          fill="white"
          stroke="#E5E7EB"
          animate={reduced ? {} : { x: [92, 92, 106, 92] }}
          transition={{ duration: duration(3.2), ease: ease(), repeat: reduced ? 0 : Infinity }}
        />
        <motion.rect
          x="92"
          y="140"
          width="170"
          height="64"
          rx="14"
          fill="white"
          stroke="#E5E7EB"
          animate={reduced ? {} : { x: [92, 92, 114, 92] }}
          transition={{ duration: duration(3.2), ease: ease(), repeat: reduced ? 0 : Infinity, delay: reduced ? 0 : 0.1 }}
        />

        <rect x="290" y="102" width="170" height="88" rx="14" fill="white" stroke="#E5E7EB" />
        <motion.g
          animate={reduced ? {} : { opacity: [0, 0, 1, 1, 0] }}
          transition={{ duration: duration(3.2), ease: 'linear', repeat: reduced ? 0 : Infinity }}
        >
          <rect x="306" y="124" width="120" height="8" rx="4" fill="#0B0D10" opacity="0.14" />
          <rect x="306" y="144" width="96" height="8" rx="4" fill="#0B0D10" opacity="0.12" />
          <rect x="306" y="164" width="108" height="8" rx="4" fill="#0B0D10" opacity="0.12" />
        </motion.g>
      </svg>
    );
  }

  if (name === 'adrDecision') {
    return (
      <svg viewBox="0 0 520 200" className={cn('h-full w-full', className)} aria-hidden>
        <rect x="80" y="40" width="360" height="120" rx="18" fill="white" stroke="#E5E7EB" />
        <rect x="104" y="68" width="220" height="10" rx="5" fill="#0B0D10" opacity="0.12" />
        <rect x="104" y="92" width="260" height="10" rx="5" fill="#0B0D10" opacity="0.10" />
        <rect x="104" y="116" width="180" height="10" rx="5" fill="#0B0D10" opacity="0.10" />
        <motion.g
          initial={reduced ? {} : { opacity: 0, scale: 0.96, rotate: -10 }}
          animate={reduced ? {} : { opacity: [0, 1, 1, 0], scale: [0.96, 1, 1, 0.98], rotate: [-10, -6, -6, -10] }}
          transition={{ duration: duration(3.4), ease: ease(), repeat: reduced ? 0 : Infinity }}
          transform="translate(355 70)"
        >
          <rect x="-72" y="-18" width="144" height="40" rx="18" fill="white" stroke="#0B0D10" opacity="0.7" />
          <rect x="-56" y="-4" width="112" height="8" rx="4" fill="#0B0D10" opacity="0.2" />
        </motion.g>
      </svg>
    );
  }

  if (name === 'messageBusPulse') {
    return (
      <svg viewBox="0 0 520 200" className={cn('h-full w-full', className)} aria-hidden>
        {[
          { cx: 120, cy: 86 },
          { cx: 120, cy: 146 },
          { cx: 400, cy: 116 },
        ].map((a) => (
          <g key={`${a.cx}-${a.cy}`}>
            <circle cx={a.cx} cy={a.cy} r="20" fill="white" stroke="#E5E7EB" />
            <circle cx={a.cx} cy={a.cy} r="5" fill="#0B0D10" opacity="0.55" />
          </g>
        ))}
        <motion.circle
          cx="260"
          cy="116"
          r="46"
          fill="transparent"
          stroke="#0B0D10"
          strokeWidth="2"
          animate={reduced ? {} : { r: [28, 78], opacity: [0.22, 0] }}
          transition={{ duration: duration(2.2), ease: 'linear', repeat: reduced ? 0 : Infinity }}
        />
        <circle cx="260" cy="116" r="6" fill="#0B0D10" opacity="0.35" />
      </svg>
    );
  }

  if (name === 'velocityPlanning') {
    const bars = [
      { x: 156, d: 0.0, h: [54, 78, 62, 54] },
      { x: 226, d: 0.15, h: [72, 52, 84, 72] },
      { x: 296, d: 0.3, h: [62, 74, 58, 62] },
      { x: 366, d: 0.45, h: [84, 62, 74, 84] },
    ];
    return (
      <svg viewBox="0 0 520 200" className={cn('h-full w-full', className)} aria-hidden>
        <rect x="110" y="148" width="300" height="2" rx="1" fill="#E5E7EB" />
        {bars.map((b) => (
          <motion.rect
            key={b.x}
            x={b.x}
            y="60"
            width="40"
            height="80"
            rx="12"
            fill="#0B0D10"
            opacity="0.10"
            animate={reduced ? {} : { height: b.h, y: b.h.map((hh) => 148 - hh) }}
            transition={{ duration: duration(3.0), ease: ease(), repeat: reduced ? 0 : Infinity, delay: reduced ? 0 : b.d }}
          />
        ))}
      </svg>
    );
  }

  if (name === 'verification') {
    return (
      <svg viewBox="0 0 520 200" className={cn('h-full w-full', className)} aria-hidden>
        <rect x="110" y="68" width="300" height="64" rx="32" fill="#F3F4F6" stroke="#E5E7EB" />
        <rect x="160" y="94" width="170" height="10" rx="5" fill="#0B0D10" opacity="0.12" />
        <motion.circle
          cx="144"
          cy="100"
          r="8"
          fill="#0B0D10"
          animate={reduced ? {} : { opacity: [0.35, 0.35, 1, 1, 0.35] }}
          transition={{ duration: duration(3.2), ease: 'linear', repeat: reduced ? 0 : Infinity }}
        />
      </svg>
    );
  }

  if (name === 'configCheck') {
    return (
      <svg viewBox="0 0 128 128" className={cn('h-full w-full', className)} aria-hidden>
        <rect x="26" y="18" width="76" height="92" rx="18" fill="white" stroke="#E5E7EB" />
        <rect x="38" y="40" width="52" height="8" rx="4" fill="#0B0D10" opacity="0.12" />
        <rect x="38" y="58" width="44" height="8" rx="4" fill="#0B0D10" opacity="0.10" />
        <motion.circle
          cx="92"
          cy="92"
          r="11"
          fill="#0B0D10"
          animate={reduced ? {} : { opacity: [0.2, 0.2, 0.7, 0.2] }}
          transition={{ duration: duration(2.8), ease: 'linear', repeat: reduced ? 0 : Infinity }}
        />
      </svg>
    );
  }

  // heroSystemBoot (default)
  return (
    <svg viewBox="0 0 520 160" className={cn('h-full w-full', className)} aria-hidden>
      <rect x="50" y="80" width="420" height="2" rx="1" fill="#E5E7EB" />
      <motion.circle
        cx="70"
        cy="81"
        r="9"
        fill="#0B0D10"
        animate={reduced ? {} : { cx: [70, 170, 270, 370, 70] }}
        transition={{ duration: duration(3.2), ease: ease(), repeat: reduced ? 0 : Infinity }}
      />
      {[
        { x: 170, o: 0.22 },
        { x: 270, o: 0.18 },
        { x: 370, o: 0.22 },
      ].map((m) => (
        <circle key={m.x} cx={m.x} cy="81" r="4" fill="#0B0D10" opacity={m.o} />
      ))}
    </svg>
  );
}

