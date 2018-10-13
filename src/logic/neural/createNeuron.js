import * as R from 'ramda';

/**
 * @param {Number} activationFnType
 * @param {Number} value
 */
const createNeuron = (activationFnType, bias = 0, value = 0) => ({
  activationFnType,
  bias,
  value,
});

export const getValue = R.prop('value');

export default createNeuron;
