import * as R from 'ramda';

/**
 * Transforms args list to array.
 * If first item is also array - unnest it,
 * because it can be call fn([arg1, arg2])
 *
 * @param {Any...}  args
 *
 * @returns {Any[]}
 */
const transformArgsToList = R.compose(
  R.when(
    R.pipe(R.head, R.is(Array)),
    R.unnest,
  ),
  R.unapply(R.identity), // transformer
);

export default transformArgsToList;
