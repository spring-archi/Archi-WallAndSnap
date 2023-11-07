import { useThree } from '@react-three/fiber'
import { useControls } from 'leva'
import { Perf } from 'r3f-perf'
import { OrthographicCamera, Vector2 } from 'three'
import Bulb from './components/Bulb'
import useWalls from './hooks/useWalls'
import Edge from './components/Edge'
import Wall from './components/Wall'
import Floor from './components/Floor'

function Scene() {
  const { performance } = useControls('Monitoring', {
    performance: true,
  })

  useThree(({ camera, viewport }) => {
    camera = camera as OrthographicCamera

    camera.left = -viewport.width
    camera.right = viewport.width
    camera.top = viewport.height
    camera.bottom = -viewport.height

    camera.position.z = 10
    camera.lookAt(0, 0, 0)
    camera.updateProjectionMatrix()
  })

  const vertices = [
    new Vector2(-300, 300),
    new Vector2(300, 300),
    new Vector2(300, -300),
    new Vector2(-300, -300),
    new Vector2(0, -300),
  ]

  const connections: Array<[number, number]> = [
    [3, 0],
    [0, 1],
    [1, 2],
    [2, 4],
    [4, 3],
  ]

  const thicknesses: Array<number> = [20, 20, 20, 20, 20]

  const [walls, inEdges, snap] = useWalls(vertices, connections, thicknesses)

  return (
    <>
      {performance && <Perf position='top-left' />}

      <Bulb snap={snap} />

      {vertices.map((v, idx) => {
        return <Edge position={v} key={idx} />
      })}
      {walls.map((w, idx) => {
        return <Wall edges={w} key={idx} />
      })}

      <Floor edges={inEdges} />
    </>
  )
}

export { Scene }
