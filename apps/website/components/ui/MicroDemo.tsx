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
    const cycle = duration(5.2);
    const lineY = 86;
    const lineStart = 140;
    const lineEnd = 468;
    return (
      <svg viewBox="0 0 520 160" className={cn('h-full w-full', className)} aria-hidden>
        {/* docs folder */}
        <g opacity="0.92">
          <rect x="52" y="56" width="44" height="16" rx="8" fill="white" stroke="#E5E7EB" />
          <rect x="52" y="66" width="72" height="54" rx="14" fill="white" stroke="#E5E7EB" />
          <rect x="66" y="86" width="44" height="8" rx="4" fill="#0B0D10" opacity="0.10" />
          <rect x="66" y="102" width="34" height="8" rx="4" fill="#0B0D10" opacity="0.08" />
        </g>

        {/* baseline + progress line */}
        <path
          d={`M${lineStart} ${lineY} H${lineEnd}`}
          stroke="#E5E7EB"
          strokeWidth="2"
          strokeLinecap="round"
          fill="none"
        />
        <motion.path
          d={`M${lineStart} ${lineY} H${lineEnd}`}
          stroke="#0B0D10"
          strokeWidth="2"
          strokeLinecap="round"
          fill="none"
          opacity={0.18}
          initial={reduced ? false : { pathLength: 0, opacity: 0 }}
          animate={
            reduced
              ? { pathLength: 1, opacity: 0.18 }
              : {
                  pathLength: [0, 1, 1, 0],
                  opacity: [0, 0.18, 0.18, 0],
                }
          }
          transition={{
            duration: cycle,
            ease: 'linear',
            repeat: reduced ? 0 : Infinity,
            times: [0, 0.72, 0.9, 1],
          }}
        />

        <motion.circle
          cx={lineStart}
          cy={lineY}
          r="6"
          fill="#0B0D10"
          opacity={0.22}
          initial={reduced ? false : { opacity: 0 }}
          animate={
            reduced
              ? { opacity: 0.22, cx: lineStart, cy: lineY }
              : {
                  cx: [lineStart, lineEnd, lineEnd, lineStart],
                  opacity: [0, 0.22, 0.22, 0],
                }
          }
          transition={{
            duration: cycle,
            ease: ease(),
            repeat: reduced ? 0 : Infinity,
            times: [0, 0.72, 0.9, 1],
          }}
        />

        {/* nodes */}
        {[
          { x: 210, t: 0.24 },
          { x: 320, t: 0.44 },
          { x: 430, t: 0.64 },
        ].map((n) => (
          <g key={n.x}>
            <circle cx={n.x} cy={lineY} r="4" fill="#0B0D10" opacity="0.10" />
            <motion.circle
              cx={n.x}
              cy={lineY}
              r="8"
              fill="transparent"
              stroke="#0B0D10"
              strokeWidth="2"
              opacity={0}
              initial={reduced ? false : { opacity: 0 }}
              animate={
                reduced
                  ? {}
                  : {
                      opacity: [0, 0, 0.14, 0.14, 0],
                    }
              }
              transition={{
                duration: cycle,
                ease: 'linear',
                repeat: reduced ? 0 : Infinity,
                times: [0, n.t, n.t + 0.06, 0.86, 1],
              }}
            />
          </g>
        ))}

        {/* doc 01 */}
        <motion.g
          initial={reduced ? false : { opacity: 0, y: 10, scale: 0.98 }}
          animate={
            reduced
              ? { opacity: 1, y: 0, scale: 1 }
              : {
                  opacity: [0, 0, 1, 1, 0],
                  y: [10, 10, 0, 0, 0],
                  scale: [0.98, 0.98, 1, 1, 1],
                }
          }
          transition={{ duration: cycle, ease: ease(), repeat: reduced ? 0 : Infinity, times: [0, 0.2, 0.26, 0.86, 1] }}
        >
          <rect x="162" y="28" width="128" height="44" rx="12" fill="white" stroke="#E5E7EB" />
          <motion.rect
            x="176"
            y="42"
            width="82"
            height="8"
            rx="4"
            fill="#0B0D10"
            opacity="0.14"
            initial={reduced ? false : { width: 0 }}
            animate={reduced ? { width: 82 } : { width: [0, 0, 82, 82, 0] }}
            transition={{ duration: cycle, ease: ease(), repeat: reduced ? 0 : Infinity, times: [0, 0.28, 0.38, 0.86, 1] }}
          />
          <motion.rect
            x="176"
            y="56"
            width="62"
            height="8"
            rx="4"
            fill="#0B0D10"
            opacity="0.10"
            initial={reduced ? false : { width: 0 }}
            animate={reduced ? { width: 62 } : { width: [0, 0, 62, 62, 0] }}
            transition={{ duration: cycle, ease: ease(), repeat: reduced ? 0 : Infinity, times: [0, 0.32, 0.44, 0.86, 1] }}
          />
          <motion.rect
            x="176"
            y="38"
            width="7"
            height="18"
            rx="3.5"
            fill="#0B0D10"
            opacity={0}
            initial={reduced ? false : { opacity: 0 }}
            animate={reduced ? {} : { opacity: [0, 0, 1, 0, 1, 0] }}
            transition={{ duration: cycle, ease: 'linear', repeat: reduced ? 0 : Infinity, times: [0, 0.34, 0.38, 0.5, 0.54, 1] }}
          />
        </motion.g>

        {/* ADR */}
        <motion.g
          initial={reduced ? false : { opacity: 0, y: 10, scale: 0.98 }}
          animate={
            reduced
              ? { opacity: 1, y: 0, scale: 1 }
              : {
                  opacity: [0, 0, 1, 1, 0],
                  y: [10, 10, 0, 0, 0],
                  scale: [0.98, 0.98, 1, 1, 1],
                }
          }
          transition={{ duration: cycle, ease: ease(), repeat: reduced ? 0 : Infinity, times: [0, 0.38, 0.44, 0.86, 1] }}
        >
          <rect x="256" y="96" width="156" height="44" rx="12" fill="white" stroke="#E5E7EB" />
          <rect x="270" y="106" width="34" height="14" rx="7" fill="#0B0D10" opacity="0.08" />
          <motion.rect
            x="314"
            y="108"
            width="76"
            height="8"
            rx="4"
            fill="#0B0D10"
            opacity="0.12"
            initial={reduced ? false : { width: 0 }}
            animate={reduced ? { width: 76 } : { width: [0, 0, 76, 76, 0] }}
            transition={{ duration: cycle, ease: ease(), repeat: reduced ? 0 : Infinity, times: [0, 0.48, 0.6, 0.86, 1] }}
          />
          <motion.rect
            x="270"
            y="126"
            width="98"
            height="8"
            rx="4"
            fill="#0B0D10"
            opacity="0.10"
            initial={reduced ? false : { width: 0 }}
            animate={reduced ? { width: 98 } : { width: [0, 0, 98, 98, 0] }}
            transition={{ duration: cycle, ease: ease(), repeat: reduced ? 0 : Infinity, times: [0, 0.52, 0.66, 0.86, 1] }}
          />
          <motion.rect
            x="270"
            y="118"
            width="7"
            height="18"
            rx="3.5"
            fill="#0B0D10"
            opacity={0}
            initial={reduced ? false : { opacity: 0 }}
            animate={reduced ? {} : { opacity: [0, 0, 1, 0, 1, 0] }}
            transition={{ duration: cycle, ease: 'linear', repeat: reduced ? 0 : Infinity, times: [0, 0.56, 0.6, 0.72, 0.76, 1] }}
          />
        </motion.g>

        {/* doc 02 */}
        <motion.g
          initial={reduced ? false : { opacity: 0, y: 10, scale: 0.98 }}
          animate={
            reduced
              ? { opacity: 1, y: 0, scale: 1 }
              : {
                  opacity: [0, 0, 1, 1, 0],
                  y: [10, 10, 0, 0, 0],
                  scale: [0.98, 0.98, 1, 1, 1],
                }
          }
          transition={{ duration: cycle, ease: ease(), repeat: reduced ? 0 : Infinity, times: [0, 0.56, 0.62, 0.86, 1] }}
        >
          <rect x="372" y="28" width="128" height="44" rx="12" fill="white" stroke="#E5E7EB" />
          <motion.rect
            x="386"
            y="42"
            width="74"
            height="8"
            rx="4"
            fill="#0B0D10"
            opacity="0.14"
            initial={reduced ? false : { width: 0 }}
            animate={reduced ? { width: 74 } : { width: [0, 0, 74, 74, 0] }}
            transition={{ duration: cycle, ease: ease(), repeat: reduced ? 0 : Infinity, times: [0, 0.66, 0.78, 0.86, 1] }}
          />
          <motion.rect
            x="386"
            y="56"
            width="54"
            height="8"
            rx="4"
            fill="#0B0D10"
            opacity="0.10"
            initial={reduced ? false : { width: 0 }}
            animate={reduced ? { width: 54 } : { width: [0, 0, 54, 54, 0] }}
            transition={{ duration: cycle, ease: ease(), repeat: reduced ? 0 : Infinity, times: [0, 0.7, 0.82, 0.86, 1] }}
          />
          <motion.rect
            x="386"
            y="38"
            width="7"
            height="18"
            rx="3.5"
            fill="#0B0D10"
            opacity={0}
            initial={reduced ? false : { opacity: 0 }}
            animate={reduced ? {} : { opacity: [0, 0, 1, 0, 1, 0] }}
            transition={{ duration: cycle, ease: 'linear', repeat: reduced ? 0 : Infinity, times: [0, 0.72, 0.76, 0.86, 0.9, 1] }}
          />
        </motion.g>
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
    const cycle = duration(4.8);
    return (
      <svg viewBox="0 0 520 240" className={cn('h-full w-full', className)} aria-hidden>
        {/* epic */}
        <rect x="60" y="40" width="230" height="58" rx="16" fill="white" stroke="#E5E7EB" />
        <rect x="78" y="58" width="120" height="10" rx="5" fill="#0B0D10" opacity="0.14" />
        <rect x="78" y="76" width="168" height="10" rx="5" fill="#0B0D10" opacity="0.10" />

        {/* breakdown rails */}
        <path d="M88 98 V212" stroke="#E5E7EB" strokeWidth="2" strokeLinecap="round" />
        {[124, 162, 200].map((y) => (
          <path key={y} d={`M88 ${y} H104`} stroke="#E5E7EB" strokeWidth="2" strokeLinecap="round" />
        ))}

        {/* stories */}
        {[
          { y: 110, t: 0.18 },
          { y: 148, t: 0.24 },
          { y: 186, t: 0.3 },
        ].map((s, idx) => (
          <motion.g
            key={s.y}
            initial={reduced ? {} : { opacity: 0, y: 12 }}
            animate={
              reduced
                ? {}
                : {
                    opacity: [0, 0, 1, 1, 0],
                    y: [12, 12, 0, 0, 0],
                  }
            }
            transition={{
              duration: cycle,
              ease: ease(),
              repeat: reduced ? 0 : Infinity,
              times: [0, s.t, s.t + 0.06, 0.86, 1],
            }}
          >
            <rect x="104" y={s.y} width="186" height="34" rx="14" fill="white" stroke="#E5E7EB" />
            <rect x="122" y={s.y + 12} width={idx === 1 ? 124 : 106} height="10" rx="5" fill="#0B0D10" opacity="0.12" />
          </motion.g>
        ))}

        {/* selected story */}
        <motion.rect
          x="104"
          y="148"
          width="186"
          height="34"
          rx="14"
          fill="transparent"
          stroke="#0B0D10"
          strokeWidth="2"
          opacity={0.18}
          initial={reduced ? {} : { opacity: 0 }}
          animate={reduced ? {} : { opacity: [0, 0, 0.18, 0.18, 0] }}
          transition={{ duration: cycle, ease: 'linear', repeat: reduced ? 0 : Infinity, times: [0, 0.3, 0.44, 0.84, 1] }}
        />

        {/* arrow to markdown */}
        <path d="M290 70 H312" stroke="#E5E7EB" strokeWidth="2" strokeLinecap="round" />
        <motion.path
          d="M290 70 C304 70 304 118 312 118"
          stroke="#0B0D10"
          strokeWidth="2"
          strokeLinecap="round"
          fill="none"
          opacity={0.2}
          initial={reduced ? {} : { pathLength: 0, opacity: 0 }}
          animate={reduced ? {} : { pathLength: [0, 1, 1], opacity: [0, 0.2, 0] }}
          transition={{ duration: cycle, ease: 'linear', repeat: reduced ? 0 : Infinity, times: [0, 0.55, 1] }}
        />
        <path d="M312 118 l10 -6 v12 z" fill="#0B0D10" opacity="0.12" />

        {/* markdown story file */}
        <rect x="320" y="44" width="150" height="182" rx="16" fill="white" stroke="#E5E7EB" />
        <rect x="338" y="64" width="92" height="10" rx="5" fill="#0B0D10" opacity="0.14" />
        <rect x="338" y="86" width="112" height="8" rx="4" fill="#0B0D10" opacity="0.10" />

        {/* Acceptance criteria lines (Given/When/Then) */}
        {[
          { y: 112, w: 118, t: 0.58 },
          { y: 132, w: 104, t: 0.66 },
          { y: 152, w: 110, t: 0.74 },
        ].map((l) => (
          <g key={l.y}>
            <motion.circle
              cx="342"
              cy={l.y + 4}
              r="2.5"
              fill="#0B0D10"
              opacity={0.18}
              initial={reduced ? {} : { opacity: 0 }}
              animate={reduced ? {} : { opacity: [0, 0, 0.18, 0.18, 0] }}
              transition={{ duration: cycle, ease: 'linear', repeat: reduced ? 0 : Infinity, times: [0, l.t, l.t + 0.05, 0.88, 1] }}
            />
            <motion.rect
              x="350"
              y={l.y}
              width={l.w}
              height="8"
              rx="4"
              fill="#0B0D10"
              opacity="0.12"
              initial={reduced ? {} : { width: 0 }}
              animate={reduced ? {} : { width: [0, l.w, l.w, 0] }}
              transition={{ duration: cycle, ease: ease(), repeat: reduced ? 0 : Infinity, times: [0, l.t + 0.06, 0.88, 1] }}
            />
          </g>
        ))}

        <motion.rect
          x="350"
          y="110"
          width="8"
          height="18"
          rx="4"
          fill="#0B0D10"
          opacity={0}
          initial={reduced ? {} : { opacity: 0 }}
          animate={reduced ? {} : { opacity: [0, 0, 1, 0, 1, 0] }}
          transition={{ duration: cycle, ease: 'linear', repeat: reduced ? 0 : Infinity, times: [0, 0.58, 0.62, 0.72, 0.76, 1] }}
        />
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
    const cycle = duration(4.2);
    const lineD = 'M110 126 L162 102 L214 118 L266 90 L318 108';
    const dotX = [110, 162, 214, 266, 318, 110];
    const dotY = [126, 102, 118, 90, 108, 126];
    const cards = [
      { y: 118, t: 0.56 },
      { y: 96, t: 0.62 },
      { y: 74, t: 0.68 },
    ];
    return (
      <svg viewBox="0 0 520 200" className={cn('h-full w-full', className)} aria-hidden>
        {/* chart axes */}
        <path d="M110 152 H320" stroke="#E5E7EB" strokeWidth="2" strokeLinecap="round" />
        <path d="M110 60 V152" stroke="#E5E7EB" strokeWidth="2" strokeLinecap="round" />
        <path d="M110 124 H320" stroke="#E5E7EB" strokeWidth="2" strokeLinecap="round" opacity="0.55" />
        <path d="M110 96 H320" stroke="#E5E7EB" strokeWidth="2" strokeLinecap="round" opacity="0.55" />

        {/* capacity line */}
        <motion.path
          d="M110 96 H320"
          stroke="#0B0D10"
          strokeWidth="2"
          strokeLinecap="round"
          strokeDasharray="6 8"
          opacity={0.14}
          initial={reduced ? {} : { opacity: 0 }}
          animate={reduced ? {} : { opacity: [0, 0.14, 0.14, 0] }}
          transition={{ duration: cycle, ease: 'linear', repeat: reduced ? 0 : Infinity, times: [0, 0.34, 0.84, 1] }}
        />

        {/* velocity line */}
        <path d={lineD} stroke="#0B0D10" strokeWidth="2" strokeLinecap="round" fill="none" opacity="0.08" />
        <motion.path
          d={lineD}
          stroke="#0B0D10"
          strokeWidth="2"
          strokeLinecap="round"
          fill="none"
          opacity={0.22}
          initial={reduced ? {} : { pathLength: 0, opacity: 0 }}
          animate={reduced ? {} : { pathLength: [0, 1, 1], opacity: [0, 0.22, 0] }}
          transition={{ duration: cycle, ease: 'linear', repeat: reduced ? 0 : Infinity, times: [0, 0.52, 1] }}
        />
        <motion.circle
          cx={dotX[0]}
          cy={dotY[0]}
          r="6"
          fill="#0B0D10"
          opacity={0.22}
          animate={reduced ? {} : { cx: dotX, cy: dotY, opacity: [0, 0.22, 0.22, 0.22, 0.22, 0] }}
          transition={{ duration: cycle, ease: ease(), repeat: reduced ? 0 : Infinity, times: [0, 0.52, 0.62, 0.72, 0.84, 1] }}
        />

        {/* sprint container */}
        <rect x="350" y="64" width="120" height="88" rx="18" fill="white" stroke="#E5E7EB" />
        <path d="M364 96 H456" stroke="#0B0D10" strokeWidth="2" strokeLinecap="round" strokeDasharray="6 8" opacity="0.10" />
        {cards.map((c) => (
          <motion.rect
            key={c.y}
            x="366"
            width="88"
            height="18"
            rx="9"
            fill="#0B0D10"
            opacity={0.08}
            initial={reduced ? {} : { y: 168, opacity: 0 }}
            animate={
              reduced
                ? { y: c.y }
                : {
                    y: [168, 168, c.y, c.y, c.y],
                    opacity: [0, 0, 0.08, 0.08, 0],
                  }
            }
            transition={{
              duration: cycle,
              ease: ease(),
              repeat: reduced ? 0 : Infinity,
              times: [0, c.t, c.t + 0.06, 0.86, 1],
            }}
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
