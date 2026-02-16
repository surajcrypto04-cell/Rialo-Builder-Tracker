'use client';

import { useEffect, useState } from 'react';

export function useCountUp(
  target: number,
  duration: number = 1500,
  shouldStart: boolean = true
) {
  const [count, setCount] = useState(0);

  useEffect(() => {
    if (!shouldStart || target === 0) {
      if (shouldStart) setCount(target);
      return;
    }

    let startTime: number | null = null;
    let animationFrame: number;

    const animate = (currentTime: number) => {
      if (!startTime) startTime = currentTime;
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / duration, 1);

      // Ease out cubic
      const eased = 1 - Math.pow(1 - progress, 3);
      setCount(Math.floor(eased * target));

      if (progress < 1) {
        animationFrame = requestAnimationFrame(animate);
      } else {
        setCount(target);
      }
    };

    animationFrame = requestAnimationFrame(animate);

    return () => cancelAnimationFrame(animationFrame);
  }, [target, duration, shouldStart]);

  return count;
}