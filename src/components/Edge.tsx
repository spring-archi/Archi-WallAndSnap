import { MeshBasicMaterial, Vector2 } from 'three'
import React, { useEffect } from 'react'

const edgeMaterial = new MeshBasicMaterial({
  color: 0x444444,
  wireframe: true,
})

const Edge: React.FC<{
  position: Vector2
}> = (props) => {
  return (
    <mesh material={edgeMaterial} position={[props.position.x, props.position.y, 0]}>
      <sphereGeometry args={[3, 8]} />
    </mesh>
  )
}

export default React.memo(Edge, (prev, next) => prev.position.equals(next.position))
