import type { WindowBody } from '../../types/physics';

// Transform Screen Click (clickX, clickY) into Window Un-rotated Local Space
export function getLocalWindowCoords(win: WindowBody, clickX: number, clickY: number) {
  const cx = win.x + win.w / 2;
  const cy = win.y + win.h / 2;

  if (!win.angle) {
    return {
      localX: clickX - win.x,
      localY: clickY - win.y,
    };
  }

  const dx = clickX - cx;
  const dy = clickY - cy;
  const cosA = Math.cos(-win.angle);
  const sinA = Math.sin(-win.angle);

  const unrotatedDx = dx * cosA - dy * sinA;
  const unrotatedDy = dx * sinA + dy * cosA;

  return {
    localX: unrotatedDx + win.w / 2,
    localY: unrotatedDy + win.h / 2,
  };
}