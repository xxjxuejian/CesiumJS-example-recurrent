<script setup>
import QuickStart from '@/views/QuickStart/index.vue'
import FlightTrack from '@/views/Flight-Tracker/index.vue'
import Photorealistic from '@/views/Photorealistic-3D-Tiles/index.vue'
import VisualizingImagery from '@/views/Visualizing-Imagery/index.vue'
import Entities from '@/views/Entities/index.vue'
import GeometryAppearances from './Sandcastle/Showcases/Geometry-Appearances.vue'
import Terrain3D from '@/views/3D-terrain/index.vue'
import TerrainExample from './Sandcastle/Terrain/TerrainExample.vue'
</script>

<template>
  <div class="App">
    <!-- <QuickStart></QuickStart> -->
    <!-- <FlightTrack></FlightTrack> -->
    <!-- <Photorealistic></Photorealistic> -->
    <!-- <VisualizingImagery></VisualizingImagery> -->
    <!-- <Entities></Entities> -->
    <!-- <GeometryAppearances></GeometryAppearances> -->
    <!-- <Terrain3D></Terrain3D> -->
    <TerrainExample></TerrainExample>
  </div>
</template>

<style scoped lang="scss">
.App {
  width: 100%;
  height: 100%;
}
</style>
