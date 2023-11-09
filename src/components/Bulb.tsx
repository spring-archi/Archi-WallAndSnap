import { useThree } from '@react-three/fiber'
import useMouse from '../hooks/useMouse'
import { useEffect, useRef, useState } from 'react'
import { BoxGeometry, Material, Vector3, Mesh } from 'three'

const Bulb: React.FC<{ snap: (bulb: Mesh) => void }> = (props) => {
  const { gl } = useThree()
  const [isDown, x, y] = useMouse(gl.domElement)
  const meshRef = useRef<Mesh<BoxGeometry, Material>>(null)

  const width = 25
  const height = 25

  useEffect(() => {
    if (isDown && meshRef.current != undefined) {
      meshRef.current.position
        .setScalar(0)
        .add(new Vector3(x - gl.domElement.width / 2, -y + gl.domElement.height / 2, 1))
        .multiplyScalar(2 / window.devicePixelRatio)
      props.snap(meshRef.current)
    }
  }, [isDown, x, y])

  return (
    <>
      <raycaster></raycaster>
      <mesh ref={meshRef} position-z={2}>
        {/* <boxGeometry args={[30, 30, 30]} /> */}

        <bufferGeometry>
          <bufferAttribute
            attach='attributes-position'
            array={
              new Float32Array([
                -width / 2,
                height / 2,
                0,
                width / 2,
                height / 2,
                0,
                0,
                -height / 2,
                0,
              ])
            }
            count={3}
            itemSize={3}
          />
          <bufferAttribute
            attach='index'
            array={new Uint16Array([0, 1, 2])}
            count={3}
            itemSize={1}
          />
        </bufferGeometry>
        <meshBasicMaterial color={0x00ff00} wireframe />
      </mesh>
    </>
  )
}

export default Bulb
