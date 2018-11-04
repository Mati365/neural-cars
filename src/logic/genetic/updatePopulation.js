/**
 * Updates whole population
 *
 * @param {Population}  population
 */
const updatePopulation = (
  {
    items,
    config: {methods},
  },
  ...args
) => {
  const {update, canKillItem} = methods;

  for (let i = 0, n = items.length; i < n; ++i) {
    const item = items[i];
    if (item.killed)
      continue;

    item.object.update(...args);
    update(item, ...args);

    if (canKillItem(item))
      item.killed = true;
  }
};

export default updatePopulation;
