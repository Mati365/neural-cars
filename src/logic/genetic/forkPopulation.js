import * as R from 'ramda';

import getRandomNumber, {
  selectRandomFromArray,
  getRandomIntInclusive,
} from 'utils/getRandomNumber';

import * as T from 'logic/neural-vectorized';

const pickFitness = R.prop('fitness');

const pluckNeural = R.pluck('neural');

export const getWinnerFitness = R.compose(
  R.last,
  R.sort((a, b) => a - b),
  R.pluck('fitness'),
);

export const getWinnersByFitness = count => R.compose(
  pluckNeural,
  R.reverse,
  R.takeLast(count),
  R.sortBy(pickFitness),
);

const mutateValues = mutateRate => R.map(
  (gene) => {
    if (Math.random() > mutateRate)
      return getRandomNumber(-0.15, 0.15) + gene * (1 + getRandomNumber(-0.15, 0.15));

    return gene;
  },
);

const crossoverValues = (geneA, geneB) => {
  const slicePoint = getRandomIntInclusive(0, geneA.length - 1);

  return [
    ...geneA.slice(0, slicePoint),
    ...geneB.slice(slicePoint, geneB.length),
  ];
};

const crossoverGenes = (neuralA, neuralB) => {
  const [_a, _b] = (
    Math.random() > 0.25
      ? [neuralA, neuralB]
      : [neuralB, neuralA]
  );

  return {
    weights: crossoverValues(_a.weights, _b.weights),
    biases: crossoverValues(_a.biases, _b.biases),
  };
};

const mutate1DNeural = mutateRate => R.mapObjIndexed(
  mutateValues(mutateRate),
);

/**
 * Creates mutation chain for neural network.
 * neuralSchema is used only for restore 1D neural network
 *
 * @param {Number}          mutateRate
 * @param {NeuralNetwork[]} winnersNeurals
 */
const createNeuralMutator = (mutateRate, winnersNeurals) => {
  const winners1D = R.map(T.dumpTo1D, winnersNeurals);

  return (itemIndex, total) => {
    let new1D = null;

    // first is made from the best items
    if (!itemIndex)
      [new1D] = winners1D;

    else if (itemIndex <= 3)
      new1D = crossoverGenes(winners1D[0], winners1D[1]);

    else if (itemIndex < total - 3) {
      new1D = crossoverGenes(
        selectRandomFromArray(winners1D),
        selectRandomFromArray(winners1D),
      );
    } else
      new1D = selectRandomFromArray(winners1D);

    return R.compose(
      T.restoreFrom1D(winnersNeurals[0]),
      mutate1DNeural(mutateRate),
    )(new1D);
  };
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
  const winners = getWinnersByFitness(4)(neuralItems);
  const mutateNeural = createNeuralMutator(0.94, winners); // it is just schema

  return R.compose(
    R.addIndex(R.map)(
      (item, index) => mutateNeural(index, neuralItems.length, item),
    ),
    pluckNeural,
  )(neuralItems);
};

export default forkPopulation;
