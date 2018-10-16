import * as R from 'ramda';
import NeuralActivationFunction from './neuralActivationFn';

export const createNeuron = activationFn => ({
  value: 0,
  ...activationFn && {
    bias: 0,
    delta: 0,
    activationFn,
  },
});

export const createNeuronsVector = (height, activationFn) => R.times(
  () => createNeuron(activationFn),
  height,
);

export const getNeuronActivationFn = ({activationFn}) => (
  NeuralActivationFunction[activationFn]
);
