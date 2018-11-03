import {toRadians} from 'logic/math';
import vec2, {
  addVec2,
  addVec2To,
  rotateVec2,
  scalarToVec2,
  vec2Center,
} from 'logic/math/vec2';

import {
  getPreferredWheelSize,
  createWheel,
} from '../objects/Wheel';

/**
 * Physics logic of a car, do not place there any render stuff
 * It must contains business logic of a car, nothing more, nothing less
 *
 * @export
 * @see
 * http://www.iforce2d.net/b2dtut/top-down-car
 * http://www.asawicki.info/Mirror/Car%20Physics%20for%20Games/Car%20Physics%20for%20Games.html
 * http://engineeringdotnet.blogspot.com/2010/04/simple-2d-car-physics-in-games.html
 */
export default class CarPhysicsBody {
  constructor({
    pos,
    size,
    speed = 0,
    angle = 0,
    steerAngle = toRadians(0),
    maxSpeed = 2,
    maxAngle = toRadians(45),
  }) {
    this.pos = pos;
    this.size = size;

    // speed is scalar, velocity should be vector
    this.speed = speed;
    this.maxSpeed = maxSpeed;

    // angle of whole car
    this.angle = angle;
    this.maxAngle = maxAngle;

    // angle of front wheels
    this.steerAngle = steerAngle;

    // wheel / axles constants
    this.wheelSize = getPreferredWheelSize(size);
    this.wheelBase = size.h * 0.6; // disance between front axis and back axis

    // mass center is center of car, relative to this
    // point wheels positions are calculated
    // todo: change it to no constant?
    this.massCenter = vec2(size.w / 2, size.h / 2);

    // array of wheels position added to mass center
    this.wheels = this.getWheels();
  }

  /**
   * Creates vector that is relative to center of car but
   * coordinates are relative to root canvas size(not car)
   *
   * @param {Vec2} v
   */
  createBodyRelativeVector(v) {
    const {pos, angle} = this;

    return addVec2(
      rotateVec2(
        angle,
        v,
      ),
      pos,
    );
  }

  /**
   * Creates new wheels based on whole car position
   *
   * @todo
   *  Optimize performance if its slow
   */
  getWheels() {
    const {
      massCenter,
      wheelBase,
      steerAngle,
      angle,
    } = this;

    return [
      // front left
      createWheel(
        angle + steerAngle,
        this.createBodyRelativeVector({
          x: -massCenter.x,
          y: -(wheelBase / 2),
        }),
      ),

      // front right
      createWheel(
        angle + steerAngle,
        this.createBodyRelativeVector(
          {
            x: massCenter.x,
            y: -(wheelBase / 2),
          },
        ),
      ),

      // back left
      createWheel(
        angle,
        this.createBodyRelativeVector(
          {
            x: -massCenter.x,
            y: (wheelBase / 2),
          },
        ),
      ),

      // back right
      createWheel(
        angle,
        this.createBodyRelativeVector(
          {
            x: massCenter.x,
            y: (wheelBase / 2),
          },
        ),
      ),
    ];
  }

  update(delta) {
    const {
      wheels,
      speed,
    } = this;

    // Math.PI / 2 - because wheels are rotated relative to landscape
    // but they are really rectangles rotated -90*
    const renderWheelAngle = Math.PI / 2;

    // update wheels pos
    for (let i = wheels.length - 1; i >= 0; --i) {
      const wheel = wheels[i];
      const velocity = scalarToVec2(
        wheel.angle - renderWheelAngle,
        speed * delta,
      );

      addVec2To(
        velocity,
        wheel.pos,
        1,
      );
    }

    this.pos = vec2Center(
      wheels[0].pos,
      wheels[3].pos,
    );

    // angle between points
    const angle = Math.atan2(
      wheels[2].pos.y - wheels[0].pos.y,
      wheels[2].pos.x - wheels[0].pos.x,
    ) - renderWheelAngle;

    // angle
    this.angle = angle;
    this.wheels = this.getWheels();
  }
}
