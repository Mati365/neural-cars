import toRadians from 'logic/math/toRadians';
import {CtxUtils} from 'ui/utils';

import {
  addVec2,
  subVec2,
} from 'logic/math/vec2';

import {
  vec2,
  dimensions,
} from 'logic/math';

import GameView from '../GameView';
import {NeuralCarPopulation} from '../game/neural';
import {Camera} from '../shared/objects';

import generateBoard from '../game/generateBoard';

const generateCarsBoard = () => generateBoard({
  startPoint: vec2(170, 40),
  startAngle: [0, 1],

  segmentsCount: 40,
  segmentSize: dimensions(
    [80, 120], // width
    80, // height
  ),
});

/**
 * Shows game simulation
 *
 * @class
 * @export
 */
export default class GameMainView extends GameView {
  board = generateCarsBoard();

  /**
   * All car items on map! Do not place there more than 40 cars,
   * it might be slow and place that number only when it is training mode,
   * in production mode with Quad Tree optimization it should be propably fine
   */
  population = new NeuralCarPopulation(
    60,
    {
      angle: toRadians(90),
      steerAngle: toRadians(0),
      speed: 1.5,
      maxSpeed: 5.5,

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

    // titles
    ctx.font = '12px Arial';

    // best item title
    const {bestItem} = population;
    if (bestItem) {
      const color = '#0080FF';

      // position relative to top left canvas origin
      const fixedPos = addVec2(
        subVec2(bestItem.car.body.pos, camera.pos),
        vec2(size.w / 2, size.h / 2),
      );

      CtxUtils.drawLine(
        vec2(fixedPos.x, fixedPos.y),
        vec2(fixedPos.x, size.h - 20),
        color,
        1,
        ctx,
      );

      ctx.fillStyle = color;
      ctx.fillText(
        `Best: ${bestItem.totalDistance.toFixed(2)}px`,
        fixedPos.x - 32,
        size.h - 6,
      );
    }

    // generation log
    ctx.fillStyle = '#fff';
    ctx.fillText(`Generation: ${population.generation}`, size.w - 210, 20);
  }
}
