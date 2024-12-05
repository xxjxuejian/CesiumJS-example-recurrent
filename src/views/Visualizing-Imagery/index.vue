<script setup>
import * as Cesium from 'cesium'
import 'cesium/Build/Cesium/Widgets/widgets.css'

import { onMounted } from 'vue'

Cesium.Ion.defaultAccessToken =
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJqdGkiOiI2MmJlY2YxZS0xZWQ1LTRiNGItYjBlNy1iNmMwYTVjMzNiYzYiLCJpZCI6MjQ3NTIyLCJpYXQiOjE3MzIwMDE2MjB9.r2CklVFhmGaQxjLV1Spscr1WO_BBaOuRAnyeybN4QiE'
window.CESIUM_BASE_URL = '/'

let viewer = null
let layers = null
function init() {
  viewer = new Cesium.Viewer('cesiumContainer', {
    baseLayer: Cesium.ImageryLayer.fromWorldImagery({
      style: Cesium.IonWorldImageryStyle.AERIAL_WITH_LABELS,
    }),
    baseLayerPicker: false,
  })

  layers = viewer.scene.imageryLayers
}
let blackMarble = null
// 添加黑色 marble图层
function loadBlackMarble() {
  if (blackMarble) {
    removeLayer()
    return
  }
  blackMarble = Cesium.ImageryLayer.fromProviderAsync(Cesium.IonImageryProvider.fromAssetId(3812))
  // 不设置透明度会完全覆盖默认的影像图层
  blackMarble.alpha = 0.5
  blackMarble.brightness = 2.0
  layers.add(blackMarble)
}

function removeLayer() {
  layers.remove(blackMarble)
  blackMarble = null
}

function addLogoLayer() {
  const logoLayer = new Cesium.ImageryLayer.fromProviderAsync(
    Cesium.SingleTileImageryProvider.fromUrl('../../assets/images/CesiumJS_light_color.png', {
      // 创建了一个矩形区域，用于定义地图上的一个特定区域。四个参数定义了一个矩形区域的边界：
      // 经度范围：从 -75.0°（西）到 -67.0°（东）
      // 纬度范围：从 28.0°（南）到 29.75°（北）
      // 这个矩形被用来定义 Cesium 标志图像的显示区域。这意味着 Cesium 的标志将被投影到这个特定的地理区域上，而不是整个地球表面。
      rectangle: Cesium.Rectangle.fromDegrees(-75.0, 28.0, -67.0, 29.75),
    }),
  )
  layers.add(logoLayer)
}

onMounted(() => {
  init()
})
</script>

<template>
  <div id="cesiumContainer"></div>
  <div class="btns">
    <button class="btn" @click="loadBlackMarble">add black layer</button>
    <button class="btn" @click="addLogoLayer">add logo layer</button>
  </div>
</template>

<style scoped lang="scss">
#cesiumContainer {
  width: 100%;
  height: 100%;
}
.btns {
  display: flex;
  position: absolute;
  top: 10px;
  left: 10px;
  gap: 10px;

  .btn {
    cursor: pointer;
  }
}
</style>
