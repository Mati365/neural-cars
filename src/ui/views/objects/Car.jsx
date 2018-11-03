import {CtxUtils} from 'ui/utils';
import {drawWheel} from './Wheel';

import CarPhysicsBody from '../physics/CarPhysicsBody';

export default class Car {
  constructor(bodyConfig) {
    this.body = new CarPhysicsBody(bodyConfig);
  }

  update(delta) {
    this.body.update(delta);
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

  render(ctx) {
    const {
      body: {
        pos,
        wheels,
        wheelSize,
      },
    } = this;

    this.renderCarCorpse(ctx);
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
