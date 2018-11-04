import * as R from 'ramda';
import createPopulation from './createPopulation';

const findBiggestFitnessItem = R.reduce(
  (acc, item) => (
    !acc || item.fitness > acc.fitness
      ? item
      : acc
  ),
  null,
);

const cloneBestNeural = R.compose(
  R.objOf('layers'),
  R.map(
    R.evolve(
      {
        weightsMatrix: R.unless(
          R.isNil,
          R.map(
            R.map(weight => (weight + (Math.random() * 2.0) - 1.0)),
          ),
        ),
      },
    ),
  ),
  R.prop('layers'),
  R.clone,
);

const resetPopulation = (population) => {
  const bestItem = findBiggestFitnessItem(population.items);
  if (!bestItem)
    return population;

  const {config} = population;
  const {neural: bestItemNeural} = bestItem;

  return createPopulation(
    {
      ...config,
      methods: {
        ...config.methods,
        creator: {
          ...config.methods.creator,
          neural: () => cloneBestNeural(bestItemNeural),
        },
      },
    },
  );
};

export default resetPopulation;
