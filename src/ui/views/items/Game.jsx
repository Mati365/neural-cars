import toRadians from 'logic/math/toRadians';
import vec2 from 'logic/math/vec2';

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
  ];

  cars = [
    new Car(
      {
        angle: toRadians(40),
        steerAngle: toRadians(0),
        speed: 0,

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
    ),

    new Car(
      {
        steerAngle: toRadians(45),
        speed: 0.5,

        // car mass center position
        pos: {
          x: 450,
          y: 250,
        },

        // car size
        size: {
          w: 28,
          h: 48,
        },
      },
    ),
  ];

  update(delta) {
    const {
      cars,
      board,
    } = this;

    for (let i = 0, n = cars.length; i < n; ++i)
      cars[i].update(delta, board);
  }

  render(ctx) {
    const {
      cars,
      board,
    } = this;

    for (let i = 0, n = board.length; i < n; ++i)
      board[i].render(ctx);

    for (let i = 0, n = cars.length; i < n; ++i)
      cars[i].render(ctx);
  }
}
