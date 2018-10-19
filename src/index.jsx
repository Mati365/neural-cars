import ReactDOM from 'react-dom';
import React from 'react';

import CarsCanvas from 'ui/CarsCanvas';
import * as T from 'logic/neural-vectorized';

const createNetwork = () => {
  const createUnipolarLayer = T.createLayer(T.NEURAL_ACTIVATION_TYPES.SIGMOID_UNIPOLAR);

  return T.createNeuralNetwork([
    T.createInputLayer(
      3,
      [
        [0.8, 0.4, 0.3, 0, 0, 0, 0, 0, 0], // first input neuron
        [0.8, 0.4, 0.3, 0, 0, 0, 0, 0, 0], // second input neuron
        [0.8, 0.4, 0.3, 0, 0, 0, 0, 0, 0], // second input neuron
      ],
    ),
    createUnipolarLayer(
      9,
      [
        [0.3],
        [0.5],
        [0.9],
        [0.3],
        [0.5],
        [0.9],
        [0.3],
        [0.5],
        [0.9],
      ],
    ),
    createUnipolarLayer(1),
  ]);
};

let testNetwork = createNetwork();
const AND_TRUTH = [
  {input: [0, 0, 1], output: [0]},
  {input: [1, 0, 1], output: [0]},
  {input: [0, 1, 0], output: [0]},
  {input: [0, 1, 1], output: [1]},
  {input: [1, 1, 0], output: [0]},
  {input: [1, 0, 0], output: [0]},
  {input: [1, 0, 1], output: [0]},
  {input: [1, 1, 1], output: [1]},
];

testNetwork = T.trainNetwork(AND_TRUTH, 0.5, 10000, testNetwork);
console.log(T.exec([1, 1, 1], testNetwork));

ReactDOM.render(
  <CarsCanvas />,
  document.getElementById('app-root'),
);
