import * as R from 'ramda';

import toRadians from 'logic/math/toRadians';

import {
  findLinesRayIntersect,
  createBlankLines,
  extractRectCornersLines,
} from 'logic/math/line';

import {
  ZERO_VEC2,
  scalarToVec2,
  addVec2,
} from 'logic/math/vec2';

/**
 * @see
 * https://pl.wikipedia.org/wiki/Algorytm_Cohena-Sutherlanda
 * https://stackoverflow.com/questions/563198/how-do-you-detect-where-two-line-segments-intersect/565282#565282
 */
export default class CarIntersectRays {
  constructor(
    body,
    {
      viewDistance = 80,
      raysCount = 9,
      raysViewportAngle = toRadians(120),
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
        corners,
      },
    } = this;

    // intersect point between edges of rectangle and lines
    const bodyLines = extractRectCornersLines(corners);

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
        if (!boardItem.checkRayCollision)
          continue;

        // line might see multiple lines
        const intersectPoint = boardItem.checkRayCollision(ray);
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
