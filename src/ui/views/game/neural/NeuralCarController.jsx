import * as R from 'ramda';

import * as T from 'logic/neural-vectorized';

import {normalizeAngle} from 'logic/math/toRadians';
import {clamp} from 'logic/math';
import {
  vec2Distance,
  pickVec2Attrs,
} from 'logic/math/vec2';

const NEURAL_CAR_INPUTS = {
  SPEED_INPUT: 0,
  ANGLE_INPUT: 1,
};

const NEURAL_CAR_OUTPUTS = {
  SPEED_INPUT: 0,
  TURN_INPUT: 1,
};

const createTanH = T.createLayer(T.NEURAL_ACTIVATION_TYPES.TAN_H);

/**
 * Creates basic game neural network
 *
 * @param {Number} raysCount
 *
 * @returns {NeuralNetwork}
 */
const createCarNeural = (raysCount) => {
  const inputCount = raysCount + R.keys(NEURAL_CAR_INPUTS).length;
  const outputsCount = R.keys(NEURAL_CAR_OUTPUTS).length;

  return T.createNeuralNetwork([
    T.createInputLayer(inputCount),
    createTanH(
      Math.floor(inputCount * 2 / 3) + outputsCount,
    ),
    createTanH(outputsCount),
  ]);
};

/**
 * Car controlled by Neural network
 *
 * @export
 */
export default class NeuralClass {
  killed = false;

  constructor(car, neural) {
    this.car = car;
    this.neural = neural || createCarNeural(car.intersectRays.raysCount);
  }

  get fitness() {
    const {totalDistance, distanceFromStart} = this;
    return totalDistance + (distanceFromStart / 2);
  }

  hasCollision(board) {
    const {car: {aabb}} = this;

    return aabb.isCollisionDetected(board);
  }

  /**
   * Hear of car brain, feed neural network with
   * rays inputs of car and update body variables
   *
   * @param {Number} delta
   */
  neuralControlCar(delta) {
    const {
      neural,
      car: {
        body,
        intersectRays,
      },
    } = this;

    // neural control
    const neuralOutput = T.exec(
      [
        body.speed / body.maxSpeed * 5, // nornalize speed
        normalizeAngle(body.steerAngle) * 5,
        ...R.map(
          num => (1 - num) * 5,
          intersectRays.pickRaysClosestIntersects(),
        ),
      ],
      neural,
    );

    body.steerAngle = clamp(
      -body.maxSteerAngle,
      body.maxSteerAngle,
      body.steerAngle + (neuralOutput[1] * delta / 30),
    );

    body.speed = clamp(
      body.maxSpeed / 2,
      body.maxSpeed,
      body.speed + (neuralOutput[0] * delta / 30),
    );
  }

  /**
   * Used in car population car classify
   *
   * @param {Board} board
   */
  updateStats() {
    const {
      prevPos,
      car: {
        body,
      },
    } = this;

    if (!this.startPos)
      this.startPos = pickVec2Attrs(body.pos);

    this.distanceFromStart = vec2Distance(this.startPos, body.pos);
    this.totalDistance = (
      (this.totalDistance || 0)
        + (prevPos ? vec2Distance(prevPos, body.pos) : 0)
    );

    this.prevPos = pickVec2Attrs(body.pos);
    return body.totalDistance || 0;
  }

  /**
   * Polymorphic car updater
   *
   * @param {Number}  delta
   * @param {Board}   board
   */
  update(delta, board) {
    const {car} = this;

    if (!this.killed) {
      this.updateStats(board);
      this.neuralControlCar(delta);

      car.update(delta, board);

      if (car.aabb.isCollisionDetected(board))
        this.killed = true;
    }
  }

  /**
   * Polymorphic car renderer
   *
   * @param {Context2D} ctx
   * @param {String}    mainColor
   */
  render(ctx, mainColor) {
    const {car, killed} = this;

    if (killed)
      ctx.globalAlpha = 0.2;

    car.render(ctx, mainColor);

    if (killed)
      ctx.globalAlpha = 1;
  }
}
