import React, { useMemo } from 'react'
import { FrontSide, RepeatWrapping, Shape, Texture, Vector2 } from 'three'
import logo2 from './logo.avif'
import { useTexture } from '@react-three/drei'
import * as turf from '@turf/turf'

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

function mergeHoles(holes: Array<Array<Vector2>>): Array<Array<Vector2>> {
  const merged = new Array()
  const turfPolygons = holes.map((h, idx) => {
    const map = h.map((h) => h.toArray())
    map.push(h[0].toArray())
    return turf.polygon([map])
  })
  let result = turfPolygons[0]
  for (let i = 1; i < turfPolygons.length; i++) {
    //@ts-expect-error
    result = turf.union(result, turfPolygons[i])
  }

  const coordinates =
    result.properties?.coordinates ?? result.geometry.coordinates.map((c: any) => c[0])

  for (let _ = 0; _ < coordinates.length; _++) {
    const hole = new Array()
    for (let i = 0; i < coordinates[_].length; i++) {
      hole.push(new Vector2().fromArray(coordinates[_][i]))
    }
    merged.push(hole)
  }
  return merged
}
