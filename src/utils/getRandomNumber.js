const getRandomNumber = (min, max) => (
  Math.random() * (max - min + 1) + min
);

export const selectRandomFromArray = array => array[
  Math.floor(getRandomNumber(0, array.length - 1))
];

export default getRandomNumber;
