import vec2, {lerp, pickVec2Attrs} from 'logic/math/vec2';

export default class Camera {
  focusedElementPos = null;

  /**
   * Actual position of camera, relative to center of canvas
   */
  pos = vec2(0, 0);

  /**
   * @param {Number}  focusSpeed  Speed in pixels in which camera is moving to focused element
   *                              it is percentage value to be added to calc point between camera
   *                              and target obj so it should be > 0 and < 1
   */
  constructor({focusSpeed = 0.07} = {}) {
    this.focusSpeed = focusSpeed;
  }

  /**
   * Makes camera move to element position
   *
   * @param {Vec2}    elementPos It must have pos prop!
   * @param {Boolean} animation   If true - camera is animating to focus
   */
  moveTo(elementPos, animation = true) {
    if (!elementPos)
      throw new Error('Cannot attach camera to null element!');

    if (this.focusedElementPos === elementPos)
      return this;

    this.focusedElementPos = elementPos;
    if (!animation)
      this.pos = pickVec2Attrs(elementPos);

    return this;
  }

  /**
   * Updates camera position to focus on element
   *
   * @param {Number} delta
   */
  update(delta) {
    const {pos, focusedElementPos, focusSpeed} = this;
    if (!pos || !focusedElementPos)
      return;

    this.pos = lerp(
      focusSpeed * delta,
      pos,
      focusedElementPos,
    );
  }

  /**
   * Renders content that is translated relative to camera origin
   *
   * @param {Function}  renderCameraViewportFn
   * @param {Context2D} ctx
   * @param {Rect}      size
   */
  render(renderCameraViewportFn, ctx, size) {
    const {pos} = this;

    if (!pos) {
      renderCameraViewportFn(ctx, size);
      return;
    }

    const center = {
      x: pos.x - (size.w / 2),
      y: pos.y - (size.h / 2),
    };

    ctx.translate(-center.x, -center.y);
    renderCameraViewportFn(ctx, size);
    ctx.translate(center.x, center.y);
  }
}
