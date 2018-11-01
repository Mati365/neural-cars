import {toRadians} from 'logic/math';
import {addVec2To} from 'logic/math/vec2';

import {CtxUtils} from 'ui/utils';
import {
  getPreferredWheelSize,
  createWheelsAxis,
  drawWheel,
} from './Wheel';

const getScalarVector = (angle, scalar) => ({
  x: (Math.cos(angle) * scalar),
  y: (Math.sin(angle) * scalar),
});

class CarPhysicsBody {
  constructor(rect, velocity = 0.1) {
    const wheelSize = getPreferredWheelSize(rect);

    this.rect = rect;
    this.wheels = [
      ...createWheelsAxis(0.15, wheelSize, toRadians(20), rect),
      ...createWheelsAxis(0.73, wheelSize, 0.0, rect),
    ];

    this.velocity = velocity;
    this.angle = 0;
  }

  updateWheels(delta) {
    const {
      velocity,
      wheels,
    } = this;

    const deltaVelocity = velocity * delta;

    for (let i = wheels.length - 1; i >= 0; --i) {
      const {
        rect: wheelRect,
        angle: wheelAngle,
      } = wheels[i];

      const wheelVelocity = getScalarVector(
        wheelAngle + (Math.PI / 2),
        deltaVelocity,
      );

      addVec2To(
        wheelVelocity,
        wheelRect,
        -1,
      );
    }
  }

  update(delta) {
    this.updateWheels(delta);
  }
}

export default class Car {
  constructor(rect) {
    this.body = new CarPhysicsBody(rect);
  }

  update(delta) {
    this.body.update(delta);
  }

  render(ctx) {
    const {
      body: {
        angle,
        rect,
        wheels,
      },
    } = this;

    const rotateOrigin = {
      x: rect.w / 2,
      y: rect.h / 2,
    };

    // rotation
    ctx.save();
    ctx.translate(
      rect.x + rotateOrigin.x,
      rect.y + rotateOrigin.y,
    );
    ctx.rotate(angle);
    ctx.translate(
      -rotateOrigin.x,
      -rotateOrigin.y,
    );

    // base corpse
    CtxUtils.drawRect(
      {
        x: 0,
        y: 0,
        w: rect.w,
        h: rect.h,
      },
      1,
      '#fff',
      ctx,
    );

    // front axis
    for (let i = wheels.length - 1; i >= 0; --i)
      drawWheel(wheels[i], ctx);

    ctx.restore();
  }
}
