import React from 'react';
import PropTypes from 'prop-types';

import GAME_RESOURCES from 'ui/constants/gameResources';
import createResourcesPack from 'ui/resources/createResourcesPack';

import attachGameStore from './utils/helpers/attachGameStore';
import {connect} from './utils/StoreProvider';

import {SimulationCanvas} from './utils';
import GameViews from './views';

/**
 * Main game class used to load resources and manage views stuff
 *
 * @class
 * @export
 */
export default
@attachGameStore
@connect(
  (state, actions) => ({
    // variables
    gameState: state,
    activeView: state.activeView,

    // actions
    onUpdateResourcesPackages: actions.updateResourcesPackages,
  }),
  {
    provideStore: true,
  },
)
class CarsCanvas extends React.Component {
  static propTypes = {
    resourcePack: PropTypes.objectOf(PropTypes.string),
  };

  static defaultProps = {
    resourcePack: GAME_RESOURCES,
  };

  activeViewInstance = null;

  componentDidMount() {
    const {
      resourcePack,
      activeView,
      onUpdateResourcesPackages,
    } = this.props;

    // resources loading stream
    createResourcesPack(resourcePack).subscribe((pack) => {
      onUpdateResourcesPackages(
        {
          rootPack: pack,
        },
      );
    });

    // lazy load initial state
    this.loadView(activeView);
  }

  componentDidUpdate(prevProps) {
    const {activeView} = this.props;
    if (prevProps.activeView !== activeView)
      this.loadView(activeView);
  }

  /**
   * @param {Number}  delta
   */
  onUpdate = (delta) => {
    const {gameState} = this.props;
    const {activeViewInstance} = this;

    activeViewInstance.update && activeViewInstance.update(
      delta,
      gameState,
    );
  };

  /**
   * Render layer content
   *
   * @param {Context2D} ctx
   * @param {Rect}      canvasSize
   */
  onRender = (ctx, canvasSize) => {
    const {gameState} = this.props;
    const {activeViewInstance} = this;

    activeViewInstance.render(
      ctx,
      canvasSize,
      gameState,
    );
  };

  /**
   * @param {Number}  viewType
   */
  loadView = (viewType) => {
    const {store} = this.props;

    // cleanup memory (listeners etc)
    if (this.activeViewInstance)
      this.activeViewInstance.unload();

    // assign new instance
    this.activeViewInstance = new GameViews[viewType](
      store,
      this.loadView,
    );
  }

  render() {
    return (
      <div
        style={{
          width: 'auto',
          height: 'auto',
        }}
      >
        <SimulationCanvas
          size={{
            w: 640,
            h: 480,
          }}
          onUpdateSimulation={this.onUpdate}
          onRenderSimulation={this.onRender}
        />
      </div>
    );
  }
}
