import * as R from 'ramda';
import transformArgsToList from 'utils/transformArgsToList';

/**
 * Create default, blank neural network,
 * it is Layer schema for rest of data
 *
 * @returns {NeuralNetwork}
 */
export const blankNeuralNetwork = () => ({
  layers: [],
});

/**
 * @param {Layer}           layer
 * @param {NeuralNetwork}   network
 *
 * @returns {NeuralNetwork}
 */
export const appendNetworkLayer = R.useWith(
  R.evolve,
  [
    /** LAYER */ layer => ({
      layers: R.append(layer), // append layer to list
    }),
    /** NETWORK */ R.identity,
  ],
);

/**
 * Create neural network from provided layers.
 * Layers are ordered:
 * [Input Layer, ... hidden layers ..., Output Layer]
 *
 * @param {Layer...} layers
 *
 * @returns {NeuralNetwork}
 */
export const createNeuralNetwork = R.compose(
  layers => R.reduce(
    R.flip(appendNetworkLayer),
    blankNeuralNetwork(),
    layers,
  ),
  transformArgsToList,
);
