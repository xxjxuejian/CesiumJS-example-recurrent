<script setup>
import * as Cesium from 'cesium'
import 'cesium/Build/Cesium/Widgets/widgets.css'
import { onMounted } from 'vue'

Cesium.Ion.defaultAccessToken =
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJqdGkiOiI2MmJlY2YxZS0xZWQ1LTRiNGItYjBlNy1iNmMwYTVjMzNiYzYiLCJpZCI6MjQ3NTIyLCJpYXQiOjE3MzIwMDE2MjB9.r2CklVFhmGaQxjLV1Spscr1WO_BBaOuRAnyeybN4QiE'
window.CESIUM_BASE_URL = '/'

let viewer = null

function init() {
  viewer = new Cesium.Viewer('cesiumContainer', {
    // baseLayer: Cesium.ImageryLayer.fromWorldImagery({
    //   style: Cesium.IonWorldImageryStyle.AERIAL_WITH_LABELS,
    // }),
    terrain: Cesium.Terrain.fromWorldTerrain({
      requestVertexNormals: true, //启用地形光照功能
      requestWaterMask: true, //水体效果
    }),
    baseLayerPicker: false,
    infoBox: false,
  })
  //启用光照效果
  viewer.scene.globe.enableLighting = true
}

onMounted(() => {
  init()
})
</script>

<template>
  <div id="cesiumContainer"></div>
</template>

<style scoped></style>
