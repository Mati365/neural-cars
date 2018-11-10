import * as R from 'ramda';

import getRandomNumber, {selectRandomFromArray} from 'utils/getRandomNumber';
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

const mutateValues = R.map(
  (gene) => {
    if (Math.random() > 0.9)
      return gene * getRandomNumber(1.0, 1.1);

    if (Math.random() > 0.9)
      return gene + getRandomNumber(-0.15, 0.15);

    return gene;
  },
);

const crossoverValues = (geneA, geneB) => {
  const slicePoint = getRandomNumber(0, geneA.length - 1);

  return [
    ...geneA.slice(0, slicePoint),
    ...geneB.slice(slicePoint, geneB.length),
  ];
};

const crossoverGenes = (neuralA, neuralB) => {
  const [_a, _b] = (
    Math.random() > 0.5
      ? [neuralA, neuralB]
      : [neuralB, neuralA]
  );

  return {
    ..._a,
    biases: crossoverValues(_a.biases, _b.biases),
  };
};

/**
 * Evolves neural network based on parents genes
 *
 * @param {1DNeuralNetwork[]} winners1D
 */
const evolve1DNeurals = winners1D => () => {
  const crossedNeural = (
    Math.random() > 0.95
      ? crossoverGenes(
        selectRandomFromArray(winners1D),
        selectRandomFromArray(winners1D),
      )
      : crossoverGenes(winners1D[0], winners1D[1])
  );

  return R.mapObjIndexed(
    mutateValues,
    crossedNeural,
  );
};

/**
 * Creates mutation chain for neural network.
 * neuralSchema is used only for restore 1D neural network
 *
 * @param {NeuralNetwork[]} winnersNeurals
 */
const createNeuralMutator = winnersNeurals => R.compose(
  T.restoreFrom1D(winnersNeurals[0]),
  evolve1DNeurals(
    R.map(T.dumpTo1D, winnersNeurals),
  ),
);

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
  const mutate = createNeuralMutator(winners); // it is just schema

  return R.compose(
    R.addIndex(R.map)(
      (item, index) => {
        // save winrars in neural network
        // prevent regression!
        if (index < winners.length)
          return winners[index].neural;

        // mutate other childs
        return mutate(item);
      },
    ),
    pluckNeural,
  )(neuralItems);
};

export default forkPopulation;
