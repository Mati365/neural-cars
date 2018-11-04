import toRadians from 'logic/math/toRadians';

import line from 'logic/math/line';
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
    this.rays = this.getRays();
  }

  getRays() {
    const {
      viewDistance,
      raysCount,
      raysViewportAngle,
    } = this;

    const rays = [];
    const rayAngle = raysViewportAngle / this.raysCount;
    const offset = (Math.PI / 2) - (raysViewportAngle / 2);

    for (let i = raysCount; i >= 0; --i) {
      rays.push(
        line(
          this.body.createBodyRelativeVector(ZERO_VEC2),
          this.body.createBodyRelativeVector(
            scalarToVec2(
              -(i * rayAngle) - offset,
              viewDistance,
              -1,
            ),
          ),
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
    this.rays = this.getRays();
  }
}
