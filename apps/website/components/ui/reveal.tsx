'use client';

import { motion, useReducedMotion } from 'framer-motion';
import { cn } from '@/lib/cn';
import { MOTION } from '@/lib/motion';

export function Reveal({
  className,
  delay = 0,
  ...props
}: React.ComponentProps<typeof motion.div> & { delay?: number }) {
  const prefersReducedMotion = useReducedMotion();

  if (prefersReducedMotion) {
    return <div className={className}>{props.children as React.ReactNode}</div>;
  }

  return (
    <motion.div
      className={cn(className)}
      initial={{ opacity: 0, y: 10 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ ...MOTION.reveal, delay }}
      viewport={{ once: true, margin: '-50px' }}
      {...props}
    />
  );
}
