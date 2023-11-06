import { useFrame, useThree } from '@react-three/fiber'
import { useControls } from 'leva'
import { Perf } from 'r3f-perf'
import { OrthographicCamera, Vector2, Vector3 } from 'three'
import Bulb from './components/Bulb'
import Room from './components/Room'

function Scene() {
  const { performance } = useControls('Monitoring', {
    performance: true,
  })

  // const { animate } = useControls('Cube', {
  //   animate: true,
  // })

  // const cubeRef = useRef<Mesh<BoxGeometry, MeshBasicMaterial>>(null)

  // useFrame((_, delta) => {
  //   if (animate) {
  //     cubeRef.current!.rotation.y += delta / 3
  //   }
  // })

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
    new Vector2(-300, 200),
    new Vector2(200, 250),
    new Vector2(200, -300),
    new Vector2(-200, -260),
    new Vector2(60, -100),
    new Vector2(0, -200),
  ]

  const connections: Array<[number, number]> = [
    [0, 1],
    [1, 2],
    [3, 0],
    [3, 5],
    [2, 5],
    [4, 5],
  ]

  const thicknesses: Array<number> = [60, 20, 20, 20, 20, 20, 20]

  return (
    <>
      {performance && <Perf position='top-left' />}

      <Bulb />
      <Room vertices={vertices} connections={connections} thicknesses={thicknesses} />
      {/* <OrbitControls makeDefault />

      <directionalLight
        position={[-2, 2, 3]}
        intensity={1.5}
        castShadow
        shadow-mapSize={[1024 * 2, 1024 * 2]}
      />
      <ambientLight intensity={0.2} />

      <Cube ref={cubeRef} />
      <Sphere />
      <Plane /> */}
    </>
  )
}

export { Scene }
