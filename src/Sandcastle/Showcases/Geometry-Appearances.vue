<script setup>
import * as Cesium from 'cesium'
import 'cesium/Build/Cesium/Widgets/widgets.css'
import { onMounted } from 'vue'

Cesium.Ion.defaultAccessToken =
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJqdGkiOiI2MmJlY2YxZS0xZWQ1LTRiNGItYjBlNy1iNmMwYTVjMzNiYzYiLCJpZCI6MjQ3NTIyLCJpYXQiOjE3MzIwMDE2MjB9.r2CklVFhmGaQxjLV1Spscr1WO_BBaOuRAnyeybN4QiE'
window.CESIUM_BASE_URL = '/'

let viewer = null
let entities = null

function init() {
  viewer = new Cesium.Viewer('cesiumContainer', {
    baseLayer: Cesium.ImageryLayer.fromWorldImagery({
      style: Cesium.IonWorldImageryStyle.AERIAL_WITH_LABELS,
    }),
    baseLayerPicker: false,
    infoBox: false,
  })
  entities = viewer.entities
}

let i
let height
let positions

// 材质属性类 ， 返回一个动态材质属性对象 ，该对象可以绑定到实体（矩形，多边形，墙，椭圆，走廊 等等）的材质属性上，从而应用条纹效果
// 动态属性允许在运行时更改条纹颜色、宽度或重复次数
const stripeMaterial = new Cesium.StripeMaterialProperty({
  evenColor: Cesium.Color.WHITE.withAlpha(0.5), //条纹的偶数部分颜色
  oddColor: Cesium.Color.BLUE.withAlpha(0.5), //奇数部分颜色
  repeat: 10.0, //条纹在材质上的重复次数（浮点数），奇偶交替一起出现的次数、
})

function addEntities() {
  if (entities) {
    // 矩形
    entities.add({
      rectangle: {
        // 矩形的地理范围，使用经纬度定义。这里的范围是：西经 115° 到西经 107°，北纬 37° 到北纬 40°。
        coordinates: Cesium.Rectangle.fromDegrees(-115.0, 37.0, -107.0, 40.0), // // 西南角和东北角 ,对角线的点
        outline: true,
        outlineColor: Cesium.Color.WHITE,
        outlineWidth: 4,
        stRotation: Cesium.Math.toRadians(45),
        material: stripeMaterial, //也是一种填充，还可以填充图片，但是更灵活，还可以是动态的（暂时不理解）
        // material: Cesium.Color.RED, // 填充为纯红色
      },
    })

    // 矩形柱
    entities.add({
      rectangle: {
        coordinates: Cesium.Rectangle.fromDegrees(-118.0, 38.0, -116.0, 40.0),
        extrudedHeight: 500000.0, // 矩形柱的高度，单位为米
        outline: true,
        outlineColor: Cesium.Color.WHITE,
        outlineWidth: 4,
        stRotation: Cesium.Math.toRadians(45),
        material: Cesium.Color.fromRandom({ alpha: 1.0 }),
      },
    })

    // 多边形
    entities.add({
      polygon: {
        hierarchy: new Cesium.PolygonHierarchy(
          Cesium.Cartesian3.fromDegreesArray([
            -107.0, 27.0, -107.0, 22.0, -102.0, 23.0, -97.0, 21.0, -97.0, 25.0,
          ]),
        ),
        outline: true,
        outlineColor: Cesium.Color.WHITE,
        outlineWidth: 4,
        material: stripeMaterial,
      },
    })

    // 多边形柱
    entities.add({
      polygon: {
        hierarchy: new Cesium.PolygonHierarchy(
          Cesium.Cartesian3.fromDegreesArray([
            -118.0, 30.0, -115.0, 30.0, -117.1, 31.1, -118.0, 33.0,
          ]),
        ),
        height: 300000.0,
        extrudedHeight: 700000.0,
        outline: true,
        outlineColor: Cesium.Color.WHITE,
        outlineWidth: 4,
        material: Cesium.Color.fromRandom({ alpha: 1.0 }),
      },
    })

    // 椭圆
    entities.add({
      position: Cesium.Cartesian3.fromDegrees(-80.0, 25.0), //椭圆的中心位置
      ellipse: {
        semiMinorAxis: 300000.0, //短半轴长度，单位为米
        semiMajorAxis: 500000.0, //长半轴长度，单位为米。
        rotation: Cesium.Math.toRadians(-40.0), //旋转角度，单位为弧度。将角角度 -40° 转换为弧度。负值表示顺时针旋转，椭圆的长轴会旋转 40°。
        outline: true,
        outlineColor: Cesium.Color.WHITE,
        outlineWidth: 4,
        stRotation: Cesium.Math.toRadians(22), //材质的纹理旋转角度，单位为弧度。椭圆内部的条纹材质（stripeMaterial）会旋转 22°。
        material: stripeMaterial,
      },
    })

    entities.add({
      position: Cesium.Cartesian3.fromDegrees(-72.0, 25.0),
      ellipse: {
        semiMinorAxis: 250000.0,
        semiMajorAxis: 250000.0,
        rotation: Cesium.Math.toRadians(-40.0),
        outline: true,
        outlineColor: Cesium.Color.WHITE,
        outlineWidth: 4,
        stRotation: Cesium.Math.toRadians(90),
        material: stripeMaterial,
      },
    })

    // 椭圆体
    entities.add({
      position: Cesium.Cartesian3.fromDegrees(-117.0, 35.0),
      ellipse: {
        semiMinorAxis: 100000.0,
        semiMajorAxis: 200000.0,
        // 通过指定 高度 和 挤出高度（extrudedHeight） 创建了一个柱状效果的三维实体
        height: 100000.0,
        extrudedHeight: 200000.0,
        rotation: Cesium.Math.toRadians(90.0),
        outline: true,
        outlineColor: Cesium.Color.WHITE,
        outlineWidth: 4,
        material: Cesium.Color.fromRandom({ alpha: 1.0 }),
      },
    })

    // 圆柱
    entities.add({
      position: Cesium.Cartesian3.fromDegrees(-70.0, 45.0, 100000.0), //经纬度和海拔
      cylinder: {
        length: 200000.0,
        topRadius: 150000.0,
        bottomRadius: 150000.0,
        outline: true,
        outlineColor: Cesium.Color.WHITE,
        outlineWidth: 4,
        material: Cesium.Color.fromRandom({ alpha: 1.0 }),
      },
    })

    for (i = 0; i < 5; ++i) {
      height = 100000.0 + 200000.0 * i
      entities.add({
        position: Cesium.Cartesian3.fromDegrees(-106.0, 45.0, height),
        // 立方体
        box: {
          dimensions: new Cesium.Cartesian3(90000.0, 90000.0, 90000.0),
          outline: true,
          outlineColor: Cesium.Color.WHITE,
          outlineWidth: 2,
          material: Cesium.Color.fromRandom({ alpha: 0.5 }),
        },
      })

      entities.add({
        position: Cesium.Cartesian3.fromDegrees(-102.0, 45.0, height),
        // 椭球体
        ellipsoid: {
          radii: new Cesium.Cartesian3(45000.0, 45000.0, 90000.0),
          outline: true,
          outlineColor: Cesium.Color.WHITE,
          outlineWidth: 2,
          material: Cesium.Color.fromRandom({ alpha: 0.5 }),
        },
      })

      entities.add({
        position: Cesium.Cartesian3.fromDegrees(-98.0, 45.0, height),
        ellipsoid: {
          radii: new Cesium.Cartesian3(67500.0, 67500.0, 67500.0),
          outline: true,
          outlineColor: Cesium.Color.WHITE,
          outlineWidth: 2,
          material: Cesium.Color.fromRandom({ alpha: 0.5 }),
        },
      })
    }

    // 墙体
    entities.add({
      // 墙体是一个沿给定路径延伸的垂直立面，可以设置每个点的最大和最小高度，以及材质和轮廓线属性。
      wall: {
        // 墙体路径的经纬度坐标序列
        positions: Cesium.Cartesian3.fromDegreesArray([-95.0, 50.0, -85.0, 50.0, -75.0, 50.0]),
        maximumHeights: [500000, 1000000, 500000], //定义墙体路径上每个点的最大高度。 数组长度需要与 positions 的点数一致。
        minimumHeights: [0, 500000, 0], //最小高度。
        outline: true, //是否绘制墙体轮廓。
        outlineColor: Cesium.Color.LIGHTGRAY,
        outlineWidth: 4,
        material: Cesium.Color.fromRandom({ alpha: 0.7 }),
      },
    })

    entities.add({
      rectangle: {
        coordinates: Cesium.Rectangle.fromDegrees(-92.0, 30.0, -85.0, 40.0),
        material: stripeMaterial,
      },
    })

    // 复杂的多边形实体，它具有嵌套的孔（holes）
    entities.add({
      polygon: {
        hierarchy: {
          positions: Cesium.Cartesian3.fromDegreesArray([
            -109.0, 30.0, -95.0, 30.0, -95.0, 40.0, -109.0, 40.0,
          ]),
          holes: [
            {
              positions: Cesium.Cartesian3.fromDegreesArray([
                -107.0, 31.0, -107.0, 39.0, -97.0, 39.0, -97.0, 31.0,
              ]),
              holes: [
                {
                  positions: Cesium.Cartesian3.fromDegreesArray([
                    -105.0, 33.0, -99.0, 33.0, -99.0, 37.0, -105.0, 37.0,
                  ]),
                  holes: [
                    {
                      positions: Cesium.Cartesian3.fromDegreesArray([
                        -103.0, 34.0, -101.0, 34.0, -101.0, 36.0, -103.0, 36.0,
                      ]),
                    },
                  ],
                },
              ],
            },
          ],
        },
        material: stripeMaterial,
      },
    })

    // 椭圆
    entities.add({
      position: Cesium.Cartesian3.fromDegrees(-80.0, 35.0),
      ellipse: {
        semiMinorAxis: 200000.0,
        semiMajorAxis: 500000.0,
        rotation: Cesium.Math.toRadians(30.0),
        material: stripeMaterial,
      },
    })

    entities.add({
      position: Cesium.Cartesian3.fromDegrees(-72.0, 35.0),
      ellipse: {
        semiMinorAxis: 200000.0,
        semiMajorAxis: 200000.0,
        rotation: Cesium.Math.toRadians(30.0),
        material: stripeMaterial,
      },
    })

    // 实心矩形柱
    entities.add({
      rectangle: {
        coordinates: Cesium.Rectangle.fromDegrees(-110.0, 38.0, -107.0, 40.0),
        height: 700000.0,
        extrudedHeight: 1000000.0,
        rotation: Cesium.Math.toRadians(45),
        material: Cesium.Color.fromRandom({ alpha: 1.0 }),
      },
    })

    // 实心椭球体
    entities.add({
      position: Cesium.Cartesian3.fromDegrees(-110.0, 35.0),
      ellipse: {
        semiMinorAxis: 100000.0,
        semiMajorAxis: 200000.0,
        height: 300000.0,
        extrudedHeight: 700000.0,
        rotation: Cesium.Math.toRadians(-40.0),
        material: Cesium.Color.fromRandom({ alpha: 1.0 }),
      },
    })

    // 实心多边形柱
    entities.add({
      polygon: {
        hierarchy: new Cesium.PolygonHierarchy(
          Cesium.Cartesian3.fromDegreesArray([
            -113.0, 30.0, -110.0, 30.0, -110.0, 33.0, -111.5, 31.0, -113.0, 33.0,
          ]),
        ),
        extrudedHeight: 300000.0,
        material: Cesium.Color.fromRandom({ alpha: 1.0 }),
      },
    })

    // 实心圆锥体
    entities.add({
      position: Cesium.Cartesian3.fromDegrees(-70.0, 40.0, 200000.0),
      cylinder: {
        // 不适用于 cylinder 的无效参数，hierarchy 是定义多边形（polygon）的参数，而不是圆柱或圆锥的一部分。
        // 在 Cesium 中，cylinder 本质上是一个三维的几何体，它通过底部半径、顶部半径和高度来定义，并不涉及 hierarchy 属性。
        // hierarchy: new Cesium.PolygonHierarchy(
        //   Cesium.Cartesian3.fromDegreesArray([
        //     -118.0, 30.0, -115.0, 30.0, -117.1, 31.1, -118.0, 33.0,
        //   ]),
        // ),
        length: 400000.0,
        topRadius: 0.0,
        bottomRadius: 200000.0,
        material: Cesium.Color.fromRandom({ alpha: 1.0 }),
      },
    })

    // 5个 层叠矩形片和椭圆片
    for (i = 0; i < 5; ++i) {
      height = 200000.0 * i

      entities.add({
        position: Cesium.Cartesian3.fromDegrees(-65.0, 35.0),
        ellipse: {
          semiMinorAxis: 200000.0,
          semiMajorAxis: 200000.0,
          height: height,
          material: Cesium.Color.fromRandom({ alpha: 0.5 }),
        },
      })

      entities.add({
        rectangle: {
          coordinates: Cesium.Rectangle.fromDegrees(-67.0, 27.0, -63.0, 32.0),
          height: height,
          material: Cesium.Color.fromRandom({ alpha: 0.5 }),
        },
      })
    }

    // 5个 层叠球体和椭球体
    for (i = 0; i < 5; ++i) {
      height = 100000.0 + 200000.0 * i
      entities.add({
        position: Cesium.Cartesian3.fromDegrees(-108.0, 45.0, height),
        box: {
          dimensions: new Cesium.Cartesian3(90000.0, 90000.0, 90000.0),
          material: Cesium.Color.fromRandom({ alpha: 1.0 }),
        },
      })

      entities.add({
        position: Cesium.Cartesian3.fromDegrees(-104.0, 45.0, height),
        ellipsoid: {
          radii: new Cesium.Cartesian3(45000.0, 45000.0, 90000.0),
          material: Cesium.Color.fromRandom({ alpha: 1.0 }),
        },
      })

      entities.add({
        position: Cesium.Cartesian3.fromDegrees(-100.0, 45.0, height),
        ellipsoid: {
          radii: new Cesium.Cartesian3(67500.0, 67500.0, 67500.0),
          material: Cesium.Color.fromRandom({ alpha: 1.0 }),
        },
      })
    }

    // 折线（polyline）实体
    positions = []
    for (i = 0; i < 40; ++i) {
      positions.push(Cesium.Cartesian3.fromDegrees(-100.0 + i, 15.0))
    }

    // 一条从西向东的直线段。
    entities.add({
      polyline: {
        positions: positions,
        width: 10.0,
        material: new Cesium.PolylineGlowMaterialProperty({
          color: Cesium.Color.DEEPSKYBLUE,
          glowPower: 0.25,
        }),
      },
    })

    positions = []
    for (i = 0; i < 40; ++i) {
      positions.push(Cesium.Cartesian3.fromDegrees(-100.0 + i, 9.0))
    }
    // 墙
    entities.add({
      wall: {
        // 定义墙体的顶点，每三个值表示一个点的经度、纬度和高度（单位为米）。
        positions: Cesium.Cartesian3.fromDegreesArrayHeights([
          -90.0, 43.0, 100000.0, -87.5, 45.0, 100000.0, -85.0, 43.0, 100000.0, -87.5, 41.0,
          100000.0, -90.0, 43.0, 100000.0,
        ]),
        //  创建了一个棋盘格样式。
        material: new Cesium.CheckerboardMaterialProperty({
          // 棋盘格在墙体表面上的重复次数。x 方向重复 20 次，y 方向重复 6 次。
          repeat: new Cesium.Cartesian2(20.0, 6.0),
        }),
      },
    })

    // 走廊
    entities.add({
      corridor: {
        positions: Cesium.Cartesian3.fromDegreesArray([-120.0, 45.0, -125.0, 50.0, -125.0, 55.0]),
        width: 100000,
        material: Cesium.Color.fromRandom({ alpha: 1.0 }),
      },
    })

    entities.add({
      corridor: {
        positions: Cesium.Cartesian3.fromDegreesArray([-120.0, 45.0, -125.0, 50.0, -125.0, 55.0]),
        width: 100000,
        height: 300000,
        extrudedHeight: 400000,
        material: Cesium.Color.fromRandom({ alpha: 0.7 }),
      },
    })

    entities.add({
      corridor: {
        positions: Cesium.Cartesian3.fromDegreesArray([-120.0, 45.0, -125.0, 50.0, -125.0, 55.0]),
        width: 100000,
        height: 700000,
        outline: true,
        outlineColor: Cesium.Color.WHITE,
        outlineWidth: 4,
        material: Cesium.Color.fromRandom({ alpha: 0.7 }),
      },
    })

    // 多条体积线

    // 生成一个星形的剖面轮廓，用于 polylineVolume 的 shape 属性。
    function starPositions(arms, rOuter, rInner) {
      const angle = Math.PI / arms
      const pos = []
      for (let i = 0; i < 2 * arms; i++) {
        const r = i % 2 === 0 ? rOuter : rInner
        const p = new Cesium.Cartesian2(Math.cos(i * angle) * r, Math.sin(i * angle) * r)
        pos.push(p)
      }
      return pos
    }

    // 通过自定义shape函数，设置形状
    entities.add({
      polylineVolume: {
        positions: Cesium.Cartesian3.fromDegreesArrayHeights([
          -102.0, 15.0, 100000.0, -105.0, 20.0, 200000.0, -110.0, 20.0, 100000.0,
        ]),
        shape: starPositions(7, 30000.0, 20000.0),
        outline: true,
        outlineColor: Cesium.Color.WHITE,
        outlineWidth: 1,
        material: Cesium.Color.fromRandom({ alpha: 1.0 }),
      },
    })

    entities.add({
      polylineVolume: {
        positions: Cesium.Cartesian3.fromDegreesArray([-102.0, 15.0, -105.0, 20.0, -110.0, 20.0]),
        shape: starPositions(7, 30000.0, 20000.0),
        material: Cesium.Color.fromRandom({ alpha: 1.0 }),
      },
    })

    function computeCircle(radius) {
      const positions = []
      for (let i = 0; i < 360; i++) {
        const radians = Cesium.Math.toRadians(i)
        positions.push(
          new Cesium.Cartesian2(radius * Math.cos(radians), radius * Math.sin(radians)),
        )
      }
      return positions
    }

    entities.add({
      polylineVolume: {
        positions: Cesium.Cartesian3.fromDegreesArray([-104.0, 13.0, -107.0, 18.0, -112.0, 18.0]),
        shape: computeCircle(40000.0),
        material: Cesium.Color.WHITE,
      },
    })
  }
  viewer.zoomTo(viewer.entities)
}

onMounted(() => {
  init()
  addEntities()
})
</script>

<template>
  <div id="cesiumContainer"></div>
</template>

<style scoped>
#cesiumContainer {
  width: 100%;
  height: 100%;
  margin: 0;
  padding: 0;
}
</style>
