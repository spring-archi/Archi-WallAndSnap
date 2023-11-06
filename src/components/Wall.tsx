import React from 'react'
import { useState } from 'react'
import { Color, Shape, Vector2 } from 'three'

const Wall: React.FC<{ edges: Array<Vector2> }> = (props) => {
  return (
    <>
      <mesh>
        <shapeGeometry args={[new Shape(props.edges)]}></shapeGeometry>
        <meshBasicMaterial
          color={new Color(Math.random(), Math.random(), Math.random())}
        />
      </mesh>
    </>
  )
}

export default React.memo(
  Wall,
  (prev, next) => !prev.edges.map((p, idx) => p.equals(next.edges[idx])).includes(false)
)
