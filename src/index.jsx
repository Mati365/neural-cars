import * as R from 'ramda';
import * as T from 'logic/neural';

const createSigmoidLayer = T.createNeuralLayer(
  {
    activationFnType: T.NEURAL_ACTIVATION_TYPES.SIGMOID_UNIPOLAR,
  },
);

const shuffle = (a) => {
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]]; // eslint-disable-line
  }

  return a;
};

const trainNeuralNetwork = (data, times, network) => {
  let trainedNetwork = network;
  let shuffleData = data;

  R.times(
    (index) => {
      if (index === data.length - 2)
        shuffleData = shuffle(shuffleData);

      const {
        input,
        output,
      } = shuffleData[index % data.length];

      trainedNetwork = T.backwardPropagation(
        output,
        T.forwardPropagation(input, trainedNetwork),
      );
    },
    times,
  );

  return trainedNetwork;
};

/**
 * Test data
 *
 * @see
 * https://stevenmiller888.github.io/mind-how-to-build-a-neural-network/
 */
const network = T.createNeuralNetwork(true)(
  [
    T.createInputNeuralLayer(3),
    createSigmoidLayer(T.NEURAL_LAYER_TYPE.HIDDEN, 9),
    createSigmoidLayer(T.NEURAL_LAYER_TYPE.OUTPUT, 1),
  ],
);

const AND_TRUTH = [
  {input: [0, 0, 1], output: [0]},
  {input: [0, 1, 1], output: [0]},
  {input: [1, 0, 1], output: [0]},
  {input: [0, 1, 0], output: [0]},
  {input: [0, 1, 1], output: [0]},
  {input: [1, 1, 0], output: [0]},
  {input: [1, 0, 0], output: [0]},
  {input: [1, 0, 1], output: [0]},
  {input: [1, 1, 1], output: [1]},
];

const trainedNetwork = trainNeuralNetwork(
  AND_TRUTH,
  10000,
  network,
);

// console.log(trainedNetwork);

console.log(
  'Values:',
);

R.forEach(
  ({input, output}) => {
    const result = T.getNeuralNetworkValues(
      T.forwardPropagation(input, trainedNetwork),
    );

    console.log(input, output[0], 'neural output:', result[0]);
  },
  AND_TRUTH,
);
