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
    size: PropTypes.shape({
      width: PropTypes.number,
      height: PropTypes.number,
    }),
    onUpdateSimulation: PropTypes.func.isRequired,
  };

  static defaultProps = {
    maxFPS: 60,
    size: {
      width: 640,
      height: 425,
    },
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
      ctx.fillRect(0, 0, size.width, size.height);
      onUpdateSimulation(delta, size);

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
        {...size}
      />
    );
  }
}
