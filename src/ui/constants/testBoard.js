import vec2 from 'logic/math/vec2';
import {Polygon} from '../views/objects';

export default [
  new Polygon(
    [
      vec2(100, 70),
      vec2(200, 70),
      vec2(200, 120),
    ],
  ),

  new Polygon(
    [
      vec2(100, 170),
      vec2(130, 320),
      vec2(150, 220),
    ],
  ),

  new Polygon(
    [
      vec2(220, 190),
      vec2(320, 120),
      vec2(300, 178),
    ],
  ),

  new Polygon(
    [
      vec2(400, 270),
      vec2(500, 220),
      vec2(500, 420),
    ],
  ),

  new Polygon(
    [
      vec2(540, 70),
      vec2(420, 70),
      vec2(420, 190),
    ],
  ),

  new Polygon(
    [
      vec2(220, 340),
      vec2(320, 320),
      vec2(320, 420),
    ],
  ),

  new Polygon(
    [
      vec2(5, 5),
      vec2(635, 5),
      vec2(635, 475),
      vec2(5, 475),
    ],
  ),
];
