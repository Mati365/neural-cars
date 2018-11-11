import * as R from 'ramda';
import ControlsContainer from './shared/controls/ControlContainer';

/**
 * GameView is each game "tab",
 * e.g. Loading screen, Game screen, Editor screen
 */
export default class GameView {
  listeners = [];

  controls = new ControlsContainer;

  constructor(store, canvasRef, loadView) {
    this.store = store;
    this.canvasRef = canvasRef;
    this.loadView = loadView;

    this.toggleControlsListeners();
    this.safeAddStateListener(
      (...args) => {
        this.stateDidUpdate && this.stateDidUpdate(...args);
      },
    );
  }

  /**
   * Adds or remove HTML listener to controls list
   *
   * @param {Boolean} toggled
   */
  toggleControlsListeners(toggled = true) {
    const {controls, canvasRef} = this;
    const mounter = (
      toggled
        ? ::canvasRef.addEventListener
        : ::canvasRef.removeEventListener
    );

    mounter('click', controls.onMouseClick);
    mounter('mousemove', controls.onMouseMove);
  }

  /**
   * Add function to watch whole app state
   *
   * @param {Function} fn
   */
  safeAddStateListener(fn) {
    this.listeners = [...this.listeners, fn];
    this.store.watchState(fn);
  }

  unload() {
    this.toggleControlsListeners(false);
    R.forEach(
      fn => this.store.removeStateWatch(fn),
      this.listeners,
    );
  }
}
