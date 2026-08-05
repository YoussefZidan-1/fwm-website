import React, { useState } from 'react';
import { Proximity } from 'z-proximity-engine';

const allFeatures = [
  { category: 'Rigid-Body Physics', title: 'Box2D 3.x Real Physics Engine', desc: 'Impulse-based collisions, proper mass ratios, resting contact, and sleeping. Windows glide, bounce with dull heavy weight (restitution 0.3), and stack on the floor.', bind: 'Box2D 3.x' },
  { category: 'Rigid-Body Physics', title: 'Dynamic Mass by Size or RAM', desc: 'Window mass is calculated by pixel size or RAM usage (mass = "ram"). A 4GB browser becomes a heavy wall while a small terminal drifts lightly.', bind: 'mass = "ram"' },
  { category: 'Rigid-Body Physics', title: 'Gravity Modes & Zero-G Glides', desc: 'Cycle between zero-g, space mode, and Earth gravity (9.8 m/s² at 100 px/m scale). Windows thud, fall, and rest naturally.', bind: 'Super + G' },
  { category: 'Rigid-Body Physics', title: 'Free Window Rotation', desc: 'Hands a window\'s rotation to Box2D. The picture and collision box turn together, letting windows tumble off walls and shove neighbors corner-first.', bind: 'Super + R' },
  { category: 'Visuals & Effects', title: 'Physical & Visual CAVA Spectrum', desc: 'Built-in audio FFT loopback capture. In physical mode, spectrum bars along the screen floor are solid bodies that throw windows into the air on bass beats!', bind: '[cava] mode="both"' },
  { category: 'Visuals & Effects', title: 'Synthesized Sound Knocks', desc: 'Collisions make physical sound effects. Heavier windows produce deeper thuds, and faster shoves yield louder impacts without external sound daemons.', bind: '[sound] collisions=true' },
  { category: 'Visuals & Effects', title: 'Wobbly Windows & Impact Deformation', desc: 'Dragged windows bend through a lattice of springs (jelly effect). On hard landings, windows squash and stretch with optional camera shake.', bind: 'effects.jelly / squash' },
  { category: 'Visuals & Effects', title: 'Interactive Region Screenshot Peel', desc: 'Taking a region screenshot peels the captured rectangle off the screen. It tilts and flies into the clipboard without writing temp files to disk.', bind: 'Print / Super+Shift+S' },
  { category: '3D & World Layout', title: '3D Expo Ring & Desktop Cards', desc: 'Press Super+A then Z to turn desktops into cards on a 3D ring. Orbit in 3D, drag windows between desktops, or click into any workspace.', bind: 'Super+A -> Z' },
  { category: '3D & World Layout', title: '10 Virtual Desktops Continuous Strip', desc: 'A continuous 10-screen-wide world. Move smoothly between desktops with camera panning rather than abrupt cuts.', bind: 'Super + H / L / 0-9' },
  { category: '3D & World Layout', title: 'Animated Video & Parallax Wallpapers', desc: 'Set looping video backgrounds (decoded via FFmpeg on dedicated threads) or multi-layer parallax images that pan as you move across desktops.', bind: 'Super + Shift + P' },
  { category: 'Window Management', title: 'Per-Desktop Tiling, Floating, & Physics', desc: 'Each desktop chooses its mode independently: Hyprland-style BSP tiling with dwindle splits, floating overlap mode, or real physics mode.', bind: 'Super + T / Alt + Space' },
  { category: 'Window Management', title: 'Hyprland-Style Tab-Stacks', desc: 'Group multiple windows into a single slot with chevron tab bars. Cycle tabs seamlessly with quick keybindings.', bind: 'Super + W / Tab' },
  { category: 'Window Management', title: 'Built-in Fuzzy App Launcher', desc: 'Search desktop applications with icons using fuzzy matching—no rofi needed. Launched applications drop directly into the world with physics.', bind: 'Super + Space' },
  { category: 'IPC & Scripting', title: 'fwmctl Live Socket & IPC', desc: 'Read state JSON, stream live compositor events (fwmctl subscribe), and tune physics parameters live on the fly without restarting.', bind: 'fwmctl set/dispatch' },
  { category: 'Desktop Integration', title: 'fwm-session Restore & Multi-Monitor', desc: 'Supervisor relaunches layout after crashes. Multi-monitors share 10 desktops independently with live wlr-randr socket commands.', bind: 'fwm-session' },
];

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

      {/* SINGLE Proximity wrapper for the entire grid! Massive performance boost */}
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
              // Notice NO transition-all or transition-transform. Just transition-colors.
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

      {/* Expand Button */}
      <div className="flex justify-center mt-12">
        <button onClick={() => setExpanded(!expanded)} className="font-mono text-xs text-slate-950 font-bold bg-amber-400 hover:bg-amber-300 px-6 py-2.5 transition-all shadow-[0_0_15px_#d0a82c] cursor-pointer uppercase tracking-wider" style={{ clipPath: 'polygon(10px 0%, calc(100% - 10px) 0%, 100% 50%, calc(100% - 10px) 100%, 10px 100%, 0% 50%)' }}>
          {expanded ? 'Show Less Features ▲' : `View All ${allFeatures.length} Features ▼`}
        </button>
      </div>
    </section>
  );
};