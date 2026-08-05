import React, { useState } from 'react';
import { ProximityText } from 'z-proximity-engine';

export const Hero: React.FC = () => {
  const [copied, setCopied] = useState(false);

  const copyCommand = () => {
    navigator.clipboard.writeText('./install.sh');
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <section className="relative min-h-screen flex flex-col items-center justify-center px-6 pt-28 pb-16 overflow-hidden bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-amber-500/10 via-slate-950 to-slate-950">
      {/* Soft Ambient Gold Glow */}
      <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[650px] h-[320px] bg-amber-500/10 blur-[130px] pointer-events-none rounded-full" />

      <div className="relative z-10 max-w-4xl mx-auto text-center flex flex-col items-center space-y-8">
        {/* Lozenge Tagline Badge */}
        <div
          className="inline-flex items-center space-x-2 px-4 py-1.5 bg-slate-900/90 border border-amber-500/30 text-amber-300 font-mono text-xs tracking-widest uppercase shadow-[0_0_15px_rgba(208,168,44,0.15)]"
          style={{
            clipPath: 'polygon(10px 0%, calc(100% - 10px) 0%, 100% 50%, calc(100% - 10px) 100%, 10px 100%, 0% 50%)',
          }}
        >
          <span className="w-2 h-2 bg-amber-400 rounded-full animate-pulse" />
          <span>Wayland Compositor • Box2D 3.x</span>
        </div>

        {/* Main Headline */}
        <h1 className="text-4xl sm:text-6xl md:text-7xl font-display font-light text-slate-100 tracking-tight leading-[1.15]">
          Welcome to a world where{' '}
          <span className="inline-block">
            {/* Interactive "physics" word with ZProximityEngine tiltCard and magnetic spatial response */}
            <ProximityText
              text="physics"
              preset="tiltCard-magnetic-opacity-glow"
              textClassName="font-display italic font-bold text-amber-400 px-2 cursor-pointer hover:text-amber-300 transition-colors drop-shadow-[0_0_25px_rgba(208,168,44,0.45)]"
              reach={2}
              duration={1}
              opacity={[0.7, 1]}
              glow={[0, 5]}
              ease="elastic"
              splitBy="letter"
            >
            </ProximityText>
          </span>{' '}
          is not boring anymore.
        </h1>

        {/* Subtitle */}
        <p className="font-body text-lg sm:text-xl text-slate-400 max-w-2xl font-light leading-relaxed">
          Windows behave as real physical objects with mass, momentum, inertia, and velocity. Throw windows, stack them under Earth gravity, or watch them tumble in zero-g.
        </p>

        {/* Call to Actions & Terminal Copy */}
        <div className="flex flex-col sm:flex-row items-center space-y-4 sm:space-y-0 sm:space-x-4 pt-4">
          {/* Lozenge Terminal Copy Button */}
          <button
            onClick={copyCommand}
            className="group relative flex items-center space-x-3 px-5 py-2.5 bg-slate-900/90 border border-amber-500/30 text-slate-200 font-mono text-xs hover:border-amber-400/80 transition-all cursor-pointer shadow-[0_0_20px_rgba(0,0,0,0.5)]"
            style={{
              clipPath: 'polygon(12px 0%, calc(100% - 12px) 0%, 100% 50%, calc(100% - 12px) 100%, 12px 100%, 0% 50%)',
            }}
          >
            <span className="text-amber-400">$</span>
            <span>./install.sh</span>
            <span className="text-slate-500 group-hover:text-amber-300 transition-colors ml-2">
              {copied ? '✓ copied!' : '📋'}
            </span>
          </button>

          {/* Lozenge Documentation Link */}
          <a
            href="#docs"
            className="px-6 py-2.5 bg-amber-400 text-slate-950 font-mono text-xs font-bold uppercase tracking-wider hover:bg-amber-300 transition-colors shadow-[0_0_15px_#d0a82c]"
            style={{
              clipPath: 'polygon(12px 0%, calc(100% - 12px) 0%, 100% 50%, calc(100% - 12px) 100%, 12px 100%, 0% 50%)',
            }}
          >
            Explore Docs
          </a>
        </div>
      </div>
    </section>
  );
};