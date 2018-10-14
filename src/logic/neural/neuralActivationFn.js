import * as R from 'ramda';

const reduceObjectToArray = obj => R.reduce(
  (acc, [index, fn]) => {
    acc[index] = fn;
    return acc;
  },
  [],
  R.toPairs(obj),
);

/**
 * @see
 * https://en.wikipedia.org/wiki/Activation_function
 * https://pl.wikipedia.org/wiki/Funkcja_aktywacji
 * https://stevenmiller888.github.io/mind-how-to-build-a-neucral-network/
 */
export const NEURAL_ACTIVATION_TYPES = {
  TAN_H: 0,
  SIGMOID_UNIPOLAR: 1,
  SIGMOID_BIPOLAR: 2,
};

const NeuralActivationFn = {
  [NEURAL_ACTIVATION_TYPES.TAN_H]: ::Math.tanh,

  [NEURAL_ACTIVATION_TYPES.SIGMOID_UNIPOLAR]: (x, B = 1) => (
    1 / (1 + (Math.E ** ((-B) * x)))
  ),

  [NEURAL_ACTIVATION_TYPES.SIGMOID_BIPOLAR]: (x, B = 2) => (
    (1 - (Math.E ** ((-B) * x)))
      / (1 + (Math.E ** (B * x)))
  ),
};

/**
 * Reduce object to array, it should be generally
 * faster than searching function via string key
 */
export default reduceObjectToArray(NeuralActivationFn);
