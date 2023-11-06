import { useCallback, useEffect, useState } from 'react'

const useMouse = (domElement: HTMLElement) => {
  const [isDown, setIsDown] = useState(false)
  const [pos_x, setPos_x] = useState(0)
  const [pos_y, setPos_y] = useState(0)

  const MouseUp = useCallback(() => {
    setIsDown(false)
  }, [])
  const MouseDown = useCallback(() => {
    setIsDown(true)
  }, [])
  const MouseMove = useCallback((mouse: { x: number; y: number }) => {
    setPos_x(mouse.x)
    setPos_y(mouse.y)
  }, [])

  useEffect(() => {
    domElement.addEventListener('mouseup', MouseUp)
    domElement.addEventListener('mousedown', MouseDown)
    domElement.addEventListener('mousemove', MouseMove)

    return () => {
      domElement.removeEventListener('mouseup', MouseUp)
      domElement.removeEventListener('mousedown', MouseDown)
      domElement.removeEventListener('mousemove', MouseMove)
    }
  }, [domElement])

  return [isDown, pos_x, pos_y] as [boolean, number, number]
}

export default useMouse
