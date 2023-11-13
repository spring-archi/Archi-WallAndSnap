import { useEffect, useMemo, useRef } from 'react'
import { BackSide, Color, DoubleSide, Euler, Group, Shape, Vector2, Vector3 } from 'three'
import Line2 from '../utils/Line2'
import ShapePlane from './ShapePlane'
import { findCenter } from '../utils/utils'

const THICKNESS_CONST = Math.sqrt(2) / 2

const applyAngle = (position: Vector2, angle: number) => {
  return position.x * Math.cos(angle) + position.y * Math.sin(angle)
}

let test = 0

export const Hole: React.FC<{
  shape: Shape
  thickness: number
}> = ({ shape, thickness }) => {
  console.log(thickness)
  return (
    <group>
      {shape.getPoints().map((point, idx) => {
        const current = point
        const next = shape.getPoints()[idx >= shape.getPoints().length - 1 ? 0 : idx + 1]
        const line = new Line2(current, next)
        const angle = line.angle()
        const center = findCenter([current, next]) as Vector2
        const edges = [
          new Vector2(-thickness * THICKNESS_CONST, applyAngle(current, angle)),
          new Vector2(thickness * THICKNESS_CONST, applyAngle(current, angle)),
          new Vector2(thickness * THICKNESS_CONST, applyAngle(next, angle)),
          new Vector2(-thickness * THICKNESS_CONST, applyAngle(next, angle)),
        ]

        const rotation = new Euler(Math.PI / 2 - angle, Math.PI / 2, 0)
        rotation.order = 'YXZ'
        return (
          <ShapePlane
            position={new Vector3(center.x, center.y, -thickness * THICKNESS_CONST)}
            rotation={rotation}
            edges={edges}
            color={new Color(1, 0, 0)}
            key={idx}
            positionForce
          />
        )
      })}
    </group>
  )
}

type Info = {
  edges: Array<Vector2>
  rotation: Euler
  position: Vector3
}
