import React, { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger);
}

export const FloatingGlassShapes: React.FC = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const circleRef = useRef<HTMLDivElement>(null);
  const squareRef = useRef<HTMLDivElement>(null);
  const squircleRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!containerRef.current || !circleRef.current || !squareRef.current || !squircleRef.current) return;

    const ctx = gsap.context(() => {
      // 1. Hardware-accelerated continuous rotation
      const circleSpin = gsap.to(circleRef.current, { rotation: 360, duration: 20, repeat: -1, ease: 'none' });
      const squareSpin = gsap.to(squareRef.current, { rotation: -360, duration: 16, repeat: -1, ease: 'none' });
      const squircleSpin = gsap.to(squircleRef.current, { rotation: 360, duration: 24, repeat: -1, ease: 'none' });

      // 2. 120FPS GPU Velocity Tracker (No Tween Spamming!)
      let targetVelocity = 0;
      let currentVelocity = 0;

      // Track raw velocity on scroll
      ScrollTrigger.create({
        onUpdate: (self) => {
          targetVelocity = Math.min(Math.abs(self.getVelocity()) / 200, 4);
        },
      });

      // Use GSAP's native ticker for buttery smooth mathematical interpolation
      const tickerCallback = () => {
        // Smoothly interpolate current velocity towards target
        currentVelocity += (targetVelocity - currentVelocity) * 0.1;
        // Auto-decay target velocity back to 0
        targetVelocity += (0 - targetVelocity) * 0.05;

        // Apply timescale directly (Zero garbage collection overhead)
        const timeScale = 1 + currentVelocity;
        circleSpin.timeScale(timeScale);
        squareSpin.timeScale(timeScale);
        squircleSpin.timeScale(timeScale);

        // Optional: High-performance opacity glow based on velocity
        if (circleRef.current) {
          circleRef.current.style.opacity = `${0.8 + currentVelocity * 0.05}`;
        }
      };

      gsap.ticker.add(tickerCallback);

      // 3. Viewport-Bounded Motion Timeline (ONLY transform properties, NO zIndex/filters)
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: document.body,
          start: 'top top',
          end: 'bottom bottom',
          scrub: 1.2,
        },
      });

      // Waypoint 1: Installation Section
      tl.to(circleRef.current, { x: '35vw', y: '35vh', scale: 1.15, ease: 'power2.inOut' }, 0)
        .to(squareRef.current, { x: '-15vw', y: '30vh', scale: 0.95, ease: 'power2.inOut' }, 0)
        .to(squircleRef.current, { x: '15vw', y: '-25vh', scale: 1.05, ease: 'power2.inOut' }, 0)

      // Waypoint 2: Features Section
        .to(circleRef.current, { x: '75vw', y: '65vh', scale: 0.85, ease: 'power2.inOut' }, 1)
        .to(squareRef.current, { x: '-75vw', y: '55vh', scale: 1.2, ease: 'power2.inOut' }, 1)
        .to(squircleRef.current, { x: '55vw', y: '10vh', scale: 0.9, ease: 'power2.inOut' }, 1);

      return () => {
        gsap.ticker.remove(tickerCallback);
      };
    }, containerRef);

    return () => ctx.revert();
  }, []);

  return (
    <div ref={containerRef} className="fixed inset-0 pointer-events-none overflow-hidden z-0">
      {/* 1. Circle (Static z-20 so it always floats over, GPU optimized borders and shadows) */}
      <div
        ref={circleRef}
        className="absolute top-[10%] left-[5%] z-20 w-28 h-28 sm:w-44 sm:h-44 rounded-full bg-amber-500/10 border border-amber-400/40 shadow-[0_0_25px_rgba(208,168,44,0.15)] flex items-center justify-center opacity-80 will-change-transform transform-gpu"
      >
        <div className="w-1/2 h-1/2 rounded-full border border-amber-300/30 bg-amber-400/10" />
      </div>

      {/* 2. Square (Static z-0 behind content) */}
      <div
        ref={squareRef}
        className="absolute top-[15%] right-[5%] z-0 w-24 h-24 sm:w-36 sm:h-36 bg-slate-900/60 border border-amber-500/30 shadow-[0_0_20px_rgba(208,168,44,0.1)] opacity-70 will-change-transform transform-gpu"
      />

      {/* 3. Curved Square / Squircle (Static z-0 behind content) */}
      <div
        ref={squircleRef}
        className="absolute top-[70%] left-[5%] z-0 w-32 h-32 sm:w-48 sm:h-48 rounded-3xl bg-amber-400/10 border border-amber-400/30 shadow-[0_0_30px_rgba(208,168,44,0.15)] opacity-75 will-change-transform transform-gpu"
      />
    </div>
  );
};