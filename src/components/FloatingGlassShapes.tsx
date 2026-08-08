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
      // 1. Initial CSS Centering
      gsap.set([circleRef.current, squareRef.current, squircleRef.current], {
        xPercent: -50,
        yPercent: -50,
        x: '0vw',
        y: '0vh',
        scale: 0,
        opacity: 0,
      });

      const circleSpin = gsap.to(circleRef.current, { rotation: 360, duration: 30, repeat: -1, ease: 'none' });
      const squareSpin = gsap.to(squareRef.current, { rotation: -360, duration: 25, repeat: -1, ease: 'none' });
      const squircleSpin = gsap.to(squircleRef.current, { rotation: 360, duration: 35, repeat: -1, ease: 'none' });

      // 2. The Welcome Explosion (Fires after preloader docks)
      const introTl = gsap.timeline({ delay: 0.8 });
      
      introTl
        .to(circleRef.current, { x: '-38vw', y: '-32vh', scale: 1, opacity: 1, duration: 2.5, ease: 'expo.out', overwrite: 'auto' }, 0)
        .to(squareRef.current, { x: '38vw', y: '-22vh', scale: 1, opacity: 1, duration: 2.5, ease: 'expo.out', overwrite: 'auto' }, 0.1)
        .to(squircleRef.current, { x: '-28vw', y: '32vh', scale: 1, opacity: 1, duration: 2.5, ease: 'expo.out', overwrite: 'auto' }, 0.2);

      // 3. Viewport-Bounded Motion Timeline
      const scrollTl = gsap.timeline({
        scrollTrigger: {
          trigger: document.body,
          start: 'top top',
          end: 'bottom bottom',
          scrub: 1.5,
        },
      });

      // Waypoint 1: Sandbox & Features
      // ✅ CHANGED: Routed them to the far outer edges (40vw+ / -40vw+) so they stay out from behind the center text!
      scrollTl.to(circleRef.current, { x: '42vw', y: '25vh', scale: 1.3, ease: 'sine.inOut' }, 0)
              .to(squareRef.current, { x: '-42vw', y: '10vh', scale: 0.85, ease: 'sine.inOut' }, 0)
              .to(squircleRef.current, { x: '30vw', y: '-35vh', scale: 1.15, ease: 'sine.inOut' }, 0)

      // Waypoint 2: Installation Section (Framing the Install Card perfectly)
              .to(circleRef.current, { x: '-36vw', y: '10vh', scale: 1.1, ease: 'sine.inOut' }, 1)
              .to(squareRef.current, { x: '36vw', y: '-5vh', scale: 1.25, ease: 'sine.inOut' }, 1)
              .to(squircleRef.current, { x: '-5vw', y: '34vh', scale: 0.9, ease: 'sine.inOut' }, 1);

      // 4. Scroll Velocity Tracker
      let targetVelocity = 0;
      let currentVelocity = 0;

      ScrollTrigger.create({
        onUpdate: (self) => {
          targetVelocity = Math.min(Math.abs(self.getVelocity()) / 200, 4);
        },
      });

      const tickerCallback = () => {
        currentVelocity += (targetVelocity - currentVelocity) * 0.1;
        targetVelocity += (0 - targetVelocity) * 0.05;

        const timeScale = 1 + currentVelocity;
        circleSpin.timeScale(timeScale);
        squareSpin.timeScale(timeScale);
        squircleSpin.timeScale(timeScale);
      };

      gsap.ticker.add(tickerCallback);

      return () => {
        gsap.ticker.remove(tickerCallback);
      };
    }, containerRef);

    return () => ctx.revert();
  }, []);

  return (
    // ✅ CHANGED: Put firmly in the background (z-0)
    <div ref={containerRef} className="fixed inset-0 pointer-events-none overflow-hidden z-0">
      
      {/* 1. Circle (Ambient glowing wireframe) */}
      <div
        ref={circleRef}
        className="absolute top-1/2 left-1/2 w-32 h-32 sm:w-48 sm:h-48 rounded-full bg-amber-500/10 border border-amber-400/30 shadow-[0_0_60px_rgba(208,168,44,0.15)] flex items-center justify-center will-change-transform transform-gpu opacity-0"
      >
        <div className="w-1/2 h-1/2 rounded-full border border-amber-400/30 bg-amber-400/5 shadow-[inset_0_0_20px_rgba(208,168,44,0.2)]" />
      </div>

      {/* 2. Square (Dark ambient body) */}
      <div
        ref={squareRef}
        className="absolute top-1/2 left-1/2 w-28 h-28 sm:w-40 sm:h-40 bg-slate-900/60 border border-amber-500/20 shadow-[0_0_50px_rgba(208,168,44,0.1)] will-change-transform transform-gpu opacity-0"
      />

      {/* 3. Curved Square / Squircle (Bright ambient glow) */}
      <div
        ref={squircleRef}
        className="absolute top-1/2 left-1/2 w-36 h-36 sm:w-52 sm:h-52 rounded-[2rem] bg-amber-400/10 border border-amber-400/25 shadow-[0_0_70px_rgba(208,168,44,0.15)] will-change-transform transform-gpu opacity-0"
      />
      
    </div>
  );
};