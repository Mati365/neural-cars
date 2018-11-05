import toRadians from 'logic/math/toRadians';
import vec2 from 'logic/math/vec2';

import {
  updatePopulation,
  resetPopulation,
} from 'logic/genetic';

import createCarsPopulation from '../neural/createCarsPopulation';

import GameView from '../GameView';
import {Polygon} from '../objects';

/**
 * Shows game simulation
 *
 * @class
 * @export
 */
export default class GameMainView extends GameView {
  board = [
    new Polygon(
      [
        vec2(100, 70),
        vec2(200, 70),
        vec2(200, 120),
      ],
    ),

    new Polygon(
      [
        vec2(100, 170),
        vec2(130, 320),
        vec2(150, 220),
      ],
    ),

    new Polygon(
      [
        vec2(220, 170),
        vec2(320, 120),
        vec2(300, 200),
      ],
    ),

    new Polygon(
      [
        vec2(220, 120),
        vec2(320, 80),
        vec2(340, 220),
      ],
    ),

    new Polygon(
      [
        vec2(400, 270),
        vec2(500, 220),
        vec2(500, 420),
      ],
    ),

    new Polygon(
      [
        vec2(540, 70),
        vec2(420, 70),
        vec2(420, 190),
      ],
    ),

    new Polygon(
      [
        vec2(220, 340),
        vec2(320, 320),
        vec2(320, 420),
      ],
    ),

    new Polygon(
      [
        vec2(5, 5),
        vec2(635, 5),
        vec2(635, 475),
        vec2(5, 475),
      ],
    ),
  ];

  population = createCarsPopulation(
    10,
    {
      angle: toRadians(0),
      steerAngle: toRadians(0),
      speed: 1,
      maxSpeed: 4,

      // car mass center position
      pos: {
        x: 300,
        y: 280,
      },

      // car size
      size: {
        w: 32,
        h: 64,
      },
    },
  );

  update(delta) {
    const {population, board} = this;

    // if all killed
    if (updatePopulation(population, delta, board))
      this.population = resetPopulation(population);
  }

  render(ctx) {
    const {
      population: {items: cars},
      board,
    } = this;

    for (let i = 0, n = board.length; i < n; ++i)
      board[i].render(ctx);

    for (let i = 0, n = cars.length; i < n; ++i) {
      const neuralCar = cars[i];
      if (neuralCar.killed)
        ctx.globalAlpha = 0.2;

      neuralCar.object.render(ctx);

      if (neuralCar.killed)
        ctx.globalAlpha = 1;
    }
  }
}
