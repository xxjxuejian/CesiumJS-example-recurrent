<script setup>
// The URL on your server where CesiumJS's static files are hosted.
window.CESIUM_BASE_URL = '/'

import {
  Cartesian3,
  createOsmBuildingsAsync,
  Ion,
  Math as CesiumMath,
  Terrain,
  Viewer,
} from 'cesium'
import 'cesium/Build/Cesium/Widgets/widgets.css'
import { onMounted } from 'vue'

Ion.defaultAccessToken =
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJqdGkiOiI2MmJlY2YxZS0xZWQ1LTRiNGItYjBlNy1iNmMwYTVjMzNiYzYiLCJpZCI6MjQ3NTIyLCJpYXQiOjE3MzIwMDE2MjB9.r2CklVFhmGaQxjLV1Spscr1WO_BBaOuRAnyeybN4QiE'

onMounted(async () => {
  const viewer = new Viewer('cesiumContainer', {
    terrain: Terrain.fromWorldTerrain(),
  })

  // Fly the camera to San Francisco at the given longitude, latitude, and height.
  viewer.camera.flyTo({
    destination: Cartesian3.fromDegrees(-122.4175, 37.655, 400),
    orientation: {
      heading: CesiumMath.toRadians(0.0),
      pitch: CesiumMath.toRadians(-15.0),
    },
  })

  // Add Cesium OSM Buildings, a global 3D buildings layer.
  // 添加3d建筑物模型
  const buildingTileset = await createOsmBuildingsAsync()
  viewer.scene.primitives.add(buildingTileset)
})
</script>

<template>
  <div id="cesiumContainer"></div>
</template>

<style scoped>
#cesiumContainer {
  width: 100%;
  height: 100%;
}
</style>
