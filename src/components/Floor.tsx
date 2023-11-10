import React, { useMemo } from 'react'
import { FrontSide, RepeatWrapping, Shape, Texture, Vector2 } from 'three'
import logo2 from './logo.avif'
import { useTexture } from '@react-three/drei'
import { mergeHoles } from '../utils/utils'

const Floor: React.FC<{
  edges: Array<Vector2>
  ceiling?: number
  holes?: Array<Array<Vector2>>
}> = (props) => {
  const texture = useTexture(logo2, (map) => {
    map = map as Texture
    map.wrapS = RepeatWrapping
    map.wrapT = RepeatWrapping
    const res = 3 / 600
    map.repeat.set(res, res)
    map.center.set(0.5, 0.5)
    map.needsUpdate = true
  })

  const { shape } = useMemo(() => {
    if (props.edges.length > 0) {
      const shape: Shape = new Shape(props.edges)

      if (props.holes) {
        const merge = mergeHoles(props.holes)
        shape.holes = merge.map((m) => new Shape(m))
      }

      return {
        shape,
      }
    } else {
      return { shape: new Shape() }
    }
  }, [props.edges])

  return (
    <>
      {props.edges.length > 2 ? (
        <mesh
          position={props.ceiling ? [0, 0, props.ceiling] : 0}
          scale={props.ceiling ? [1, 1, -1] : undefined}
        >
          <shapeGeometry args={[shape]} />
          <meshStandardMaterial map={texture} side={FrontSide} />
        </mesh>
      ) : null}
      <ambientLight />
    </>
  )
}

export default Floor
