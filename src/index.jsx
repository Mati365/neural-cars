import * as T from 'logic/neural-vectorized';

const createTestNetwork = () => {
  const createUnipolarLayer = T.createLayer(T.NEURAL_ACTIVATION_TYPES.SIGMOID_UNIPOLAR);

  return T.createNeuralNetwork([
    T.createInputLayer(
      2,
      [
        [0.8, 0.4, 0.3], // first input neuron to 1, 2, 3 hidden neurons
        [0.2, 0.9, 0.5], // second input neuron to 1, 2, 3 hidden neurons
      ],
    ),
    createUnipolarLayer(
      3,
      [
        [0.3], // first hidden neuron to 1 output
        [0.5], // second hidden neuron to 1 output
        [0.9], // third hidden neuron to 1 output
      ],
    ),
    createUnipolarLayer(1),
  ]);
};

console.log(T.getNetworkOutput(createTestNetwork()));
