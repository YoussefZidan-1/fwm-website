import React from 'react';

export const Navbar: React.FC = () => {
  return (
    <header className="fixed top-4 left-0 right-0 z-40 flex justify-center px-4 pointer-events-none">
      {/* Outer wrapper provides the sharp lozenge border edge */}
      <div
        id="navbar-container"
        className="opacity-0 pointer-events-auto p-[1px] bg-gradient-to-r from-amber-500/40 via-amber-400/80 to-amber-500/40 shadow-[0_0_25px_rgba(208,168,44,0.2)] transition-all duration-300"
        style={{
          clipPath: 'polygon(20px 0%, calc(100% - 20px) 0%, 100% 50%, calc(100% - 20px) 100%, 20px 100%, 0% 50%)',
          width: '100%',
          maxWidth: '720px',
        }}
      >
        {/* Inner Lozenge Navbar Content */}
        <nav
          className="flex items-center justify-between px-6 py-2 bg-slate-950/95 backdrop-blur-md text-slate-200"
          style={{
            clipPath: 'polygon(20px 0%, calc(100% - 20px) 0%, 100% 50%, calc(100% - 20px) 100%, 20px 100%, 0% 50%)',
          }}
        >
          {/* Clickable Logo Slot */}
          <a
            href="/"
            aria-label="Home"
            className="relative flex items-center justify-center p-1 group transition-transform duration-300 hover:scale-115 ease-[cubic-bezier(0.34,1.56,0.64,1)] cursor-pointer"
          >
            <div
              id="navbar-logo-slot"
              className="w-10 h-10 flex items-center justify-center shrink-0 relative"
            />
          </a>

          {/* Lozenge Navigation Links with Apple-like Hover Fill */}
          <div className="flex items-center space-x-2">
            {[
              { name: 'Features', href: '#features' },
              { name: 'Physics', href: '#physics' },
              { name: 'Docs', href: '#docs' },
            ].map((link) => (
              <a
                key={link.name}
                href={link.href}
                className="relative px-4 py-1.5 font-mono text-xs uppercase tracking-wider text-slate-300 hover:text-slate-950 font-medium transition-colors duration-300 group overflow-hidden block"
                style={{
                  clipPath: 'polygon(10px 0%, calc(100% - 10px) 0%, 100% 50%, calc(100% - 10px) 100%, 10px 100%, 0% 50%)',
                }}
              >
                {/* Apple-style background fill animation */}
                <span className="absolute inset-0 bg-amber-400 translate-y-full group-hover:translate-y-0 transition-transform duration-400 ease-[cubic-bezier(0.16,1,0.3,1)]" />
                <span className="relative z-10">{link.name}</span>
              </a>
            ))}
          </div>

          {/* GitHub Action Button */}
          <a
            href="https://github.com/iluaii/fwm"
            target="_blank"
            rel="noopener noreferrer"
            className="font-mono text-xs text-slate-950 font-bold bg-amber-400 hover:bg-amber-300 px-4 py-1.5 transition-colors shadow-[0_0_10px_#d0a82c]"
            style={{
              clipPath: 'polygon(8px 0%, calc(100% - 8px) 0%, 100% 50%, calc(100% - 8px) 100%, 8px 100%, 0% 50%)',
            }}
          >
            GitHub
          </a>
        </nav>
      </div>
    </header>
  );
};