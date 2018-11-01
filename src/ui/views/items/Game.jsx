import * as CtxUtils from 'ui/utils/CtxUtils';
import GameView from '../GameView';

const toRadians = deg => (deg * Math.PI / 180);

const TEST_MAP = {
  segments: [
    {
      x: 200,
      y: 200,
      angle: toRadians(80),
      width: 60,
      length: 100,
    },
  ],
};

/**
 * Shows game simulation
 *
 * @class
 * @export
 */
export default class GameMainView extends GameView {
  render(ctx) {
    CtxUtils.drawSegments(
      TEST_MAP.segments,
      '#ffffff',
      2,
      ctx,
    );
  }
}
