import {CtxUtils} from 'ui/utils';
import {drawWheel} from './Wheel';

import {
  CarPhysicsBody,
  CarAabbBox,
  CarIntersectRays,
} from '../physics';

/**
 * Do not place there any car logic
 *
 * @export
 */
export default class Car {
  constructor(bodyConfig, raysConfig = {}) {
    this.body = new CarPhysicsBody(bodyConfig);
    this.aabb = new CarAabbBox(this.body);
    this.intersectRays = new CarIntersectRays(this.body, raysConfig);
  }

  update(delta, board) {
    this.body.update(delta);
    this.intersectRays.update(delta, board);
    this.aabb.update(delta);
  }

  renderCarCorpse(ctx) {
    const {
      body: {
        angle,
        pos,
        size,
      },
    } = this;

    // rotation around mass center
    ctx.save();
    ctx.translate(
      pos.x,
      pos.y,
    );
    ctx.rotate(angle);

    CtxUtils.drawRect(
      {
        x: -size.w / 2,
        y: -size.h / 2,
        w: size.w,
        h: size.h,
      },
      1,
      '#fff',
      ctx,
    );

    ctx.restore();
  }

  renderRays(ctx) {
    const {
      intersectRays: {rays},
    } = this;

    for (let i = rays.length - 1; i >= 0; --i) {
      const ray = rays[i];
      const {collisionPoints} = ray;

      CtxUtils.drawLine(
        ray.from,
        ray.to,
        '#444',
        1,
        ctx,
      );

      CtxUtils.fillCircle(
        rays[i].from,
        2,
        'red',
        ctx,
      );

      // draw collision points
      if (collisionPoints.length) {
        for (let j = collisionPoints.length - 1; j >= 0; --j) {
          CtxUtils.fillCircle(
            collisionPoints[j],
            2,
            '#00ff00',
            ctx,
          );
        }
      }
    }
  }

  render(ctx) {
    const {
      body: {
        pos,
        wheels,
        wheelSize,
      },
    } = this;

    // draw car
    this.renderCarCorpse(ctx);

    // render rays lines under car
    this.renderRays(ctx);

    for (let i = wheels.length - 1; i >= 0; --i) {
      const wheel = wheels[i];

      drawWheel(
        wheel.pos,
        wheelSize,
        wheel.angle,
        ctx,
      );
    }

    // draw circle in center of car, debug purpose only
    CtxUtils.fillCircle(
      pos,
      2,
      '#fff',
      ctx,
    );
  }
}
