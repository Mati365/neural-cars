import indexedReduce from 'utils/indexedReduce';

import {
  setNeuronValues,
  evolveLayerNeurons,
} from './createNeuralLayer';

import {
  getNthLayerOutputs,
  sumNeuronInputs,
} from './networkSelectors';

import {
  getNeuronActivationFn,
  setNeuronValue,
} from './createNeuron';

/**
 * Calc activation value of neuron
 *
 * @param {Number}  inputSum  returns sum all weights multipled by input neurons
 * @param {Neuron}  neuron
 */
const getNeuronActivationValue = (inputSum, neuron) => (
  getNeuronActivationFn(neuron).plain(inputSum + neuron.bias)
);

/**
 * It sums all previous weights connected to neuron
 * It should be optimized!
 *
 * @param {LayerValues} prevLayerOutputs
 *
 * @todo
 *  Optimize performance, remove `indexedReduce` to someting faster
 */
const activateNeuronValue = prevLayerOutputs => (neuron, neuronIndex) => {
  const inputSum = sumNeuronInputs(prevLayerOutputs, neuronIndex);
  return setNeuronValue(
    getNeuronActivationValue(inputSum, neuron),
    neuron,
  );
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
      if (!layerIndex) {
        return [
          setNeuronValues(
            inputValues,
            layer,
          ),
        ];
      }

      // get values from previous layer to calc input sum
      const prevLayerOutputs = getNthLayerOutputs(
        layerIndex - 1,
        network,
        previousLayers,
      );

      const layerEvolve = evolveLayerNeurons(
        activateNeuronValue(prevLayerOutputs),
      );

      // sum all weights values with all previous neuron values
      return [
        ...previousLayers,
        layerEvolve(layer),
      ];
    },
    [],
    network.layers,
  ),
});

export default forwardPropagation;
