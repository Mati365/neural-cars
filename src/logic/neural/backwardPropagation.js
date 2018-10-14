import indexedReduce, {indexedReduceRight} from 'utils/indexedReduce';

import {
  evolveLayerNeurons,
  getNeurons,
} from './createNeuralLayer';

import {
  getNeuronActivationFn,
  getNeuronValue,
} from './createNeuron';

import {
  getNthLayerOutputs,
  sumNeuronInputs,
} from './networkSelectors';

const evolveLayerNeuronsDeltas = fn => evolveLayerNeurons(
  (neuron, neuronIndex) => ({
    ...neuron,
    backPropagationDelta: fn(neuron, neuronIndex),
  }),
);

/**
 * Calc activation value of neuron
 *
 * @param {Number}  inputSum  returns sum all weights multipled by input neurons
 * @param {Neuron}  neuron
 *
 * @returns {Number}
 */
const getNeuronDerivativeValue = (inputSum, neuron) => (
  getNeuronActivationFn(neuron).derivative(inputSum + neuron.bias)
);

/**
 * Calc delta between preferred output value and actual output
 * from OUTPUT layer type
 *
 * @param {LayerValues} prevLayerOutputs
 *
 * @returns fn => {NeuralNetwork}
 */
const setOutputNeuronsDeltas = (prevLayerOutputs, preferredOutput) => evolveLayerNeuronsDeltas(
  (neuron, neuronIndex) => {
    const inputSum = sumNeuronInputs(prevLayerOutputs, neuronIndex);

    return (
      // S'(sum) * (output sum margin of error)
      (preferredOutput[neuronIndex] - getNeuronValue(neuron))
        * getNeuronDerivativeValue(inputSum, neuron)
    );
  },
);

const setHiddenNeuronsDeltas = (
  prevLayerOutputs,
  nextLayerNeurons,
  currentLayerWeights,
) => evolveLayerNeuronsDeltas(
  (neuron, neuronIndex) => {
    const inputNeuronWeights = currentLayerWeights[neuronIndex];
    const inputSum = sumNeuronInputs(prevLayerOutputs, neuronIndex);

    const deltasSum = indexedReduce(
      (acc, deltaNeuronWeight, deltaNeuronIndex) => (
        acc + (nextLayerNeurons[deltaNeuronIndex].backPropagationDelta * deltaNeuronWeight)
      ),
      0,
      inputNeuronWeights,
    );

    return deltasSum * getNeuronDerivativeValue(inputSum, neuron);
  },
);

/**
 * @param {Number[]}      preferredOutput
 * @param {NeuralNetwork} network
 */
const backwardPropagation = (preferredOutput, network) => {
  const layersLength = network.layers.length;

  return ({
    ...network,
    layers: indexedReduceRight(
      (layer, acc, reversedIndex) => {
        const nonReversedIndex = layersLength - (reversedIndex + 1);

        // ignore input layer
        if (!nonReversedIndex)
          return [layer, ...acc];

        // used to calc sum
        const prevLayerOutputs = getNthLayerOutputs(nonReversedIndex - 1, network);

        // const nextLayerDeltaValues = reversedIndex > 0 && {
        //   weightsToNextLayer: network.weights[layersLength - reversedIndex - 1],
        //   nextLayerNeuronDeltas: getLayerNeuronsDeltas(acc[0]), // acc[0] was previous next layer
        // };
        const evolveLayer = (
          // if output layer
          !reversedIndex
            ? setOutputNeuronsDeltas(prevLayerOutputs, preferredOutput)
            : (
              setHiddenNeuronsDeltas(
                prevLayerOutputs,
                getNeurons(acc[0]),
                network.weights[nonReversedIndex],
              )
            )
        );

        return ([
          evolveLayer(layer),
          ...acc,
        ]);
      },
      [],
      network.layers,
    ),
  });
};

export default backwardPropagation;
