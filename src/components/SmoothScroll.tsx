import React, { useEffect } from 'react';
import Lenis from 'lenis';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger);
}

export const SmoothScroll: React.FC = () => {
  useEffect(() => {
    // 1. Initialize Lenis
    const lenis = new Lenis({
      duration: 1.2,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      touchMultiplier: 2,
    });

    // 2. Notify ScrollTrigger on every Lenis scroll tick
    lenis.on('scroll', ScrollTrigger.update);

    // 3. Drive Lenis RAF directly using GSAP's internal ticker (Single unified clock)
    const updateLenis = (time: number) => {
      lenis.raf(time * 1000); // GSAP provides time in seconds, Lenis expects ms
    };

    gsap.ticker.add(updateLenis);

    // 4. Disable GSAP lagSmoothing so scroll animations stay 1:1 in sync
    gsap.ticker.lagSmoothing(0);

    // 5. Clean up ticker and Lenis on unmount
    return () => {
      gsap.ticker.remove(updateLenis);
      lenis.destroy();
    };
  }, []);

  return null;
};