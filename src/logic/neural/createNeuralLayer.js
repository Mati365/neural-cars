import * as R from 'ramda';
import createNeuron from './createNeuron';

export const NEURAL_LAYER_TYPE = {
  INPUT: 'INPUT',
  HIDDEN: 'HIDDEN',
  OUTPUT: 'OUTPUT',
};

/**
 * Creates array of neurons for layer
 *
 * @param {Enum}    activationFnType
 * @param {Number}  length
 *
 * @returns {Neuron[]}
 */
const createNeuralLayer = R.curry(
  (
    {
      activationFnType,
      bias = 0,
    },
    type,
    length,
  ) => (
    R.compose(
      neurons => ({
        type,
        neurons,
        bias,
      }),

      // create array of neurons
      R.times(
        R.partial(
          createNeuron,
          [activationFnType, 0],
        ),
      ),
    )(length)
  ),
);

export default createNeuralLayer;
