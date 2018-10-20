import React from 'react';
import PropTypes from 'prop-types';
import * as R from 'ramda';

export const StoreContext = React.createContext({
  state: {},
  actions: {},
});

export default class StoreProvider extends React.PureComponent {
  static propTypes = {
    store: PropTypes
      .shape({
        state: PropTypes.any,
        actions: PropTypes.objectOf(PropTypes.function),
      })
      .isRequired,
  };

  static getDerivedStateFromProps(nextProps, nextState) {
    return !nextState.store?.modified && {
      store: nextProps.store,
    };
  }

  getPropStore = () => {
    const {store} = this.state;

    return R.evolve(
      {
        actions: R.map(
          fn => (...args) => {
            const newState = fn(...args);
            if (!newState)
              return;

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
          },
        ),
      },
    )(store);
  };

  render() {
    const {children} = this.props;

    return (
      <StoreContext value={this.getPropStore()}>
        {children}
      </StoreContext>
    );
  }
}

export const attachReducerStore = store => (Component) => {
  const Wrapped = props => (
    <StoreProvider store={store}>
      <Component {...props} />
    </StoreProvider>
  );

  Wrapped.displayName = 'Wrapped';

  return Wrapped;
};
