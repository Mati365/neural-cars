import {CtxUtils} from 'ui/utils';
import {
  findLinesRayIntersect,
  mapPointsToLines,
} from 'logic/math/line';

/**
 * Single renderable polygon body, it should be static
 *
 * @export
 */
export default class Polygon {
  constructor(
    points,
    {
      color = '#fff',
      width = 1,
      loop = true,
    } = {},
  ) {
    this.points = points;
    this.lines = mapPointsToLines(loop, points); // after change points, update lines

    this.config = {
      color,
      width,
      loop,
    };
  }

  checkLineCollision(line) {
    const {lines} = this;

    return findLinesRayIntersect(lines, line);
  }

  render(ctx) {
    const {points, config} = this;

    CtxUtils.drawPolygon(
      points,
      config.color,
      config.width,
      config.loop,
      ctx,
    );
  }
}
