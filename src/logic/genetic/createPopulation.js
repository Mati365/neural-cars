import * as R from 'ramda';

/**
 * Create population with items
 *
 * @param {Object}    config
 *
 * @returns {Population}
 */
const createPopulation = (config) => {
  const {methods: {creator}} = config;

  return {
    config,
    items: R.times(
      index => ({
        object: creator.object(index),
        neural: creator.neural(index),
        fitness: 1, // default fitness
      }),
      config.size,
    ),
  };
};

export default createPopulation;
