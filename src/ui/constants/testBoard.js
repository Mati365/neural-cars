import vec2 from 'logic/math/vec2';
import {Polygon} from '../views/shared/objects';

export default [
  // top line
  new Polygon(
    [
      vec2(100, -100),
      vec2(300, 20),
    ],
    {
      loop: false,
    },
  ),

  // bottom line
  new Polygon(
    [
      vec2(100, 100),
      vec2(400, 100),
    ],
    {
      loop: false,
    },
  ),
];
