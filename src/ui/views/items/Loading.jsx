import GAME_VIEWS from 'ui/constants/gameViews';

import {CtxUtils} from 'ui/utils';
import {globalResLoadingPercentage} from 'ui/utils/helpers/selectors';

import GameView from '../GameView';

const LOADING_BAR_SIZE = {
  w: 128,
  h: 8,
};

const drawLoadingBar = (rect, percentage, ctx) => {
  // background
  CtxUtils.drawRect(
    rect,
    2,
    '#fff',
    ctx,
  );

  // progress
  CtxUtils.fillRect(
    {
      x: rect.x + 2,
      y: rect.y + 2,
      w: (rect.w - 4) * percentage,
      h: rect.h - 4,
    },
    '#fff',
    ctx,
  );
};

/**
 * Shows game loading bar, when state updates and new percentage is 1
 * try to load new game page, GAME_VIEWS.GAME
 *
 * @class
 * @export
 */
export default class LoadingView extends GameView {
  stateDidUpdate(state, prevState) {
    const newLoadingPercentage = globalResLoadingPercentage(state);
    if (
      globalResLoadingPercentage(prevState) !== newLoadingPercentage
        && newLoadingPercentage === 1.0
    ) {
      setTimeout(
        () => this.loadView(GAME_VIEWS.GAME),
        1000,
      );
    }
  }

  render(ctx, canvasSize, state) {
    drawLoadingBar(
      {
        x: canvasSize.w / 2 - LOADING_BAR_SIZE.w / 2,
        y: canvasSize.h / 2 - LOADING_BAR_SIZE.h / 2,
        w: LOADING_BAR_SIZE.w,
        h: LOADING_BAR_SIZE.h,
      },
      globalResLoadingPercentage(state),
      ctx,
    );
  }
}
