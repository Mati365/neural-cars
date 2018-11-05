import * as R from 'ramda';

import toRadians from 'logic/math/toRadians';

import {
  findLinesRayIntersect,
  createBlankLines,
} from 'logic/math/line';

import {
  ZERO_VEC2,
  scalarToVec2,
  addVec2,
} from 'logic/math/vec2';

const pickPercentageIntersectDistance = item => item.meta.uA;

/**
 * Compares uA values between to intersection vectors,
 * basically  meta.uA is distance in percentage between
 * start of ray vector and vector with collision
 *
 * @see
 *  intersectVec2Point
 *
 * @param {IntersectPoint} a
 * @param {IntersectPoint} b
 *
 * @returns {IntersectPoint}
 */
const compareIntersectPoints = (a, b) => (
  b && (!a || pickPercentageIntersectDistance(a) > pickPercentageIntersectDistance(b))
    ? b
    : a
);

/**
 * Picks intersect distance with lowest uA
 *
 * @param {Ray} ray
 * @returns {Point}
 */
const getClosestRayIntersectPoint = (ray) => {
  const {collisionPoints: rayPoints} = ray;
  let closestPoint = null;

  if (rayPoints.length > 0) {
    for (let j = rayPoints.length - 1; j >= 0; --j) {
      const collisionPoint = rayPoints[j];
      closestPoint = compareIntersectPoints(closestPoint, collisionPoint);
    }
  }

  // assign mapped value
  return closestPoint;
};

/**
 * @see
 * https://pl.wikipedia.org/wiki/Algorytm_Cohena-Sutherlanda
 * https://stackoverflow.com/questions/563198/how-do-you-detect-where-two-line-segments-intersect/565282#565282
 */
export default class CarIntersectRays {
  constructor(
    body,
    {
      viewDistance = 100,
      raysCount = 8,
      raysViewportAngle = toRadians(180),
    },
  ) {
    // car body
    this.body = body;

    // rays config
    this.viewDistance = viewDistance;
    this.raysCount = raysCount;
    this.raysViewportAngle = raysViewportAngle;

    // each ray should update when car move
    this.rays = this.createRays();
  }

  /**
   * Iterates over all rays and picks closes intersection point,
   * instead of getClosesRaysIntersect(), returns array
   *
   * IT IS DEFAULTED TO 1
   *
   * @see
   *  getClosesRaysIntersect
   *  neuralControlCar
   *
   * @returns {Point[]}
   */
  pickRaysClosestIntersects() {
    const {rays} = this;
    const raysIntersectPoints = [];

    for (let i = rays.length - 1; i >= 0; --i) {
      const percentageDistance = getClosestRayIntersectPoint(rays[i]);

      raysIntersectPoints[i] = (
        percentageDistance === null
          ? 1
          : pickPercentageIntersectDistance(percentageDistance)
      );
    }

    return raysIntersectPoints;
  }

  /**
   * Creates array of rays and attaches it
   * to BORDER of car bodys
   *
   * @returns {Line[]}
   */
  createRays() {
    const {
      raysCount,
      body: {
        pos,
        cornersLines: bodyLines,
      },
    } = this;

    /**
     * iterates over all vectors and tries to find ray intersect with body lines
     * if found - sets bodyAttachPoint to vector
     * unless - sets bodyAttachPoint vector to massCenter
     *
     * @see
     *  bodyAttachPoint MUST BE RELATIVE TO BODY CENTER NOT GLOBAL ORIGIN!!!!
     *  ...due to rotation issues
     */
    const setBodyAttachPoints = (ray) => {
      const bodyIntersectPoint = findLinesRayIntersect(bodyLines, ray) || pos;

      return {
        ...ray,
        // make it relative to center pos of body
        // bodyAttachPoint: ZERO_VEC2,
        bodyAttachPoint: this.body.toBodyRelativeVector(bodyIntersectPoint),

        // used in collision updater
        collisionPoints: [],
      };
    };

    /**
     * @todo Remove double updateRaysPosition call,
     * it mige be done in one call, in theory ofc
     */
    return R.compose(
      ::this.updateRaysPositions,
      R.map(setBodyAttachPoints),
      lines => (
        this.updateRaysPositions(lines, 20000)
      ),
      createBlankLines,
    )(raysCount);
  }

  /**
   * Because car's position is updating also
   * rays relative to car angle and other stuff,
   * do not use pure functions here, it is slow
   * and GC really dislikes it
   *
   * @param {Line[]} rays
   *
   * @returns {Line[]}
   */
  updateRaysPositions(
    rays = this.rays,
    viewDistance = this.viewDistance,
  ) {
    const {
      raysCount,
      raysViewportAngle,
    } = this;

    const rayAngle = raysViewportAngle / (this.raysCount - 1);
    const offset = (Math.PI / 2) - (raysViewportAngle / 2);

    for (let i = raysCount - 1; i >= 0; --i) {
      const ray = rays[i];
      const attachPoint = ray.bodyAttachPoint || ZERO_VEC2;

      ray.from = this.body.createBodyRelativeVector(attachPoint);
      ray.to = this.body.createBodyRelativeVector(
        addVec2(
          attachPoint,
          scalarToVec2(
            -(i * rayAngle) - offset,
            viewDistance,
            -1,
          ),
        ),
      );
    }

    return rays;
  }

  /**
   * Check position between each ray and each element on board
   *
   * @param {Line[]} rays
   */
  checkCollisions(
    board,
    rays = this.rays,
  ) {
    for (let i = rays.length - 1; i >= 0; --i) {
      const ray = rays[i];
      ray.collisionPoints = [];

      for (let j = board.length - 1; j >= 0; --j) {
        const boardItem = board[j];
        if (!boardItem.checkLineCollision)
          continue;

        // line might see multiple lines
        const intersectPoint = boardItem.checkLineCollision(ray);
        if (intersectPoint)
          ray.collisionPoints.push(intersectPoint);
      }
    }
  }

  /**
   * Slooow rays update!
   *
   * @todo
   *  Reduce GC overhead, just update existing array instead recreating
   */
  update(delta, board) {
    this.updateRaysPositions();
    this.checkCollisions(board);
  }
}
