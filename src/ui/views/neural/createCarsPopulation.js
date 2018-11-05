import * as R from 'ramda';

import * as T from 'logic/neural-vectorized';

import {normalizeAngle} from 'logic/math/toRadians';
import {clamp} from 'logic/math';
import {createPopulation} from 'logic/genetic';

import Car from '../objects/Car';

const NEURAL_CAR_INPUTS = {
  SPEED_INPUT: 0,
  ANGLE_INPUT: 1,
};

const NEURAL_CAR_OUTPUTS = {
  SPEED_INPUT: 0,
  TURN_INPUT: 1,
};

// const createBipolarLayer = T.createLayer(T.NEURAL_ACTIVATION_TYPES.SIGMOID_BIPOLAR);
const createBipolarLayer = T.createLayer(T.NEURAL_ACTIVATION_TYPES.SIGMOID_BIPOLAR);

/**
 * Creates basic game neural network
 *
 * @param {Object} raysConfig
 *
 * @returns {NeuralNetwork}
 */
const createCarNeural = ({raysCount}) => {
  const inputCount = raysCount + R.keys(NEURAL_CAR_INPUTS).length;
  const outputsCount = R.keys(NEURAL_CAR_OUTPUTS).length;

  return T.createNeuralNetwork([
    T.createInputLayer(inputCount),
    createBipolarLayer(inputCount * 2),
    createBipolarLayer(outputsCount),
  ]);
};

/**
 * Returns true if car contains collisions ony any layer
 *
 * @param {NeuralItem}  neuralItem
 * @param {Number}      delta
 * @param {Board}       board
 *
 * @returns {Boolean}
 */
const updateCarFitness = (
  {
    object: {body, aabb},
    fitness,
  },
  delta,
  board,
) => {
  if (aabb.isCollisionDetected(board))
    return false;

  return fitness + body.speed;
};

/**
 * Car AI
 *
 * @param {Object}  neuralCar
 * @param {Number}  delta
 */
const neuralControlCar = (neuralCar, delta) => {
  const {
    neural, // ai
    object: {
      body,
      intersectRays,
    },
  } = neuralCar;

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
    body.steerAngle + (neuralOutput[1] * delta / 20),
  );

  body.speed = clamp(
    body.maxSpeed / 2,
    body.maxSpeed,
    body.speed + neuralOutput[0] * delta / 30,
  );
};

/**
 * Creates population of cars with default cars AI
 *
 * @param {Number} size
 * @param {Object} initialConfigm
 * @param {Object} raysConfig
 */
const createCarsPopulation = (
  size,
  initialConfig,
  raysConfig = {
    raysCount: 9,
  },
) => createPopulation(
  {
    size,
    methods: {
      updateFitness: updateCarFitness,
      update: neuralControlCar,
      creator: {
        neural: () => createCarNeural(raysConfig),
        object: () => (
          new Car(
            R.clone(initialConfig),
            R.clone(raysConfig),
          )
        ),
      },
    },
  },
);

export default createCarsPopulation;