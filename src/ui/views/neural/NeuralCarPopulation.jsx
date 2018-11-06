import * as R from 'ramda';

import forkPopulation from 'logic/genetic/forkPopulation';

import NeuralCarController from './NeuralCarController';
import {Car} from '../objects';

/**
 * Population of object to be trained
 *
 * @export
 */
export default class NeuralCarPopulation {
  constructor(size, defaultCarConfig) {
    this.size = size;
    this.defaultCarConfig = defaultCarConfig;

    // creates new population of cars
    this.items = this.createGeneration();
  }

  createGeneration(neurals = []) {
    const {size, defaultCarConfig} = this;

    return R.times(
      index => new NeuralCarController(
        new Car(defaultCarConfig, neurals[index]),
      ),
      size,
    );
  }

  /**
   * Creates new cars population
   */
  nextGeneration() {
    const {items} = this;

    this.items = this.createGeneration(
      forkPopulation(items),
    );
  }

  /**
   * Polymorphic population updater
   *
   * @param {Number}  delta
   * @param {Board}   board
   */
  update(delta, board) {
    const {items} = this;
    let allKilled = true;
    let bestIndex = null;

    for (let i = 0, n = items.length; i < n; ++i) {
      const item = items[i];
      if (bestIndex === null || item.fitness > items[bestIndex].fitness)
        bestIndex = i;

      if (!item.killed) {
        allKilled = false;
        item.update(delta, board);
      }
    }

    this.bestItemIndex = bestIndex;
    if (allKilled)
      this.nextGeneration();
  }

  /**
   * Polymorphic population renderer
   *
   * @param {Context2D} ctx
   */
  render(ctx) {
    const {items, bestItemIndex} = this;

    for (let i = 0, n = items.length; i < n; ++i) {
      const item = items[i];
      item.render(ctx);
    }

    if (bestItemIndex !== null)
      items[bestItemIndex].render(ctx, '#00ff00');
  }
}