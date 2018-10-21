import GAME_VIEWS from 'ui/constants/gameViews';
import {attachReducerStore} from '../StoreProvider';

const INITIAL_STATE = {
  activeView: GAME_VIEWS.LOADING,

  // current views states
  resources: {
    rootPack: {
      percentage: 0,
      resources: null,
    },
  },

  // todo: cars AI
  neural: {},

  // board
  board: {
    segments: [
      {id: 1, angle: 0.5, width: 10, pos: {x: 10, y: 10}},
      {id: 1, angle: 0.5, width: 10, pos: {x: 20, y: 20}},
    ],
  },
};

const ACTIONS = {
  updateResourcesPackages: (state, data) => ({
    ...state,
    resources: {
      ...state.resources,
      ...data,
    },
  }),
};

export default attachReducerStore(
  {
    state: INITIAL_STATE,
    actions: ACTIONS,
  },
);
