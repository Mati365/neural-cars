import * as T from 'logic/neural-vectorized';

import {normalizeAngle} from 'logic/math/toRadians';
import {clamp} from 'logic/math';

/**
 * Car AI
 *
 * @param {Object}  neuralCar
 * @param {Number}  delta
 */
const neuralControlCar = (neuralCar, delta) => {
  const {
    neural, // ai
    object: {
      body,
      intersectRays,
    },
  } = neuralCar;

  const neuralOutput = T.exec(
    [
      body.speed / body.maxSpeed, // nornalize speed
      normalizeAngle(body.angle),
      ...intersectRays.pickRaysClosestIntersects(),
    ],
    neural,
  );

  body.steerAngle = clamp(
    -body.maxSteerAngle,
    body.maxSteerAngle,
    body.steerAngle + (neuralOutput[1] * delta / 35),
  );

  body.speed = clamp(
    body.maxSpeed / 2,
    body.maxSpeed,
    body.speed + neuralOutput[0] * delta / 30,
  );
};

export default neuralControlCar;
