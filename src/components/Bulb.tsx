import { useThree } from '@react-three/fiber'
import useMouse from '../hooks/useMouse'
import { useEffect, useRef, useState } from 'react'
import { BoxGeometry, Material, Mesh, BufferGeometry, BufferAttribute } from 'three'
import { TargetMesh } from '../store/BulbPosition'
import { useRecoilState } from 'recoil'

const Bulb: React.FC<{ snap: (bulb: Mesh) => void }> = (props) => {
  const { scene } = useThree()
  const meshRef = useRef<Mesh<BoxGeometry, Material>>(null)

  return (
    <>
      <raycaster></raycaster>
      <mesh ref={meshRef} name={'bulb'} scale={25}>
        <boxGeometry args={[1, 1, 1]} />
        <meshBasicMaterial attach='material-0' color='brown' />
        <meshBasicMaterial attach='material-1' color='brown' />
        <meshBasicMaterial attach='material-2' color='green' />
        <meshBasicMaterial attach='material-3' color='brown' />
        <meshBasicMaterial attach='material-4' color='brown' />
        <meshBasicMaterial attach='material-5' color='brown' />
      </mesh>
    </>
  )
}

export default Bulb
