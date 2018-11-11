import * as R from 'ramda';

import getRandomNumber, {getRandomFromRange} from 'utils/getRandomNumber';

import {toRadians} from 'logic/math';
import {
  pickVec2Attrs,
  scalarToVec2,
  addVec2,
} from 'logic/math/vec2';

import {Polygon} from '../shared/objects';

const generateBoard = ({
  startPoint,
  startAngle,
  segmentsCount,
  segmentSize,
}) => {
  const randomBend = () => (
    6 * Math.sign(getRandomNumber(-1, 1))
  );

  let currentAngle = toRadians(getRandomFromRange(startAngle));
  let bend = randomBend();

  const path = [
    {
      angle: currentAngle,
      vec: pickVec2Attrs(startPoint),
    },
  ];

  for (let i = 1; i < segmentsCount; ++i) {
    const prevVec = path[i - 1];

    path.push({
      angle: currentAngle,
      vec: addVec2(
        prevVec.vec,
        scalarToVec2(
          currentAngle,
          getRandomFromRange(segmentSize.w),
        ),
      ),
    });

    if (bend === 1)
      bend = 6 * (-Math.sign(bend));

    const angleDelta = (
      bend < 0
        ? getRandomNumber(-0.1, -0.1)
        : getRandomNumber(0.1, 0.1)
    );

    bend = Math.sign(bend) * (Math.abs(bend) - 1);
    currentAngle += angleDelta;
  }

  const polygonMapper = dir => R.map(
    ({angle, vec}) => (
      addVec2(
        scalarToVec2(
          angle - (Math.PI / 2),
          dir * segmentSize.h / 2,
        ),
        vec,
      )
    ),
    path,
  );

  return [
    new Polygon(
      polygonMapper(-1),
      {
        loop: false,
      },
    ),

    new Polygon(
      polygonMapper(1),
      {
        loop: false,
      },
    ),
  ];
};

export default generateBoard;
