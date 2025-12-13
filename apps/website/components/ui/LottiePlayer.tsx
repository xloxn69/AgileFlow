'use client';

import { useEffect, useMemo, useRef, useState } from 'react';
import { cn } from '@/lib/cn';

type LottieAnimation = {
  destroy: () => void;
  play: () => void;
  pause: () => void;
  setSpeed: (speed: number) => void;
  goToAndStop: (value: number, isFrame: boolean) => void;
};

export function LottiePlayer({
  src,
  loop = true,
  autoplay = true,
  className,
  poster,
  hoverSpeed = 1.1,
}: {
  src: string;
  loop?: boolean;
  autoplay?: boolean;
  className?: string;
  poster?: React.ReactNode;
  hoverSpeed?: number;
}) {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const animationRef = useRef<LottieAnimation | null>(null);
  const [ready, setReady] = useState(false);

  const reducedMotion = useMemo(() => {
    if (typeof window === 'undefined') return false;
    return window.matchMedia?.('(prefers-reduced-motion: reduce)').matches ?? false;
  }, []);

  useEffect(() => {
    if (reducedMotion) return;
    const el = containerRef.current;
    if (!el) return;

    let cancelled = false;
    let observer: IntersectionObserver | undefined;

    (async () => {
      const [{ default: lottie }, response] = await Promise.all([
        import('lottie-web'),
        fetch(src),
      ]);
      if (cancelled) return;
      const animationData = await response.json();
      if (cancelled) return;

      const anim = lottie.loadAnimation({
        container: el,
        renderer: 'svg',
        loop,
        autoplay,
        animationData,
        rendererSettings: {
          progressiveLoad: true,
        },
      }) as unknown as LottieAnimation;
      animationRef.current = anim;
      setReady(true);

      observer = new IntersectionObserver(
        (entries) => {
          const entry = entries[0];
          if (!entry) return;
          if (entry.isIntersecting) anim.play();
          else anim.pause();
        },
        { threshold: 0.15 },
      );
      observer.observe(el);
    })();

    return () => {
      cancelled = true;
      observer?.disconnect();
      animationRef.current?.destroy();
      animationRef.current = null;
    };
  }, [autoplay, loop, reducedMotion, src]);

  if (reducedMotion) {
    return <div className={cn('flex items-center justify-center', className)}>{poster}</div>;
  }

  return (
    <div
      className={cn('relative', className)}
      onPointerEnter={() => animationRef.current?.setSpeed(hoverSpeed)}
      onPointerLeave={() => animationRef.current?.setSpeed(1)}
    >
      {!ready ? (
        <div className="absolute inset-0 flex items-center justify-center">{poster}</div>
      ) : null}
      <div ref={containerRef} className="h-full w-full" aria-hidden />
    </div>
  );
}

