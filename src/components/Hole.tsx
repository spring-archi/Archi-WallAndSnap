import { useEffect, useMemo } from 'react'
import { Color, DoubleSide, Euler, Shape, Vector2, Vector3 } from 'three'
import ShapePlane from './ShapePlane'
import Line2 from '../utils/Line2'
import { MUL_COORDINATES, findCenter } from '../utils/utils'

export const Hole: React.FC<{
  position: Vector3
  startShape: Shape
  endShape: Shape
  thickness: number
  rotation: Euler
}> = ({ position, startShape, endShape, thickness, rotation }) => {
  const shapes = useMemo(() => {
    const shapes: Array<Info> = new Array()
    const startPoints = startShape.getPoints()
    const endPoints = endShape.getPoints()

    for (let i = 0; i < startPoints.length - 1; i++) {
      const center = findCenter([
        startPoints[i],
        endPoints[i],
        endPoints[i + 1],
        startPoints[i + 1],
      ]) as Vector2

      // const { x, y } = center.clone().add(startPoints[i])
      // // console.log()
      // const angle = new Line2(startPoints[i], startPoints[i + 1]).angle()
      // shapes.push({
      //   position: new Vector3(0, position.y + 200, 0).add(new Vector3(-y, 0, x)),
      //   rotation: new Euler(0, angle, angle > Math.PI ? -rotation.y : rotation.y),
      //   edges: MUL_COORDINATES.map((mul) => {
      //     return center
      //       .clone()
      //       .add(center.clone().sub(startPoints[i].clone().multiply(mul)))
      //   }),
      // })
      // console.log(position, thickness)
    }

    return shapes
  }, [startShape, endShape])
  console.log(findCenter([...startShape.getPoints(), ...endShape.getPoints()]))
  return (
    // <>
    //   {shapes.map((shape, idx) => {
    //     return (
    //       <ShapePlane
    //         position={shape.position}
    //         edges={shape.edges}
    //         rotation={shape.rotation}
    //         key={idx}
    //         color={new Color(1, 0, 0)}
    //       />
    //     )
    //   })}
    // </>

    <mesh
      rotation={new Euler(rotation.x, rotation.y, rotation.z)}
      position={position.clone().add(new Vector3(1, -30, 0))}
    >
      <extrudeGeometry
        args={[
          startShape,
          {
            depth: thickness * 1,
          },
        ]}
      />
      <meshBasicMaterial color={new Color(1, 0, 0)} side={DoubleSide} wireframe />
    </mesh>
  )
}

type Info = {
  edges: Array<Vector2>
  rotation: Euler
  position: Vector3
}
