import * as R from 'ramda';

import indexedMap from 'utils/indexedMap';
import createNeuron, {getNeuronValue, setNeuronValue} from './createNeuron';

export const NEURAL_LAYER_TYPE = {
  INPUT: 'INPUT',
  HIDDEN: 'HIDDEN',
  OUTPUT: 'OUTPUT',
};

export const getNeurons = R.prop('neurons');

export const setNeuronValues = (values, layer) => R.evolve(
  {
    neurons: indexedMap(
      (neuron, index) => setNeuronValue(
        values[index],
        neuron,
      ),
    ),
  },
  layer,
);

export const evolveLayerNeurons = fn => R.evolve(
  {
    neurons: indexedMap(fn),
  },
);

export const pluckLayerNeuronsValues = R.compose(
  R.map(getNeuronValue),
  getNeurons,
);

/**
 * Creates array of number weights for layer
 *
 * @param {Layer} layer
 * @param {Number[]}  Array of weights(length === neurons.length)
 *
 * @returns {Neuron[]}
 */
export const createLayerWeights = R.compose(
  // R.times(R.always(0)), // initial value is 0
  R.times(R.divide(R.__, 10)),
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
 *
 * @see
 *  For initial values see:
 *  https://medium.com/usf-msds/deep-learning-best-practices-1-weight-initialization-14e5c0295b94
 */
const createNeuralLayer = R.curry(
  (
    {
      activationFnType,
      initials = {
        bias: R.always(0),
        value: R.always(0),
      },
    },
    type,
    length,
  ) => (
    R.compose(
      neurons => ({
        type,
        neurons,
      }),

      // create array of neurons
      R.times(
        index => createNeuron(
          activationFnType,
          initials.bias(index),
          initials.value(index),
        ),
      ),
    )(length)
  ),
);

/**
 * Creates input layer without activation function and initial values
 *
 * @returns fn(type, length) => Layer
 */
export const createInputNeuralLayer = createNeuralLayer(
  {
    activationFnType: null,
  },
  NEURAL_LAYER_TYPE.INPUT,
);

export default createNeuralLayer;
