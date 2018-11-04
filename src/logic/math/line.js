import vec2 from './vec2';

const line = (p1, p2) => ({
  from: p1,
  to: p2,
});

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
 * Splits rectangle into array of lines
 *
 * @param {Rect} rect
 *
 * @returns {Line[]}
 */
export const extractRectangleLines = ({x, y, w, h}) => ([
  /** TOP */ line(x, y, x + w, y),
  /** BOTTOM */ line(x, y + h, x + w, y + h),

  /** LEFT */ line(x, y, x, y + h),
  /** RIGHT */ line(x + w, y, x + w, y + h),
]);

export default line;
