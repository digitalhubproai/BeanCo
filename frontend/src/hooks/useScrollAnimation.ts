'use client';

import React, { useEffect, useRef, RefObject, useState } from 'react';

interface UseScrollAnimationOptions {
  threshold?: number;
  rootMargin?: string;
  triggerOnce?: boolean;
}

export function useScrollAnimation(
  options: UseScrollAnimationOptions = {}
): RefObject<HTMLElement | null> {
  const { threshold = 0.1, rootMargin = '0px 0px -50px 0px', triggerOnce = true } = options;
  const ref = useRef<HTMLElement | null>(null);

  useEffect(() => {
    const element = ref.current;
    if (!element) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            element.classList.add('active');
            if (triggerOnce) {
              observer.unobserve(element);
            }
          } else if (!triggerOnce) {
            element.classList.remove('active');
          }
        });
      },
      { threshold, rootMargin }
    );

    observer.observe(element);

    return () => {
      observer.disconnect();
    };
  }, [threshold, rootMargin, triggerOnce]);

  return ref;
}

export function useScrollAnimationMultiple(
  selector: string = '.reveal, .reveal-left, .reveal-right, .reveal-scale',
  options: UseScrollAnimationOptions = {}
): RefObject<HTMLElement | null> {
  const { threshold = 0.1, rootMargin = '0px 0px -50px 0px', triggerOnce = true } = options;
  const ref = useRef<HTMLElement | null>(null);

  useEffect(() => {
    const container = ref.current;
    if (!container) return;

    const elements = container.querySelectorAll(selector);

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('active');
            if (triggerOnce) {
              observer.unobserve(entry.target);
            }
          } else if (!triggerOnce) {
            entry.target.classList.remove('active');
          }
        });
      },
      { threshold, rootMargin }
    );

    elements.forEach((el) => observer.observe(el));

    return () => {
      observer.disconnect();
    };
  }, [selector, threshold, rootMargin, triggerOnce]);

  return ref;
}

// Hook for animated counter
export function useCounterAnimation(
  end: number,
  duration: number = 2000,
  startOnView: boolean = true
): { count: number; ref: RefObject<HTMLElement | null> } {
  const ref = useRef<HTMLElement | null>(null);
  const [count, setCount] = useState(0);
  const hasAnimated = useRef(false);

  useEffect(() => {
    if (!startOnView) {
      animateCounter();
      return;
    }

    const element = ref.current;
    if (!element) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && !hasAnimated.current) {
          hasAnimated.current = true;
          animateCounter();
          observer.disconnect();
        }
      },
      { threshold: 0.5 }
    );

    observer.observe(element);

    return () => observer.disconnect();
  }, [end, duration, startOnView]);

  const animateCounter = () => {
    const startTime = performance.now();
    const startValue = 0;

    const updateCount = (currentTime: number) => {
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / duration, 1);

      // Ease out cubic
      const easedProgress = 1 - Math.pow(1 - progress, 3);
      const currentValue = Math.round(startValue + (end - startValue) * easedProgress);

      setCount(currentValue);

      if (progress < 1) {
        requestAnimationFrame(updateCount);
      }
    };

    requestAnimationFrame(updateCount);
  };

  return { count, ref };
}
