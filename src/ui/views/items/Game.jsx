import toRadians from 'logic/math/toRadians';
import vec2 from 'logic/math/vec2';

import {
  createPopulation,
  updatePopulation,
} from 'logic/genetic';

import GameView from '../GameView';
import {
  Car,
  Polygon,
} from '../objects';

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
        vec2(220, 170),
        vec2(320, 120),
        vec2(320, 220),
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
        vec2(5, 5),
        vec2(635, 5),
        vec2(635, 475),
        vec2(5, 475),
      ],
    ),
  ];

  population = createPopulation(
    {
      size: 1,
    },
    () => (
      new Car(
        {
          angle: toRadians(60),
          steerAngle: toRadians(45),
          speed: 2.5,

          // car mass center position
          pos: {
            x: 300,
            y: 300,
          },

          // car size
          size: {
            w: 32,
            h: 64,
          },
        },
      )
    ),
  );

  update(delta) {
    const {population, board} = this;
    updatePopulation(population, delta, board);
  }

  render(ctx) {
    const {
      population: {items: cars},
      board,
    } = this;

    for (let i = 0, n = board.length; i < n; ++i)
      board[i].render(ctx);

    for (let i = 0, n = cars.length; i < n; ++i)
      cars[i].render(ctx);
  }
}
