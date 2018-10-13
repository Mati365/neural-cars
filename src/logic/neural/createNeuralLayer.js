import * as R from 'ramda';
import createNeuron from './createNeuron';

export const NEURAL_LAYER_TYPE = {
  INPUT: 'INPUT',
  HIDDEN: 'HIDDEN',
  OUTPUT: 'OUTPUT',
};

export const getNeurons = R.prop('neurons');

/**
 * Creates array of number weights for layer
 *
 * @param {Layer} layer
 * @param {Number[]}  Array of weights(length === neurons.length)
 */
export const createLayerWeights = R.compose(
  R.times(R.always(0)), // initial value is 0
  R.length,
  getNeurons,
);

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
