import {CtxUtils} from 'ui/utils';

export const getPreferredWheelSize = carSize => ({
  w: carSize.w * 0.2,
  h: carSize.h * 0.2,
});

export const createWheel = (angle, pos, flags) => ({
  angle,
  pos,
  ...flags,
});

export const drawWheel = (pos, rect, angle, ctx) => {
  ctx.save();
  ctx.translate(
    pos.x,
    pos.y,
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
