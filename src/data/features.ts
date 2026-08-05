export interface FeatureItem {
  category: string;
  title: string;
  desc: string;
  bind: string;
}

export const allFeatures: FeatureItem[] = [
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