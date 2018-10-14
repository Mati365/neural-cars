import * as T from 'logic/neural';

import performanceMeasure from 'utils/performanceMeasure';

const createSigmoidLayer = T.createNeuralLayer(
  {
    activationFnType: T.NEURAL_ACTIVATION_TYPES.SIGMOID_UNIPOLAR,
  },
);

/**
 * Test data
 *
 * @see
 * https://stevenmiller888.github.io/mind-how-to-build-a-neural-network/
 */
const network = T.createWeightedNeuralNetwork(
  [
    T.createInputNeuralLayer(2),
    createSigmoidLayer(T.NEURAL_LAYER_TYPE.HIDDEN, 3),
    createSigmoidLayer(T.NEURAL_LAYER_TYPE.OUTPUT, 1),
  ],
  [
    // input -> hidden weights
    [
      [0.8, 0.4, 0.3], // first input neuron
      [0.2, 0.9, 0.5], // second input neuron
    ],

    // hidden -> output
    [
      [0.3],
      [0.5],
      [0.9],
    ],
  ],
);

const measuredPropagation = performanceMeasure(T.forwardPropagation);
const propagatedNetwork = measuredPropagation(
  [
    1,
    1,
  ],
  network,
);

console.log(
  propagatedNetwork,
  T.getNeuralNetworkValues(propagatedNetwork),
);
