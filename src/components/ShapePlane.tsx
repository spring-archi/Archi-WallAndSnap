import { PivotControls, useTexture } from '@react-three/drei'
import { useEffect, useMemo, useRef, useState } from 'react'
import {
  Box3,
  BufferAttribute,
  Color,
  Euler,
  Float32BufferAttribute,
  FrontSide,
  RepeatWrapping,
  Shape,
  ShapeGeometry,
  Vector2,
  Vector3,
} from 'three'
import logo from './archi.jpg'
import { Hole } from './Hole'
import { useRecoilState } from 'recoil'
import { TargetMesh } from '../store/BulbPosition'
import { useThree } from '@react-three/fiber'

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
  fill?: number
  origin?: Vector2
  positionForce?: boolean
}> = ({
  edges,
  rotation,
  color,
  position,
  material,
  holes,
  fill,
  origin,
  positionForce,
}) => {
  const center: Vector2 = useMemo(() => {
    return origin ?? findCenter(edges)
  }, [edges])
  const { scene } = useThree()
  const vertices: Array<Vector2> = useMemo(() => {
    return edges.map((e) => {
      return e.clone().sub(center)
    })
  }, [center])

  const texture = useTexture(logo, () => {
    const res = 1 / 100
    texture.repeat.set(res, res)
    texture.wrapS = RepeatWrapping
    texture.wrapT = RepeatWrapping
    texture.center.set(0, 0)
    texture.offset.set(0, 0)
    texture.needsUpdate = true
  })
  const shape = useMemo(() => {
    const shape = new Shape(vertices)
    if (holes != undefined) shape.holes = holes
    return shape
  }, [vertices, holes])
  const [targetRef, _] = useRecoilState(TargetMesh)
  return (
    <>
      <mesh
        position={(position?.clone() ?? new Vector3()).add(
          positionForce ? new Vector3() : new Vector3(center.x, center.y, 0)
        )}
        rotation={rotation}
        scale={positionForce ? [-1, 1, -1] : [1, 1, 1]}
      >
        <shapeGeometry args={[shape]}></shapeGeometry>
        <meshBasicMaterial
          color={color ?? new Color(1, 1, 1)}
          side={FrontSide}
          map={material ? texture : undefined}
        />
        {holes?.map((h, idx) => {
          return fill ? <Hole shape={h} thickness={fill} key={idx} /> : null
        })}
      </mesh>
      {positionForce ? null : (
        <mesh
          position={(position?.clone() ?? new Vector3()).add(
            new Vector3(center.x, center.y, 0)
          )}
          rotation={rotation}
          scale={positionForce ? [-1, 1, -1] : [1, 1, 1]}
          onPointerMove={(e) => {
            if (e.object == e.eventObject && e.object == e.intersections[0].object) {
              const target = scene.getObjectByName('bulb')
              if (target != undefined) {
                const rot = rotation.y

                target.position.set(
                  e.point.x + (Math.sin(rot) * target.scale.x) / 2,
                  e.point.y - (Math.cos(rot) * target.scale.y) / 2,
                  e.point.z
                )
                target.rotation.z = rotation.y + Math.PI
                // console.log(Math.cos(rotation.y), Math.sin(rotation.y))
              }
            }
          }}
          visible={false}
        >
          <shapeGeometry
            args={[
              (() => {
                return new Shape(vertices)
              })(),
            ]}
          ></shapeGeometry>
          <meshBasicMaterial side={FrontSide} transparent={true} />
          {holes?.map((h, idx) => {
            return fill ? <Hole shape={h} thickness={fill} key={idx} /> : null
          })}
        </mesh>
      )}
    </>
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
