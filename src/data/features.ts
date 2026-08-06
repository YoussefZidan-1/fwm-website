export interface FeatureItem {
  category: string;
  title: string;
  desc: string;
  bind: string;
}

export const allFeatures: FeatureItem[] = [
  {
    category: 'Rigid-Body Physics Engine',
    title: 'Box2D 3.x Native Integration',
    desc: 'Pure C11 rigid-body simulation in src/physics.c. Windows are impulse-driven bodies with 0.3 restitution, Coulomb contact friction, and zero sub-pixel jitter.',
    bind: 'Box2D 3.x',
  },
  {
    category: 'Rigid-Body Physics Engine',
    title: 'Dynamic Mass Scaling (Size vs. RAM)',
    desc: 'Weight is derived from window surface area (0.0005 kg/px²) or live Linux process RSS memory from /proc/$PID/stat (mass = "ram"). Heavy apps weigh like concrete walls!',
    bind: 'mass = "ram"',
  },
  {
    category: 'Rigid-Body Physics Engine',
    title: 'Gravity Steps & 1800 px/s Throw Limits',
    desc: 'Cycle Super+G between zero-g, space mode, and Earth gravity (9.8 m/s²). Continuous 16-substep collision (src/defines.h) prevents tunneling at up to 30,000 px/s drags.',
    bind: 'Super + G',
  },
  {
    category: 'Rigid-Body Physics Engine',
    title: 'Free Rotation & Compound Pendulum',
    desc: 'Super+R hands rotation to Box2D. Dragging by a corner calculates compound pendulum torque (src/server_drag.c) while stirring the mouse winds up rotational momentum.',
    bind: 'Super + R',
  },
  {
    category: 'Visuals & Effects',
    title: 'CAVA Physical Spectrum Bars',
    desc: 'Real-time 2048-point FFT audio loopback capture (src/cava.c + src/audio.c). Physical floor bars are kinematic bodies that throw windows into the air on heavy bass hits!',
    bind: '[cava] mode="both"',
  },
  {
    category: 'Visuals & Effects',
    title: 'Procedural Audio Knock Synthesis',
    desc: 'In-engine sound generation (src/sound.c + src/wav.c) produces 90ms collision clicks scaled by impact approach velocity and window mass—no external audio daemons needed.',
    bind: '[sound] collisions=true',
  },
  {
    category: 'Visuals & Effects',
    title: '9x9 Hooke\'s Law Spring Wobble Mesh',
    desc: 'Dragged windows deform through a 9x9 spring lattice (src/wobble.c) using Hooke\'s Law springs (K_HOME=200, K_EDGE=1152). Bounces squash and stretch on hard floor impacts.',
    bind: 'effects.jelly / squash',
  },
  {
    category: 'Visuals & Effects',
    title: 'Interactive 3D Screenshot Peel',
    desc: 'Taking a region screenshot (Print / Super+Shift+S) lifts a frozen copy off the screen, tilts/rotates it in 3D (src/screenshot.c), and flies it into the clipboard toast.',
    bind: 'Print / Super+Shift+S',
  },
  {
    category: '3D & World Layout',
    title: '3D Cylinder Expo Ring & Desktops',
    desc: 'Press Super+A then Z to turn virtual workspaces into a 3D perspective cylinder (src/expo.c). Orbit in 3D with middle-drag, click into workspaces, or drag windows across.',
    bind: 'Super+A -> Z',
  },
  {
    category: '3D & World Layout',
    title: '10 Virtual Desktops Continuous Strip',
    desc: 'A continuous 10-screen-wide world in global coordinates. Smooth camera sliding, wrapping ring mode, and multi-monitor output mapping.',
    bind: 'Super + H / L / 0-9',
  },
  {
    category: '3D & World Layout',
    title: 'FFmpeg Video & Parallax Wallpapers',
    desc: 'Software-decoded video wallpapers on dedicated threads (src/video.c) or multi-layer parallax images that pan as you navigate workspaces.',
    bind: 'Super + Shift + P',
  },
  {
    category: 'Window Management',
    title: 'Per-Desktop Hybrid Tiling & Floating',
    desc: 'Each desktop chooses its mode independently: Hyprland-style BSP dwindle splits, floating overlap mode, or real physics mode.',
    bind: 'Super + T / Alt + Space',
  },
  {
    category: 'Window Management',
    title: 'Tab-Stacks & Grouping',
    desc: 'Group multiple windows into a single physics body with chevron tab bars (src/group.c). Cycle tabs with Super+Tab or drop windows onto bars.',
    bind: 'Super + W / Tab',
  },
  {
    category: 'Window Management',
    title: 'Fuzzy App Launcher & Icon Lookup',
    desc: 'Search desktop applications with XDG icons (src/ui/launcher.c) backed by Box2D spring tile arrivals—no external rofi process required.',
    bind: 'Super + Space',
  },
  {
    category: 'IPC & Scripting',
    title: 'fwmctl Control Socket & Event Streaming',
    desc: 'Control compositor state over Unix domain sockets (src/ipc.c). Stream live JSON events (window_open, desktop, gravity) or tune physics live with fwmctl set.',
    bind: 'fwmctl set/dispatch',
  },
  {
    category: 'Desktop Integration',
    title: 'fwm-session Restore & Full Protocol Suite',
    desc: 'fwm-session supervisor relaunches layouts after crashes. Native support for xdg-shell, Xwayland, layer-shell, session-lock, gamma-control, and xdg-activation.',
    bind: 'fwm-session',
  },
];