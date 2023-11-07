import React from 'react'
import {
  Box3,
  BufferAttribute,
  Float32BufferAttribute,
  FrontSide,
  RepeatWrapping,
  Shape,
  ShapeGeometry,
  Texture,
  Vector2,
  Vector3,
} from 'three'
import logo from './logo.png'
import logo2 from './logo.avif'
import { useTexture } from '@react-three/drei'

const Floor: React.FC<{ edges: Array<Vector2> }> = (props) => {
  const texture = useTexture(logo, (map) => {
    map = map as Texture
    map.wrapS = RepeatWrapping
    map.wrapT = RepeatWrapping
    const res = 3 / 600
    map.repeat.set(res, res)
    map.center.set(0.5, 0.5)
    map.needsUpdate = true
  })

  return (
    <>
      {props.edges.length > 2 ? (
        <mesh>
          <shapeGeometry args={[new Shape(props.edges)]} />
          <meshStandardMaterial map={texture} side={FrontSide} />
        </mesh>
      ) : null}
      <ambientLight />
    </>
  )
}

export default Floor

function setUV(geometry: ShapeGeometry) {
  let pos = geometry.attributes.position as BufferAttribute
  let b3 = new Box3().setFromBufferAttribute(pos)
  let size = b3.getSize(new Vector3())
  let uv = []
  let v3 = new Vector3()
  for (let i = 0; i < pos.count; i++) {
    v3.fromBufferAttribute(pos, i)
    v3.sub(b3.min).divide(size)
    uv.push(v3.x, v3.y)
  }
  geometry.setAttribute('uv', new Float32BufferAttribute(uv, 2))
}
