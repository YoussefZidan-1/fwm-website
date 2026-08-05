import React from 'react';

export const InstallSection: React.FC = () => {
  return (
    <section id="docs" className="relative z-10 pt-2 pb-16 px-4 sm:px-6 max-w-4xl mx-auto text-center">
      <div className="bg-slate-900/90 backdrop-blur-md border border-amber-500/30 p-8 sm:p-10 rounded-3xl shadow-2xl space-y-6">
        <h2 className="font-display italic text-3xl sm:text-5xl font-bold text-amber-400">
          Ready to experience fwm?
        </h2>
        <p className="font-body text-slate-300 text-base sm:text-lg max-w-xl mx-auto font-light">
          One command installs dependencies (pacman / apt / dnf / xbps), builds Box2D v3, compiles fwm, and registers the session.
        </p>

        <div className="bg-slate-950 border border-slate-800 p-4 rounded-xl font-mono text-xs sm:text-sm text-left text-amber-300/90 overflow-x-auto space-y-1">
          <p className="text-slate-500"># Clone & install fwm session</p>
          <p><span className="text-amber-500">$</span> git clone https://github.com/iluaii/fwm.git</p>
          <p><span className="text-amber-500">$</span> cd fwm</p>
          <p><span className="text-amber-500">$</span> ./install.sh</p>
        </div>
      </div>
    </section>
  );
};