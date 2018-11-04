/**
 * Updates whole population
 *
 * @param {Population}  population
 */
const updatePopulation = (population, ...args) => {
  const {
    items,
    config: {methods},
  } = population;

  const {
    update,
    updateFitness,
  } = methods;

  let allKilled = true;
  for (let i = 0, n = items.length; i < n; ++i) {
    const item = items[i];
    if (item.killed)
      continue;

    item.object.update(...args);
    update(item, ...args);

    const newFitness = updateFitness(item, ...args);
    if (newFitness > 0.02)
      item.fitness = newFitness;
    else
      item.killed = true;

    allKilled = false;
  }

  return allKilled;
};

export default updatePopulation;
