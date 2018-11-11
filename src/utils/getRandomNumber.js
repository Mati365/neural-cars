const getRandomNumber = (min, max) => (
  Math.random() * (max - min) + min
);

export const getRandomFromRange = ([min, max]) => getRandomNumber(min, max);

export const selectRandomFromArray = array => array[
  Math.floor(getRandomNumber(0, array.length - 1))
];

export default getRandomNumber;
