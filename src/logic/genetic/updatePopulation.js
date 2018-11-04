/**
 * Updates whole population
 *
 * @param {Population}  population
 */
const updatePopulation = ({items}, ...args) => {
  for (let i = 0, n = items.length; i < n; ++i) {
    const item = items[i];
    item.update(...args);
  }
};

export default updatePopulation;
