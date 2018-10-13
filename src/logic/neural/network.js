import * as R from 'ramda';

import transformArgsToList from 'utils/transformArgsToList';
import {
  createLayerWeights,
  getNeurons,
} from './createNeuralLayer';

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
  (layer, network) => (
    R.evolve(
      {
        layers: R.append(layer), // append layer to list of layers

        // each layer should be conencted to previous layer using edges(weights)
        weights: R.ifElse(
          R.equals(0),
          R.identity, // ignore input layer
          // get count of previous layer neurons
          // and generate for each neuron list of edges that is equal
          // to length of layer neurons
          layersLength => (
            R.append(
              R.times(
                () => createLayerWeights(layer),
                getNeurons(network.layers[layersLength - 1]).length,
              ),
            )
          ),
        )(
          network.layers.length,
        ),
      },
      network,
    )
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
