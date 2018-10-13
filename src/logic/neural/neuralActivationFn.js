/**
 * @see
 * https://en.wikipedia.org/wiki/Activation_function
 * https://pl.wikipedia.org/wiki/Funkcja_aktywacji
 */
export const NEURAL_ACTIVATION_TYPES = {
  NOOP: 'NOOP',
  TAN_H: 'TAN_H',
  SIGMOID_UNIPOLAR: 'SIGMOID_UNIPOLAR',
  SIGMOID_BIPOLAR: 'SIGMOID_BIPOLAR',
};

const NeuralActivationFn = {
  [NEURAL_ACTIVATION_TYPES.TAN_H]: ::Math.tanh,

  [NEURAL_ACTIVATION_TYPES.SIGMOID_UNIPOLAR]: (x, {B}) => (
    1 / (1 + ((Math.E, (-B) * x) ** 2))
  ),

  [NEURAL_ACTIVATION_TYPES.SIGMOID_BIPOLAR]: (x, {B}) => (
    (1 - ((Math.E, (-B) * x) ** 2))
      / (1 + ((Math.E, (-B) * x) ** 2))
  ),
};

export default NeuralActivationFn;
