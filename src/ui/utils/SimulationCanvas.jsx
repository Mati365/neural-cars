import React from 'react';
import PropTypes from 'prop-types';

/**
 * Area where are cars rendered
 *
 * @class
 * @exports
 */
export default class SimulationCanvas extends React.Component {
  static propTypes = {
    maxFPS: PropTypes.number,
    size: PropTypes
      .shape({
        w: PropTypes.number,
        h: PropTypes.number,
      })
      .isRequired,
    onRenderSimulation: PropTypes.func.isRequired,
    onUpdateSimulation: PropTypes.func.isRequired,
  };

  static defaultProps = {
    maxFPS: 60,
  };

  ref = React.createRef();

  static shouldComponentUpdate() {
    return false;
  }

  componentDidMount() {
    this.startRenderLoop();
  }

  get ctx() {
    return this.ref.current.getContext('2d');
  }

  /**
   * Main rendering stuff, it must be as fast as it is possible
   */
  startRenderLoop = () => {
    const {ctx} = this;
    const {
      maxFPS,
      size,
      onUpdateSimulation,
      onRenderSimulation,
    } = this.props;

    const maxFrameTime = 1000 / maxFPS;
    let lastFrame = null;

    const renderFrame = (timeStamp) => {
      // calc delta timing to smooth anim
      const delta = (
        lastFrame === null
          ? 1
          : Math.min(maxFrameTime, timeStamp - lastFrame) / maxFrameTime
      );
      lastFrame = timeStamp;

      // render stuff
      ctx.fillStyle = '#000';
      ctx.fillRect(0, 0, size.w, size.h);

      // app logic
      onUpdateSimulation(delta, size);
      onRenderSimulation(ctx, size);

      // loop forever
      window.requestAnimationFrame(renderFrame);
    };

    window.requestAnimationFrame(renderFrame);
  };

  render() {
    const {size} = this.props;

    return (
      <canvas
        ref={this.ref}
        width={size.w}
        height={size.h}
      />
    );
  }
}
