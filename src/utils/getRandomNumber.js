/**
 * Gets random number betwen: [min, max)
 *
 * @param {Number} min
 * @param {Number} max
 *
 * @returns {Number}
 */
const getRandomNumber = (min, max) => (
  Math.random() * (max - min) + min
);

/**
 * Gets random number between: [min, max] not (min, max)
 *
 * @param {Number} min
 * @param {Number} max
 *
 * @returns {Number}
 */
export const getRandomIntInclusive = (min, max) => {
  const [_min, _max] = [Math.floor(min), Math.ceil(max)];

  return Math.floor(Math.random() * (_max - _min + 1)) + _min;
};

export const getRandomFromRange = ([min, max]) => getRandomNumber(min, max);

export const selectRandomFromArray = array => array[
  getRandomIntInclusive(0, array.length - 1)
];

export default getRandomNumber;
