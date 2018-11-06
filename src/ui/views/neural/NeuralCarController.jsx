import * as R from 'ramda';

import * as T from 'logic/neural-vectorized';

import {normalizeAngle} from 'logic/math/toRadians';
import {vec2Distance} from 'logic/math/vec2';
import {clamp} from 'logic/math';

const NEURAL_CAR_INPUTS = {
  SPEED_INPUT: 0,
  ANGLE_INPUT: 1,
};

const NEURAL_CAR_OUTPUTS = {
  SPEED_INPUT: 0,
  TURN_INPUT: 1,
};

const createBipolarLayer = T.createLayer(T.NEURAL_ACTIVATION_TYPES.SIGMOID_BIPOLAR);

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
    createBipolarLayer(Math.floor(inputCount * 2)),
    createBipolarLayer(outputsCount),
  ]);
};

/**
 * Car controlled by Neural network
 *
 * @export
 */
export default class NeuralClass {
  fitness = 0;

  killed = false;

  constructor(car, neural) {
    this.car = car;
    this.neural = neural || createCarNeural(car.intersectRays.raysCount);
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
        body.speed / body.maxSpeed, // nornalize speed
        normalizeAngle(body.angle),
        ...intersectRays.pickRaysClosestIntersects(),
      ],
      neural,
    );

    body.steerAngle = clamp(
      -body.maxSteerAngle,
      body.maxSteerAngle,
      body.steerAngle + (neuralOutput[1] * delta / 35),
    );

    body.speed = clamp(
      body.maxSpeed / 2,
      body.maxSpeed,
      body.speed + neuralOutput[0] * delta / 30,
    );
  }

  /**
   * Used in car population car classify
   *
   * @param {Board} board
   */
  updateCarFitness(board) {
    const {
      fitness,
      prevPos,
      car: {
        body,
        aabb,
      },
    } = this;

    if (!this.startPos)
      this.startPos = R.clone(body.pos);

    if (aabb.isCollisionDetected(board))
      return fitness + vec2Distance(this.startPos, body.pos);

    if (this.prevPos)
      body.totalDistance = (body.totalDistance || 0) + vec2Distance(prevPos, body.pos);

    this.prevPos = R.clone(body.pos);
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
    this.killed = this.killed || this.hasCollision(board);

    if (!this.killed) {
      this.fitness = this.updateCarFitness(board);
      this.neuralControlCar(delta);

      car.update(delta, board);
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
