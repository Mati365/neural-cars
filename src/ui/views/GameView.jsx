import * as R from 'ramda';

export default class GameView {
  constructor(store, loadView) {
    this.store = store;
    this.loadView = loadView;

    this.safeAddStateListener(
      (...args) => {
        this.stateDidUpdate && this.stateDidUpdate(...args);
      },
    );
  }

  listeners = [];

  safeAddStateListener(fn) {
    this.listeners = [...this.listeners, fn];
    this.store.watchState(fn);
  }

  unload() {
    R.forEach(
      fn => this.store.removeStateWatch(fn),
      this.listeners,
    );
  }
}
