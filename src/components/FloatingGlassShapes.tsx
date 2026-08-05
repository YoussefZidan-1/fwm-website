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
      const circleSpin = gsap.to(circleRef.current, { rotation: 360, duration: 20, repeat: -1, ease: 'none', force3D: true });
      const squareSpin = gsap.to(squareRef.current, { rotation: -360, duration: 16, repeat: -1, ease: 'none', force3D: true });
      const squircleSpin = gsap.to(squircleRef.current, { rotation: 360, duration: 24, repeat: -1, ease: 'none', force3D: true });

      // 2. High-Fidelity Velocity Tracker (Faster scroll = Brighter Glow & Faster Spin)
      let velocityTimeout: NodeJS.Timeout;
      ScrollTrigger.create({
        onUpdate: (self) => {
          const velocity = Math.min(Math.abs(self.getVelocity()) / 250, 4);

          if (velocity > 0.1) {
            // Boost rotation speed
            gsap.to([circleSpin, squareSpin, squircleSpin], {
              timeScale: 1 + velocity,
              duration: 0.2,
              overwrite: 'auto',
            });

            // Amplify Glow & Brightness dynamically based on speed
            gsap.to([circleRef.current, squareRef.current, squircleRef.current], {
              filter: `drop-shadow(0 0 ${25 + velocity * 15}px rgba(208,168,44,${0.3 + velocity * 0.15})) brightness(${1 + velocity * 0.2})`,
              duration: 0.2,
              overwrite: 'auto',
            });

            clearTimeout(velocityTimeout);
            velocityTimeout = setTimeout(() => {
              // Smoothly decay back to normal resting state
              gsap.to([circleSpin, squareSpin, squircleSpin], { timeScale: 1, duration: 1, ease: 'power2.out' });
              gsap.to([circleRef.current, squareRef.current, squircleRef.current], {
                filter: 'drop-shadow(0 0 25px rgba(208,168,44,0.25)) brightness(1)',
                duration: 1,
                ease: 'power2.out',
              });
            }, 150);
          }
        },
      });

      // 3. Viewport-Bounded Motion Timeline
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: document.body,
          start: 'top top',
          end: 'bottom bottom',
          scrub: 1.2,
        },
      });

      // WAYPOINT 1: Installation Section (They cluster around the center)
      tl.to(circleRef.current, { x: '35vw', y: '35vh', scale: 1.15, zIndex: 30, ease: 'power2.inOut', force3D: true }, 0)
        .to(squareRef.current, { x: '-15vw', y: '30vh', scale: 0.95, zIndex: 0, ease: 'power2.inOut', force3D: true }, 0)
        .to(squircleRef.current, { x: '15vw', y: '-25vh', scale: 1.05, zIndex: 0, ease: 'power2.inOut', force3D: true }, 0)

      // WAYPOINT 2: Features Section (They spread out symmetrically, NEVER leaving the screen)
        .to(circleRef.current, { x: '75vw', y: '65vh', scale: 0.85, zIndex: 0, ease: 'power2.inOut', force3D: true }, 1)
        .to(squareRef.current, { x: '-75vw', y: '55vh', scale: 1.2, zIndex: 20, ease: 'power2.inOut', force3D: true }, 1)
        .to(squircleRef.current, { x: '55vw', y: '10vh', scale: 0.9, zIndex: 0, ease: 'power2.inOut', force3D: true }, 1);

    }, containerRef);

    return () => ctx.revert();
  }, []);

  return (
    <div ref={containerRef} className="fixed inset-0 pointer-events-none overflow-hidden z-0">
      {/* 1. Circle (Starts Top-Left) */}
      <div
        ref={circleRef}
        className="absolute top-[10%] left-[5%] w-28 h-28 sm:w-44 sm:h-44 rounded-full bg-amber-500/10 backdrop-blur-md border border-amber-400/40 shadow-[0_0_25px_rgba(208,168,44,0.25)] flex items-center justify-center opacity-80 will-change-transform transform-gpu"
      >
        <div className="w-1/2 h-1/2 rounded-full border border-amber-300/30 bg-amber-400/10 blur-[1px]" />
      </div>

      {/* 2. Square (Starts Top-Right) */}
      <div
        ref={squareRef}
        className="absolute top-[15%] right-[5%] w-24 h-24 sm:w-36 sm:h-36 bg-slate-900/30 backdrop-blur-lg border border-amber-500/30 shadow-[0_0_20px_rgba(208,168,44,0.15)] opacity-70 will-change-transform transform-gpu"
      />

      {/* 3. Curved Square / Squircle (Starts Bottom-Left) */}
      <div
        ref={squircleRef}
        className="absolute top-[70%] left-[5%] w-32 h-32 sm:w-48 sm:h-48 rounded-3xl bg-amber-400/10 backdrop-blur-md border border-amber-400/30 shadow-[0_0_30px_rgba(208,168,44,0.2)] opacity-75 will-change-transform transform-gpu"
      />
    </div>
  );
};