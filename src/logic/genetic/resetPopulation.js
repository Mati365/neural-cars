import * as R from 'ramda';

import getRandomNumber from 'utils/getRandomNumber';
import createPopulation from './createPopulation';

const findBiggestFitnessItem = R.reduce(
  (acc, item) => (
    !acc || item.fitness > acc.fitness
      ? item
      : acc
  ),
  null,
);

// const sumBy = prop => R.compose(
//   R.sum,
//   R.pluck(prop),
// );

const mutateNeuralNetwork = R.compose(
  R.objOf('layers'),
  R.map(
    R.evolve(
      {
        weightsMatrix: R.unless(
          R.isNil,
          R.map(
            R.map(
              weight => (weight + getRandomNumber(-0.25, 0.25)),
            ),
          ),
        ),
      },
    ),
  ),
  R.prop('layers'),
  R.clone,
);

// const pickRandomItemsFromWeightedArray = R.curry(
//   (weightProp, count, items) => {
//     const sum = sumBy(weightProp)(items);

//     return R.times(
//       () => {
//         const randomSum = getRandomNumber(0, sum);
//         let p = 0;
//         for (let i = 0, n = items.length; i < n; ++i) {
//           const item = items[i];
//           p += item.fitness;

//           if (p >= randomSum)
//             return item;
//         }

//         // it should never happen
//         return null;
//       },
//       count,
//     );
//   },
// );
// pickRandomItemsFromWeightedArray('fitness');

const getParentsByFitness = (count, items) => R.compose(
  R.takeLast(count),
  R.sortBy(R.prop('fitness')),
)(items);

const crossoverNeuralNetworks = (a, b) => {
  const crossedNeural = R.clone(a);

  for (let i = 0; i < crossedNeural.layers.length; ++i) {
    const layer = crossedNeural.layers[i];
    if (!layer.weightsMatrix)
      continue;

    for (let j = 0; j < layer.weightsMatrix.length; ++j) {
      const row = layer.weightsMatrix[j];
      const slicePoint = getRandomNumber(0, row.length);

      layer.weightsMatrix[j] = [
        ...row.slice(0, slicePoint),
        ...b.layers[i].weightsMatrix[j].slice(slicePoint, row.length),
      ];
    }
  }

  return crossedNeural;
};

/**
 *
 * @see
 * https://stackoverflow.com/a/14020358
 * https://www.tutorialspoint.com/genetic_algorithms/genetic_algorithms_parent_selection.htm
 *
 * Algorithm:
 * http://www.cleveralgorithms.com/nature-inspired/evolution/genetic_algorithm.html
 */
const resetPopulation = (population) => {
  const {config, items} = population;
  const newNeurals = R.map(
    () => {
      const parents = getParentsByFitness(2, items);

      // ignore mutation, just clone parent
      // maybe it will be better to select the best parent instead random
      const newItem = (
        Math.random() > 0.9
          ? findBiggestFitnessItem(parents).neural
          : crossoverNeuralNetworks(parents[0].neural, parents[1].neural)
      );

      return newItem;
    },
    population.items,
  );

  return createPopulation(
    {
      ...config,
      methods: {
        ...config.methods,
        creator: {
          ...config.methods.creator,
          neural: index => mutateNeuralNetwork(newNeurals[index]),
        },
      },
    },
  );
};

export default resetPopulation;
