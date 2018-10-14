/**
 * @param {Function}  fn      Measured function
 * @param {String}    fnName  Name used in log exec time function
 */
const performanceMeasure = (fn, fnName) => (...args) => {
  const start = performance.now();
  const result = fn(...args);
  const time = performance.now() - start;

  console.warn(`Execution ${fnName} function took: ${time}ms, output value:`, result);
  return result;
};

export default performanceMeasure;
