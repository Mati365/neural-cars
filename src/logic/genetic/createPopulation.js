import * as R from 'ramda';

/**
 * Create population with items
 *
 * @param {Object}    config
 * @param {Function}  itemCreatorFn
 *
 * @returns {Population}
 */
const createPopulation = (config, itemCreatorFn) => ({
  config,
  items: R.times(
    itemCreatorFn,
    config.size,
  ),
});

export default createPopulation;
