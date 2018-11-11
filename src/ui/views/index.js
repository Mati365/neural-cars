import GAME_VIEWS from 'ui/constants/gameViews';
import * as Boards from './boards';

export default {
  [GAME_VIEWS.LOADING]: Boards.Loading,
  [GAME_VIEWS.GAME]: Boards.Game,
  [GAME_VIEWS.EDITOR]: Boards.Editor,
};
