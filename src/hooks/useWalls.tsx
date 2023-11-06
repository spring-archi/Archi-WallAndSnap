import { useEffect, useState } from 'react'
import { Line3, Vector2, Vector3 } from 'three'
import Line2 from '../utils/Line2'

const useWalls = (
  vertices: Array<Vector2>,
  connections: Array<[number, number]>,
  thicknesses: Array<number>
) => {
  const [edges, setEdges] = useState<Array<Array<Vector2>>>(new Array())

  useEffect(() => {
    const wallsInEdge: Array<Edge> = new Array()

    vertices.forEach((v) => {
      wallsInEdge.push({
        position: v,
        walls: new Array(),
      })
    })

    const edges = connections.map((con, idx) => {
      const points = makePoints(vertices[con[0]], vertices[con[1]], thicknesses[idx])
      wallsInEdge[con[0]].walls.push({
        start: vertices[con[0]],
        vertices: points,
      })
      wallsInEdge[con[1]].walls.push({
        start: vertices[con[0]],
        vertices: points,
      })
      return points
    })

    wallsInEdge.forEach((w, idx) => {
      join(w.position, w.walls)
    })

    setEdges(edges)
  }, [])

  return edges
}
const SquareConst = Math.PI / 4

function makePoints(
  start: Vector2,
  end: Vector2,
  thickness: number
): [Vector2, Vector2, Vector2, Vector2] {
  const push = (isStart: boolean) => {
    positions.push(
      (isStart ? start : end)
        .clone()
        .add(
          new Vector2(Math.cos(angle), Math.sin(angle)).multiplyScalar(thickness).negate()
        )
    )
  }
  const positions = new Array()
  let angle: number = 0
  angle = end.clone().sub(start).angle() + SquareConst
  push(true)
  angle = end.clone().sub(start).angle() - SquareConst
  push(true)
  angle = start.clone().sub(end).angle() + SquareConst
  push(false)
  angle = start.clone().sub(end).angle() - SquareConst
  push(false)
  return positions as [Vector2, Vector2, Vector2, Vector2]
}

function join(edge: Vector2, walls: Array<Wall>) {
  if (walls.length >= 2) {
    const lines: Array<Line2> = new Array()
    walls.forEach((w) => {
      if (w.start === edge) {
        lines.push(new Line2(w.vertices[0], w.vertices[3]))
        lines.push(new Line2(w.vertices[1], w.vertices[2]))
      } else {
        lines.push(new Line2(w.vertices[3], w.vertices[0]))
        lines.push(new Line2(w.vertices[2], w.vertices[1]))
      }
    })
    lines.sort((e1, e2) => {
      return new Line2(edge, e1.end).angle() > new Line2(edge, e2.end).angle() ? 1 : -1
    })
    for (let i = 1; i < lines.length - 2; i += 2) {
      joinLine(lines[i], lines[i + 1])
    }
    joinLine(lines[0], lines[lines.length - 1])

    if (walls.length >= 3) {
      walls.forEach((w) => {
        const idx = w.start === edge ? 1 : 3
        w.vertices.splice(idx, 0, edge.clone())
      })
    }
  }
}

function joinLine(l1: Line2, l2: Line2) {
  const point = Line2.getProjPoint(l1, l2)!
  l1.start.setX(point.x)
  l1.start.setY(point.y)
  l2.start.setX(point.x)
  l2.start.setY(point.y)
}

type Edge = {
  position: Vector2
  walls: Array<Wall>
}

type Wall = {
  vertices: Array<Vector2>
  start: Vector2
}
export default useWalls
