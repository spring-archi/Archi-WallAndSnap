import { useCallback, useEffect, useState } from 'react'
import { Line, Line3, Mesh, Vector2, Vector3 } from 'three'
import Line2 from '../utils/Line2'

const useWalls = (
  vertices: Array<Vector2>,
  connections: Array<[number, number]>,
  thicknesses: Array<number>
) => {
  const [edges, setEdges] = useState<Array<Array<Vector2>>>(new Array())
  const [_walls, _setWalls] = useState<Array<Wall>>(new Array())

  useEffect(() => {
    const walls: Array<Wall> = new Array()
    const wallsInEdge: Array<Edge> = new Array()

    vertices.forEach((v) => {
      wallsInEdge.push({
        position: v,
        walls: new Array(),
      })
    })

    const edges = connections.map((con, idx) => {
      const points = makePoints(vertices[con[0]], vertices[con[1]], thicknesses[idx])
      const wall = {
        start: vertices[con[0]],
        end: vertices[con[1]],
        vertices: points,
        lines: [new Line2(points[0], points[3]), new Line2(points[1], points[2])],
      }
      wallsInEdge[con[0]].walls.push(wall)
      wallsInEdge[con[1]].walls.push(wall)
      walls.push(wall)
      return points
    })
    _setWalls(walls)

    wallsInEdge.forEach((w, idx) => {
      join(w.position, w.walls)
    })

    setEdges(edges)
  }, [])

  const snap = useCallback(
    (bulb: Mesh) => {
      const getLines = () => {
        const result: Array<Line3> = new Array()
        _walls.forEach((w) => {
          result.push(
            ...w.lines.map((l) => {
              return l.toLine3()
            })
          )
        })
        return result
      }
      const lines = getLines()
      const closest = lines.map((l) =>
        l.closestPointToPoint(bulb.position, true, new Vector3())
      )
      let distance: number = Infinity
      let index: number = 0
      closest.forEach((pos: Vector3, idx: number) => {
        const local_dis = pos.distanceTo(bulb.position)
        if (local_dis < distance) {
          distance = local_dis
          index = idx
        }
      })
      if (distance < 100) {
        bulb.position.setScalar(0).add(closest[index])
        bulb.position.z = 1
        const w = _walls[Math.floor(index / 2)]
        const w_cloest = new Line3(
          new Vector3(w.start.x, w.start.y, 1),
          new Vector3(w.end.x, w.end.y, 1)
        ).closestPointToPoint(closest[index], true, new Vector3())
        const dir_3 = w_cloest.clone().sub(closest[index])
        const dir = new Vector2(dir_3.x, dir_3.y).normalize()
        dir_3.set(dir.x, dir.y, 0).multiplyScalar(-15)
        bulb.position.add(dir_3)
        let rot = lines[index].delta(new Vector3())
        const vec2 = new Vector2(rot.x, rot.y)
        let a = vec2.angle() - dir.angle()
        if (a < 0) a = Math.PI * 2 + a
        bulb.rotation.z = a > Math.PI ? vec2.angle() : vec2.angle() + Math.PI
      }
    },
    [edges, _walls]
  )

  return [edges, snap] as [Array<Array<Vector2>>, (bulb: Mesh) => void]
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
  end: Vector2
  lines: Array<Line2>
}
export default useWalls
