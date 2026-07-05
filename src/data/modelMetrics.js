// Source GLB bounds. Keeping these in one place makes camera framing
// and scroll target poses easier to tune without touching component code.
export const MODEL_BOUNDS = {
  min: { x: -3.13667, y: -0.86046, z: -0.34527 },
  max: { x: 6.67506, y: 1.04484, z: 0.19713 },
};

export const MODEL_CENTER = {
  x: (MODEL_BOUNDS.min.x + MODEL_BOUNDS.max.x) / 2,
  y: (MODEL_BOUNDS.min.y + MODEL_BOUNDS.max.y) / 2,
  z: (MODEL_BOUNDS.min.z + MODEL_BOUNDS.max.z) / 2,
};

export const MODEL_SIZE = {
  x: MODEL_BOUNDS.max.x - MODEL_BOUNDS.min.x,
  y: MODEL_BOUNDS.max.y - MODEL_BOUNDS.min.y,
  z: MODEL_BOUNDS.max.z - MODEL_BOUNDS.min.z,
};
