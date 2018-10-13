import * as R from 'ramda';

/**
 * Transforms args list to array.
 * If first item is also array - unnest it,
 * because it can be call fn([arg1, arg2])
 *
 * @param {Any...}  args
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
 */
const blankNeuralNetwork = () => ({
  layers: [],
  edges: [],
  biases: [],
});

/**
 * @param {Layer}           layer
 * @param {NeuralNetwork}   network
 */
const appendNetworkLayer = R.useWith(
  R.evolve,
  [
    /** LAYER */ layer => ({
      layers: R.append(layer),
    }),
    /** NETWORK */ R.identity,
  ]
);(layer, network) => R.evolve(
  {
    layers: R.append(layer),
  },
  network,
);

/**
 * Create neural network from provided layers.
 * Layers are ordered:
 * [Input Layer, ... hidden layers ..., Output Layer]
 *
 * @param {Layer...} layers
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
    1, 2, 3
  ),
);
