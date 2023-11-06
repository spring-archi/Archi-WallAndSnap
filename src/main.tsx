import { Canvas } from '@react-three/fiber'
import { Leva } from 'leva'
import React, { useRef } from 'react'
import ReactDOM from 'react-dom/client'
import {
  ACESFilmicToneMapping,
  OrthographicCamera,
  PerspectiveCamera,
  Vector3,
} from 'three'
import { Scene } from './Scene'
import './styles/main.css'

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
        camera={new OrthographicCamera()}
      >
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
