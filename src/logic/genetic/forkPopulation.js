import * as R from 'ramda';

import getRandomNumber, {selectRandomFromArray} from 'utils/getRandomNumber';

const sumBy = prop => R.compose(
  R.sum,
  R.pluck(prop),
);

/**
 * Not used, it doesnt work well with cars
 */
const pickRandomItemsFromWeightedArray = R.curry(
  (weightProp, count, items) => {
    const sum = sumBy(weightProp)(items);

    return R.times(
      () => {
        const randomSum = getRandomNumber(0, sum - 1);
        let p = 0;
        for (let i = 0, n = items.length; i < n; ++i) {
          const item = items[i];
          p += item.fitness;

          if (p >= randomSum)
            return item;
        }

        // it should never happen
        return null;
      },
      count,
    );
  },
);

export const pickRandomParentByFitness = pickRandomItemsFromWeightedArray('fitness');

const getParentsByFitness = (count, items) => R.compose(
  R.reverse,
  R.takeLast(count),
  R.sortBy(R.prop('fitness')),
)(items);

const mutateNeuralNetwork = R.compose(
  R.objOf('layers'),
  R.map(
    R.evolve(
      {
        weightsMatrix: R.unless(
          R.isNil,
          R.map(
            R.map(
              (weight) => {
                if (Math.random() > 0.95)
                  return weight * getRandomNumber(0.5, 2);

                if (Math.random() > 0.65)
                  return weight + getRandomNumber(-1.5, 1.5);

                return weight;
              },
            ),
          ),
        ),
      },
    ),
  ),
  R.prop('layers'),
  R.clone,
);

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
 * @param {NeuralItem[]}  neuralItems
 *
 * @see
 * https://4programmers.net/Z_pogranicza/Sztuczne_sieci_neuronowe_i_algorytmy_genetyczne
 * https://pl.wikipedia.org/wiki/Algorytm_genetyczny
 *
 * https://stackoverflow.com/a/14020358
 * https://www.tutorialspoint.com/genetic_algorithms/genetic_algorithms_parent_selection.htm
 *
 * Algorithm:
 * http://www.cleveralgorithms.com/nature-inspired/evolution/genetic_algorithm.html
 */
const forkPopulation = (neuralItems) => {
  const parents = getParentsByFitness(3, neuralItems);
  const crossedItems = R.map(
    () => {
      // ignore mutation, just clone parent
      // maybe it will be better to select the best parent instead random
      const newItem = crossoverNeuralNetworks(
        selectRandomFromArray(parents).neural,
        selectRandomFromArray(parents).neural,
      );
      return newItem;
    },
    neuralItems,
  );

  const mutatedNeurals = R.map(
    mutateNeuralNetwork,
    crossedItems,
  );

  return mutatedNeurals;
};

export default forkPopulation;
