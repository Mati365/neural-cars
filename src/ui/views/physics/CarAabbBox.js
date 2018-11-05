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

  /**
   * Check if car has intersect and if intersect is
   * lower than accepted non collision distance
   *
   * @returns {Boolean}
   */
  isCollisionDetected(board) {
    const {cornersLines} = this.body;

    for (let i = cornersLines.length - 1; i >= 0; --i) {
      const cornerLine = cornersLines[i];

      for (let j = board.length - 1; j >= 0; --j) {
        const boardItem = board[j];
        if (!boardItem.checkLineCollision)
          continue;

        if (boardItem.checkLineCollision(cornerLine))
          return true;
      }
    }

    return false;
  }
}
