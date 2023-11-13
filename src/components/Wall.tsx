import React, { useEffect, useMemo, useRef, useState } from 'react'
import { Color, DoubleSide, Euler, Matrix4, Path, Shape, Vector2, Vector3 } from 'three'
import Line2 from '../utils/Line2'
import ShapePlane from './ShapePlane'
import { mergeHoles, findCenter, MUL_COORDINATES } from '../utils/utils'
import { Hole } from './Hole'

const HEIGHT: number = 200

const Wall: React.FC<{
  edges: Array<Vector2>
  thickness: number
  holes?: Array<Array<Vector2>>
}> = ({ edges, holes, thickness }) => {
  const { center, correction } = useMemo(() => {
    //@ts-expect-error
    const center: Vector2 = findCenter(edges)
    const correction = edges.map((e) => e.clone().sub(center))
    return {
      center,
      correction,
    }
  }, [edges])

  const color = useMemo(() => new Color(Math.random(), Math.random(), Math.random()), [])
  const angle = useMemo(
    () => new Line2(correction[0], correction[3]).angle(),
    [correction]
  )
  const wallCenter = useMemo(() => {
    return [
      findCenter([correction[0], correction[3]]) as Vector2,
      findCenter([correction[1], correction[2]]) as Vector2,
    ]
  }, [correction])
  const extend = useMemo(() => {
    return [
      new Vector2(correction[0].distanceTo(correction[3]) / 2, HEIGHT / 2),
      new Vector2(correction[1].distanceTo(correction[2]) / 2, HEIGHT / 2),
    ]
  }, [angle])

  const rotation = useMemo(() => new Euler(Math.PI / 2, angle, 0), [angle])

  const distance = useMemo(() => {
    if (holes != undefined) {
      const line = new Line2(edges[1], edges[2])
      const inCenterProj = line.findClosestPoint(
        findCenter([edges[0], edges[3]]) as Vector2
      )
      const distance = (findCenter([edges[1], edges[2]]) as Vector2).distanceTo(
        inCenterProj as Vector2
      )

      return (
        distance *
        (inCenterProj.distanceToSquared(line.start) >
        inCenterProj.distanceToSquared(line.end)
          ? 1
          : -1)
      )
    }
    return 0
  }, [edges])
  const [holeShape, outHoleShape] = useMemo(() => {
    if (holes != undefined) {
      const merged = mergeHoles(holes)
      return [
        merged.map((m) => {
          return new Shape(m)
        }),
        merged.map((m) => {
          return new Shape(
            m.map((m) =>
              m.clone().multiply(new Vector2(1, -1)).add(new Vector2(distance, 0))
            )
          )
        }),
      ]
    }
    return []
  }, [holes, distance])
  return (
    <>
      <mesh position={new Vector3(center.x, center.y, 0)} scale={[1, 1, -1]}>
        <shapeGeometry args={[new Shape(correction)]}></shapeGeometry>
        <meshBasicMaterial color={color} />
      </mesh>

      <mesh position={new Vector3(center.x, center.y, HEIGHT)}>
        <shapeGeometry args={[new Shape(correction)]}></shapeGeometry>
        <meshBasicMaterial color={new Color(color)} />
      </mesh>
      <ShapePlane
        position={new Vector3(center.x, center.y, HEIGHT / 2)}
        edges={MUL_COORDINATES.map((mul) =>
          wallCenter[0].clone().add(extend[0].clone().multiply(mul))
        )}
        rotation={rotation}
        holes={holeShape}
        material
        fill={thickness}
      />
      <ShapePlane
        position={new Vector3(center.x, center.y, HEIGHT / 2)}
        edges={MUL_COORDINATES.map((mul) =>
          wallCenter[1].clone().add(extend[1].clone().multiply(mul))
        )}
        rotation={new Euler(rotation.x, rotation.y + Math.PI, rotation.z + Math.PI)}
        holes={outHoleShape}
      />
    </>
  )
}

export default React.memo(
  Wall,
  (prev, next) => !prev.edges.map((p, idx) => p.equals(next.edges[idx])).includes(false)
)
