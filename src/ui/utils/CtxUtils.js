export const drawRect = (rect, borderWidth, color, ctx) => {
  ctx.beginPath();
  ctx.lineWidth = borderWidth;
  ctx.strokeStyle = color;
  ctx.rect(rect.x, rect.y, rect.w, rect.h);
  ctx.stroke();
};

export const fillRect = (rect, color, ctx) => {
  ctx.beginPath();
  ctx.fillStyle = color;
  ctx.rect(rect.x, rect.y, rect.w, rect.h);
  ctx.fill();
};

export const drawLines = () => {};
