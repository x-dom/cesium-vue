<template>
    <div id="cesiumContainer"></div>
</template>
<script>
import DicCesium from "@/utils/MyCesium/MyCesium";
import {Cesium} from "@/utils/MyCesium/MyCesium";
export default {
    name: 'cesiumViewer',
    mounted () {
        this.app = new DicCesium("cesiumContainer", {targetFrameRate: 30});
        this.viewer = this.app.viewer;
        this.app.initClock();
        this.app.flyHome(new Cesium.Cartesian3(-1337923.7948842596, 5329400.940359369, 3229446.8398128035));
    }
}
</script>

<style scoped>

</style>