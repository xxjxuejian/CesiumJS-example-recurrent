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
    baseLayer: Cesium.ImageryLayer.fromWorldImagery({
      style: Cesium.IonWorldImageryStyle.AERIAL_WITH_LABELS,
    }),
    baseLayerPicker: false,
  })
}

let wyoming = null
// 添加polygon entity
function addPolygon() {
  wyoming = viewer.entities.add({
    polygon: {
      hierarchy: Cesium.Cartesian3.fromDegreesArray([
        -109.080842, 45.002073, -105.91517, 45.002073, -104.058488, 44.996596, -104.053011,
        43.002989, -104.053011, 41.003906, -105.728954, 40.998429, -107.919731, 41.003906,
        -109.04798, 40.998429, -111.047063, 40.998429, -111.047063, 42.000709, -111.047063,
        44.476286, -111.05254, 45.002073,
      ]),
      height: 0,
      material: Cesium.Color.RED.withAlpha(0.5),
      outline: true,
      outlineColor: Cesium.Color.BLACK,
    },
  })

  viewer.zoomTo(wyoming)
}

function addDescription() {
  wyoming.name = 'Wyoming'
  wyoming.description =
    '\
<img\
  width="50%"\
  style="float:left; margin: 0 1em 1em 0;"\
  src="/docs/tutorials/creating-entities/Flag_of_Wyoming.svg"/>\
<p>\
  Wyoming is a state in the mountain region of the Western \
  United States.\
</p>\
<p>\
  Wyoming is the 10th most extensive, but the least populous \
  and the second least densely populated of the 50 United \
  States. The western two thirds of the state is covered mostly \
  with the mountain ranges and rangelands in the foothills of \
  the eastern Rocky Mountains, while the eastern third of the \
  state is high elevation prairie known as the High Plains. \
  Cheyenne is the capital and the most populous city in Wyoming, \
  with a population estimate of 63,624 in 2017.\
</p>\
<p>\
  Source: \
  <a style="color: WHITE"\
    target="_blank"\
    href="http://en.wikipedia.org/wiki/Wyoming">Wikpedia</a>\
</p>'
}
// To extrude the shape into a volume, }
function changeToVolume() {
  wyoming.polygon.height = 200000
  wyoming.polygon.extrudedHeight = 250000
}

// 添加椭圆entity
let ellipse = null
function addEllipse() {
  const entity = viewer.entities.add({
    position: Cesium.Cartesian3.fromDegrees(-103.0, 40.0),
    ellipse: {
      semiMinorAxis: 250000.0,
      semiMajorAxis: 400000.0,
      material: Cesium.Color.BLUE.withAlpha(0.5),
    },
  })
  viewer.zoomTo(entity)

  ellipse = entity.ellipse // For upcoming examples
  console.log('ellipse', ellipse)
}

// 修改椭圆entity的填充样式
function updateImageEntity() {
  if (ellipse) {
    ellipse.material = '../../assets/images/OIP-C.jpg'
    // ellipse.material = new Cesium.CheckerboardMaterialProperty({
    //   evenColor: Cesium.Color.WHITE,
    //   oddColor: Cesium.Color.BLACK,
    //   repeat: new Cesium.Cartesian2(4, 4),
    // })
  }
}

function updateStripe() {
  if (ellipse) {
    ellipse.material = new Cesium.StripeMaterialProperty({
      evenColor: Cesium.Color.WHITE,
      oddColor: Cesium.Color.BLACK,
      repeat: 32,
    })
  }
}

function updateGrid() {
  if (ellipse) {
    ellipse.material = new Cesium.GridMaterialProperty({
      color: Cesium.Color.YELLOW,
      cellAlpha: 0.2,
      lineCount: new Cesium.Cartesian2(8, 8),
      lineThickness: new Cesium.Cartesian2(2.0, 2.0),
    })
    ellipse.fill = true
  }
}

function updateOutlines() {
  if (ellipse) {
    ellipse.fill = false
    ellipse.outline = true
    ellipse.outlineColor = Cesium.Color.YELLOW
    ellipse.outlineWidth = 2.0
  }
}

let polyline = null
function addPolylines() {
  const entity = viewer.entities.add({
    polyline: {
      positions: Cesium.Cartesian3.fromDegreesArray([-77, 35, -77.1, 35]),
      width: 5,
      material: Cesium.Color.RED,
    },
  })
  viewer.zoomTo(viewer.entities)

  polyline = entity.polyline // For upcoming examples
}

function updatePolylineOutline() {
  if (polyline) {
    polyline.material = new Cesium.PolylineOutlineMaterialProperty({
      color: Cesium.Color.ORANGE,
      outlineWidth: 3,
      outlineColor: Cesium.Color.BLACK,
    })
  }
}

function updatePolylineGlow() {
  if (polyline) {
    polyline.material = new Cesium.PolylineGlowMaterialProperty({
      color: Cesium.Color.BLUE,
      glowPower: 0.2,
      taperPower: 0.9,
    })
  }
}

// 相机控制
function controlCamera() {
  // 设置相机的朝向，即相机在水平方向上的旋转角度。
  const heading = Cesium.Math.toRadians(0)
  // 设置相机的俯仰角
  // 俯仰角决定相机视线相对于地面的倾斜角度，负值表示相机向下倾斜，正值表示相机向上倾斜。
  const pitch = Cesium.Math.toRadians(-30)
  viewer.zoomTo(wyoming, new Cesium.HeadingPitchRange(heading, pitch))
}

async function flyTo() {
  const result = await viewer.flyTo(wyoming)
  if (result) {
    viewer.selectedEntity = wyoming
  }
}

// 追踪entity，锁定
function trackedEntity() {
  wyoming.position = Cesium.Cartesian3.fromDegrees(-107.724, 42.68)
  viewer.trackedEntity = wyoming
}
onMounted(() => {
  init()
})
</script>

<template>
  <div id="cesiumContainer"></div>
  <div class="toolbar">
    <button @click="addPolygon">Add Polygon</button>
    <button @click="addDescription">addDescription</button>
    <button @click="changeToVolume">change ToVolume</button>
    <button @click="addEllipse">Add Ellipse</button>
    <button @click="updateImageEntity">update ImageEntity</button>
    <button @click="updateStripe">update Stripe</button>
    <button @click="updateGrid">update Grid</button>
    <button @click="updateOutlines">update Outline</button>

    <button @click="addPolylines">add Polylines</button>
    <button @click="updatePolylineOutline">update PolylineOutline</button>
    <button @click="updatePolylineGlow">update PolylineGlow</button>
    <button @click="controlCamera">Camera controls</button>
    <button @click="flyTo">flyTo</button>
    <button @click="trackedEntity">tracked-Entity</button>
  </div>
</template>

<style scoped>
#cesiumContainer {
  width: 100%;
  height: 100%;
}
.toolbar {
  display: flex;
  gap: 10px;
  position: absolute;
  top: 10px;
  left: 10px;
  z-index: 10;
}
</style>
