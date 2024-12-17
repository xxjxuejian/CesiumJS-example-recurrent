<script setup>
import * as Cesium from 'cesium'
import 'cesium/Build/Cesium/Widgets/widgets.css'
import { onMounted } from 'vue'

Cesium.Ion.defaultAccessToken =
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJqdGkiOiI2MmJlY2YxZS0xZWQ1LTRiNGItYjBlNy1iNmMwYTVjMzNiYzYiLCJpZCI6MjQ3NTIyLCJpYXQiOjE3MzIwMDE2MjB9.r2CklVFhmGaQxjLV1Spscr1WO_BBaOuRAnyeybN4QiE'
window.CESIUM_BASE_URL = '/'

let viewer = null
// setup alternative terrain providers： 替代的地形提供者
/*
EllipsoidTerrainProvider：这是一个程序化地形提供者，用于生成一个简化的地球表面，即椭球体的表面。
它不会请求任何外部地形数据，而是通过数学算法直接生成地形的形状。这个地形提供者缺乏真实的地形细节，
因此它不适用于需要真实地形数据的场景，但适用于测试或简化的可视化。
*/
const ellipsoidProvider = new Cesium.EllipsoidTerrainProvider()

// Sine wave
const customHeightmapWidth = 32
const customHeightmapHeight = 32
const customHeightmapProvider = new Cesium.CustomHeightmapTerrainProvider({
  width: customHeightmapWidth,
  height: customHeightmapHeight,
  callback: function (x, y, level) {
    const width = customHeightmapWidth
    const height = customHeightmapHeight
    const buffer = new Float32Array(width * height)

    for (let yy = 0; yy < height; yy++) {
      for (let xx = 0; xx < width; xx++) {
        const u = (x + xx / (width - 1)) / Math.pow(2, level)
        const v = (y + yy / (height - 1)) / Math.pow(2, level)

        const heightValue = 4000 * (Math.sin(8000 * v) * 0.5 + 0.5)

        const index = yy * width + xx
        buffer[index] = heightValue
      }
    }

    return buffer
  },
})

function init() {
  viewer = new Cesium.Viewer('cesiumContainer', {
    requestWaterMask: true,
    requestVertexNormals: true,
  })
  // set lighting to true
  viewer.scene.globe.enableLighting = true
  // adjust time so scene is lit by sun： 时钟对象的当前时间
  // 设置当前时间为 2023 年 1 月 1 日的 00:00:00，使得场景的光照效果（如太阳的位置）基于该时间进行计算。
  viewer.clock.currentTime = Cesium.JulianDate.fromIso8601('2023-01-01T00:00:00')
}

onMounted(() => {
  init()
})

// 选中项绑定值
const value1 = ref(null)
const options1 = [
  {
    text: 'CesiumTerrainProvider - Cesium World Terrain',
    onselect: function () {
      viewer.scene.setTerrain(
        Cesium.Terrain.fromWorldTerrain({
          requestWaterMask: true,
          requestVertexNormals: true,
        }),
      )
      viewer.scene.globe.enableLighting = true
    },
  },
  {
    text: 'CesiumTerrainProvider - Cesium World Terrain - no effects',
    onselect: function () {
      viewer.scene.setTerrain(Cesium.Terrain.fromWorldTerrain())
    },
  },
  {
    text: 'CesiumTerrainProvider - Cesium World Terrain w/ Lighting',
    onselect: function () {
      viewer.scene.setTerrain(
        Cesium.Terrain.fromWorldTerrain({
          requestVertexNormals: true,
        }),
      )
      viewer.scene.globe.enableLighting = true
    },
  },
  {
    text: 'CesiumTerrainProvider - Cesium World Terrain w/ Water',
    onselect: function () {
      viewer.scene.setTerrain(
        Cesium.Terrain.fromWorldTerrain({
          requestWaterMask: true,
        }),
      )
    },
  },
  {
    text: 'EllipsoidTerrainProvider',
    onselect: function () {
      viewer.terrainProvider = ellipsoidProvider
    },
  },
  {
    text: 'CustomHeightmapTerrainProvider',
    onselect: function () {
      viewer.terrainProvider = customHeightmapProvider
    },
  },
  {
    text: 'VRTheWorldTerrainProvider',
    onselect: function () {
      viewer.scene.setTerrain(
        new Cesium.Terrain(
          Cesium.VRTheWorldTerrainProvider.fromUrl(
            'http://www.vr-theworld.com/vr-theworld/tiles1.0.0/73/',
            {
              credit: 'Terrain data courtesy VT MÄK',
            },
          ),
        ),
      )
    },
  },
  // {
  //   text: 'ArcGISTerrainProvider',
  //   onselect: function () {
  //     viewer.scene.setTerrain(
  //       new Cesium.Terrain(
  //         Cesium.ArcGISTiledElevationTerrainProvider.fromUrl(
  //           'https://elevation3d.arcgis.com/arcgis/rest/services/WorldElevation3D/Terrain3D/ImageServer',
  //         ),
  //       ),
  //     )
  //   },
  // },
]

function lookAtMtEverest() {
  const target = new Cesium.Cartesian3(300770.50872389384, 5634912.131394585, 2978152.2865545116)
  const offset = new Cesium.Cartesian3(6344.974098678562, -793.3419798081741, 2499.9508860763162)
  viewer.camera.lookAt(target, offset)
  viewer.camera.lookAtTransform(Cesium.Matrix4.IDENTITY)
}
const value2 = ref(null)
const options2 = [
  {
    text: 'Mount Everest',
    onselect: function () {
      lookAtMtEverest()
    },
  },
  {
    text: 'Half Dome',
    onselect: function () {
      const target = new Cesium.Cartesian3(
        -2489625.0836225147,
        -4393941.44443024,
        3882535.9454173897,
      )
      const offset = new Cesium.Cartesian3(-6857.40902037546, 412.3284835694358, 2147.5545426812023)
      viewer.camera.lookAt(target, offset)
      viewer.camera.lookAtTransform(Cesium.Matrix4.IDENTITY)
    },
  },
  {
    text: 'San Francisco Bay',
    onselect: function () {
      const target = new Cesium.Cartesian3(
        -2708814.85583248,
        -4254159.450845907,
        3891403.9457429945,
      )
      const offset = new Cesium.Cartesian3(
        70642.66030209465,
        -31661.517948317807,
        35505.179997143336,
      )
      viewer.camera.lookAt(target, offset)
      viewer.camera.lookAtTransform(Cesium.Matrix4.IDENTITY)
    },
  },
]
// 选中项变化事件
const handleSelectChange1 = () => {
  console.log('value1', value1.value.text)
  const fn = value1.value.onselect
  console.log(fn)
  fn()
}

const handleSelectChange2 = () => {
  console.log('value2', value2.value.text)
  const fn = value2.value.onselect
  console.log(fn)
  fn()
}
</script>
<template>
  <div id="cesiumContainer"></div>
  <div class="toolbars">
    <el-select
      v-model="value1"
      placeholder="Select"
      style="width: 240px"
      @change="handleSelectChange1"
    >
      <el-option v-for="item in options1" :key="item.text" :label="item.text" :value="item" />
    </el-select>

    <!-- select2 -->
    <el-select
      v-model="value2"
      placeholder="Select"
      style="width: 240px"
      @change="handleSelectChange2"
    >
      <el-option v-for="item in options2" :key="item.text" :label="item.text" :value="item" />
    </el-select>
  </div>
</template>

<style scoped>
#cesiumContainer {
  width: 100%;
  height: 100%;
}
.toolbars {
  display: flex;
  flex-direction: column;
  gap: 30px;
  position: absolute;
  top: 10px;
  left: 10px;
}
</style>
