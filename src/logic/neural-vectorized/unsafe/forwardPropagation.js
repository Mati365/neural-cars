import {getNeuronActivationFn} from '../neuron';

/**
 * Do not use FP stuff here, it should be as fast as it is possible.
 *
 * @see
 *  It produces side effects!
 *  Do not use forEach() call etc, because it is fucking slow in JS,
 *  it should use only plain for loops
 *
 * @param {Number[]}  input
 * @param {Network}   network
 *
 * @returns {Network}
 */
const forwardPropagation = (input, network) => {
  const {layers} = network;
  const inputNeurons = layers[0].neuronsMatrix;

  // assign input values to network
  for (let i = inputNeurons.length - 1; i >= 0; --i)
    inputNeurons[i].value = input[i];

  for (let i = 1; i < layers.length; ++i) {
    const {
      neuronsMatrix: layerNeurons,
    } = layers[i];

    const {
      neuronsMatrix: prevLayerNeurons,
      weightsMatrix: prevLayerWeights,
    } = layers[i - 1];

    // calc activation value for each neuron in current layer
    for (let j = layerNeurons.length - 1; j >= 0; --j) {
      const neuron = layerNeurons[j];
      let sum = 0;

      // sum linked weights
      for (let pNeuronIndex = prevLayerNeurons.length - 1; pNeuronIndex >= 0; --pNeuronIndex)
        sum += prevLayerNeurons[pNeuronIndex].value * prevLayerWeights[pNeuronIndex][j];

      neuron.value = getNeuronActivationFn(neuron).plain(sum);
    }
  }

  return network;
};

export default forwardPropagation;
