import * as R from 'ramda';

import {
  indexedReduce,
  indexedMap,
} from 'utils';

import {
  getNeurons,
  pluckLayerNeuronsValues,
} from './createNeuralLayer';

/**
 * Returns last layer in network(it should be output layer)
 *
 * @param {NeuralNetwork} network
 *
 * @returns {Layer}
 */
export const getOutputLayer = R.compose(
  R.last,
  R.prop('layers'),
);

/**
 * Returns list of neurons from output layer
 *
 * @param {NeuralNetwork} network
 *
 * @returns {Neuron[]}
 */
export const getOutputNeurons = R.compose(
  getNeurons,
  getOutputLayer,
);

/**
 * Return neural network outputs
 *
 * @param {NeuralNetwork} network
 *
 * @returns {Number[]} outputs
 */
export const getNeuralNetworkValues = R.compose(
  pluckLayerNeuronsValues,
  getOutputLayer,
);

/**
 * Returns neurons and its outputs weights
 *
 * @param {Number}        index
 * @param {NeuralNetwork} network
 * @param {Layer[]}       layers
 *
 * @returns {LayerOutput[]}
 */
export const getNthLayerOutputs = (
  index,
  network,
  layers = network.layers,
) => {
  const currentWeights = network.weights[index];

  return (
    index < 0 || !currentWeights
      ? []
      : indexedMap(
        (neuron, neuronIndex) => ({
          value: neuron.value,
          weights: currentWeights[neuronIndex],
        }),
        getNeurons(layers[index]),
      )
  );
};

/**
 * Sums all connections attached to neuron
 *
 * @param {LayerOutput[]} layerOutputs
 * @param {Number}        neuronIndex
 * @returns {Number}
 */
export const sumNeuronInputs = (layerOutputs, neuronIndex) => (
  indexedReduce(
    (acc, connection) => acc + (connection.value * connection.weights[neuronIndex]),
    0,
    layerOutputs,
  )
);
