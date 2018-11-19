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
