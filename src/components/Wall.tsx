import React, { useEffect, useMemo, useRef, useState } from 'react'
import { Color, DoubleSide, Euler, Matrix4, Path, Shape, Vector2, Vector3 } from 'three'
import Line2 from '../utils/Line2'
import ShapePlane from './ShapePlane'

const height: number = 200

const findCenter = <T extends Vector2 | Vector3>(vertices: Array<T>) => {
  const center = vertices[0].clone().setScalar(0)
  vertices.forEach((v) => {
    //@ts-expect-error
    center.add(v)
  })
  center.divideScalar(vertices.length)
  return center
}

const Wall: React.FC<{ edges: Array<Vector2>; thickness: number }> = ({ edges }) => {
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
      new Vector2(correction[0].distanceTo(correction[3]) / 2, height / 2),
      new Vector2(correction[1].distanceTo(correction[2]) / 2, height / 2),
    ]
  }, [angle])

  const rotation = useMemo(() => new Euler(Math.PI / 2, angle, 0), [angle])
  return (
    <>
      <mesh position={new Vector3(center.x, center.y, 0)} scale={[1, 1, -1]}>
        <shapeGeometry args={[new Shape(correction)]}></shapeGeometry>
        <meshBasicMaterial color={color} />
      </mesh>

      <mesh position={new Vector3(center.x, center.y, height)}>
        <shapeGeometry args={[new Shape(correction)]}></shapeGeometry>
        <meshBasicMaterial color={new Color(color)} />
      </mesh>
      <ShapePlane
        position={new Vector3(center.x, center.y, height / 2)}
        edges={[
          wallCenter[0].clone().add(extend[0].clone().multiply(new Vector2(-1, 1))),
          wallCenter[0].clone().add(extend[0].clone().multiply(new Vector2(1, 1))),
          wallCenter[0].clone().add(extend[0].clone().multiply(new Vector2(1, -1))),
          wallCenter[0].clone().add(extend[0].clone().multiply(new Vector2(-1, -1))),
        ]}
        rotation={rotation}
        material
      />
      <ShapePlane
        position={new Vector3(center.x, center.y, height / 2)}
        edges={[
          wallCenter[1].clone().add(extend[1].clone().multiply(new Vector2(-1, 1))),
          wallCenter[1].clone().add(extend[1].clone().multiply(new Vector2(1, 1))),
          wallCenter[1].clone().add(extend[1].clone().multiply(new Vector2(1, -1))),
          wallCenter[1].clone().add(extend[1].clone().multiply(new Vector2(-1, -1))),
        ]}
        rotation={new Euler(rotation.x, rotation.y + Math.PI, rotation.z + Math.PI)}
      />
    </>
  )
}

export default React.memo(
  Wall,
  (prev, next) => !prev.edges.map((p, idx) => p.equals(next.edges[idx])).includes(false)
)
