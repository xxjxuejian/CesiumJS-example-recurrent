<script setup>
/*
创建并加载 Google 的逼真 3D 瓦片图层。
瓦片提供了地球表面的高度逼真的 3D 表示，包括建筑物、地形等
*/
import * as Cesium from 'cesium'
import 'cesium/Build/Cesium/Widgets/widgets.css'
import { onMounted } from 'vue'

Cesium.Ion.defaultAccessToken =
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJqdGkiOiI2MmJlY2YxZS0xZWQ1LTRiNGItYjBlNy1iNmMwYTVjMzNiYzYiLCJpZCI6MjQ3NTIyLCJpYXQiOjE3MzIwMDE2MjB9.r2CklVFhmGaQxjLV1Spscr1WO_BBaOuRAnyeybN4QiE'

window.CESIUM_BASE_URL = '/'
let viewer = null

async function initMap() {
  viewer = new Cesium.Viewer('cesiumContainer', {
    timeline: false,
    animation: false,
    sceneModePicker: false,
    baseLayerPicker: false,
    geocoder: Cesium.IonGeocodeProviderType.GOOGLE,
    // The globe does not need to be displayed,
    // since the Photorealistic 3D Tiles include terrain
    globe: false,
  })

  // Enable rendering the sky
  viewer.scene.skyAtmosphere.show = true

  // Add Photorealistic 3D Tiles
  try {
    // 谷歌提供的一种特殊的 3D Tiles 数据集,提供了地球表面的高度逼真的 3D 表示，包括建筑物、地形和其他地表特征。
    const tileset = await Cesium.createGooglePhotorealistic3DTileset({
      // 这个 tileset 只能与 Google Geocoder 一起使用。这是由于 Google 的使用条款和数据许可限制。
      // Only the Google Geocoder can be used with Google Photorealistic 3D Tiles.  Set the `geocode` property of the viewer constructor options to IonGeocodeProviderType.GOOGLE.
      onlyUsingWithGoogleGeocoder: true,
    })
    console.log('object', tileset)
    viewer.scene.primitives.add(tileset)
  } catch (error) {
    console.log(`Error loading Photorealistic 3D Tiles tileset.
  ${error}`)
  }

  // Point the camera at the Googleplex
  // 设置Cesium场景中相机的视角
  viewer.scene.camera.setView({
    // 三维笛卡尔坐标点：代表相机在地球坐标系中的位置，单位是米，原点是地球的中心。
    destination: new Cesium.Cartesian3(-2693797.551060477, -4297135.517094725, 3854700.7470414364),
    // 定义了相机的方向/朝向：`HeadingPitchRoll`是一种表示3D旋转的方式，通常用于航空领域。

    /*
      Cesium.HeadingPitchRoll(heading, pitch, roll)
      heading: 绕Z轴旋转的角度，单位是弧度。
      pitch: 绕X轴旋转的角度，单位是弧度。
      roll: 绕Y轴旋转的角度，单位是弧度。
    */
    orientation: new Cesium.HeadingPitchRoll(
      4.6550106925119925,
      -0.2863894863138836,
      1.3561760425773173e-7,
    ),
  })
}

onMounted(() => {
  initMap()
})
</script>

<template>
  <div id="cesiumContainer"></div>
</template>

<style scoped></style>
