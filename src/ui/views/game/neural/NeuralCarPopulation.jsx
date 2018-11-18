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
  generation = 0;

  /**
   * Best item taken from current generation
   */
  bestItem = null;

  constructor(
    size,
    defaultCarConfig,
    {
      onNewPopulation,
    } = {},
  ) {
    this.size = size;
    this.defaultCarConfig = defaultCarConfig;
    this.onNewPopulation = onNewPopulation;

    // creates new population of cars
    this.items = this.createGeneration();
  }

  createGeneration(neurals = []) {
    const {size, defaultCarConfig} = this;

    return R.times(
      index => new NeuralCarController(
        new Car(defaultCarConfig),
        neurals[index],
      ),
      size,
    );
  }

  /**
   * Creates new cars population only if actual generation
   * is better than previous, otherwise - kill it and try again
   */
  nextGeneration() {
    // const {prevItems} = this;
    const {items, onNewPopulation} = this;

    this.generation++;

    // prevent whole population regression
    // if (prevItems && getWinnerFitness(prevItems) > getWinnerFitness(items)) {
    //   console.warn('regression detected, kill population!');
    //   items = this.prevItems;
    // }

    this.prevItems = items;
    this.items = this.createGeneration(
      forkPopulation(items),
    );

    if (onNewPopulation)
      onNewPopulation(this.items, this.generation);
  }

  /**
   * Polymorphic population updater. If all items from array are
   * dead - reset population and check if has regression
   *
   * @param {Number}  delta
   * @param {Board}   board
   */
  update(delta, board) {
    const {items} = this;
    let allKilled = true;
    let bestItem = null;

    for (let i = 0, n = items.length; i < n; ++i) {
      const item = items[i];
      if (bestItem === null || item.fitness >= bestItem.fitness)
        bestItem = item;

      if (!item.killed) {
        allKilled = false;
        item.update(delta, board);
      }
    }

    this.bestItem = bestItem;
    if (allKilled)
      this.nextGeneration();
  }

  /**
   * Polymorphic population renderer
   *
   * @param {Context2D} ctx
   */
  render(ctx) {
    const {
      items, bestItem,
    } = this;

    for (let i = 0, n = items.length; i < n; ++i) {
      const item = items[i];
      item.render(ctx);
    }

    bestItem?.render(ctx, '#00ff00');
  }
}
