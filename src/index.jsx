import * as R from 'ramda';
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

const measuredForwardPropagation = performanceMeasure(T.forwardPropagation, 'T.forwardPropagation');
const measuredBackwardPropagation = performanceMeasure(T.backwardPropagation, 'T.backwardPropagation');

const propagatedNetwork = R.compose(
  R.partial(
    measuredBackwardPropagation,
    [[0]],
  ),

  R.partial(
    measuredForwardPropagation,
    [[1, 1]],
  ),
)(network);

console.log(
  'Values:',
  T.getNeuralNetworkValues(propagatedNetwork),
);
