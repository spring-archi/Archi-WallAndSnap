import { useTexture } from '@react-three/drei'
import { useEffect, useMemo, useRef } from 'react'
import {
  Box3,
  BufferAttribute,
  Color,
  DoubleSide,
  Euler,
  Float32BufferAttribute,
  FrontSide,
  RepeatWrapping,
  Shape,
  ShapeGeometry,
  Texture,
  TextureLoader,
  Vector2,
  Vector3,
} from 'three'
import logo from './archi.jpg'
import { RAD2DEG } from 'three/src/math/MathUtils'
import { useLoader } from '@react-three/fiber'
// let test: Texture | undefined

const findCenter = <T extends Vector2 | Vector3>(vertices: Array<T>): T => {
  const center = vertices[0].clone().setScalar(0)
  vertices.forEach((v) => {
    //@ts-expect-error
    center.add(v)
  })
  center.divideScalar(vertices.length)
  return center as T
}

const ShapePlane: React.FC<{
  edges: Array<Vector2>
  rotation: Euler
  position?: Vector3
  color?: Color
  material?: boolean
  holes?: Array<Shape>
}> = ({ edges, rotation, color, position, material, holes }) => {
  const center: Vector2 = useMemo(() => {
    return findCenter(edges)
  }, [edges])
  const vertices: Array<Vector2> = useMemo(() => {
    return edges.map((e) => {
      return e.clone().sub(center)
    })
  }, [center])

  // useEffect(() => {
  //   console.log(vertices[0], vertices[1], vertices[2], vertices[3])
  // }, [vertices])
  const geometry = useRef<ShapeGeometry>(null)

  const texture = useTexture(logo, () => {
    const res = 1 / 100
    texture.repeat.set(res, res)
    texture.wrapS = RepeatWrapping
    texture.wrapT = RepeatWrapping
    texture.center.set(0, 0)
    texture.offset.set(0, 0)
    texture.needsUpdate = true
  })
  // useEffect(() => {
  //   const geo = geometry.current!
  //   const uvAttribute = geo.attributes.uv
  //   for (let i = 0; i < uvAttribute.count; i++) {
  //     // console.log(uvAttribute.getX(i))
  //     const u = uvAttribute.getX(i)
  //     const v = uvAttribute.getY(i)
  //     uvAttribute.setXY(i, u < 0 ? 0 : u * 2, v < 0 ? 0 : v * 2) // Invert the v-coordinate
  //   }
  // }, [geometry])
  const shape = useMemo(() => {
    const shape = new Shape(vertices)
    if (holes != undefined) shape.holes = holes
    return shape
  }, [vertices, holes])
  return (
    <mesh
      position={(position?.clone() ?? new Vector3()).add(
        new Vector3(center.x, center.y, 0)
      )}
      rotation={new Euler(rotation.x, rotation.y, rotation.z)}
    >
      <shapeGeometry args={[shape]} ref={geometry}></shapeGeometry>
      <meshBasicMaterial
        color={color ?? new Color(1, 1, 1)}
        side={FrontSide}
        map={material ? texture : undefined}
      />
    </mesh>
  )
}

export default ShapePlane

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
