import * as R from 'ramda';

import indexedReduce, {indexedReduceRight} from 'utils/indexedReduce';
import indexedMap from 'utils/indexedMap';

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
  (neuron, neuronIndex) => {
    const backPropagationDelta = fn(neuron, neuronIndex);

    return {
      ...neuron,
      backPropagationDelta,
    };
  },
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

/**
 * @param {LayerValues} prevLayerOutputs
 * @param {LayerValues} nextLayerNeurons
 * @param {Number[]}    currentLayerWeights
 */
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
 * Assign to neurons delta errors
 *
 * @param {Number[]}      preferredOutput
 * @param {NeuralNetwork} network
 */
const backwardPropagation = (preferredOutput, network) => {
  const layersLength = network.layers.length;
  const updatedLayers = indexedReduceRight(
    (layer, acc, reversedIndex) => {
      const nonReversedIndex = layersLength - (reversedIndex + 1);

      // ignore input layer
      if (!nonReversedIndex)
        return [layer, ...acc];

      // used to calc sum
      const prevLayerOutputs = getNthLayerOutputs(nonReversedIndex - 1, network);

      // assign deltas
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
  );

  return ({
    ...network,
    layers: updatedLayers,
  });
};

const getUpdatedWeight = (speed, oldWeight, neuron) => (
  oldWeight + (neuron.value * speed * neuron.backPropagationDelta)
);

const updateWeights = learnSpeed => (network) => {
  const mapLayerWeights = (layerWeights, layerIndex) => {
    if (layerIndex + 1 === network.layers.length)
      return layerWeights;

    return (
      indexedMap(
        (weight, weightIndex) => indexedMap(
          (neuronWeight, neuronIndex) => (
            neuronWeight + (
              network.layers[layerIndex].neurons[weightIndex].value
                * learnSpeed
                * network.layers[layerIndex + 1].neurons[neuronIndex].backPropagationDelta
            )
          ),
        )(weight),
        layerWeights,
      )
    );
  };

  return R.evolve(
    {
      // update connection weights
      weights: indexedMap(mapLayerWeights),

      // update neuron biases
      layers: R.map(
        evolveLayerNeurons(
          neuron => ({
            ...neuron,
            bias: getUpdatedWeight(learnSpeed, neuron.bias, neuron),
          }),
        ),
      ),
    },
    network,
  );
};

export default R.compose(
  updateWeights(0.5),
  backwardPropagation,
);
