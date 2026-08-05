import React, { useEffect, useRef } from 'react';
import gsap from 'gsap';

export const Loader: React.FC = () => {
  const loaderOverlayRef = useRef<HTMLDivElement>(null);
  const logoWrapperRef = useRef<HTMLDivElement>(null);
  const progressContainerRef = useRef<HTMLDivElement>(null);
  const percentRef = useRef<HTMLSpanElement>(null);
  const progressBarRef = useRef<HTMLDivElement>(null);
  const svgRef = useRef<SVGSVGElement>(null);

  useEffect(() => {
    if (
      !loaderOverlayRef.current ||
      !logoWrapperRef.current ||
      !progressContainerRef.current ||
      !percentRef.current ||
      !progressBarRef.current ||
      !svgRef.current
    )
      return;

    const ctx = gsap.context(() => {
      // Setup path stroke lengths for drawing
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

      // 1. Draw SVG Logo Layers (Mono -> Brackets -> Badge)
      mainTl
        .to('.mono-line', {
          strokeDashoffset: 0,
          duration: 0.8,
          stagger: 0.15,
        })
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
        .to(
          '.badge-polygon',
          {
            strokeDashoffset: 0,
            duration: 0.7,
            opacity: 1,
          },
          '-=0.2'
        );

      // 2. Animate progress bar & percentage counter
      gsap.to(progressObj, {
        value: 100,
        duration: 2.0,
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
          const performDocking = () => {
            const targetSlot = document.getElementById('navbar-logo-slot');
            const navContainer = document.getElementById('navbar-container');

            // Fade out loading bar and text
            gsap.to(progressContainerRef.current, {
              opacity: 0,
              y: 10,
              duration: 0.3,
            });

            // Fade out black background overlay
            gsap.to(loaderOverlayRef.current, {
              opacity: 0,
              duration: 0.6,
              onComplete: () => {
                if (loaderOverlayRef.current) {
                  loaderOverlayRef.current.style.pointerEvents = 'none';
                }
              },
            });

            // Reveal Lozenge Navbar
            if (navContainer) {
              gsap.to(navContainer, {
                opacity: 1,
                duration: 0.5,
                delay: 0.1,
              });
            }

            // Calculate exact position delta to dock Logo into Navbar slot
            if (targetSlot && logoWrapperRef.current) {
              const targetRect = targetSlot.getBoundingClientRect();
              const logoRect = logoWrapperRef.current.getBoundingClientRect();

              const deltaX =
                targetRect.left + targetRect.width / 2 - (logoRect.left + logoRect.width / 2);
              const deltaY =
                targetRect.top + targetRect.height / 2 - (logoRect.top + logoRect.height / 2);

              // Elastic spring animation into the navbar slot!
              gsap.to(logoWrapperRef.current, {
                x: deltaX,
                y: deltaY,
                scale: 0.28,
                duration: 1.3,
                ease: 'elastic.out(1, 0.75)',
              });
            }
          };

          if (document.readyState === 'complete') {
            performDocking();
          } else {
            window.addEventListener('load', performDocking, { once: true });
          }
        },
      });
    });

    return () => ctx.revert();
  }, []);

  return (
    <>
      {/* Background Overlay */}
      <div
        ref={loaderOverlayRef}
        className="fixed inset-0 z-50 bg-slate-950 flex flex-col items-center justify-center select-none"
      />

      {/* Logo Wrapper (Fixed layer so it can animate anywhere on screen) */}
      <div className="fixed inset-0 z-50 pointer-events-none flex items-center justify-center">
        <div
          ref={logoWrapperRef}
          className="relative w-64 h-36 flex items-center justify-center filter drop-shadow-[0_0_20px_rgba(208,168,44,0.35)]"
        >
          <svg
            ref={svgRef}
            xmlns="http://www.w3.org/2000/svg"
            viewBox="-4 -4 248 140"
            className="w-full h-full overflow-visible"
          >
            <g fill="none" stroke="#d0a82c" strokeWidth="6" strokeLinejoin="miter" strokeLinecap="butt">
              <polygon className="badge-polygon opacity-60" points="66,0 174,0 240,66 174,132 66,132 0,66" />
              <polyline className="bracket-line opacity-80" points="10,26 -16,66 10,106" />
              <polyline className="bracket-line opacity-80" points="230,26 256,66 230,106" />
              <g transform="translate(64,13)">
                <polyline className="mono-line" points="6,96 6,10 76,10" />
                <polyline className="mono-line" points="6,46 34,46" />
                <polyline className="mono-line" points="34,46 46,96 54,62 64,96 76,10" />
                <polyline className="mono-line" points="76,10 90,54 104,14 104,96" />
              </g>
            </g>
          </svg>
        </div>

        {/* Progress Container */}
        <div
          ref={progressContainerRef}
          className="absolute bottom-1/3 flex flex-col items-center space-y-2 w-56"
        >
          <div className="w-full h-1 bg-slate-900 rounded-full overflow-hidden p-[1px] border border-amber-500/20">
            <div
              ref={progressBarRef}
              className="h-full bg-gradient-to-r from-amber-500 to-amber-300 rounded-full w-0 shadow-[0_0_10px_#d0a82c]"
            />
          </div>

          <div className="flex items-center justify-between w-full text-xs font-mono text-amber-400/80 tracking-widest uppercase">
            <span>fwm loading</span>
            <span ref={percentRef}>0%</span>
          </div>
        </div>
      </div>
    </>
  );
};