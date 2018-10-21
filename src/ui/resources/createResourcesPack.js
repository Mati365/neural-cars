import * as R from 'ramda';
import {pairs} from 'rxjs';
import {scan, flatMap} from 'rxjs/operators';

export const DEFAULT_LOADERS = [
  // image loader
  {
    test: R.test(/\.(png|jpe?g)$/),
    loader: path => new Promise(
      (resolve, reject) => {
        const img = new Image;
        img.src = path;
        img.onload = () => resolve(img);
        img.onerror = e => reject(e);
      },
    ),
  },
];

/**
 * Load resources from path
 *
 * @param {Loader[]}  loaders
 * @param {String}    path
 *
 * @returns {Resource}
 */
const loadResource = loaders => R.converge(
  (loader, path) => {
    if (R.isNil(loader))
      throw new Error('Loader not found!');

    return loader.loader(path);
  },
  [
    // find loader matching test
    path => R.find(
      ({test}) => test(path),
      loaders,
    ),

    // return identity, path to apply if loader found
    R.identity,
  ],
);

/**
 * Load resources from path
 *
 * @param {Loader[]}  loaders
 * @param {String[]}  resources
 *
 * @returns {ResourcePack}
 */
export const createLoadersResourcesPack = R.curry(
  (loaders, resources) => {
    const packLoader = loadResource(loaders);
    const totalResources = R.keys(resources).length;

    return (
      pairs(resources)
        .pipe(
          // loads in parallel
          // see: https://stackoverflow.com/a/49701944
          flatMap(
            ([key, path]) => new Promise(
              (resolve, reject) => (
                packLoader(path)
                  .then(loaded => resolve([key, loaded]))
                  .catch(reject)
              ),
            ),
          ),
          scan(
            (acc, [key, value]) => ({
              ...acc,
              percentage: ((R.keys(acc?.resources || {}).length + 1) / totalResources),
              resources: {
                ...acc?.resources,
                [key]: value,
              },
            }),
            {},
          ),
        )
    );
  },
);

export default createLoadersResourcesPack(DEFAULT_LOADERS);
