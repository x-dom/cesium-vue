<template>
    <div class="cesium-viewer" ref="container">
        <div class="btn-items">
            <button @click="showLonLat = !showLonLat">实时经纬度</button>
        </div>
        <div class="lon-lat" v-if="showLonLat">
            <div>经度：<span>{{currentLonLat[0]}}</span></div>
            <div>纬度：<span>{{currentLonLat[1]}}</span></div>
        </div>
    </div>
</template>
<script>
import AICesium from "@/utils/MyCesium/MyCesium";
import {Cesium} from "@/utils/MyCesium/MyCesium";

export default {
    name: 'cesiumViewer',
    data: () => {
        return {
            app: undefined,
            tileset: undefined,
            roadset: undefined,
            showLonLat: false,
            currentLonLat: [0,0,0]
        }
    },
    created() {

    },
    mounted () {
        console.log('挂载...');
        if(!this.app) {
            this.app = new AICesium(this.$refs.container, {targetFrameRate: 30});
        } else {
            this.app.clear();
        }
        let app = this.app;
        window.viewer = app.viewer;
        app.initClock();
        // app.flyHome(Cesium.Cartesian3.fromDegrees(116.397335, 39.90743, 100));
        // app.lookAround(116.397335, 39.90743, 300, -45, 1, 500);

        //鼠标点击事件
        app.eventObj.on('click', (evt) => {
            console.log(evt);
            let pixel = evt.position;
            let origin = app.pixelToWorld3D(pixel);
            // app.createComposeSymbolPoint(origin);
            // app.addTracePosition(origin);
            console.log(app.pixelToWGS84(pixel));

            let height = 100;
            let heightProperty = new Cesium.SampledProperty(Number);
            heightProperty.addSample(app.viewer.clock.currentTime,  0);
            heightProperty.addSample(Cesium.JulianDate.addSeconds(app.viewer.clock.currentTime, 1, new Cesium.JulianDate()),  height);
            heightProperty.addSample(Cesium.JulianDate.addDays(app.viewer.clock.currentTime, 1, new Cesium.JulianDate()),  height);
            app.viewer.entities.add({
                position: origin,
                cylinder: {
                    length: heightProperty,
                    material: Cesium.Color.fromCssColorString('#00ff00'),
                    topRadius: 5,
                    bottomRadius: 5
                }
            });
        });
        //鼠标移动事件
        app.eventObj.on('mousemove', (evt) => {
            let pixel = evt.endPosition;
            let lonLatArr = app.pixelToWGS84(pixel);
            if(Cesium.defined(lonLatArr)) {
                this.currentLonLat = lonLatArr;
            }
        });

        //加载三维建筑图层
        // this.tileset = app.load3DTileSet('http://localhost:18080/beijing/tileset.json', true);

        //加载路网图层
        AICesium.loadGeoJson('http://localhost:18080/road_4m.geojson').then((dataSources) => {
            this.roadset = app.loadPolylineOfDataSources(dataSources);
        });
    },
    updated () {
        // console.log('更新...');
    },
    methods: {
    }
}
</script>

<style scoped>
    .cesium-viewer {
        width: 100vw;
        height: 100vh;
        position: relative;
        overflow: hidden;
    }

    .btn-items {
        position: absolute;
        z-index: 10;
        top: 5px;
        left: 5px;
        display: flex;
        justify-content: center;
        align-items: center;
    }

    .lon-lat {
        padding: 5px;
        border-radius: 5px;
        background-color: rgba(236, 252, 92, 0.4);
        box-shadow: 2px 2px rgba(0,0,0,.5);
        font-size: 16px;
        position: absolute;
        z-index: 10;
        bottom: 5px;
        left: 5px;
        display: flex;
        align-items: center;
        justify-content: space-between;
    }

    .lon-lat div {
        width: 150px;
    }
</style>