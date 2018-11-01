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

export const drawSegments = (segments, color, width, ctx) => {
  const center = segments[0];
  const offsetY = Math.sin(segments[0].angle) * center.width;
  const offsetX = Math.cos(segments[0].angle) * center.width;

  ctx.strokeWidth = width;
  ctx.strokeStyle = color;

  ctx.beginPath();
  ctx.moveTo(
    center.x + offsetX,
    center.y + offsetY,
  );
  ctx.lineTo(
    center.x - offsetX,
    center.y - offsetY,
  );
  ctx.stroke();
};
