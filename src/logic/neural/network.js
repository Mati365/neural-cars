import * as R from 'ramda';

import transformArgsToList from 'utils/transformArgsToList';
import {
  createLayerWeights,
  getNeurons,
  pluckLayerNeuronsValues,
} from './createNeuralLayer';

export const assignWeights = R.assoc('weights');

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
 * @param {Boolean}       createBlankWeights  network will create empty array of weights per layer
 * @param {Layer}         layer
 * @param {NeuralNetwork} network
 *
 * @returns {NeuralNetwork}
 */
export const appendNetworkLayer = R.curry(
  (
    createBlankWeights,
    layer,
    network,
  ) => (
    R.evolve(
      {
        layers: R.append(layer), // append layer to list of layers

        // each layer should be conencted to previous layer using edges(weights)
        weights: R.ifElse(
          createBlankWeights
            ? R.equals(0)
            : R.T,

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
 * @param {Boolean}   createBlankWeights
 * @param {Layer...}  layers
 *
 * @returns {NeuralNetwork}
 */
export const createNeuralNetwork = createBlankWeights => R.compose(
  layers => R.reduce(
    R.flip(
      appendNetworkLayer(createBlankWeights),
    ),
    blankNeuralNetwork(),
    layers,
  ),
  transformArgsToList,
);

/**
 * Create network with predefined weights
 *
 * @param {Layer[]}   layers
 * @param {Array[][]} weights
 *
 * @returns {NeuralNetwork}
 */
export const createWeightedNeuralNetwork = (layers, weights) => R.compose(
  assignWeights(weights),
  createNeuralNetwork(false),
)(layers);

/**
 * Return neural network outputs
 *
 * @param {NeuralNetwork} network
 *
 * @returns {Number[]} outputs
 */
export const getNeuralNetworkValues = R.compose(
  pluckLayerNeuronsValues,
  R.last,
  R.prop('layers'),
);
