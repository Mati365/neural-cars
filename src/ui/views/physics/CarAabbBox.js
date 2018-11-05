/**
 * Ray collision detection is not good at all,
 * it would generate collision true flag event
 * when body is going near object but not touching it.
 *
 * IntersectRays should be used ONLY for neural network and other magic shit
 * DO NOT USE INTERSECT RAYS TO COLLISION DETECT
 *
 * @export
 */
export default class CarAabbBox {
  constructor(body) {
    this.body = body;
  }

  update(dt) {}
}
