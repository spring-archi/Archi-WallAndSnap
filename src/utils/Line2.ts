import { Line3, Vector2, Vector3 } from 'three'

class Line2 {
  constructor(public start: Vector2, public end: Vector2) {}

  public static getProjPoint(l1: Line2, l2: Line2) {
    const x1 = l1.start.x
    const y1 = l1.start.y
    const x2 = l1.end.x
    const y2 = l1.end.y
    const x3 = l2.start.x
    const y3 = l2.start.y
    const x4 = l2.end.x
    const y4 = l2.end.y
    let determinant = (x1 - x2) * (y3 - y4) - (y1 - y2) * (x3 - x4)
    if (determinant === 0) {
      return l1.start.clone().add(l2.start).divideScalar(2)
    } else {
      const px =
        ((x1 * y2 - y1 * x2) * (x3 - x4) - (x1 - x2) * (x3 * y4 - y3 * x4)) / determinant
      const py =
        ((x1 * y2 - y1 * x2) * (y3 - y4) - (y1 - y2) * (x3 * y4 - y3 * x4)) / determinant
      return new Vector2(px, py)
    }
  }

  public angle() {
    return this.end.clone().sub(this.start).angle()
  }

  public toLine3() {
    return new Line3(
      new Vector3(this.start.x, this.start.y, 0),
      new Vector3(this.end.x, this.end.y, 0)
    )
  }

  public findClosestPoint(point: Vector2) {
    const { x, y } = this.toLine3().closestPointToPoint(
      new Vector3(point.x, point.y, 0),
      false,
      new Vector3()
    )
    return new Vector2(x, y)
  }
}
export default Line2
