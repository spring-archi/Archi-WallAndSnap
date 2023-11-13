import { atom } from 'recoil'
import { Mesh } from 'three'

export const SnapWall = atom<Array<Mesh>>({
  key: 'SnapWall',
  default: [],
})
