import * as T from 'logic/neural';
import performanceMeasure from 'utils/performanceMeasure';

const createTanLayer = T.createNeuralLayer(
  {
    activationFnType: T.NEURAL_ACTIVATION_TYPES.TAN_H,
  },
);

const network = T.createNeuralNetwork(
  createTanLayer(T.NEURAL_LAYER_TYPE.INPUT, 6),
  createTanLayer(T.NEURAL_LAYER_TYPE.HIDDEN, 10),
  createTanLayer(T.NEURAL_LAYER_TYPE.OUTPUT, 6),
);

const measuredPropagation = performanceMeasure(T.forwardPropagation);

console.log(
  measuredPropagation(
    [
      0.25,
      0.5,
    ],
    network,
  ),
);
