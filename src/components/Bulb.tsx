import { Color } from 'three'

const Bulb = () => {
  return (
    <mesh position-z={1}>
      <boxGeometry args={[30, 30, 30]} />
      <meshBasicMaterial color={0x00ff00} wireframe />
    </mesh>
  )
}

export default Bulb
