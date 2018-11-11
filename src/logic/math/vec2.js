const vec2 = (x, y, meta) => ({
  x: x || 0,
  y: y || 0,
  meta,
});

export const ZERO_VEC2 = vec2(0, 0);

/**
 * Clones vector
 *
 * @param {Vec2} v1
 *
 * @returns {Vec2}
 */
export const pickVec2Attrs = ({x, y}) => ({
  x,
  y,
});

/**
 * Gets distance between points
 *
 * @param {Vec2} v1
 * @param {Vec2} v2
 *
 * @returns {Number}
 */
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

/**
 * Adds or subs vector(based on direction)
 *
 * @param {Vec2}    v1
 * @param {Vec2}    v2
 * @param {Number}  direction
 */
export const addVec2 = (v1, v2, direction = 1) => ({
  x: v1.x + (v2.x * direction),
  y: v1.y + (v2.y * direction),
});

export const subVec2 = (v1, v2) => addVec2(v1, v2, -1);

/**
 * Get vector 2D distance
 *
 * @param {Vec2} v1
 */
export const vec2Length = v1 => (
  Math.sqrt((v1.x ** 2) + (v1.y ** 2))
);

/**
 * Cretes 2D vector from angle and length
 *
 * @param {Number} angle  Angle of vector
 * @param {Number} scalar Length of vector
 *
 * @returns {Vec2}
 */
export const scalarToVec2 = (angle, scalar) => ({
  x: (Math.cos(angle) * scalar),
  y: (Math.sin(angle) * scalar),
});

/**
 * Get point between two points in provided percentage
 *
 * @param {Number}  percentage
 * @param {Vec2}    v1
 * @param {Vec2}    v2
 *
 * @returns {Vec2}
 */
export const lerp = (percentage, v1, v2) => ({
  x: v1.x + ((v2.x - v1.x) * percentage),
  y: v1.y + ((v2.y - v1.y) * percentage),
});

/**
 * Calculates center of line between two points
 *
 * @param {Vec2} v1
 * @param {Vec2} v2
 *
 * @returns {Vec2}
 */
export const vec2Center = (v1, v2) => lerp(0.5, v1, v2);

export const angleBetweenPoints = (p1, p2) => Math.atan2(
  p2.y - p1.y,
  p2.x - p1.x,
);

/**
 * Unsafe method, adds vector to dest
 *
 * @param {Vec2} src
 * @param {Vec2} dest
 * @param {Vec2} direction
 *
 * @return {Vec2} dest
 */
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
