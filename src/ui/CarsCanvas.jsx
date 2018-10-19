import React from 'react';
import SimulationCanvas from './SimulationCanvas';

import createResourcePack from './engine/createResourcesPack';

createResourcePack(
  {
    yellow: 'https://techflourish.com/images/car-clipart-sprite-sheet-1.jpg',
    blue: 'https://mbtskoudsalg.com/images/race-car-sprite-png-1.png',
  },
)
  .subscribe(
    (cars) => {
      console.log(cars);
    },
  );

export default class CarsCanvas extends React.PureComponent {
  onUpdateSimulation = () => {
  }

  render() {
    return (
      <SimulationCanvas
        onUpdateSimulation={this.onUpdateSimulation}
      />
    );
  }
}
