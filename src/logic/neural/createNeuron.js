const createNeuron = (activationFnType, value = 0) => ({
  activationFnType,
  value,
});

export default createNeuron;
