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
    new Car(
      // car mass center position
      {
        x: 300,
        y: 300,
      },

      // car size
      {
        w: 32,
        h: 64,
      },
    ),
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
