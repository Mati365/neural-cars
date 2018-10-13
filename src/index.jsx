import * as R from 'ramda';

/**
 * @see
 * https://en.wikipedia.org/wiki/Activation_function
 * https://pl.wikipedia.org/wiki/Funkcja_aktywacji
 */
const NEURAL_ACTIVATION_TYPES = {
  TAN_H: 'TAN_H',
  SIGMOID_UNIPOLAR: 'SIGMOID_UNIPOLAR',
  SIGMOID_BIPOLAR: 'SIGMOID_BIPOLAR',
};

const NeuralActivationFn = {
  [NEURAL_ACTIVATION_TYPES.TAN_H]: ::Math.tanh,
  [NEURAL_ACTIVATION_TYPES.SIGMOID_UNIPOLAR]: (x, {B}) => 1 / (1 + ((Math.E, (-B) * x) ** 2)),
  [NEURAL_ACTIVATION_TYPES.SIGMOID_BIPOLAR]: (x, {B}) => (
    (1 - ((Math.E, (-B) * x) ** 2))
      / (1 + ((Math.E, (-B) * x) ** 2))
  ),
};

/**
 * Transforms args list to array.
 * If first item is also array - unnest it,
 * because it can be call fn([arg1, arg2])
 *
 * @param {Any...}  args
 *
 * @returns {Any[]}
 */
const transformArgsToList = R.compose(
  R.when(
    R.pipe(R.head, R.is(Array)),
    R.unnest,
  ),
  R.unapply(R.identity), // transformer
);

/**
 * Create default, blank neural network,
 * it is Layer schema for rest of data
 *
 * @returns {NeuralNetwork}
 */
const blankNeuralNetwork = () => ({
  layers: [],
});

/**
 * Creates array of neurons for layer
 *
 * @param {Enum}    activationFnType
 * @param {Number}  length
 *
 * @returns {Neuron[]}
 */
const createNeuralLayer = activationFnType => R.flip(R.times)(
  () => ({
    bias: 0,
    activationFnType,
  }),
);

/**
 * @param {Layer}           layer
 * @param {NeuralNetwork}   network
 *
 * @returns {NeuralNetwork}
 */
const appendNetworkLayer = R.useWith(
  R.evolve,
  [
    /** LAYER */ layer => ({
      layers: R.append(layer), // append layer to list
    }),
    /** NETWORK */ R.identity,
  ],
);

/**
 * Create neural network from provided layers.
 * Layers are ordered:
 * [Input Layer, ... hidden layers ..., Output Layer]
 *
 * @param {Layer...} layers
 *
 * @returns {NeuralNetwork}
 */
const createNeuralNetwork = R.compose(
  layers => console.log(layers) || R.reduce(
    R.flip(appendNetworkLayer),
    blankNeuralNetwork(),
    layers,
  ),
  transformArgsToList,
);

console.log(
  createNeuralNetwork(
    createNeuralLayer(1, 2, 3),
  ),
);
