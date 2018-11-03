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

    innerRef: PropTypes.object,
    onRenderSimulation: PropTypes.func.isRequired,
    onUpdateSimulation: PropTypes.func.isRequired,
  };

  static defaultProps = {
    maxFPS: 60,
    innerRef: null,
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
      const delay = timeStamp - lastFrame;
      const delta = (
        lastFrame === null
          ? 1
          : Math.min(maxFrameTime, delay) / maxFrameTime
      );
      lastFrame = timeStamp;

      // render stuff
      ctx.fillStyle = '#000';
      ctx.fillRect(0, 0, size.w, size.h);

      // app logic
      onUpdateSimulation(delta, size);
      onRenderSimulation(ctx, size);

      // draw debug stuff
      ctx.fillStyle = '#fff';
      ctx.font = '12px Arial';
      ctx.fillText(`Frame time: ${delay.toFixed(2)}ms`, size.w - 120, 20);

      // loop forever
      window.requestAnimationFrame(renderFrame);
    };

    window.requestAnimationFrame(renderFrame);
  };

  render() {
    const {
      size,
      innerRef,
    } = this.props;

    return (
      <canvas
        ref={(element) => {
          this.ref.current = element;
          if (innerRef)
            innerRef.current = element;
        }}
        width={size.w}
        height={size.h}
        style={{
          imageRendering: 'pixelated',
        }}
      />
    );
  }
}
