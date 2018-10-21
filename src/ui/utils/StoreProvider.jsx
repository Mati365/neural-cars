import React from 'react';
import PropTypes from 'prop-types';
import * as R from 'ramda';

const DEFAULT_INITIAL_STATE = {
  state: {},
  actions: {},
};

export const StoreContext = React.createContext(DEFAULT_INITIAL_STATE);

export default class StoreProvider extends React.PureComponent {
  static propTypes = {
    store: PropTypes
      .shape({
        state: PropTypes.any,
        actions: PropTypes.objectOf(PropTypes.func),
      })
      .isRequired,
  };

  static getDerivedStateFromProps(nextProps, nextState) {
    return !nextState.store?.modified && {
      store: nextProps.store,
    };
  }

  state = R.clone(DEFAULT_INITIAL_STATE);

  watchers = [];

  updateStoreState = (newState) => {
    if (!newState)
      return;

    // safe notify watchers
    const {store: {state: oldState}} = this.state;
    R.forEach(
      R.apply(R.__, [newState, oldState]),
      this.watchers,
    );

    // update state
    this.setState(
      state => ({
        ...state,
        store: {
          ...state.store,
          modified: true,
          state: newState,
        },
      }),
    );
  };

  watchState = (fn) => {
    this.watchers = [...this.watchers, fn];
    return fn;
  };

  removeStateWatch = (fn) => {
    this.watchers = R.filter(
      R.complement(R.equals)(fn),
      this.watchers,
    );
  }

  getPropStore = () => {
    const {store} = this.state;

    return {
      ...store,
      // callbacks and other stuff
      updateState: this.updateStoreState,
      watchState: this.watchState,
      removeStateWatch: this.removeStateWatch,

      // predefined actions
      actions: R.map(
        fn => (...args) => this.updateStoreState(fn(store.state, ...args)),
        store.actions,
      ),
    };
  };

  render() {
    const {children} = this.props;

    return (
      <StoreContext.Provider value={this.getPropStore()}>
        {children}
      </StoreContext.Provider>
    );
  }
}

export const attachReducerStore = store => (Component) => {
  const Wrapped = props => (
    <StoreProvider store={store}>
      <Component {...props} />
    </StoreProvider>
  );

  Wrapped.displayName = 'attachReducerStore()';

  return Wrapped;
};

/**
 * Connects component to global store
 *
 * @param {Function}  selector  Function that returns data from store
 * @param {Object}    flags
 */
export const connect = (selector, {provideStore} = {}) => (Component) => {
  const Wrapped = props => (
    <StoreContext.Consumer>
      {store => (
        <Component
          {...props}
          {...selector(store.state, store.actions)}
          {...provideStore && {
            store,
          }}
        />
      )}
    </StoreContext.Consumer>
  );

  Wrapped.displayName = 'connect()';

  return Wrapped;
};
