import React, { useEffect, useRef } from 'react';
import gsap from 'gsap';

export const Loader: React.FC = () => {
  const loaderRef = useRef<HTMLDivElement>(null);
  const percentRef = useRef<HTMLSpanElement>(null);
  const progressBarRef = useRef<HTMLDivElement>(null);
  const svgRef = useRef<SVGSVGElement>(null);

  useEffect(() => {
    if (!loaderRef.current || !percentRef.current || !progressBarRef.current || !svgRef.current) return;

    const ctx = gsap.context(() => {
      // Calculate total length for each SVG path to allow stroke drawing
      const paths = svgRef.current?.querySelectorAll('polyline, polygon');
      if (paths) {
        paths.forEach((path) => {
          const p = path as SVGGeometryElement;
          const length = p.getTotalLength ? p.getTotalLength() : 400;
          gsap.set(p, {
            strokeDasharray: length,
            strokeDashoffset: length,
          });
        });
      }

      const mainTl = gsap.timeline({ defaults: { ease: 'power2.inOut' } });
      const progressObj = { value: 0 };

      // 1. Stage 1: Draw central Monogram F/W/M
      mainTl
        .to('.mono-line', {
          strokeDashoffset: 0,
          duration: 0.8,
          stagger: 0.15,
        })
        // 2. Stage 2: Draw open chevrons/brackets
        .to(
          '.bracket-line',
          {
            strokeDashoffset: 0,
            duration: 0.6,
            stagger: 0.1,
            opacity: 1,
          },
          '-=0.3'
        )
        // 3. Stage 3: Draw hexagon badge outline
        .to(
          '.badge-polygon',
          {
            strokeDashoffset: 0,
            duration: 0.7,
            opacity: 1,
          },
          '-=0.2'
        );

      // 4. Animate percent counter (0% to 100%) and progress bar width
      gsap.to(progressObj, {
        value: 100,
        duration: 2.2,
        ease: 'power1.inOut',
        onUpdate: () => {
          if (percentRef.current) {
            percentRef.current.innerText = `${Math.floor(progressObj.value)}%`;
          }
          if (progressBarRef.current) {
            progressBarRef.current.style.width = `${progressObj.value}%`;
          }
        },
        onComplete: () => {
          const finishLoading = () => {
            gsap
              .timeline()
              .to('.loader-content', {
                scale: 0.95,
                opacity: 0,
                duration: 0.4,
                ease: 'power2.in',
              })
              .to(loaderRef.current, {
                opacity: 0,
                duration: 0.5,
                ease: 'power2.out',
                onComplete: () => {
                  if (loaderRef.current) {
                    loaderRef.current.style.display = 'none';
                  }
                },
              });
          };

          if (document.readyState === 'complete') {
            finishLoading();
          } else {
            window.addEventListener('load', finishLoading, { once: true });
          }
        },
      });
    }, loaderRef);

    return () => ctx.revert();
  }, []);

  return (
    <div
      ref={loaderRef}
      className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-slate-950 text-amber-400 select-none"
    >
      <div className="loader-content flex flex-col items-center space-y-6">
        {/* Animated SVG containing Mono, Brackets, and Badge Silhouette */}
        <div className="relative w-64 h-36 flex items-center justify-center filter drop-shadow-[0_0_20px_rgba(208,168,44,0.35)]">
          <svg
            ref={svgRef}
            xmlns="http://www.w3.org/2000/svg"
            viewBox="-4 -4 248 140"
            className="w-full h-full overflow-visible"
          >
            <g fill="none" stroke="#d0a82c" strokeWidth="6" strokeLinejoin="miter" strokeLinecap="butt">
              {/* Hexagon Badge (Stage 3) */}
              <polygon
                className="badge-polygon opacity-60"
                points="66,0 174,0 240,66 174,132 66,132 0,66"
              />

              {/* Left & Right Chevrons (Stage 2) */}
              <polyline className="bracket-line opacity-80" points="10,26 -16,66 10,106" />
              <polyline className="bracket-line opacity-80" points="230,26 256,66 230,106" />

              {/* Monogram F/W/M Ligature (Stage 1) */}
              <g transform="translate(64,13)">
                <polyline className="mono-line" points="6,96 6,10 76,10" />
                <polyline className="mono-line" points="6,46 34,46" />
                <polyline className="mono-line" points="34,46 46,96 54,62 64,96 76,10" />
                <polyline className="mono-line" points="76,10 90,54 104,14 104,96" />
              </g>
            </g>
          </svg>
        </div>

        {/* Progress Bar and Counter */}
        <div className="w-56 flex flex-col items-center space-y-2">
          <div className="w-full h-1 bg-slate-900 rounded-full overflow-hidden p-[1px] border border-amber-500/20">
            <div
              ref={progressBarRef}
              className="h-full bg-gradient-to-r from-amber-500 to-amber-300 rounded-full w-0 transition-all duration-75 shadow-[0_0_10px_#d0a82c]"
            />
          </div>

          <div className="flex items-center justify-between w-full text-xs font-mono text-amber-400/80 tracking-widest uppercase">
            <span>fwm loading</span>
            <span ref={percentRef}>0%</span>
          </div>
        </div>
      </div>
    </div>
  );
};
