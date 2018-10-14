import * as R from 'ramda';
import NeuralActivationFn from './neuralActivationFn';

/**
 * @param {Number} activationFnType
 * @param {Number} value
 */
const createNeuron = (activationFnType, bias = 0, value = 0) => ({
  activationFnType,
  bias,
  value,
});

export const getNeuronValue = R.prop('value');

export const setNeuronValue = R.assoc('value');

export const getNeuronActivationFn = neuron => NeuralActivationFn[neuron.activationFnType];

export default createNeuron;
