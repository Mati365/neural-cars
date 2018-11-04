import * as R from 'ramda';

import toRadians from 'logic/math/toRadians';
import {createBlankLines} from 'logic/math/line';
import {
  ZERO_VEC2,
  scalarToVec2,
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
      viewDistance = 100,
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
    this.rays = createBlankLines(R.always([]))(raysCount);
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
  updateRaysPositions(rays = this.rays) {
    const {
      viewDistance,
      raysCount,
      raysViewportAngle,
    } = this;

    const rayAngle = raysViewportAngle / this.raysCount;
    const offset = (Math.PI / 2) - (raysViewportAngle / 2);

    for (let i = raysCount - 1; i >= 0; --i) {
      const ray = rays[i];

      ray.from = this.body.createBodyRelativeVector(ZERO_VEC2);
      ray.to = this.body.createBodyRelativeVector(
        scalarToVec2(
          -(i * rayAngle) - offset,
          viewDistance,
          -1,
        ),
      );
    }

    return rays;
  }

  /**
   * Slooow rays update!
   *
   * @todo
   *  Reduce GC overhead, just update existing array instead recreating
   */
  update() {
    this.updateRaysPositions();
  }
}
