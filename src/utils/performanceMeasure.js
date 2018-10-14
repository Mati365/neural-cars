/**
 * @param {Function}  fn      Measured function
 * @param {String}    fnName  Name used in log exec time function
 */
const performanceMeasure = (fn, fnName) => (...args) => {
  const start = performance.now();
  const result = fn(...args);

  console.log(`Execution ${fnName} function took: ${performance.now() - start}ms`);
  return result;
};

export default performanceMeasure;
