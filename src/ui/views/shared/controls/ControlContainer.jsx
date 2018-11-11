/**
 * It is just abstract handler to forward single
 * function call to multiple elements
 */
class ControlsContainer {
  controls = [];

  constructor() {
    this.onMouseClick = this.execOnEachProxy('onMouseClick');
    this.onMouseMove = this.execOnEachProxy('onMouseMove');
    this.render = this.execOnEachProxy('render');
    this.update = this.execOnEachProxy('update');
  }

  /**
   * Returns function that is invoked on all list element
   *
   * @param {String}  methodName
   *
   * @returns {Function}
   */
  execOnEachProxy = methodName => (...args) => {
    const {controls} = this;
    const {length} = controls;

    if (!length)
      return;

    for (let i = 0; i < length; ++i) {
      const control = controls[i];
      const method = control[methodName];

      if (method)
        method.bind(control, ...args);
    }
  }

  /**
   * Adds control to controls list
   *
   * @param {Control} control
   *
   * @returns {ControlsContainer}
   */
  addControl(control) {
    const {controls} = this;
    controls.push(control);

    return this;
  }
}

export default ControlsContainer;
