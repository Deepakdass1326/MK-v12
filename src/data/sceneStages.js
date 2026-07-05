import { MODEL_CENTER } from "./modelMetrics";

const STAGES = {
  hero: { scale: 0.56, lx: MODEL_CENTER.x, ly: MODEL_CENTER.y, rot: [0.02, 0.28, 0], offset: [0.18, 0.06] },
  optics: { scale: 1.08, lx: 0.9, ly: 0.5, rot: [-0.06, 0.34, 0], offset: [-0.62, 0.12] },
  barrel: { scale: 1.12, lx: 5.65, ly: -0.02, rot: [0.04, -0.24, 0], offset: [0.62, 0.06] },
  ergonomics: { scale: 1.06, lx: -2.35, ly: -0.2, rot: [-0.04, 0.42, 0], offset: [-0.62, 0.08] },
  close: {
    scale: 0.58,
    lx: MODEL_CENTER.x,
    ly: MODEL_CENTER.y,
    rot: [0.02, 0.28 + Math.PI * 2, 0],
    offset: [0.18, 0.06],
  },
};

export const STAGE_ORDER = ["optics", "barrel", "ergonomics", "close"];

export function pose(stage) {
  const s = STAGES[stage];

  return {
    x: -s.lx * s.scale + s.offset[0],
    y: -s.ly * s.scale + s.offset[1],
    z: -MODEL_CENTER.z * s.scale,
    rx: s.rot[0],
    ry: s.rot[1],
    rz: s.rot[2],
    scale: s.scale,
  };
}
