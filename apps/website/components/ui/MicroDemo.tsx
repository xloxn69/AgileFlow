'use client';

import { motion } from 'framer-motion';
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
    const cycle = duration(4.2);
    const promptX = 60;
    const cmdChars = 'npx agileflow';
    return (
      <svg viewBox="0 0 520 160" className={cn('h-full w-full', className)} aria-hidden>
        {/* Terminal window */}
        <rect x="40" y="24" width="440" height="112" rx="16" fill="white" stroke="#E5E7EB" />

        {/* Terminal header bar */}
        <rect x="40" y="24" width="440" height="28" rx="16" fill="#F9FAFB" />
        <rect x="40" y="40" width="440" height="12" fill="#F9FAFB" />
        <path d="M40 52 H480" stroke="#E5E7EB" strokeWidth="1" />
        {/* Traffic lights */}
        <circle cx="60" cy="38" r="5" fill="#FCA5A5" />
        <circle cx="78" cy="38" r="5" fill="#FCD34D" />
        <circle cx="96" cy="38" r="5" fill="#86EFAC" />

        {/* Prompt symbol */}
        <text
          x={promptX}
          y="82"
          fontSize="13"
          fontWeight="600"
          fill="#9CA3AF"
          style={{ fontFamily: 'ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace' }}
        >
          $
        </text>

        {/* Command text that types out */}
        <motion.text
          x={promptX + 18}
          y="82"
          fontSize="13"
          fontWeight="500"
          fill="#374151"
          style={{ fontFamily: 'ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace' }}
          initial={reduced ? {} : { opacity: 0 }}
          animate={reduced ? {} : { opacity: [0, 1, 1, 0] }}
          transition={{ duration: cycle, ease: 'linear', repeat: reduced ? 0 : Infinity, times: [0, 0.04, 0.72, 0.78] }}
        >
          <motion.tspan
            initial={reduced ? {} : { opacity: 0 }}
            animate={reduced ? {} : { opacity: [0, 0, 1, 1, 0] }}
            transition={{ duration: cycle, ease: 'linear', repeat: reduced ? 0 : Infinity, times: [0, 0.06, 0.08, 0.72, 0.78] }}
          >
            n
          </motion.tspan>
          <motion.tspan
            initial={reduced ? {} : { opacity: 0 }}
            animate={reduced ? {} : { opacity: [0, 0, 1, 1, 0] }}
            transition={{ duration: cycle, ease: 'linear', repeat: reduced ? 0 : Infinity, times: [0, 0.10, 0.12, 0.72, 0.78] }}
          >
            p
          </motion.tspan>
          <motion.tspan
            initial={reduced ? {} : { opacity: 0 }}
            animate={reduced ? {} : { opacity: [0, 0, 1, 1, 0] }}
            transition={{ duration: cycle, ease: 'linear', repeat: reduced ? 0 : Infinity, times: [0, 0.14, 0.16, 0.72, 0.78] }}
          >
            x
          </motion.tspan>
          <motion.tspan
            initial={reduced ? {} : { opacity: 0 }}
            animate={reduced ? {} : { opacity: [0, 0, 1, 1, 0] }}
            transition={{ duration: cycle, ease: 'linear', repeat: reduced ? 0 : Infinity, times: [0, 0.18, 0.20, 0.72, 0.78] }}
          >
            {' '}
          </motion.tspan>
          <motion.tspan
            fill="#e8683a"
            fontWeight="600"
            initial={reduced ? {} : { opacity: 0 }}
            animate={reduced ? {} : { opacity: [0, 0, 1, 1, 0] }}
            transition={{ duration: cycle, ease: 'linear', repeat: reduced ? 0 : Infinity, times: [0, 0.22, 0.24, 0.72, 0.78] }}
          >
            a
          </motion.tspan>
          <motion.tspan
            fill="#e8683a"
            fontWeight="600"
            initial={reduced ? {} : { opacity: 0 }}
            animate={reduced ? {} : { opacity: [0, 0, 1, 1, 0] }}
            transition={{ duration: cycle, ease: 'linear', repeat: reduced ? 0 : Infinity, times: [0, 0.25, 0.27, 0.72, 0.78] }}
          >
            g
          </motion.tspan>
          <motion.tspan
            fill="#e8683a"
            fontWeight="600"
            initial={reduced ? {} : { opacity: 0 }}
            animate={reduced ? {} : { opacity: [0, 0, 1, 1, 0] }}
            transition={{ duration: cycle, ease: 'linear', repeat: reduced ? 0 : Infinity, times: [0, 0.28, 0.30, 0.72, 0.78] }}
          >
            i
          </motion.tspan>
          <motion.tspan
            fill="#e8683a"
            fontWeight="600"
            initial={reduced ? {} : { opacity: 0 }}
            animate={reduced ? {} : { opacity: [0, 0, 1, 1, 0] }}
            transition={{ duration: cycle, ease: 'linear', repeat: reduced ? 0 : Infinity, times: [0, 0.31, 0.33, 0.72, 0.78] }}
          >
            l
          </motion.tspan>
          <motion.tspan
            fill="#e8683a"
            fontWeight="600"
            initial={reduced ? {} : { opacity: 0 }}
            animate={reduced ? {} : { opacity: [0, 0, 1, 1, 0] }}
            transition={{ duration: cycle, ease: 'linear', repeat: reduced ? 0 : Infinity, times: [0, 0.34, 0.36, 0.72, 0.78] }}
          >
            e
          </motion.tspan>
          <motion.tspan
            fill="#e8683a"
            fontWeight="600"
            initial={reduced ? {} : { opacity: 0 }}
            animate={reduced ? {} : { opacity: [0, 0, 1, 1, 0] }}
            transition={{ duration: cycle, ease: 'linear', repeat: reduced ? 0 : Infinity, times: [0, 0.37, 0.39, 0.72, 0.78] }}
          >
            f
          </motion.tspan>
          <motion.tspan
            fill="#e8683a"
            fontWeight="600"
            initial={reduced ? {} : { opacity: 0 }}
            animate={reduced ? {} : { opacity: [0, 0, 1, 1, 0] }}
            transition={{ duration: cycle, ease: 'linear', repeat: reduced ? 0 : Infinity, times: [0, 0.40, 0.42, 0.72, 0.78] }}
          >
            l
          </motion.tspan>
          <motion.tspan
            fill="#e8683a"
            fontWeight="600"
            initial={reduced ? {} : { opacity: 0 }}
            animate={reduced ? {} : { opacity: [0, 0, 1, 1, 0] }}
            transition={{ duration: cycle, ease: 'linear', repeat: reduced ? 0 : Infinity, times: [0, 0.43, 0.45, 0.72, 0.78] }}
          >
            o
          </motion.tspan>
          <motion.tspan
            fill="#e8683a"
            fontWeight="600"
            initial={reduced ? {} : { opacity: 0 }}
            animate={reduced ? {} : { opacity: [0, 0, 1, 1, 0] }}
            transition={{ duration: cycle, ease: 'linear', repeat: reduced ? 0 : Infinity, times: [0, 0.46, 0.48, 0.72, 0.78] }}
          >
            w
          </motion.tspan>
        </motion.text>

        {/* Blinking cursor */}
        <motion.rect
          x={promptX + 18}
          y="70"
          width="8"
          height="16"
          rx="2"
          fill="#0B0D10"
          initial={reduced ? {} : { x: promptX + 18, opacity: 0 }}
          animate={
            reduced
              ? {}
              : {
                  x: [promptX + 18, promptX + 26, promptX + 34, promptX + 42, promptX + 50, promptX + 58, promptX + 66, promptX + 74, promptX + 82, promptX + 90, promptX + 98, promptX + 106, promptX + 114, promptX + 114],
                  opacity: [0.6, 0.6, 0.6, 0.6, 0.6, 0.6, 0.6, 0.6, 0.6, 0.6, 0.6, 0.6, 0.6, 0],
                }
          }
          transition={{
            duration: cycle,
            ease: 'linear',
            repeat: reduced ? 0 : Infinity,
            times: [0, 0.08, 0.12, 0.16, 0.20, 0.27, 0.30, 0.33, 0.36, 0.39, 0.42, 0.45, 0.48, 0.52],
          }}
        />

        {/* Output line - "Setting up..." */}
        <motion.text
          x={promptX}
          y="106"
          fontSize="12"
          fill="#6B7280"
          style={{ fontFamily: 'ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace' }}
          initial={reduced ? {} : { opacity: 0 }}
          animate={reduced ? {} : { opacity: [0, 0, 1, 1, 0] }}
          transition={{ duration: cycle, ease: 'linear', repeat: reduced ? 0 : Infinity, times: [0, 0.54, 0.58, 0.72, 0.78] }}
        >
          Setting up AgileFlow...
        </motion.text>

        {/* Success checkmark */}
        <motion.g
          initial={reduced ? {} : { opacity: 0, scale: 0.8 }}
          animate={
            reduced
              ? {}
              : {
                  opacity: [0, 0, 1, 1, 0],
                  scale: [0.8, 0.8, 1, 1, 1],
                }
          }
          transition={{ duration: cycle, ease: ease(), repeat: reduced ? 0 : Infinity, times: [0, 0.62, 0.68, 0.88, 0.94] }}
        >
          <circle cx="450" cy="96" r="16" fill="#DCFCE7" stroke="#86EFAC" />
          <motion.path
            d="M442 96 l5 5 l10 -10"
            stroke="#16A34A"
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
            fill="none"
            initial={reduced ? {} : { pathLength: 0 }}
            animate={reduced ? {} : { pathLength: [0, 0, 1, 1, 0] }}
            transition={{ duration: cycle, ease: ease(), repeat: reduced ? 0 : Infinity, times: [0, 0.66, 0.72, 0.88, 0.94] }}
          />
        </motion.g>
      </svg>
    );
  }

  if (name === 'docsTreeGrowth') {
    const cycle = duration(5.0);
    const folders = [
      { y: 48, label: '03-decisions', t: 0.08 },
      { y: 74, label: '05-epics', t: 0.18 },
      { y: 100, label: '06-stories', t: 0.28 },
      { y: 126, label: '09-agents', t: 0.38 },
    ];
    return (
      <svg viewBox="0 0 520 160" className={cn('h-full w-full', className)} aria-hidden>
        {/* Root docs/ folder */}
        <g>
          <rect x="52" y="36" width="44" height="16" rx="8" fill="white" stroke="#E5E7EB" />
          <rect x="52" y="46" width="72" height="96" rx="14" fill="white" stroke="#E5E7EB" />
          <text
            x="88"
            y="86"
            textAnchor="middle"
            dominantBaseline="middle"
            fontSize="9"
            fontWeight="600"
            letterSpacing="0.04em"
            fill="#9CA3AF"
            style={{ fontFamily: 'ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace' }}
          >
            docs/
          </text>
        </g>

        {/* Vertical tree line */}
        <path d="M148 56 V136" stroke="#E5E7EB" strokeWidth="2" strokeLinecap="round" />

        {/* Horizontal branches */}
        {folders.map((f) => (
          <path key={f.y} d={`M148 ${f.y + 6} H168`} stroke="#E5E7EB" strokeWidth="2" strokeLinecap="round" />
        ))}

        {/* Folder entries appearing */}
        {folders.map((f, idx) => (
          <motion.g
            key={f.y}
            initial={reduced ? {} : { opacity: 0, x: -8 }}
            animate={
              reduced
                ? { opacity: 1, x: 0 }
                : {
                    opacity: [0, 0, 1, 1, 0],
                    x: [-8, -8, 0, 0, 0],
                  }
            }
            transition={{ duration: cycle, ease: ease(), repeat: reduced ? 0 : Infinity, times: [0, f.t, f.t + 0.08, 0.88, 1] }}
          >
            <rect x="172" y={f.y} width={120 + idx * 8} height="24" rx="8" fill="white" stroke="#E5E7EB" />
            <text
              x="184"
              y={f.y + 13}
              dominantBaseline="middle"
              fontSize="10"
              fontWeight="500"
              fill="#6B7280"
              style={{ fontFamily: 'ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace' }}
            >
              {f.label}/
            </text>
          </motion.g>
        ))}

        {/* Animated progress indicator along tree */}
        <motion.circle
          cx="148"
          cy="56"
          r="5"
          fill="#0B0D10"
          opacity={0.25}
          initial={reduced ? {} : { cy: 56, opacity: 0 }}
          animate={
            reduced
              ? {}
              : {
                  cy: [56, 56, 80, 106, 132, 132],
                  opacity: [0, 0.25, 0.25, 0.25, 0.25, 0],
                }
          }
          transition={{ duration: cycle, ease: ease(), repeat: reduced ? 0 : Infinity, times: [0, 0.08, 0.24, 0.38, 0.52, 0.62] }}
        />

        {/* File preview card */}
        <motion.g
          initial={reduced ? {} : { opacity: 0, y: 12, scale: 0.96 }}
          animate={
            reduced
              ? { opacity: 1, y: 0, scale: 1 }
              : {
                  opacity: [0, 0, 1, 1, 0],
                  y: [12, 12, 0, 0, 0],
                  scale: [0.96, 0.96, 1, 1, 1],
                }
          }
          transition={{ duration: cycle, ease: ease(), repeat: reduced ? 0 : Infinity, times: [0, 0.52, 0.62, 0.88, 1] }}
        >
          <rect x="340" y="36" width="140" height="88" rx="14" fill="white" stroke="#E5E7EB" />
          <rect x="356" y="52" width="72" height="8" rx="4" fill="#0B0D10" opacity="0.14" />
          <motion.rect
            x="356"
            y="68"
            width="108"
            height="6"
            rx="3"
            fill="#0B0D10"
            opacity="0.10"
            initial={reduced ? {} : { width: 0 }}
            animate={reduced ? {} : { width: [0, 0, 108, 108, 0] }}
            transition={{ duration: cycle, ease: ease(), repeat: reduced ? 0 : Infinity, times: [0, 0.64, 0.74, 0.88, 1] }}
          />
          <motion.rect
            x="356"
            y="80"
            width="82"
            height="6"
            rx="3"
            fill="#0B0D10"
            opacity="0.08"
            initial={reduced ? {} : { width: 0 }}
            animate={reduced ? {} : { width: [0, 0, 82, 82, 0] }}
            transition={{ duration: cycle, ease: ease(), repeat: reduced ? 0 : Infinity, times: [0, 0.68, 0.78, 0.88, 1] }}
          />
          <motion.rect
            x="356"
            y="92"
            width="94"
            height="6"
            rx="3"
            fill="#0B0D10"
            opacity="0.08"
            initial={reduced ? {} : { width: 0 }}
            animate={reduced ? {} : { width: [0, 0, 94, 94, 0] }}
            transition={{ duration: cycle, ease: ease(), repeat: reduced ? 0 : Infinity, times: [0, 0.72, 0.82, 0.88, 1] }}
          />
          <motion.rect
            x="356"
            y="104"
            width="64"
            height="6"
            rx="3"
            fill="#0B0D10"
            opacity="0.06"
            initial={reduced ? {} : { width: 0 }}
            animate={reduced ? {} : { width: [0, 0, 64, 64, 0] }}
            transition={{ duration: cycle, ease: ease(), repeat: reduced ? 0 : Infinity, times: [0, 0.76, 0.84, 0.88, 1] }}
          />
          {/* Cursor */}
          <motion.rect
            x="356"
            y="66"
            width="5"
            height="12"
            rx="2.5"
            fill="#0B0D10"
            opacity={0}
            initial={reduced ? {} : { opacity: 0 }}
            animate={reduced ? {} : { opacity: [0, 0, 1, 0, 1, 0] }}
            transition={{ duration: cycle, ease: 'linear', repeat: reduced ? 0 : Infinity, times: [0, 0.66, 0.70, 0.78, 0.82, 1] }}
          />
        </motion.g>

        {/* Connecting arrow */}
        <motion.path
          d="M310 86 H328"
          stroke="#0B0D10"
          strokeWidth="2"
          strokeLinecap="round"
          fill="none"
          opacity={0}
          initial={reduced ? {} : { pathLength: 0, opacity: 0 }}
          animate={reduced ? {} : { pathLength: [0, 0, 1, 1, 0], opacity: [0, 0, 0.18, 0.18, 0] }}
          transition={{ duration: cycle, ease: ease(), repeat: reduced ? 0 : Infinity, times: [0, 0.54, 0.62, 0.88, 1] }}
        />
        <motion.path
          d="M328 86 l8 -5 v10 z"
          fill="#0B0D10"
          opacity={0}
          initial={reduced ? {} : { opacity: 0 }}
          animate={reduced ? {} : { opacity: [0, 0, 0.18, 0.18, 0] }}
          transition={{ duration: cycle, ease: 'linear', repeat: reduced ? 0 : Infinity, times: [0, 0.58, 0.62, 0.88, 1] }}
        />
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
    const cycle = duration(5.6);
    return (
      <svg viewBox="0 0 520 200" className={cn('h-full w-full', className)} aria-hidden>
        {/* ADR document */}
        <rect x="60" y="32" width="180" height="136" rx="16" fill="white" stroke="#E5E7EB" />
        <rect x="78" y="50" width="32" height="14" rx="7" fill="#0B0D10" opacity="0.08" />
        <text
          x="94"
          y="60"
          textAnchor="middle"
          dominantBaseline="middle"
          fontSize="8"
          fontWeight="600"
          letterSpacing="0.08em"
          fill="#6B7280"
          style={{ fontFamily: 'ui-sans-serif, system-ui, -apple-system, Segoe UI, Roboto, Helvetica, Arial' }}
        >
          ADR
        </text>
        <rect x="118" y="52" width="100" height="10" rx="5" fill="#0B0D10" opacity="0.14" />
        <rect x="78" y="76" width="140" height="8" rx="4" fill="#0B0D10" opacity="0.08" />

        {/* Decision section label */}
        <rect x="78" y="96" width="56" height="8" rx="4" fill="#0B0D10" opacity="0.12" />

        {/* Decision line that gets written */}
        <motion.rect
          x="78"
          y="114"
          width="138"
          height="8"
          rx="4"
          fill="#0B0D10"
          opacity="0.14"
          initial={reduced ? {} : { width: 0 }}
          animate={reduced ? {} : { width: [0, 0, 138, 138, 0] }}
          transition={{ duration: cycle, ease: ease(), repeat: reduced ? 0 : Infinity, times: [0, 0.62, 0.78, 0.92, 1] }}
        />
        <motion.rect
          x="78"
          y="130"
          width="106"
          height="8"
          rx="4"
          fill="#0B0D10"
          opacity="0.10"
          initial={reduced ? {} : { width: 0 }}
          animate={reduced ? {} : { width: [0, 0, 106, 106, 0] }}
          transition={{ duration: cycle, ease: ease(), repeat: reduced ? 0 : Infinity, times: [0, 0.68, 0.82, 0.92, 1] }}
        />

        {/* Typing cursor */}
        <motion.rect
          x="78"
          y="110"
          width="6"
          height="16"
          rx="3"
          fill="#0B0D10"
          opacity={0}
          initial={reduced ? {} : { opacity: 0 }}
          animate={reduced ? {} : { opacity: [0, 0, 1, 0, 1, 0] }}
          transition={{ duration: cycle, ease: 'linear', repeat: reduced ? 0 : Infinity, times: [0, 0.64, 0.68, 0.76, 0.8, 1] }}
        />

        {/* Options container */}
        <rect x="272" y="32" width="188" height="136" rx="16" fill="white" stroke="#E5E7EB" />
        <rect x="290" y="50" width="68" height="10" rx="5" fill="#0B0D10" opacity="0.12" />

        {/* Option A - gets selected */}
        <motion.g
          initial={reduced ? {} : { opacity: 0, x: 10 }}
          animate={
            reduced
              ? { opacity: 1, x: 0 }
              : {
                  opacity: [0, 0, 1, 1, 0],
                  x: [10, 10, 0, 0, 0],
                }
          }
          transition={{ duration: cycle, ease: ease(), repeat: reduced ? 0 : Infinity, times: [0, 0.08, 0.16, 0.92, 1] }}
        >
          <rect x="290" y="72" width="152" height="28" rx="10" fill="white" stroke="#E5E7EB" />
          <rect x="306" y="82" width="68" height="8" rx="4" fill="#0B0D10" opacity="0.12" />
          {/* Selection indicator */}
          <motion.rect
            x="290"
            y="72"
            width="152"
            height="28"
            rx="10"
            fill="transparent"
            stroke="#0B0D10"
            strokeWidth="2"
            opacity={0}
            initial={reduced ? {} : { opacity: 0 }}
            animate={reduced ? {} : { opacity: [0, 0, 0, 0.5, 0.5, 0] }}
            transition={{ duration: cycle, ease: 'linear', repeat: reduced ? 0 : Infinity, times: [0, 0.36, 0.44, 0.52, 0.88, 1] }}
          />
          {/* Checkmark */}
          <motion.path
            d="M426 82 l5 5 l9 -9"
            stroke="#0B0D10"
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
            fill="none"
            opacity={0}
            initial={reduced ? {} : { pathLength: 0, opacity: 0 }}
            animate={reduced ? {} : { pathLength: [0, 0, 0, 1, 1, 0], opacity: [0, 0, 0, 0.6, 0.6, 0] }}
            transition={{ duration: cycle, ease: ease(), repeat: reduced ? 0 : Infinity, times: [0, 0.44, 0.48, 0.56, 0.88, 1] }}
          />
        </motion.g>

        {/* Option B - not selected, fades */}
        <motion.g
          initial={reduced ? {} : { opacity: 0, x: 10 }}
          animate={
            reduced
              ? { opacity: 0.5 }
              : {
                  opacity: [0, 0, 1, 0.35, 0.35, 0],
                  x: [10, 10, 0, 0, 0, 0],
                }
          }
          transition={{ duration: cycle, ease: ease(), repeat: reduced ? 0 : Infinity, times: [0, 0.14, 0.22, 0.52, 0.88, 1] }}
        >
          <rect x="290" y="108" width="152" height="28" rx="10" fill="white" stroke="#E5E7EB" />
          <rect x="306" y="118" width="92" height="8" rx="4" fill="#0B0D10" opacity="0.10" />
        </motion.g>

        {/* Option C - not selected, fades */}
        <motion.g
          initial={reduced ? {} : { opacity: 0, x: 10 }}
          animate={
            reduced
              ? { opacity: 0.5 }
              : {
                  opacity: [0, 0, 1, 0.35, 0.35, 0],
                  x: [10, 10, 0, 0, 0, 0],
                }
          }
          transition={{ duration: cycle, ease: ease(), repeat: reduced ? 0 : Infinity, times: [0, 0.2, 0.28, 0.52, 0.88, 1] }}
        >
          <rect x="290" y="144" width="114" height="20" rx="10" fill="white" stroke="#E5E7EB" />
          <rect x="306" y="150" width="54" height="8" rx="4" fill="#0B0D10" opacity="0.10" />
        </motion.g>

        {/* Arrow from selected option to document */}
        <motion.path
          d="M280 86 C258 86 258 122 248 122"
          stroke="#0B0D10"
          strokeWidth="2"
          strokeLinecap="round"
          fill="none"
          opacity={0}
          initial={reduced ? {} : { pathLength: 0, opacity: 0 }}
          animate={reduced ? {} : { pathLength: [0, 0, 0, 1, 1, 0], opacity: [0, 0, 0, 0.25, 0.25, 0] }}
          transition={{ duration: cycle, ease: ease(), repeat: reduced ? 0 : Infinity, times: [0, 0.52, 0.56, 0.64, 0.88, 1] }}
        />
        <motion.path
          d="M248 122 l-8 -5 v10 z"
          fill="#0B0D10"
          opacity={0}
          initial={reduced ? {} : { opacity: 0 }}
          animate={reduced ? {} : { opacity: [0, 0, 0, 0.25, 0.25, 0] }}
          transition={{ duration: cycle, ease: 'linear', repeat: reduced ? 0 : Infinity, times: [0, 0.56, 0.6, 0.64, 0.88, 1] }}
        />
      </svg>
    );
  }

  if (name === 'messageBusPulse') {
    const cycle = duration(4.0);
    const agents = [
      { cx: 100, cy: 70, label: 'A1' },
      { cx: 100, cy: 130, label: 'A2' },
      { cx: 420, cy: 70, label: 'A3' },
      { cx: 420, cy: 130, label: 'A4' },
    ];
    const hubX = 260;
    const hubY = 100;
    return (
      <svg viewBox="0 0 520 200" className={cn('h-full w-full', className)} aria-hidden>
        {/* Connection lines from agents to hub */}
        {agents.map((a) => (
          <path
            key={`line-${a.cx}-${a.cy}`}
            d={`M${a.cx} ${a.cy} L${hubX} ${hubY}`}
            stroke="#E5E7EB"
            strokeWidth="2"
            strokeLinecap="round"
            fill="none"
          />
        ))}

        {/* Animated connection pulses */}
        {agents.map((a, idx) => (
          <motion.circle
            key={`pulse-${a.cx}-${a.cy}`}
            cx={a.cx}
            cy={a.cy}
            r="4"
            fill="#0B0D10"
            opacity={0}
            initial={reduced ? {} : { cx: a.cx, cy: a.cy, opacity: 0 }}
            animate={
              reduced
                ? {}
                : {
                    cx: [a.cx, a.cx, hubX, hubX, a.cx],
                    cy: [a.cy, a.cy, hubY, hubY, a.cy],
                    opacity: [0, 0.35, 0.35, 0, 0],
                  }
            }
            transition={{
              duration: cycle,
              ease: ease(),
              repeat: reduced ? 0 : Infinity,
              times: [0, idx * 0.08 + 0.02, idx * 0.08 + 0.22, idx * 0.08 + 0.28, 1],
              delay: idx * 0.15,
            }}
          />
        ))}

        {/* Return pulses from hub to agents */}
        {agents.map((a, idx) => (
          <motion.circle
            key={`return-${a.cx}-${a.cy}`}
            cx={hubX}
            cy={hubY}
            r="3"
            fill="#e8683a"
            opacity={0}
            initial={reduced ? {} : { cx: hubX, cy: hubY, opacity: 0 }}
            animate={
              reduced
                ? {}
                : {
                    cx: [hubX, hubX, a.cx, a.cx, hubX],
                    cy: [hubY, hubY, a.cy, a.cy, hubY],
                    opacity: [0, 0.5, 0.5, 0, 0],
                  }
            }
            transition={{
              duration: cycle,
              ease: ease(),
              repeat: reduced ? 0 : Infinity,
              times: [0, 0.45 + idx * 0.06, 0.60 + idx * 0.06, 0.68 + idx * 0.06, 1],
            }}
          />
        ))}

        {/* Agent nodes */}
        {agents.map((a) => (
          <g key={`agent-${a.cx}-${a.cy}`}>
            <circle cx={a.cx} cy={a.cy} r="22" fill="white" stroke="#E5E7EB" strokeWidth="1.5" />
            <circle cx={a.cx} cy={a.cy} r="8" fill="#0B0D10" opacity="0.12" />
            <text
              x={a.cx}
              y={a.cy + 1}
              textAnchor="middle"
              dominantBaseline="middle"
              fontSize="8"
              fontWeight="600"
              fill="#9CA3AF"
              style={{ fontFamily: 'ui-sans-serif, system-ui, -apple-system, Segoe UI, Roboto, Helvetica, Arial' }}
            >
              {a.label}
            </text>
          </g>
        ))}

        {/* Central hub */}
        <motion.circle
          cx={hubX}
          cy={hubY}
          r="32"
          fill="transparent"
          stroke="#0B0D10"
          strokeWidth="2"
          opacity={0.08}
          animate={reduced ? {} : { r: [28, 44], opacity: [0.15, 0] }}
          transition={{ duration: duration(2.0), ease: 'linear', repeat: reduced ? 0 : Infinity }}
        />
        <circle cx={hubX} cy={hubY} r="28" fill="white" stroke="#E5E7EB" strokeWidth="1.5" />
        <circle cx={hubX} cy={hubY} r="10" fill="#0B0D10" opacity="0.18" />

        {/* Hub activity indicator */}
        <motion.circle
          cx={hubX}
          cy={hubY}
          r="6"
          fill="#e8683a"
          opacity={0.35}
          animate={reduced ? {} : { opacity: [0.2, 0.5, 0.2], scale: [1, 1.15, 1] }}
          transition={{ duration: duration(1.2), ease: 'easeInOut', repeat: reduced ? 0 : Infinity }}
        />

        {/* Bus label */}
        <text
          x={hubX}
          y={hubY + 52}
          textAnchor="middle"
          fontSize="10"
          fontWeight="500"
          fill="#9CA3AF"
          style={{ fontFamily: 'ui-sans-serif, system-ui, -apple-system, Segoe UI, Roboto, Helvetica, Arial' }}
        >
          message bus
        </text>
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
