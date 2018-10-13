import * as T from 'logic/neural';

const createTanLayer = T.createNeuralLayer(
  {
    activationFnType: T.NEURAL_ACTIVATION_TYPES.TAN_H,
  },
);

const network = T.createNeuralNetwork(
  createTanLayer(T.NEURAL_LAYER_TYPE.INPUT, 2),
  createTanLayer(T.NEURAL_LAYER_TYPE.HIDDEN, 3),
  createTanLayer(T.NEURAL_LAYER_TYPE.OUTPUT, 2),
);

console.log(
  T.forwardPropagation(
    [
      0.25,
      0.5,
    ],
    network,
  ),
);
