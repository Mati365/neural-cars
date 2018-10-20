import React from 'react';

import {attachReducerStore} from './utils/StoreProvider';
import SimulationCanvas from './SimulationCanvas';

export default
@attachReducerStore(
  {
    state: {},
    actions: {},
  },
)
class CarsCanvas extends React.PureComponent {
  render() {
    const {activeMode} = this;

    return (
      <SimulationCanvas onUpdateSimulation={this.onUpdateSimulation}>
        {::activeMode.render}
      </SimulationCanvas>
    );
  }
}
