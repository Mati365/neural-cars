import * as R from 'ramda';

import transformArgsToList from 'utils/transformArgsToList';
import {createLayerWeights} from './createNeuralLayer';

/**
 * Create default, blank neural network,
 * it is Layer schema for rest of data
 *
 * @returns {NeuralNetwork}
 */
export const blankNeuralNetwork = () => ({
  layers: [],
  weights: [], // length should be equal with layers.length - 1(because INPUT has not weights)
});

/**
 * @param {Layer}           layer
 * @param {NeuralNetwork}   network
 *
 * @returns {NeuralNetwork}
 */
export const appendNetworkLayer = R.curry(
  (layer, network) => R.evolve(
    {
      layers: R.append(layer), // append layer to list of layers
      weights: R.ifElse(
        R.equals(0),
        () => R.append(createLayerWeights(layer)),
        R.identity,
      )(
        network.layers.length,
      ),
    },
    network,
  ),
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
