import {vec2, dimensions} from 'logic/math';
import {CtxUtils} from 'ui/utils';

import GameView from '../GameView';

/**
 * Layer that renders dots in provided size in render method
 *
 * @see
 *  Draw always one / two dots offscreen! It will help with dragging
 */
class EditorCellSheet {
  constructor({
    offscreenCells = 2,
    cellSize = dimensions(24, 24),
    pointRadius = 1,
    pointColor = '#4a4949',
  } = {}) {
    this.offscreenCells = offscreenCells;
    this.cellSize = cellSize;
    this.pointRadius = pointRadius;
    this.pointColor = pointColor;
  }

  render(ctx, size) {
    const {
      cellSize, pointRadius,
      offscreenCells, pointColor,
    } = this;

    for (let i = (size.w / cellSize.w) + offscreenCells; i >= -offscreenCells; --i) {
      for (let j = (size.h / cellSize.h) + offscreenCells; j >= -offscreenCells; --j) {
        CtxUtils.fillCircle(
          vec2(
            i * cellSize.w,
            j * cellSize.h,
          ),
          pointRadius,
          pointColor,
          ctx,
        );
      }
    }
  }
}

export default class Editor extends GameView {
  sheet = new EditorCellSheet;

  render(ctx, size) {
    const {sheet} = this;

    sheet.render(ctx, size);
  }
}
