import { Vector2 } from 'three'
import Edge from './Edge'
import Wall from './Wall'
import useWalls from '../hooks/useWalls'

const Room: React.FC<{
  vertices: Array<Vector2>
  connections: Array<[number, number]>
  thicknesses: Array<number>
}> = (props) => {
  const edges = useWalls(props.vertices, props.connections, props.thicknesses)
  return (
    <>
      {props.vertices.map((v, idx) => {
        return <Edge position={v} key={idx} />
      })}
      {edges.map((e, idx) => {
        return <Wall edges={e} key={idx} />
      })}
    </>
  )
}

export default Room
