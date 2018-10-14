import * as R from 'ramda';

export const indexedReduceRight = R.addIndex(R.reduceRight);

export default R.addIndex(R.reduce);
