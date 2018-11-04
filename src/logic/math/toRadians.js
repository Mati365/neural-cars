const RATIO = Math.PI / 180;

/**
 * Normalizes angle to -1 to 1
 *
 * @param {Number} angle  Angle in radians
 * @returns {Number}
 */
export const normalizeAngle = angle => (
  Math.atan2(Math.sin(angle), Math.cos(angle)) / Math.PI
);

export default deg => (deg * RATIO);
