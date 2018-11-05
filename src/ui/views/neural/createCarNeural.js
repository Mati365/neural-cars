import * as R from 'ramda';
import * as T from 'logic/neural-vectorized';

const NEURAL_CAR_INPUTS = {
  SPEED_INPUT: 0,
  ANGLE_INPUT: 1,
};

const NEURAL_CAR_OUTPUTS = {
  SPEED_INPUT: 0,
  TURN_INPUT: 1,
};

// const createBipolarLayer = T.createLayer(T.NEURAL_ACTIVATION_TYPES.SIGMOID_BIPOLAR);
const createBipolarLayer = T.createLayer(T.NEURAL_ACTIVATION_TYPES.SIGMOID_BIPOLAR);

/**
 * Creates basic game neural network
 *
 * @param {Object} raysConfig
 *
 * @returns {NeuralNetwork}
 */
const createCarNeural = ({raysCount}) => {
  const inputCount = raysCount + R.keys(NEURAL_CAR_INPUTS).length;
  const outputsCount = R.keys(NEURAL_CAR_OUTPUTS).length;

  return T.createNeuralNetwork([
    T.createInputLayer(inputCount),
    createBipolarLayer(inputCount ** 2),
    createBipolarLayer(outputsCount),
  ]);
};

export default createCarNeural;
