import { Canvas } from '@react-three/fiber'
import { Leva, useControls } from 'leva'
import React, { useRef } from 'react'
import ReactDOM from 'react-dom/client'
import { ACESFilmicToneMapping } from 'three'
import { Scene } from './Scene'
import { Switch } from 'antd'
import './styles/main.css'
import { Perf } from 'r3f-perf'
import { PerspectiveCamera, OrthographicCamera, OrbitControls } from '@react-three/drei'

function Main() {
  return (
    <div className='main'>
      <Leva
        collapsed={false}
        oneLineLabels={false}
        flat={true}
        theme={{
          sizes: {
            titleBarHeight: '28px',
          },
          fontSizes: {
            root: '10px',
          },
        }}
      />
      <Canvas
        dpr={[1, 2]}
        gl={{
          antialias: false,
          toneMapping: ACESFilmicToneMapping,
        }}
        // camera={new OrthographicCamera()}
      >
        {/* <OrthographicCamera makeDefault={true} /> */}
        <PerspectiveCamera
          fov={80}
          position={[0, -500, 1000]}
          far={10000}
          makeDefault={true}
        />
        <OrbitControls />
        <Scene />
      </Canvas>
    </div>
  )
}

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <React.StrictMode>
    <Main />
  </React.StrictMode>
)
