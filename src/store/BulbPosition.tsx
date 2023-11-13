import { atom } from 'recoil'
import { Mesh, Scene, Vector3 } from 'three'

export const TargetMesh = atom<Scene>({
  key: 'BulbPosition',
  default: new Scene(),
})
