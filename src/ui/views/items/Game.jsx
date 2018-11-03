import toRadians from 'logic/math/toRadians';

import GameView from '../GameView';
import Car from '../objects/Car';

/**
 * Shows game simulation
 *
 * @class
 * @export
 */
export default class GameMainView extends GameView {
  cars = [
    new Car({
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
    }),

    new Car({
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
    }),
  ];

  update(delta) {
    const {cars} = this;
    for (let i = 0, n = cars.length; i < n; ++i)
      cars[i].update(delta);
  }

  render(ctx) {
    const {cars} = this;
    for (let i = 0, n = cars.length; i < n; ++i)
      cars[i].render(ctx);
  }
}
