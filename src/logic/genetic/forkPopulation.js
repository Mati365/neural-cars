import * as R from 'ramda';

import getRandomNumber from 'utils/getRandomNumber';
import {
  loadGenesToMatrix,
  getNeuralWeightsGenes,
} from './genes';

const getParentsByFitness = count => R.compose(
  R.reverse,
  R.takeLast(count),
  R.sortBy(R.prop('fitness')),
);

const mutateGene = (gene) => {
  if (Math.random() > 0.95)
    return gene * getRandomNumber(-1.1, 1.1);

  if (Math.random() > 0.95)
    return gene + getRandomNumber(-0.05, 0.05);

  return gene;
};

const mutateGenes = R.map(mutateGene);

const crossoverGenes = (geneA, geneB) => R.times(
  index => (
    Math.random() > 0.4 ? geneA[index] : geneB[index]
  ),
  geneA.length,
);

const mutateNeuralBiases = ({layers}) => {
  for (let i = 0; i < layers.length; ++i) {
    const {neuronsMatrix} = layers[i];
    if (!neuronsMatrix)
      continue;

    for (let j = 0; j < neuronsMatrix.length; ++j) {
      const neuron = neuronsMatrix[j];
      neuron.bias = mutateGene(neuron.bias);
    }
  }
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
  const parents = R.compose(
    R.map(
      ({neural}) => ({
        genes: getNeuralWeightsGenes(neural),
        neural,
      }),
    ),
    getParentsByFitness(4),
  )(neuralItems);

  const crossedItems = R.map(
    () => {
      // ignore mutation, just clone parent
      // maybe it will be better to select the best parent instead random
      const newGenes = mutateGenes(
        crossoverGenes(
          parents[0].genes,
          parents[1].genes,
        ),
      );

      return mutateNeuralBiases(
        loadGenesToMatrix(
          newGenes,
          R.clone(parents[0].neural),
        ),
      );
    },
    neuralItems,
  );

  return crossedItems;
};

export default forkPopulation;
