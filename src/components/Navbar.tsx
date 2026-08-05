import React from 'react';

export const Navbar: React.FC = () => {
  const handleNavClick = (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
    if (href.startsWith('#')) {
      e.preventDefault();
      const target = document.querySelector(href);
      if (target) {
        target.scrollIntoView({ behavior: 'smooth' });
      }
    }
  };

  return (
    <header className="fixed top-3 sm:top-4 left-0 right-0 z-40 flex justify-center px-2 sm:px-4 pointer-events-none">
      {/* Outer wrapper provides the sharp lozenge border edge */}
      <div
        id="navbar-container"
        className="opacity-0 pointer-events-auto p-[1px] bg-gradient-to-r from-amber-500/40 via-amber-400/80 to-amber-500/40 shadow-[0_0_25px_rgba(208,168,44,0.2)] transition-all duration-300 w-full max-w-[720px]"
        style={{
          clipPath: 'polygon(16px 0%, calc(100% - 16px) 0%, 100% 50%, calc(100% - 16px) 100%, 16px 100%, 0% 50%)',
        }}
      >
        {/* Inner Lozenge Navbar Content */}
        <nav
          className="flex items-center justify-between px-3 sm:px-6 py-1.5 sm:py-2 bg-slate-950/95 backdrop-blur-md text-slate-200"
          style={{
            clipPath: 'polygon(16px 0%, calc(100% - 16px) 0%, 100% 50%, calc(100% - 16px) 100%, 16px 100%, 0% 50%)',
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
              className="w-8 h-8 sm:w-10 sm:h-10 flex items-center justify-center shrink-0 relative"
            />
          </a>

          {/* Smooth Scroll Navigation Links */}
          <div className="flex items-center space-x-1 sm:space-x-2">
            {[
              { name: 'Features', href: '#features' },
              { name: 'Physics', href: '#features' },
              { name: 'Docs', href: '#docs' },
            ].map((link) => (
              <a
                key={link.name}
                href={link.href}
                onClick={(e) => handleNavClick(e, link.href)}
                className="relative px-2.5 sm:px-4 py-1 font-mono text-[10px] sm:text-xs uppercase tracking-wider text-slate-300 hover:text-slate-950 font-medium transition-colors duration-300 group overflow-hidden block"
                style={{
                  clipPath: 'polygon(8px 0%, calc(100% - 8px) 0%, 100% 50%, calc(100% - 8px) 100%, 8px 100%, 0% 50%)',
                }}
              >
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
            className="font-mono text-[10px] sm:text-xs text-slate-950 font-bold bg-amber-400 hover:bg-amber-300 px-2.5 sm:px-4 py-1 sm:py-1.5 transition-colors shadow-[0_0_10px_#d0a82c]"
            style={{
              clipPath: 'polygon(6px 0%, calc(100% - 6px) 0%, 100% 50%, calc(100% - 6px) 100%, 6px 100%, 0% 50%)',
            }}
          >
            GitHub
          </a>
        </nav>
      </div>
    </header>
  );
};