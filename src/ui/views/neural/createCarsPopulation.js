import * as R from 'ramda';

import {createPopulation} from 'logic/genetic';
import {vec2Distance} from 'logic/math/vec2';

import Car from '../objects/Car';
import neuralControlCar from './neuralControlCar';
import createCarNeural from './createCarNeural';

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
  neuralItem,
  delta,
  board,
) => {
  const {
    object: {body, aabb},
    fitness,
  } = neuralItem;

  if (aabb.isCollisionDetected(board)) {
    neuralItem.fitness = body.totalDistance ** 2;
    return false;
  }

  if (!body.startPos)
    body.startPos = R.clone(body.pos);

  if (body.prevPos)
    body.totalDistance = (body.totalDistance || 0) + vec2Distance(body.prevPos, body.pos);

  body.prevPos = R.clone(body.pos);
  return fitness;
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
