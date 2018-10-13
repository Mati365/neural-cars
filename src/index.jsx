import * as T from 'logic/neural';

const createTanLayer = T.createNeuralLayer({
  activationFnType: T.NEURAL_ACTIVATION_TYPES.TAN_H,
});

// test
console.log(
  T.createNeuralNetwork(
    createTanLayer(T.NEURAL_LAYER_TYPE.INPUT, 4),
    createTanLayer(T.NEURAL_LAYER_TYPE.HIDDEN, 8),
    createTanLayer(T.NEURAL_LAYER_TYPE.OUTPUT, 2),
  ),
);
