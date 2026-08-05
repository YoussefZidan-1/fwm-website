import React, { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

import { FwmWobble, WOBBLE_GRID } from '../lib/physics/FwmWobble';
import { playKnockSound } from '../lib/audio/knockSound';
import { drawTriangle } from '../lib/graphics/drawTriangle';
import { getLocalWindowCoords } from '../lib/physics/geometry';
import { getWindowTextureCanvas } from '../lib/graphics/windowTexture';
import type { WindowBody } from '../types/physics';

if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger);
}

export const PhysicsSection: React.FC = () => {
  const sectionRef = useRef<HTMLDivElement>(null);
  const desktopRef = useRef<HTMLDivElement>(null);
  const shakeWrapperRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const textRef = useRef<HTMLDivElement>(null);
  const instructionRef = useRef<HTMLDivElement>(null);

  const windowTextureMapRef = useRef<{ [key: number]: HTMLCanvasElement }>({});

  const [isExpanded, setIsExpanded] = useState(false);
  const [clock, setClock] = useState('');
  const [activeDesktop, setActiveDesktop] = useState(0);

  const [gravityOn, setGravityOn] = useState(true);
  const [gravityType, setGravityType] = useState<'earth' | 'moon' | 'space'>('earth');
  const [rotationOn, setRotationOn] = useState(true);
  const [wobbleOn, setWobbleOn] = useState(true);
  const [soundOn, setSoundOn] = useState(true);
  const [massMode, setMassMode] = useState<'size' | 'ram'>('size');
  const [showModes, setShowModes] = useState(false);

  const [telemetry, setTelemetry] = useState({
    title: 'fwm-terminal',
    vx: 0,
    vy: 0,
    angvel: 0,
    angle: 0,
    mass: 25.2,
    speed: 0,
  });

  const optsRef = useRef({ gravityOn, gravityType, rotationOn, wobbleOn, soundOn, massMode });
  useEffect(() => {
    optsRef.current = { gravityOn, gravityType, rotationOn, wobbleOn, soundOn, massMode };
  }, [gravityOn, gravityType, rotationOn, wobbleOn, soundOn, massMode]);

  const windowsRef = useRef<WindowBody[]>([]);

  // Setup EXACTLY ONE terminal window on initial load
  useEffect(() => {
    const wob = new FwmWobble();
    wob.reset(280, 180);
    windowsRef.current = [
      {
        id: 101,
        title: 'fwm-terminal',
        x: 180,
        y: 60,
        vx: 0,
        vy: 0,
        w: 280,
        h: 180,
        angle: 0,
        angvel: 0,
        mass: Math.round((280 * 180 * 0.0005) * 10) / 10,
        isDragging: false,
        grabLxCenter: 0,
        grabLyCenter: -76,
        grabLx: 140,
        grabLy: 14,
        squashT: 0,
        squashAmount: 0,
        squashNx: 0,
        squashNy: 0,
        wobble: wob,
        activeDesktop: 0,
        zIndex: 10,
        lastX: 180,
        lastY: 60,
      },
    ];
  }, []);

  // Clock Update
  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      setClock(now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }));
    };
    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  // GSAP ScrollTrigger Sequence
  useEffect(() => {
    if (!sectionRef.current || !desktopRef.current || !textRef.current || !instructionRef.current) return;

    const isMobile = window.innerWidth < 768;

    const ctx = gsap.context(() => {
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: sectionRef.current,
          start: 'top top',
          end: '+=2800',
          scrub: 1,
          pin: true,
          onUpdate: (self) => {
            if (self.progress > 0.15 && self.progress < 0.85) {
              if (!isExpanded) setIsExpanded(true);
            } else {
              if (isExpanded) setIsExpanded(false);
            }
          },
        },
      });

      tl.to(desktopRef.current, {
        width: '92vw',
        height: '85vh',
        borderRadius: '0px',
        borderColor: 'rgba(122, 162, 247, 0.4)',
        duration: 1,
        ease: 'power2.inOut',
      });

      tl.to(instructionRef.current, { opacity: 1, duration: 0.5 }, '-=0.5');
      tl.to({}, { duration: 2 });
      tl.to(instructionRef.current, { opacity: 0, duration: 0.5 });

      if (isMobile) {
        tl.to(desktopRef.current, { height: '44vh', y: '-16vh', borderRadius: '0px', duration: 1 })
          .fromTo(textRef.current, { opacity: 0, y: 50 }, { opacity: 1, y: 0, duration: 1 }, '<');
      } else {
        tl.to(desktopRef.current, { width: '48vw', height: '64vh', x: '-22vw', borderRadius: '0px', duration: 1 })
          .fromTo(textRef.current, { opacity: 0, x: 50 }, { opacity: 1, x: 0, duration: 1 }, '<');
      }
    }, sectionRef);

    return () => ctx.revert();
  }, [isExpanded]);

  // Spawn extra window on demand
  const spawnWindow = () => {
    if (!desktopRef.current || windowsRef.current.length >= 4) return;
    const deskW = desktopRef.current.clientWidth;
    const id = Date.now();
    const wob = new FwmWobble();
    wob.reset(270, 170);
    const titles = ['kitty ~ zsh', 'mpv - video.mp4', 'htop • fwm', 'cargo build'];
    const title = titles[windowsRef.current.length % titles.length];

    const maxZ = Math.max(...windowsRef.current.map((w) => w.zIndex), 10);
    const spawnX = Math.random() * (deskW - 290) + 10;
    const spawnY = 50;
    windowsRef.current.push({
      id,
      title,
      x: spawnX,
      y: spawnY,
      vx: (Math.random() - 0.5) * 350,
      vy: 80,
      w: 270,
      h: 170,
      angle: 0,
      angvel: (Math.random() - 0.5) * 2,
      mass: Math.round((270 * 170 * 0.0005) * 10) / 10,
      isDragging: false,
      grabLxCenter: 0,
      grabLyCenter: -71,
      grabLx: 135,
      grabLy: 14,
      squashT: 0,
      squashAmount: 0,
      squashNx: 0,
      squashNy: 0,
      wobble: wob,
      activeDesktop: activeDesktop,
      zIndex: maxZ + 1,
      lastX: spawnX,
      lastY: spawnY,
    });
  };

  // Main Canvas & Physics Loop
  useEffect(() => {
    if (!desktopRef.current || !canvasRef.current) return;

    let shakeMag = 0;
    let shakeT = 0;

    let histX = [0, 0, 0, 0];
    let histY = [0, 0, 0, 0];
    let histTime = [0, 0, 0, 0];
    let histCount = 0;
    let swirlDir = 0;
    let swirlTime = 0;
    let swirlHave = false;
    let swirlAcc = 0;
    let swirlAbs = 0;
    let swirlSpan = 0;

    let pivotX = 0, pivotY = 0;
    let pivotVx = 0, pivotVy = 0;
    let pivotAx = 0, pivotAy = 0;
    let pivotHave = false;

    let activeDragWin: WindowBody | null = null;
    let dragTargetX = 0;
    let dragTargetY = 0;
    let dragCurX = 0;
    let dragCurY = 0;

    const physicsTick = (_time: number, deltaTime: number) => {
      const canvas = canvasRef.current;
      const desk = desktopRef.current;
      if (!canvas || !desk) return;

      const ctx = canvas.getContext('2d');
      if (!ctx) return;

      const boundsW = desk.clientWidth;
      const boundsH = desk.clientHeight;

      if (canvas.width !== boundsW || canvas.height !== boundsH) {
        canvas.width = boundsW;
        canvas.height = boundsH;
      }

      const dt = Math.min(deltaTime / 1000, 0.033);
      const opts = optsRef.current;

      const currentGravity = opts.gravityOn
        ? (opts.gravityType === 'earth' ? 981.0 : opts.gravityType === 'moon' ? 162.0 : 0.0)
        : 0.0;

      let camOffsetX = 0;
      let camOffsetY = 0;
      if (shakeMag > 0.01) {
        shakeT += dt;
        shakeMag *= Math.exp(-9.0 * dt);
        camOffsetX = Math.round(shakeMag * Math.sin(shakeT * 38.0));
        camOffsetY = Math.round(shakeMag * Math.sin(shakeT * 47.0 + 1.3));
      } else {
        shakeMag = 0;
      }

      if (shakeWrapperRef.current) {
        shakeWrapperRef.current.style.transform = `translate(${camOffsetX}px, ${camOffsetY}px)`;
      }

      ctx.clearRect(0, 0, boundsW, boundsH);
      ctx.save();

      const winList = windowsRef.current;

      for (let i = 0; i < winList.length; i++) {
        for (let j = i + 1; j < winList.length; j++) {
          const w1 = winList[i];
          const w2 = winList[j];
          if (w1.activeDesktop !== activeDesktop || w2.activeDesktop !== activeDesktop) continue;

          const c1x = w1.x + w1.w / 2;
          const c1y = w1.y + w1.h / 2;
          const c2x = w2.x + w2.w / 2;
          const c2y = w2.y + w2.h / 2;

          const dx = c1x - c2x;
          const dy = c1y - c2y;

          const overlapX = (w1.w + w2.w) / 2 - Math.abs(dx);
          const overlapY = (w1.h + w2.h) / 2 - Math.abs(dy);

          if (overlapX > 0 && overlapY > 0) {
            let nx = 0, ny = 0, penetration = 0;

            if (overlapX < overlapY) {
              nx = dx > 0 ? 1 : -1;
              ny = 0;
              penetration = overlapX;
            } else {
              nx = 0;
              ny = dy > 0 ? 1 : -1;
              penetration = overlapY;
            }

            if (w1.isDragging && !w2.isDragging) {
              w2.x -= nx * penetration;
              w2.y -= ny * penetration;
            } else if (!w1.isDragging && w2.isDragging) {
              w1.x += nx * penetration;
              w1.y += ny * penetration;
            } else if (!w1.isDragging && !w2.isDragging) {
              w1.x += (nx * penetration) / 2;
              w1.y += (ny * penetration) / 2;
              w2.x -= (nx * penetration) / 2;
              w2.y -= (ny * penetration) / 2;
            }

            const rx1 = (c2x - c1x) / 2;
            const ry1 = (c2y - c1y) / 2;
            const rx2 = (c1x - c2x) / 2;
            const ry2 = (c1y - c2y) / 2;

            const vp1x = w1.vx - w1.angvel * ry1;
            const vp1y = w1.vy + w1.angvel * rx1;
            const vp2x = w2.vx - w2.angvel * ry2;
            const vp2y = w2.vy + w2.angvel * rx2;

            const relVx = vp1x - vp2x;
            const relVy = vp1y - vp2y;
            const relSpeed = Math.hypot(relVx, relVy);
            const velAlongNormal = relVx * nx + relVy * ny;

            if (velAlongNormal < 0) {
              const restitution = relSpeed > 100 ? 0.3 : 0.05;
              const invMass1 = 1 / w1.mass;
              const invMass2 = 1 / w2.mass;
              const invI1 = 12 / (w1.mass * (w1.w * w1.w + w1.h * w1.h));
              const invI2 = 12 / (w2.mass * (w2.w * w2.w + w2.h * w2.h));

              const rCrossN1 = rx1 * ny - ry1 * nx;
              const rCrossN2 = rx2 * ny - ry2 * nx;

              const impulse = -(1 + restitution) * velAlongNormal /
                (invMass1 + invMass2 + rCrossN1 * rCrossN1 * invI1 + rCrossN2 * rCrossN2 * invI2);

              const impulseX = impulse * nx;
              const impulseY = impulse * ny;

              const torqueFactor = Math.min(1.0, relSpeed / 120.0);

              if (!w1.isDragging) {
                w1.vx += impulseX * invMass1;
                w1.vy += impulseY * invMass1;
                if (opts.rotationOn) {
                  w1.angvel += (rx1 * impulseY - ry1 * impulseX) * invI1 * torqueFactor;
                  w1.angvel *= 0.90;
                  w1.angvel = Math.max(-8.0, Math.min(8.0, w1.angvel));
                }
              }

              if (!w2.isDragging) {
                w2.vx -= impulseX * invMass2;
                w2.vy -= impulseY * invMass2;
                if (opts.rotationOn) {
                  w2.angvel -= (rx2 * impulseY - ry2 * impulseX) * invI2 * torqueFactor;
                  w2.angvel *= 0.90;
                  w2.angvel = Math.max(-8.0, Math.min(8.0, w2.angvel));
                }
              }

              if (relSpeed > 120) {
                const f = Math.min(1.0, relSpeed / 2000.0);
                const mag = 14.0 * f * f;
                if (mag > shakeMag) {
                  shakeMag = mag;
                  shakeT = 0;
                }
                playKnockSound(relSpeed, opts.soundOn);
              }
            }

            if (opts.rotationOn) {
              [w1, w2].forEach((w) => {
                if (w.isDragging) return;
                const wSpeed = Math.hypot(w.vx, w.vy);
                if (wSpeed < 40 && Math.abs(w.angvel) < 1.5) {
                  let normAngle = w.angle % (Math.PI * 2);
                  if (normAngle > Math.PI) normAngle -= Math.PI * 2;
                  if (normAngle < -Math.PI) normAngle += Math.PI * 2;

                  const targets = [-Math.PI, -Math.PI / 2, 0, Math.PI / 2, Math.PI];
                  let nearestTarget = 0;
                  let minDiff = Infinity;
                  for (const target of targets) {
                    const diff = Math.abs(normAngle - target);
                    if (diff < minDiff) {
                      minDiff = diff;
                      nearestTarget = target;
                    }
                  }

                  const angleDiff = nearestTarget - normAngle;
                  if (Math.abs(angleDiff) < 0.25) {
                    w.angvel += 10.0 * Math.sin(angleDiff) * dt;
                    w.angvel *= Math.exp(-5.0 * dt);
                  }

                  if (Math.abs(angleDiff) < 0.15 && Math.abs(w.angvel) < 0.8 && wSpeed < 20) {
                    w.angle = nearestTarget;
                    w.angvel = 0;
                    if (Math.abs(w.vy) < 15) w.vy = 0;
                  }
                }
              });
            }
          }
        }
      }

      const sortedWindows = [...winList].sort((a, b) => a.zIndex - b.zIndex);

      sortedWindows.forEach((win) => {
        if (win.activeDesktop !== activeDesktop) return;

        if (opts.massMode === 'ram') {
          win.mass = 342.0;
        } else {
          win.mass = Math.round((win.w * win.h * 0.0005) * 10) / 10;
        }

        const moveDx = win.x - win.lastX;
        const moveDy = win.y - win.lastY;
        if (opts.wobbleOn && (moveDx !== 0 || moveDy !== 0)) {
          win.wobble.translate(moveDx, moveDy);
        }
        win.lastX = win.x;
        win.lastY = win.y;

        if (win.isDragging) {
          const px = dragCurX;
          const py = dragCurY;

          win.vx = (dragTargetX - win.x) / dt;
          win.vy = (dragTargetY - win.y) / dt;

          if (opts.rotationOn) {
            if (!pivotHave) {
              pivotX = px; pivotY = py;
              pivotVx = 0; pivotVy = 0;
              pivotAx = 0; pivotAy = 0;
              pivotHave = true;
            } else {
              const nvx = (px - pivotX) / dt;
              const nvy = (py - pivotY) / dt;
              const kv = dt / (dt + 0.040);
              const svx = pivotVx + (nvx - pivotVx) * kv;
              const svy = pivotVy + (nvy - pivotVy) * kv;

              const rax = (svx - pivotVx) / dt;
              const ray = (svy - pivotVy) / dt;
              const ka = dt / (dt + 0.080);
              pivotAx += (rax - pivotAx) * ka;
              pivotAy += (ray - pivotAy) * ka;

              pivotAx = Math.max(-20000, Math.min(20000, pivotAx));
              pivotAy = Math.max(-20000, Math.min(20000, pivotAy));

              pivotX = px; pivotY = py;
              pivotVx = svx; pivotVy = svy;

              const c = Math.cos(win.angle), s = Math.sin(win.angle);
              const rx = -(c * win.grabLxCenter - s * win.grabLyCenter);
              const ry = -(s * win.grabLxCenter + c * win.grabLyCenter);

              const gy = currentGravity;
              const ex = -pivotAx;
              const ey = gy - pivotAy;

              const inertia = (win.w * win.w + win.h * win.h) / 12.0 + (rx * rx + ry * ry);
              if (inertia > 1.0) {
                const alpha = (rx * ey - ry * ex) / inertia;
                win.angvel += alpha * dt;
              }

              win.angvel *= Math.exp(-1.2 * dt);
              win.angvel = Math.max(-8.0, Math.min(8.0, win.angvel));
              win.angle += win.angvel * dt;

              const cx = px + rx;
              const cy = py + ry;
              win.x = cx - win.w / 2;
              win.y = cy - win.h / 2;
            }
          } else {
            win.x = dragTargetX;
            win.y = dragTargetY;
          }
        } else {
          win.vy += currentGravity * dt;

          const airDamping = currentGravity > 0 ? 0.985 : 0.995;
          const damp = Math.pow(airDamping, dt * 60);
          win.vx *= damp;
          win.vy *= damp;

          win.x += win.vx * dt;
          win.y += win.vy * dt;

          if (opts.rotationOn) {
            win.angle += win.angvel * dt;
            win.angvel *= Math.exp(-0.35 * dt);
            win.angvel = Math.max(-8.0, Math.min(8.0, win.angvel));
          } else {
            win.angle = 0;
            win.angvel = 0;
          }

          const cosA = Math.cos(win.angle);
          const sinA = Math.sin(win.angle);
          const extX = (win.w / 2) * Math.abs(cosA) + (win.h / 2) * Math.abs(sinA);
          const extY = (win.w / 2) * Math.abs(sinA) + (win.h / 2) * Math.abs(cosA);

          let cx = win.x + win.w / 2;
          let cy = win.y + win.h / 2;

          let hit = false;
          let hitSpeed = 0;

          const wallRestitution = currentGravity > 0 ? 0.3 : 0.80;

          if (cx - extX < 0) {
            cx = extX;
            win.x = cx - win.w / 2;
            if (win.vx < 0) {
              win.vx = Math.abs(win.vx) * wallRestitution;
              if (opts.rotationOn) {
                win.angvel = Math.max(-8.0, Math.min(8.0, win.angvel + (Math.random() - 0.5) * 0.8));
              }
              hit = true;
              hitSpeed = Math.abs(win.vx);
            }
          }

          if (cx + extX > boundsW) {
            cx = boundsW - extX;
            win.x = cx - win.w / 2;
            if (win.vx > 0) {
              win.vx = -Math.abs(win.vx) * wallRestitution;
              if (opts.rotationOn) {
                win.angvel = Math.max(-8.0, Math.min(8.0, win.angvel + (Math.random() - 0.5) * 0.8));
              }
              hit = true;
              hitSpeed = Math.abs(win.vx);
            }
          }

          if (cy - extY < 0) {
            cy = extY;
            win.y = cy - win.h / 2;
            if (win.vy < 0) {
              win.vy = Math.abs(win.vy) * wallRestitution;
              hit = true;
              hitSpeed = Math.abs(win.vy);
            }
          }

          if (cy + extY > boundsH) {
            cy = boundsH - extY;
            win.y = cy - win.h / 2;

            if (win.vy > 0) {
              win.vy = -Math.abs(win.vy) * wallRestitution;
              win.vx *= 0.85;
              hit = true;
              hitSpeed = Math.abs(win.vy);
            }

            if (opts.rotationOn) {
              let normAngle = win.angle % (Math.PI * 2);
              if (normAngle > Math.PI) normAngle -= Math.PI * 2;
              if (normAngle < -Math.PI) normAngle += Math.PI * 2;

              const targets = [-Math.PI, -Math.PI / 2, 0, Math.PI / 2, Math.PI];
              let nearestTarget = 0;
              let minDiff = Infinity;
              for (const target of targets) {
                const diff = Math.abs(normAngle - target);
                if (diff < minDiff) {
                  minDiff = diff;
                  nearestTarget = target;
                }
              }

              const angleDiff = nearestTarget - normAngle;

              if (currentGravity > 0) {
                win.angvel += 14.0 * Math.sin(angleDiff) * dt;
              }
              win.angvel *= Math.exp(-4.0 * dt);

              if (Math.abs(angleDiff) < 0.15 && Math.abs(win.angvel) < 0.8 && Math.abs(win.vy) < 25) {
                win.angle = nearestTarget;
                win.angvel = 0;
                if (Math.abs(win.vy) < 15) win.vy = 0;
              }
            }
          }

          win.angvel = Math.max(-8.0, Math.min(8.0, win.angvel));

          if (hit && hitSpeed > 120) {
            win.squashT = 0;
            win.squashAmount = Math.min(0.24, hitSpeed / 900.0);
            win.squashNx = 0;
            win.squashNy = -1;

            const f = Math.min(1.0, hitSpeed / 2000.0);
            const mag = 14.0 * f * f;
            if (mag > shakeMag) {
              shakeMag = mag;
              shakeT = 0;
            }

            playKnockSound(hitSpeed, opts.soundOn);
          }
        }

        if (opts.wobbleOn) {
          win.wobble.step(dt);
        }

        let sx = 1.0, sy = 1.0;
        if (win.squashAmount > 0.001) {
          win.squashT += dt;
          const env = win.squashAmount * Math.exp(-12.0 * win.squashT);
          if (env < 0.004) {
            win.squashAmount = 0;
          } else {
            const a = Math.min(0.45, Math.max(-0.45, env * Math.cos(14.0 * win.squashT)));
            const ax = Math.abs(win.squashNx);
            const ay = Math.abs(win.squashNy);
            sx = 1.0 - a * ax + a * 0.45 * ay;
            sy = 1.0 - a * ay + a * 0.45 * ax;
          }
        }

        const isFocused = win.isDragging || telemetry.title === win.title;
        if (isFocused) {
          setTelemetry({
            title: win.title,
            vx: Math.round(win.vx),
            vy: Math.round(win.vy),
            angvel: parseFloat(win.angvel.toFixed(2)),
            angle: Math.round((win.angle * 180 / Math.PI) % 360),
            mass: win.mass,
            speed: Math.round(Math.hypot(win.vx, win.vy)),
          });
        }

        const texCanvas = getWindowTextureCanvas(win, windowTextureMapRef.current, isFocused);

        ctx.save();
        ctx.translate(win.x + win.w / 2, win.y + win.h / 2);

        if (opts.rotationOn && win.angle !== 0) {
          ctx.rotate(win.angle);
        }
        ctx.translate(-win.w / 2, -win.h / 2);

        if (opts.wobbleOn && win.isDragging) {
          const grid = WOBBLE_GRID;
          const gridStepU = win.w / (grid - 1);
          const gridStepV = win.h / (grid - 1);

          ctx.save();
          ctx.scale(sx, sy);

          for (let j = 0; j < grid - 1; j++) {
            for (let i = 0; i < grid - 1; i++) {
              const k00 = j * grid + i;
              const k10 = j * grid + (i + 1);
              const k11 = (j + 1) * grid + (i + 1);
              const k01 = (j + 1) * grid + i;

              const x00 = win.wobble.px[k00], y00 = win.wobble.py[k00];
              const x10 = win.wobble.px[k10], y10 = win.wobble.py[k10];
              const x11 = win.wobble.px[k11], y11 = win.wobble.py[k11];
              const x01 = win.wobble.px[k01], y01 = win.wobble.py[k01];

              const u0 = i * gridStepU,       v0 = j * gridStepV;
              const u1 = (i + 1) * gridStepU, v1 = (j + 1) * gridStepV;

              drawTriangle(ctx, texCanvas, x00, y00, u0, v0, x10, y10, u1, v0, x11, y11, u1, v1);
              drawTriangle(ctx, texCanvas, x00, y00, u0, v0, x11, y11, u1, v1, x01, y01, u0, v1);
            }
          }
          ctx.restore();
        } else {
          ctx.scale(sx, sy);
          ctx.drawImage(texCanvas, 0, 0);
        }

        ctx.restore();
      });

      ctx.restore();
    };

    gsap.ticker.add(physicsTick);

    const handlePointerDown = (e: PointerEvent) => {
      if (!desktopRef.current || !canvasRef.current) return;
      const deskRect = desktopRef.current.getBoundingClientRect();
      const clickX = e.clientX - deskRect.left;
      const clickY = e.clientY - deskRect.top;

      const winList = windowsRef.current;
      for (let i = winList.length - 1; i >= 0; i--) {
        const win = winList[i];
        if (win.activeDesktop !== activeDesktop) continue;

        const { localX, localY } = getLocalWindowCoords(win, clickX, clickY);

        if (
          localX >= 0 &&
          localX <= win.w &&
          localY >= 0 &&
          localY <= win.h
        ) {
          const maxZ = Math.max(...winList.map((w) => w.zIndex), 10);
          win.zIndex = maxZ + 1;

          if (localY <= 28 && localX >= win.w - 24 && localX <= win.w - 4) {
            delete windowTextureMapRef.current[win.id];
            winList.splice(i, 1);
            return;
          }

          if (localY <= 28) {
            activeDragWin = win;
            win.isDragging = true;
            desktopRef.current.style.cursor = 'grabbing';

            win.grabLxCenter = localX - win.w / 2;
            win.grabLyCenter = localY - win.h / 2;

            win.grabLx = localX;
            win.grabLy = localY;

            dragTargetX = clickX - localX;
            dragTargetY = clickY - localY;
            dragCurX = clickX;
            dragCurY = clickY;

            win.wobble.grab(localX, localY);

            pivotHave = false;
            histCount = 0;
            swirlHave = false;
            swirlAcc = 0;
            swirlAbs = 0;
            swirlSpan = 0;
            break;
          }
        }
      }
    };

    const handlePointerMove = (e: PointerEvent) => {
      if (!desktopRef.current) return;
      const deskRect = desktopRef.current.getBoundingClientRect();
      const curLx = e.clientX - deskRect.left;
      const curLy = e.clientY - deskRect.top;

      if (!activeDragWin) {
        let hovered = false;
        const winList = windowsRef.current;
        for (let i = winList.length - 1; i >= 0; i--) {
          const win = winList[i];
          if (win.activeDesktop !== activeDesktop) continue;
          const { localX, localY } = getLocalWindowCoords(win, curLx, curLy);
          if (localX >= 0 && localX <= win.w && localY >= 0 && localY <= win.h) {
            if (localY <= 28 && localX >= win.w - 24 && localX <= win.w - 4) {
              desktopRef.current.style.cursor = 'pointer';
            } else if (localY <= 28) {
              desktopRef.current.style.cursor = 'grab';
            } else {
              desktopRef.current.style.cursor = 'default';
            }
            hovered = true;
            break;
          }
        }
        if (!hovered) desktopRef.current.style.cursor = 'default';
        return;
      }

      dragCurX = curLx;
      dragCurY = curLy;
      dragTargetX = curLx - activeDragWin.grabLx;
      dragTargetY = curLy - activeDragWin.grabLy;

      const now = performance.now() / 1000;
      histX.shift(); histX.push(curLx);
      histY.shift(); histY.push(curLy);
      histTime.shift(); histTime.push(now);
      if (histCount < 4) histCount++;

      if (histCount >= 2) {
        const oldest = 4 - histCount;
        const dtS = now - histTime[oldest];
        if (dtS > 0.001) {
          const vx = (curLx - histX[oldest]) / dtS;
          const vy = (curLy - histY[oldest]) / dtS;
          const speed = Math.hypot(vx, vy);

          if (optsRef.current.rotationOn && speed > 150.0) {
            const dir = Math.atan2(vy, vx);
            if (!swirlHave) {
              swirlDir = dir;
              swirlTime = now;
              swirlHave = true;
            } else {
              const dtSwirl = now - swirlTime;
              if (dtSwirl >= 0.02) {
                let d = dir - swirlDir;
                while (d > Math.PI) d -= 2 * Math.PI;
                while (d < -Math.PI) d += 2 * Math.PI;

                if (dtSwirl < 0.2 && Math.abs(d) < Math.PI / 2.0) {
                  const decay = Math.exp(-dtSwirl / 0.20);
                  swirlAcc = swirlAcc * decay + d;
                  swirlAbs = swirlAbs * decay + Math.abs(d);
                  swirlSpan = swirlSpan * decay + dtSwirl;

                  if (swirlSpan > 0.05 && swirlAbs > 1e-6) {
                    const coh = Math.abs(swirlAcc) / swirlAbs;
                    let omega = (swirlAcc / swirlSpan) * 0.7 * coh * coh;
                    omega = Math.max(-6.0, Math.min(6.0, omega));

                    if (Math.abs(omega) >= 0.4) {
                      activeDragWin.angvel += (omega - activeDragWin.angvel) * 0.15;
                    }
                  }
                }
                swirlDir = dir;
                swirlTime = now;
              }
            }
          }
        }
      }
    };

    const handlePointerUp = () => {
      if (!activeDragWin) return;
      const win = activeDragWin;
      win.isDragging = false;
      win.wobble.release();

      const now = performance.now() / 1000;

      let throwVx = 0;
      let throwVy = 0;
      if (histCount >= 2) {
        const oldest = 4 - histCount;
        const dtS = now - histTime[oldest];
        if (dtS > 0.01) {
          throwVx = ((dragCurX - histX[oldest]) / dtS) * 0.65;
          throwVy = ((dragCurY - histY[oldest]) / dtS) * 0.65;
        }
      }

      const throwSpeed = Math.hypot(throwVx, throwVy);
      if (throwSpeed > 1800) {
        const scale = 1800 / throwSpeed;
        throwVx *= scale;
        throwVy *= scale;
      }

      win.vx = throwVx;
      win.vy = throwVy;

      if (optsRef.current.rotationOn) {
        win.angvel = Math.max(-6.0, Math.min(6.0, win.angvel));
      }

      activeDragWin = null;
      pivotHave = false;
      if (desktopRef.current) desktopRef.current.style.cursor = 'default';
    };

    window.addEventListener('pointerdown', handlePointerDown);
    window.addEventListener('pointermove', handlePointerMove);
    window.addEventListener('pointerup', handlePointerUp);

    return () => {
      gsap.ticker.remove(physicsTick);
      window.removeEventListener('pointerdown', handlePointerDown);
      window.removeEventListener('pointermove', handlePointerMove);
      window.removeEventListener('pointerup', handlePointerUp);
    };
  }, [activeDesktop]);

  return (
    <>
      <div className="bg-slate-950 py-12 px-4 text-center space-y-3 z-10 relative border-b border-slate-800/60">
        <div className="inline-flex items-center space-x-2 px-3.5 py-1 bg-amber-500/10 border border-amber-500/30 text-amber-300 font-mono text-xs uppercase tracking-widest rounded-none">
          <span>Interactive Compositor Sandbox</span>
        </div>
        <h2 className="font-display italic text-3xl sm:text-5xl font-bold text-slate-100">
          Scroll down to <span className="text-amber-400">taste some physics</span> yourself
        </h2>
        <p className="font-body text-slate-400 text-sm sm:text-base max-w-xl mx-auto font-light leading-relaxed">
          Experience fwm's Box2D 3.x rigid body dynamics, corner pendulum torque, swirl spin momentum, 9x9 wobble mesh, and collision knock sound.
        </p>
      </div>

      <section id="physics" ref={sectionRef} className="relative w-full h-[300vh] bg-slate-950">
        <div className="sticky top-0 w-full h-screen flex items-center justify-center overflow-hidden">
          <div
            ref={desktopRef}
            className="relative w-[320px] h-[220px] bg-slate-900/95 border border-slate-800 rounded-none overflow-hidden z-10 will-change-transform select-none"
          >
            <div
              ref={shakeWrapperRef}
              className="relative w-full h-full flex flex-col justify-between items-center will-change-transform"
            >
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_rgba(122,162,247,0.06)_0%,_transparent_75%)] pointer-events-none" />

              <header className="w-full px-3 pt-2.5 flex items-center justify-between z-30 pointer-events-auto select-none">
                <div
                  className="px-3 py-1 bg-[#131519]/90 border border-slate-700/50 text-[#7aa2f7] font-mono text-[10px] flex items-center space-x-1.5"
                  style={{ clipPath: 'polygon(10px 0%, calc(100% - 10px) 0%, 100% 50%, calc(100% - 10px) 100%, 10px 100%, 0% 50%)' }}
                >
                  <span className="w-1.5 h-1.5 rounded-none bg-[#7aa2f7] animate-pulse" />
                  <span>{telemetry.title} • {telemetry.angle}° • {telemetry.speed}px/s • m {telemetry.mass}</span>
                </div>

                <div
                  className="px-3 py-1 bg-[#131519]/90 border border-slate-700/50 flex items-center space-x-1.5 relative"
                  style={{ clipPath: 'polygon(10px 0%, calc(100% - 10px) 0%, 100% 50%, calc(100% - 10px) 100%, 10px 100%, 0% 50%)' }}
                >
                  {Array.from({ length: 10 }).map((_, i) => (
                    <button
                      key={i}
                      onClick={() => setActiveDesktop(i)}
                      className={`w-2 h-2 rounded-none transition-all cursor-pointer flex items-center justify-center text-[7px] font-mono font-bold ${
                        activeDesktop === i
                          ? 'bg-[#e8ecf0] text-slate-950 scale-110'
                          : 'bg-slate-700 text-transparent hover:bg-slate-500'
                      }`}
                    >
                      {activeDesktop === i ? '•' : ''}
                    </button>
                  ))}
                </div>

                <div className="flex items-center space-x-1.5 relative">
                  <div
                    className="px-2.5 py-1 bg-[#131519]/90 border border-slate-700/50 text-[#e8ecf0] font-mono text-[10px] font-bold"
                    style={{ clipPath: 'polygon(8px 0%, calc(100% - 8px) 0%, 100% 50%, calc(100% - 8px) 100%, 8px 100%, 0% 50%)' }}
                  >
                    <span>{clock || '21:42'}</span>
                  </div>

                  <button
                    onClick={() => setShowModes(!showModes)}
                    className="px-2.5 py-1 bg-[#7aa2f7] hover:bg-blue-400 text-slate-950 font-mono text-[10px] font-bold transition-colors cursor-pointer"
                    style={{ clipPath: 'polygon(8px 0%, calc(100% - 8px) 0%, 100% 50%, calc(100% - 8px) 100%, 8px 100%, 0% 50%)' }}
                  >
                    ⚙ Modes
                  </button>

                  {showModes && (
                    <div
                      className="absolute top-9 right-0 w-60 bg-[#131519]/95 border border-[#7aa2f7]/40 p-3 z-40 font-mono text-xs space-y-2.5 text-[#e8ecf0]"
                      style={{ clipPath: 'polygon(12px 0%, calc(100% - 12px) 0%, 100% 50%, calc(100% - 12px) 100%, 12px 100%, 0% 50%)' }}
                    >
                      <div className="flex items-center justify-between text-slate-300">
                        <span>Gravity</span>
                        <button
                          onClick={() => setGravityOn(!gravityOn)}
                          className={`px-2 py-0.5 text-[10px] font-bold rounded-none cursor-pointer ${
                            gravityOn ? 'bg-[#7aa2f7] text-slate-950' : 'bg-slate-800 text-slate-400'
                          }`}
                        >
                          {gravityOn ? 'ON' : 'OFF'}
                        </button>
                      </div>

                      <div className="flex items-center justify-between text-slate-300">
                        <span>Preset</span>
                        <div className="flex space-x-1">
                          {(['earth', 'moon', 'space'] as const).map((type) => (
                            <button
                              key={type}
                              onClick={() => {
                                setGravityType(type);
                                setGravityOn(type !== 'space');
                              }}
                              className={`px-1.5 py-0.5 text-[9px] uppercase font-bold rounded-none cursor-pointer ${
                                gravityType === type && gravityOn
                                  ? 'bg-[#7aa2f7] text-slate-950'
                                  : 'bg-slate-800 text-slate-400'
                              }`}
                            >
                              {type}
                            </button>
                          ))}
                        </div>
                      </div>

                      <div className="flex items-center justify-between text-slate-300">
                        <span>Mass Mode</span>
                        <div className="flex space-x-1">
                          {(['size', 'ram'] as const).map((mode) => (
                            <button
                              key={mode}
                              onClick={() => setMassMode(mode)}
                              className={`px-1.5 py-0.5 text-[9px] uppercase font-bold rounded-none cursor-pointer ${
                                massMode === mode ? 'bg-[#7aa2f7] text-slate-950' : 'bg-slate-800 text-slate-400'
                              }`}
                            >
                              {mode}
                            </button>
                          ))}
                        </div>
                      </div>

                      <div className="flex items-center justify-between text-slate-300">
                        <span>Free Rotation</span>
                        <button
                          onClick={() => setRotationOn(!rotationOn)}
                          className={`px-2 py-0.5 text-[10px] font-bold rounded-none cursor-pointer ${
                            rotationOn ? 'bg-[#7aa2f7] text-slate-950' : 'bg-slate-800 text-slate-400'
                          }`}
                        >
                          {rotationOn ? 'ON' : 'OFF'}
                        </button>
                      </div>

                      <div className="flex items-center justify-between text-slate-300">
                        <span>Wobble Jelly</span>
                        <button
                          onClick={() => setWobbleOn(!wobbleOn)}
                          className={`px-2 py-0.5 text-[10px] font-bold rounded-none cursor-pointer ${
                            wobbleOn ? 'bg-[#7aa2f7] text-slate-950' : 'bg-slate-800 text-slate-400'
                          }`}
                        >
                          {wobbleOn ? 'ON' : 'OFF'}
                        </button>
                      </div>

                      <div className="flex items-center justify-between text-slate-300">
                        <span>Collision Knock</span>
                        <button
                          onClick={() => setSoundOn(!soundOn)}
                          className={`px-2 py-0.5 text-[10px] font-bold rounded-none cursor-pointer ${
                            soundOn ? 'bg-[#7aa2f7] text-slate-950' : 'bg-slate-800 text-slate-400'
                          }`}
                        >
                          {soundOn ? 'ON' : 'OFF'}
                        </button>
                      </div>

                      <button
                        onClick={spawnWindow}
                        className="w-full py-1 mt-1 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold rounded-none cursor-pointer text-center text-[10px]"
                      >
                        + Spawn Extra Window
                      </button>
                    </div>
                  )}
                </div>
              </header>

              <div
                ref={instructionRef}
                className="absolute top-14 px-5 py-1 bg-slate-950/90 backdrop-blur-sm border border-[#7aa2f7]/30 rounded-none font-mono text-[11px] text-[#7aa2f7] opacity-0 pointer-events-none z-20 transition-opacity"
              >
                Drag titlebar to throw, click red dot to close window, or stir cursor to spin!
              </div>

              <canvas ref={canvasRef} className="absolute inset-0 w-full h-full pointer-events-auto" />
            </div>
          </div>

          <div
            ref={textRef}
            className="absolute flex flex-col space-y-4 z-0 opacity-0 md:right-[5vw] md:top-1/2 md:-translate-y-1/2 md:w-[40vw] bottom-[5vh] left-[5vw] w-[90vw]"
          >
            <div className="inline-flex items-center space-x-2 px-3.5 py-1 bg-[#7aa2f7]/10 border border-[#7aa2f7]/30 text-[#7aa2f7] font-mono text-xs uppercase tracking-widest rounded-none w-max">
              <span>Rigid-Body Wayland Engine</span>
            </div>
            <h2 className="font-display italic text-4xl md:text-5xl font-bold text-slate-100 drop-shadow-md">
              Simulated with <span className="text-[#7aa2f7]">Box2D 3.x</span>
            </h2>
            <p className="font-body text-slate-400 text-base md:text-lg font-light leading-relaxed">
              fwm isn't just CSS transitions. Every window is simulated by a rigid-body engine at 60 steps per second with authentic C physics.
            </p>
            <ul className="space-y-3 pt-2">
              <li className="flex items-start space-x-3">
                <span className="text-[#7aa2f7] font-bold font-mono">01</span>
                <p className="font-body text-xs md:text-sm text-slate-300">
                  <strong className="text-slate-100">Dull Heavy Bounces:</strong> Configured with 0.3 restitution and Coulomb surface friction for realistic weight.
                </p>
              </li>
              <li className="flex items-start space-x-3">
                <span className="text-[#7aa2f7] font-bold font-mono">02</span>
                <p className="font-body text-xs md:text-sm text-slate-300">
                  <strong className="text-slate-100">9x9 Jelly Wobble Mesh:</strong> Hooke's law springs calculate velocity lag to bend windows during drags.
                </p>
              </li>
              <li className="flex items-start space-x-3">
                <span className="text-[#7aa2f7] font-bold font-mono">03</span>
                <p className="font-body text-xs md:text-sm text-slate-300">
                  <strong className="text-slate-100">Swirl Spin Windup:</strong> Stir the cursor in circles to wind up window rotation momentum.
                </p>
              </li>
              <li className="flex items-start space-x-3">
                <span className="text-[#7aa2f7] font-bold font-mono">04</span>
                <p className="font-body text-xs md:text-sm text-slate-300">
                  <strong className="text-slate-100">Synthesized Audio Knock:</strong> Procedurally generates audio feedback on wall and window impacts.
                </p>
              </li>
            </ul>
          </div>
        </div>
      </section>
    </>
  );
};