import { useThree } from '@react-three/fiber'
import { Leva, useControls } from 'leva'
import { Perf } from 'r3f-perf'
import { OrthographicCamera, PerspectiveCamera, Vector2 } from 'three'
import Bulb from './components/Bulb'
import useWalls from './hooks/useWalls'
import Edge from './components/Edge'
import Wall from './components/Wall'
import Floor from './components/Floor'
function Scene() {
  const { performance } = useControls('Monitoring', {
    performance: true,
  })

  useThree((three) => {
    let { camera, viewport } = three

    camera = camera as OrthographicCamera

    camera.left = -viewport.width
    camera.right = viewport.width
    camera.top = viewport.height
    camera.bottom = -viewport.height

    camera.position.z = 1000
    camera.lookAt(0, 0, 0)
    camera.updateProjectionMatrix()
  })

  const vertices = [
    new Vector2(-400, 200),
    new Vector2(300, 300),
    new Vector2(300, -300),
    new Vector2(-300, -300),
    new Vector2(0, -200),
  ]

  const connections: Array<[number, number]> = [
    [3, 0],
    [0, 1],
    [1, 2],
    [2, 4],
    [4, 3],
  ]

  const thicknesses: Array<number> = [200, 100, 20, 20, 20]

  const [walls, inEdges, snap] = useWalls(vertices, connections, thicknesses)

  return (
    <>
      {performance && <Perf position='top-left' />}

      <Bulb snap={snap} />

      {vertices.map((v, idx) => {
        return <Edge position={v} key={idx} />
      })}
      {walls.map((w, idx) => {
        return (
          <Wall
            edges={w}
            thickness={thicknesses[idx]}
            key={idx}
            holes={
              idx == 1 || idx == 2 || idx == 0
                ? [
                    [
                      new Vector2(50, -30),
                      new Vector2(50, 30),
                      new Vector2(-50, 30),
                      new Vector2(-50, -30),
                    ],
                    [
                      new Vector2(-175, 25),
                      new Vector2(25, 25),
                      new Vector2(25, -75),
                      new Vector2(-175, -75),
                    ],
                    // [
                    //   new Vector2(-50, -50),
                    //   new Vector2(-50, 50),
                    //   new Vector2(50, 50),
                    //   new Vector2(50, -50),
                    // ],
                  ]
                : undefined
            }
          />
        )
      })}

      <Floor
        edges={inEdges}
        holes={[
          [
            new Vector2(100, -100),
            new Vector2(-100, -100),
            new Vector2(-100, 100),
            new Vector2(100, 100),
          ],
          [
            new Vector2(-200, -100),
            new Vector2(-250, -100),
            new Vector2(-250, 100),
            new Vector2(-200, 100),
          ],
          [
            new Vector2(-50, -150),
            new Vector2(-50, 50),
            new Vector2(150, 50),
            new Vector2(150, -150),
          ],
        ]}
      />
      <Floor edges={inEdges} ceiling={200} />
    </>
  )
}

export { Scene }
