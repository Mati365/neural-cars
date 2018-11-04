import * as R from 'ramda';

import vec2, {pickVec2Attrs} from './vec2';

const line = (p1, p2, meta) => ({
  from: p1,
  to: p2,
  meta,
});

/**
 * Creates line from numbers, instead of vectors.
 * Used in fast square lines diassembly
 *
 * @param {Number} x1
 * @param {Number} y1
 * @param {Number} x2
 * @param {Number} y2
 * @param {Object} meta
 *
 * @returns {Line}
 */
export const lineFromPoints = (x1, y1, x2, y2, meta) => ({
  from: vec2(x1, y1),
  to: vec2(x2, y2),
  meta,
});

/**
 * Creates array of line, fn is argumet generator
 * for function creator
 *
 * @param {Function} fn
 *
 * @returns {Line[]}
 */
export const createBlankLines = R.times(
  () => line(),
);

/**
 * Detects collision intersect point between two vectors
 *
 * @see
 * http://paulbourke.net/geometry/pointlineplane/
 * http://jeffreythompson.org/collision-detection/line-line.php
 *
 * x1 + uA (x2 - x1) = x3 + uB (x4 - x3)
 * y1 + uA (y2 - y1) = y3 + uB (y4 - y3)
 *
 * @param {Line}  v1  First line
 * @param {Line}  v2  Second line
 *
 * @returns {Vec2}
 */
export const intersectVec2Point = ({from: p1, to: p2}, {from: p3, to: p4}) => {
  // divider is same for uA and uB
  const divider = (
    ((p4.y - p3.y) * (p2.x - p1.x)) - ((p4.x - p3.x) * (p2.y - p1.y))
  );

  // intersect point on first vector(p1, p2)
  const uA = (
    (((p4.x - p3.x) * (p1.y - p3.y)) - ((p4.y - p3.y) * (p1.x - p3.x)))
      / divider
  );

  // intersect point on second vector(p3, p4)
  const uB = (
    (((p2.x - p1.x) * (p1.y - p3.y)) - ((p2.y - p1.y) * (p1.x - p3.x)))
      / divider
  );

  // lines collide
  if (uA >= 0 && uA <= 1 && uB >= 0 && uB <= 1) {
    return vec2(
      // collision point
      p1.x + (uA * (p2.x - p1.x)),
      p1.y + (uA * (p2.y - p1.y)),
      {
        uA,
        uB,
      },
    );
  }

  return null;
};

/**
 * Transforms cornets points object to array of lines
 * connected to each other, it is used to mount rays to the rect
 *
 * @param {RectCorners}  corners
 *
 * @returns {Line[]}
 */
export const extractRectCornersLines = ({
  topLeft,
  topRight,
  bottomLeft,
  bottomRight,
}) => ([
  /** TOP */ lineFromPoints(topLeft.x, topLeft.y, topRight.x, topRight.y),
  /** BOTTOM */ lineFromPoints(bottomLeft.x, bottomLeft.y, bottomRight.x, bottomRight.y),

  /** LEFT */ lineFromPoints(topLeft.x, topLeft.y, bottomLeft.x, bottomLeft.y),
  /** RIGHT */ lineFromPoints(topRight.x, topRight.y, bottomRight.x, bottomRight.y),
]);

/**
 * Check if ray intersect with array of lines
 *
 * @param {Line[]}  lines
 * @param {Line}    ray
 *
 * @returns {Vec2}  Intersect position
 */
export const findLinesRayIntersect = (lines, ray) => {
  for (let j = lines.length - 1; j >= 0; --j) {
    const intersect = intersectVec2Point(ray, lines[j]);
    if (intersect)
      return pickVec2Attrs(intersect);
  }

  return null;
};

export default line;
