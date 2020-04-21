<template>
    <div id="cesiumContainer"></div>
</template>
<script>
export default {
    name: 'cesiumViewer',
    mounted () {
        // var viewer = new this.Cesium.Viewer('cesiumContainer')
        const Cesium = this.Cesium;
        var baseLayer=new Cesium.UrlTemplateImageryProvider({            	
            url:'http://www.google.cn/maps/vt?lyrs=s@800&x={x}&y={y}&z={z}',  
            tilingScheme:new Cesium.WebMercatorTilingScheme(),            	
            minimumLevel:1,            
            maximumLevel:20        
        }); 

        var viewer = new Cesium.Viewer('cesiumContainer', {
            requestRenderMode: false, // 进入后台停止渲染
            // targetFrameRate: 30, // 帧率30，节约GPU资源
            fullscreenButton: true, //是否显示全屏按钮
            infoBox: false,//信息弹窗控件
            geocoder: false,//是否显示geocoder小器件，右上角查询按钮 
            scene3DOnly: true,//如果设置为true，则所有几何图形以3D模式绘制以节约GPU资源
            selectionIndicator: false,//是否显示默认的选中指示框
            baseLayerPicker: false,//是否显示图层选择器
            homeButton: false, //是否显示Home按钮
            sceneModePicker: false,//   是否显示3D/2D选择器
            navigationHelpButton: false,//是否显示右上角的帮助按钮
            animation: false,//是否创建动画小器件，左下角仪表
            creditsDisplay: false,
            timeline: false,//是否显示时间轴
            shouldAnimate : true,
            fullscreenButton: false,//是否显示全屏按钮
            // terrainProvider: Cesium.createWorldTerrain(),//地形
            imageryProvider: baseLayer,
        });

        viewer.scene.globe.depthTestAgainstTerrain = true;//地形相关
        viewer.scene.debugShowFramesPerSecond = true;//FPS
        viewer._cesiumWidget._creditContainer.style.display = "none";//去除版权信息
        viewer.scene.globe.enableLighting = false;
        viewer.scene.highDynamicRange = true;// 解决瓦片地图偏灰问题
    }
}
</script>

<style scoped>

</style>