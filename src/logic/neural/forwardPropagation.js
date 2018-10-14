import * as R from 'ramda';

import indexedMap from 'utils/indexedMap';
import indexedReduce from 'utils/indexedReduce';

import {pluckLayerNeuronsValues} from './createNeuralLayer';
import NeuralActivationFn from './neuralActivationFn';

const getNeuronActivationValue = (inputSum, neuron) => (
  NeuralActivationFn[neuron.activationFnType](inputSum - neuron.bias)
);

/**
 * It sums all previous weights connected to neuron
 * It should be optimized!
 *
 * @param {Object}  prevLayerNeurons
 *
 * @todo
 *  Optimize performance, remove `indexedReduce` to someting faster
 */
const updateNeuronValue = prevLayerNeurons => (neuron, neuronIndex) => {
  const inputSum = indexedReduce(
    (acc, prevNeuronValue, prevNeuronIndex) => (
      acc + (prevNeuronValue * prevLayerNeurons.weights[prevNeuronIndex][neuronIndex])
    ),
    0,
    prevLayerNeurons.values,
  );

  return {
    ...neuron,
    value: getNeuronActivationValue(inputSum, neuron),
  };
};

/**
 * @param {Number[]}        inputValues
 * @param {NeuralNetwork}   network
 *
 * @returns {NeuralNetwork}
 */
const forwardPropagation = (inputValues, network) => ({
  ...network,
  layers: indexedReduce(
    (previousLayers, layer, layerIndex) => {
      // ignore inputs layer
      if (!layerIndex)
        return [layer];

      // it should be length of previous layer neurons length
      // and should contain inside each item weights count that
      // is equal to count of neurons in current layer
      const prevLayerNeurons = {
        weights: network.weights[layerIndex - 1],

        // input neurons does not contain value
        values: (
          layerIndex === 1
            ? inputValues
            : pluckLayerNeuronsValues(previousLayers[layerIndex - 1])
        ),
      };

      // sum all weights values with all previous neuron values
      return [
        ...previousLayers,
        R.evolve(
          {
            neurons: indexedMap(
              updateNeuronValue(prevLayerNeurons),
            ),
          },
          layer,
        ),
      ];
    },
    [],
    network.layers,
  ),
});

export default forwardPropagation;
