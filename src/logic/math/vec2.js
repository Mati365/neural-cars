const vec2 = (x, y) => ({
  x: x || 0,
  y: y || 0,
});

export const vec2Distance = (v1, v2) => (
  Math.sqrt(
    ((v1.x - v2.x) ** 2)
      + ((v1.y - v2.y) ** 2),
  )
);

/**
 * @see https://matthew-brett.github.io/teaching/rotation_2d.html
 */
export const rotateVec2 = (angle, v) => ({
  x: (Math.cos(angle) * v.x) - (Math.sin(angle) * v.y),
  y: (Math.sin(angle) * v.x) + (Math.cos(angle) * v.y),
});

export const addVec2 = (v1, v2) => ({
  x: v1.x + v2.x,
  y: v1.y + v2.y,
});

export const vec2Length = v1 => (
  Math.sqrt((v1.x ** 2) + (v1.y ** 2))
);


export const scalarToVec2 = (angle, scalar) => ({
  x: (Math.cos(angle) * scalar),
  y: (Math.sin(angle) * scalar),
});

export const vec2Center = (v1, v2) => ({
  x: v1.x + ((v2.x - v1.x) / 2),
  y: v1.y + ((v2.y - v1.y) / 2),
});

export const addVec2To = (src, dest, direction = 1) => {
  /**
   * It should be shallow copy but it is slow
   * in rendering engine, it must be as fast as
   * it is possible, disable linter here
   */

  /* eslint-disable */
  dest.x += src.x * direction;
  dest.y += src.y * direction;
  /* eslint-enable */
  return dest;
};

export default vec2;
