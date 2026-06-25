import { useEffect, useRef } from 'react';
import anime from 'animejs';

interface ScrollRevealOptions {
  threshold?: number;
  rootMargin?: string;
  duration?: number;
  delay?: number;
  distance?: string;
  stagger?: number;
}

export function useScrollReveal(options: ScrollRevealOptions = {}) {
  const ref = useRef<HTMLDivElement>(null);
  
  const {
    threshold = 0.1,
    rootMargin = '0px',
    duration = 800,
    delay = 0,
    distance = '30px',
    stagger = 0
  } = options;

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            // Animate using animejs
            anime({
              targets: ref.current,
              translateY: [distance, 0],
              opacity: [0, 1],
              duration: duration,
              easing: 'easeOutExpo',
              delay: delay + stagger,
            });
            // Unobserve after animating once
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold, rootMargin }
    );

    if (ref.current) {
      // Set initial state
      ref.current.style.opacity = '0';
      ref.current.style.transform = `translateY(${distance})`;
      observer.observe(ref.current);
    }

    return () => {
      if (ref.current) {
        observer.unobserve(ref.current);
      }
    };
  }, [threshold, rootMargin, duration, delay, distance, stagger]);

  return ref;
}
