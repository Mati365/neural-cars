import TEST_BOARD from 'ui/constants/testBoard';

import toRadians from 'logic/math/toRadians';

import GameView from '../GameView';
import {NeuralCarPopulation} from '../neural';
import {Camera} from '../objects';

/**
 * Shows game simulation
 *
 * @class
 * @export
 */
export default class GameMainView extends GameView {
  board = TEST_BOARD;

  /**
   * All car items on map! Do not place there more than 40 cars,
   * it might be slow and place that number only when it is training mode,
   * in production mode with Quad Tree optimization it should be propably fine
   */
  population = new NeuralCarPopulation(
    30,
    {
      angle: toRadians(90),
      steerAngle: toRadians(0),
      speed: 2.5,
      maxSpeed: 3.5,

      // car mass center position
      pos: {
        x: 170,
        y: 40,
      },

      // car size
      size: {
        w: 32,
        h: 64,
      },
    },
  );

  camera = new Camera;

  update(delta) {
    const {population, board, camera} = this;

    population.update(delta, board);
    camera
      .moveTo(population.bestItem.car.body.pos)
      .update(delta);
  }

  /**
   * Population is render but focused only on the best item
   *
   * @see
   *  It is binded to class this context!
   *
   * @param {Context2D} ctx
   * @param {Rect}      size
   */
  renderCameraViewport = (ctx, size) => {
    const {
      population,
      board,
    } = this;

    for (let i = 0, n = board.length; i < n; ++i)
      board[i].render(ctx, size);

    population.render(ctx, size);
  }

  render(ctx, size) {
    const {population, camera} = this;

    // area
    camera.render(
      this.renderCameraViewport,
      ctx,
      size,
    );

    // logs
    ctx.fillStyle = '#fff';
    ctx.font = '12px Arial';
    ctx.fillText(`Generation: ${population.generation}`, size.w - 210, 20);
  }
}
