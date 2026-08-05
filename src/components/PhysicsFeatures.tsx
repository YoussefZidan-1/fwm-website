import React, { useState } from 'react';
import { Proximity } from 'z-proximity-engine';
import { allFeatures } from '../data/features';

export const PhysicsFeatures: React.FC = () => {
  const [expanded, setExpanded] = useState(false);
  const visibleFeatures = expanded ? allFeatures : allFeatures.slice(0, 6);

  return (
    <section id="features" className="relative z-10 py-24 px-4 sm:px-6 max-w-5xl mx-auto flex flex-col justify-center">
      <div className="text-center mb-16 space-y-4">
        <div className="inline-flex items-center space-x-2 px-3.5 py-1 bg-amber-500/10 border border-amber-500/30 text-amber-300 font-mono text-xs uppercase tracking-widest rounded-full">
          <span>Feature Index</span>
        </div>
        <h2 className="font-display italic text-4xl sm:text-6xl font-bold text-slate-100">
          Everything <span className="text-amber-400">fwm</span> Can Do
        </h2>
      </div>

      <Proximity
        preset="tiltCard-magnetic"
        reach={1}
        duration={0.3}
        ease="power2.out"
      >
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 transition-all duration-500">
          {visibleFeatures.map((item) => (
            <div
              key={item.title}
              className="prox-item p-6 bg-slate-900/95 border border-slate-800 hover:border-amber-500/40 rounded-2xl transition-colors duration-300 shadow-xl group flex flex-col justify-between h-full will-change-transform transform-gpu"
              style={{ clipPath: 'polygon(14px 0%, calc(100% - 14px) 0%, 100% 50%, calc(100% - 14px) 100%, 14px 100%, 0% 50%)' }}
            >
              <div>
                <div className="flex items-center justify-between mb-3">
                  <span className="font-mono text-[9px] uppercase tracking-widest text-slate-400">{item.category}</span>
                  <span className="font-mono text-[10px] text-amber-400 bg-amber-500/10 px-2.5 py-0.5 rounded-full border border-amber-500/20">{item.bind}</span>
                </div>
                <h3 className="font-body text-xl font-semibold text-slate-100 mb-2 group-hover:text-amber-300 transition-colors">{item.title}</h3>
                <p className="font-body text-slate-400 text-xs leading-relaxed font-light">{item.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </Proximity>

      <div className="flex justify-center mt-12">
        <button onClick={() => setExpanded(!expanded)} className="font-mono text-xs text-slate-950 font-bold bg-amber-400 hover:bg-amber-300 px-6 py-2.5 transition-all shadow-[0_0_15px_#d0a82c] cursor-pointer uppercase tracking-wider" style={{ clipPath: 'polygon(10px 0%, calc(100% - 10px) 0%, 100% 50%, calc(100% - 10px) 100%, 10px 100%, 0% 50%)' }}>
          {expanded ? 'Show Less Features ▲' : `View All ${allFeatures.length} Features ▼`}
        </button>
      </div>
    </section>
  );
};