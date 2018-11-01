import {CtxUtils} from 'ui/utils';

export const getPreferredWheelSize = carSize => ({
  w: carSize.w * 0.2,
  h: carSize.h * 0.2,
});

export const createWheel = (angle, rect) => ({
  angle,
  rect,
});

export const createWheelsAxis = (axisPos, size, angle, rect) => {
  const y = rect.h * axisPos;

  return [
    createWheel(
      angle || 0.0,
      {
        x: -size.w / 2,
        y,
        ...size,
      },
    ),

    createWheel(
      angle || 0.0,
      {
        x: rect.w - size.w / 2,
        y,
        ...size,
      },
    ),
  ];
};

export const drawWheel = (wheel, ctx) => {
  const {rect, angle} = wheel;

  ctx.save();
  ctx.translate(
    rect.x + rect.w / 2,
    rect.y + rect.h / 2,
  );
  ctx.rotate(angle);

  CtxUtils.fillRect(
    {
      x: -rect.w / 2,
      y: -rect.h / 2,
      w: rect.w,
      h: rect.h,
    },
    '#fff',
    ctx,
  );
  ctx.restore();
};
