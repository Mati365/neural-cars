import GAME_VIEWS from 'ui/constants/gameViews';
import * as Items from './items';

export default {
  [GAME_VIEWS.LOADING]: Items.Loading,
  [GAME_VIEWS.GAME]: Items.Game,
  [GAME_VIEWS.EDITOR]: Items.Editor,
};
