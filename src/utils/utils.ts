import { Vector2 } from 'three'
import * as turf from '@turf/turf'

export function mergeHoles(holes: Array<Array<Vector2>>): Array<Array<Vector2>> {
  const merged = new Array()
  const turfPolygons = holes.map((h, idx) => {
    const map = h.map((h) => h.toArray())
    map.push(h[0].toArray())
    return turf.polygon([map])
  })
  let result = turfPolygons[0]
  for (let i = 1; i < turfPolygons.length; i++) {
    //@ts-expect-error
    result = turf.union(result, turfPolygons[i])
  }

  const coordinates =
    result.geometry.coordinates.length == 1
      ? result.geometry.coordinates
      : result.geometry.coordinates.map((c: any) => c[0])
  for (let _ = 0; _ < coordinates.length; _++) {
    const hole = new Array()
    for (let i = 0; i < coordinates[_].length - 1; i++) {
      hole.push(new Vector2().fromArray(coordinates[_][i]))
    }
    merged.push(hole)
  }
  return merged
}
