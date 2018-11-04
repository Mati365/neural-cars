import {CtxUtils} from 'ui/utils';

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
    this.config = {
      color,
      width,
      loop,
    };
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
