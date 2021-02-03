import 'cesium/Widgets/widgets.css'
import Event from './utils/event/Event'
import {loadPolylineForEntity, loadPolylineForPrimitives, loadPolylineForGroundPrimitives} from './utils/effect/line/Polyline'
import {ComposeSymbolPoint} from './utils/effect/comp/ComposeSymbolPoint'
import {Cesium} from './utils/CONST'

/**
 * Cesium 二次封装
 * @author xiaoshuai
 */
export default class MyCesium {
    constructor(container, options) {
        let _this = this;
        if(!options) options = {};
        options.defaultAccessToken =  options.defaultAccessToken || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJqdGkiOiIzNDhhYmQxOC1mYzMwLTRhYmEtOTI5Ny1iNGExNTQ3ZTZhODkiLCJpZCI6NTQ1NCwic2NvcGVzIjpbImFzciIsImdjIl0sImlhdCI6MTU0MzM3Mzc0NH0.RU6ynAZcwQvdfygt_N_j2rb2lpsuyyROzdaLQg0emAg';
        Cesium.Ion.defaultAccessToken = options.defaultAccessToken;
        const args=["geocoder","homeButton","sceneModePicker","baseLayerPicker","navigationHelpButton","animation","timeline","fullscreenButton","vrButton","infoBox","selectionIndicator"];
        for(let i=0; i < args.length; i++) {
            if(!options[args[i]]) {
                options[args[i]] = false;
            }
        }
        options['scene3DOnly'] = true;
        // options['requestRenderMode'] = true;

        if(!options.map_server || options.map_server.length==0){
            options.map_server = [
                // {
                //     type: 'XYZ',
                //     // url:'http://www.google.cn/maps/vt?lyrs=s@800&x={x}&y={y}&z={z}',  
                //     url:'http://t{s}.tianditu.gov.cn/img_c/wmts?SERVICE=WMTS&REQUEST=GetTile&VERSION=1.0.0&LAYER=img&STYLE=default&TILEMATRIXSET=w&FORMAT=tiles&TILEMATRIX={z}&TILEROW={x}&TILECOL={y}&tk=d42fd762c9bb221d415d6d7eb6921f29',  
                //     value: ['0', '1', '2', '3', '4', '5', '6', '7'],
                //     minimumLevel:1,
                //     maximumLevel:20
                // },
                // {
                //     type: 'XYZ',
                //     url:'http://t{s}.tianditu.gov.cn/DataServer?T=cva_w&x={x}&y={y}&l={z}&tk=d42fd762c9bb221d415d6d7eb6921f29',  
                //     value: ['0', '1', '2', '3', '4', '5', '6', '7'],
                //     minimumLevel:1,
                //     maximumLevel:20
                // },
                {
                    type: 'XYZ',
                    url: '//webrd{s}.is.autonavi.com/appmaptile?lang=zh_cn&size=1&scale=1&style=8&x={x}&y={y}&z={z}',
                    value: ['01', '02', '03', '04'],
                    minimumLevel:3,
                    maximumLevel:18
                },
            ];
        } 
        
        //默认网格底图
        options.imageryProvider = new Cesium.GridImageryProvider({
            backgroundColor: new Cesium.Color(0.78,0.78,0.78,1.0),
            cells: 8,
            color: new Cesium.Color(1.0, 1.0, 1.0, 1.0),
            glowColor: new Cesium.Color(0.0, 1.0, 0.0, 0.05),
            glowWidth: 0,
        });

        this.viewer = new Cesium.Viewer(container,options);
        this.scene = this.viewer.scene;
        this.camera = this.scene.camera;

        //其他默认图层
        options.map_server.forEach((item, index)=>{
            let layer = new Cesium.UrlTemplateImageryProvider({
                tilingScheme:new Cesium.WebMercatorTilingScheme(),
                url: item.url,
                subdomains: item.value,
                minimumLevel: item.minimumLevel||1,
                maximumLevel: item.maximumLevel||18
            });
            _this.viewer.imageryLayers.addImageryProvider(layer);
        });

        //取消双击选中事件。(这个作用不大)
        this.viewer.cesiumWidget.screenSpaceEventHandler.removeInputAction(Cesium.ScreenSpaceEventType.LEFT_DOUBLE_CLICK);
        //全球光照
        this.viewer.scene.globe.enableLighting = options.globeLight;
        //大气层
        this.viewer.scene.globe.showGroundAtmosphere = options.showGroundAtmosphere;
        //地形
        this.viewer.scene.globe.depthTestAgainstTerrain = true;
        //FPS
        this.viewer.scene.debugShowFramesPerSecond = true;
        //除版权信息
        this.viewer._cesiumWidget._creditContainer.style.display = "none";
        // 解决瓦片地图偏灰问题
        this.viewer.scene.highDynamicRange = false;
        //底图默认暗色
        this.viewer.imageryLayers.get(1).brightness = 0.2;
        //主页
        this.home = {};
        this.home.duration = 3;
        this.home.destination = Cesium.Cartesian3.fromDegrees(116.397335, 39.90743, 100);
        this.home.orientation = {
            heading : 0.13331432556596035,
            pitch : -0.6460940450802517,
            roll : 0.0
        };

        this.viewer.scene.camera.setView({
            destination: this.home.destination, 
            orientation: this.home.orientation
        });

        /*****************注册事件********************/
        _this.eventObj = new Event();
        
        //渲染完成事件
        _this.viewer.scene.postRender.addEventListener((evt) => {
            _this.eventObj.emit("rendercomplete", evt);
        });
        
        let handler = new Cesium.ScreenSpaceEventHandler(_this.viewer.canvas);

        //单击事件
        handler.setInputAction((evt) => {
            evt.feature = _this.viewer.scene.pick(evt.position);
            _this.eventObj.emit("click", evt);
        }, Cesium.ScreenSpaceEventType.LEFT_CLICK);
        
        //双击事件
        handler.setInputAction((evt) => {
            evt.feature = _this.viewer.scene.pick(evt.position);
            _this.eventObj.emit("dblclick", evt);
        }, Cesium.ScreenSpaceEventType.LEFT_DOUBLE_CLICK);

        //鼠标移动事件
        let lastFrameTime =  Date.now();
        handler.setInputAction((evt) => {
                let targetFrameRate = _this.viewer.cesiumWidget._targetFrameRate;
                targetFrameRate = !Cesium.defined(targetFrameRate)?10:targetFrameRate;
                targetFrameRate = 10;
                let frameTime = Date.now();
                let interval = 1000.0 / targetFrameRate;
                let delta = frameTime - lastFrameTime;
                if (delta > interval) {
                    lastFrameTime = frameTime;
                    // evt.feature = _this.viewer.scene.pick(evt.endPosition);//高耗资源
                    _this.eventObj.emit("mousemove", evt);
                }
        }, Cesium.ScreenSpaceEventType.MOUSE_MOVE);
    }

    clear() {
        if(this.viewer) {
            this.viewer.scene.groundPrimitives.removeAll();
            this.viewer.scene.primitives.removeAll();
            this.viewer.dataSources.removeAll();
            this.viewer.entities.removeAll();
        }
    }
}

/**
 * 初始化时钟
 * @param { 开始时间 } start
 * @param { 结束时间 } stop
 * @param { 动画状态 } status
 */
MyCesium.prototype.initClock = function(start, stop, status) {
    let  viewer = this.viewer;
    start = start || Cesium.JulianDate.fromDate(new Date());
    stop = stop || Cesium.JulianDate.addDays(start, 1, new Cesium.JulianDate());
    status = status==undefined?true:status;
    viewer.clock.startTime = start.clone();
    viewer.clock.stopTime = stop.clone();
    viewer.clock.currentTime = start.clone();
    viewer.clock.clockRange = Cesium.ClockRange.LOOP_STOP;
    viewer.clock.multiplier = 1;
    viewer.clock.shouldAnimate = status;
}

/**
 * 回到关注点
 * @param { 目的地 } destination 
 * @param { 方向} orientation 
 * @param { 持续时间 } duration 
 */
MyCesium.prototype.flyHome = function(destination, orientation, duration) {
    this.home.duration = duration || this.home.duration;
    this.home.destination = destination || this.home.destination;
    this.home.orientation = orientation || this.home.orientation;
    this.viewer.camera.flyTo({
        destination: this.home.destination,
        orientation: this.home.orientation,
        duration: this.home.duration,
    });
}

/**
 * 飞行至指定的经纬度
 * @param { 经度 } longitude 
 * @param { 纬度 } latitude
 * @param { 俯仰角 } pitch //-90~90，默认-90，-90为相机看向正下方，90为相机看向正上方，可选
 * @param { 相机与目标的距离 } distance //单位米，默认500，可选
 * @param { 飞行时间 } duration //单位秒，默认飞行3秒，可选
 */
MyCesium.prototype.fly2Point = function(longitude, latitude, pitch, distance, duration) {//点位置 + 俯仰角 + 时间
    longitude = longitude ? longitude : 0;
    latitude = latitude ? latitude : 0;

    let viewer = this.viewer;
    let Pitch = pitch ? pitch : -45;
    let Distance = distance ? distance : 1000;
    let Duration = duration ? duration : 3;
    let entity = viewer.entities.getById("flyTmp");
    if (Cesium.defined(entity)) {
        viewer.entities.remove(entity);
    }
    entity = viewer.entities.add({
        id: 'flyTmp',
        position: Cesium.Cartesian3.fromDegrees(longitude, latitude),
        point: {
            pixelSize: 0,
            color: Cesium.Color.WHITE.withAlpha(1),
            outlineColor: Cesium.Color.WHITE.withAlpha(0),
            outlineWidth: 0
        }
    });
    viewer.flyTo(entity, {
        duration: Duration,
        offset: new Cesium.HeadingPitchRange(0, Cesium.Math.toRadians(Pitch), Distance)
    });
}

/**
 * 围绕中心点旋转
 * @param { 经度 } longitude 
 * @param { 纬度 } latitude 
 * @param { 旋转时长 } period //单位秒
 * @param { 俯仰角 } pitch //-90~90，-90为相机看向正下方，默认值为 -30 度
 * @param { 每秒飞行速度 } speed //单位度/秒，默认值2
 * @param { 相机与目标的距离 } distance /单位米,默认值为5000
 */
MyCesium.prototype.lookAround = function(longitude, latitude, period, pitch, speed, distance) {
    longitude = longitude ? longitude : 0;
    latitude = latitude ? latitude : 0;

    // 相机看点的角度，如果大于0那么则是从地底往上看，所以要为负值，这里取-30 度
    let viewer = this.viewer;
    let Pitch = Cesium.Math.toRadians(pitch ? pitch : -30);
    // 每秒转动度数
    let angle = speed ? speed : 2;
    // 给定相机距离点多少距离飞行，这里取值为5000m
    let dis = distance ? distance : 5000;
    let startTime = Cesium.JulianDate.fromDate(new Date());
    let stopTime = Cesium.JulianDate.addSeconds(
        startTime,
        period,
        new Cesium.JulianDate()
    );
    viewer.clock.startTime = startTime.clone(); // 开始时间
    viewer.clock.stopTime = stopTime.clone(); // 结速时间
    viewer.clock.currentTime = startTime.clone(); // 当前时间
    viewer.clock.clockRange = Cesium.ClockRange.CLAMPED; // 行为方式
    viewer.clock.clockStep = Cesium.ClockStep.SYSTEM_CLOCK; // 时钟设置为当前系统时间; 忽略所有其他设置。
    // 相机的当前 heading
    let initialHeading = viewer.camera.heading;
    let Exection = function TimeExecution() {
        // 当前已经过去的时间，单位s
        let delTime = Cesium.JulianDate.secondsDifference(
            viewer.clock.currentTime,
            viewer.clock.startTime
        );
        let heading = Cesium.Math.toRadians(delTime * angle) + initialHeading;
        viewer.scene.camera.setView({
            destination: Cesium.Cartesian3.fromDegrees(longitude, latitude), 
            orientation: {
                heading: heading,
                pitch: Pitch
            }
        });
        viewer.scene.camera.moveBackward(dis);
        if (
            Cesium.JulianDate.compare(
                viewer.clock.currentTime,
                viewer.clock.stopTime
            ) >= 0
        ) {
            viewer.clock.onTick.removeEventListener(Exection);
        }
    };
    viewer.clock.onTick.addEventListener(Exection);
}

/**
 * 注销中心点旋转
 */
MyCesium.prototype.removeLookAround = function() {
    let viewer = this.viewer;
    viewer.clock.onTick._listeners.forEach(item => { viewer.clock.onTick.removeEventListener(item) })
}

/**
 * 加载三维瓦片集合
 * @param { 瓦片路径 } url 
 * @param { 默认是否显示 } show 
 */
MyCesium.prototype.load3DTileSet = function(url,show){
    var viewer = this.viewer;
    // var color = `vec4(0.0, 0.5, 1.0,1)`;
    var color = 'vec4(0.2, 0.2, 0.2,1)';
    var contentFS = '';
    
    //黑色基底,深蓝从底向上渐变
    contentFS = `
        gl_FragColor = vec4(0.0, 0.5, 1.0, 1.0);
        float position3DZ = xs_positionMC.z;
        float channelNum = position3DZ / 20.0;
        float randomNum1 = fract(czm_frameNumber / 120.0) * 3.14159265 * 2.0;
        channelNum += sin(randomNum1) * 0.2;
        gl_FragColor *= vec4(channelNum, channelNum, channelNum, 1.0);

        float randomNum2 = fract(czm_frameNumber / 360.0);
        randomNum2 = abs(randomNum2 - 0.5) * 2.0;
        float changeH = clamp(position3DZ / 300.0, 0.0, 1.0);
        float changeDiff = step(0.005, abs(changeH - randomNum2));
        gl_FragColor.rgb += gl_FragColor.rgb * (1.0 - changeDiff);
    `;

    //蓝色基底,灰白从底向上渐变
    contentFS = `
        gl_FragColor = vec4(0.2, 0.2, 0.2,1.0);
        float position3DZ = xs_positionMC.z;
        float channelNum1 = position3DZ/10.0;
        float randomNum1 = fract(czm_frameNumber / 120.0) * 3.14159265 * 2.0;
        channelNum1 += sin(randomNum1) * 0.2;
        channelNum1 = channelNum1>.8?.8:channelNum1;
        channelNum1 = 1.0 - channelNum1;
        gl_FragColor.rgb += vec3(0.0, 0.0, channelNum1);

        float channelNum2 = mod(position3DZ, 3.0);
        channelNum2 = position3DZ/20.0;
        gl_FragColor.rgb += vec3(channelNum2, channelNum2, channelNum2);

        float randomNum2 = fract(czm_frameNumber / 720.0);
        randomNum2 = abs(randomNum2 - 0.5) * 2.0;
        float changeH = clamp(position3DZ / 200.0, 0.0, 1.0);
        float changeDiff = step(0.005, abs(changeH - randomNum2));
        gl_FragColor.rgb += gl_FragColor.rgb * (1.0 - changeDiff);
    `;

    var tileset = viewer.scene.primitives.add(new Cesium.Cesium3DTileset({
        show: !!show,
        url: url,
        // maximumScreenSpaceError: 60,//减少细粒度元素渲染，优化渲染效率
        shaderDebug: false,
        headVS: ` varying vec3 xs_positionMC;`,
        contentVS: ` xs_positionMC = a_position.xyz;`,
        headFS: ` varying vec3 xs_positionMC;`,
        contentFS: contentFS,
    }));
    tileset.style = new Cesium.Cesium3DTileStyle({
        color : color,
    });

    return tileset;
};

/**
 * 屏幕坐标转世界坐标
 * @param { 屏幕坐标 } pixel 
 */
MyCesium.prototype.pixelToWorld3D = function(pixel){
    var viewer = this.viewer;
    var pickRay = viewer.camera.getPickRay(pixel);
    var cartesian3 = viewer.scene.globe.pick(pickRay,viewer.scene);
    if(Cesium.defined(cartesian3)){
        return cartesian3;
    }
};

/**
 * 屏幕坐标转经纬度坐标
 * @param { 屏幕坐标 } pixel 
 */
MyCesium.prototype.pixelToWGS84 = function(pixel){
    if(Cesium.defined(pixel)) {
        pixel.x = Math.round(pixel.x);
        pixel.y = Math.round(pixel.y);
        var cartesian3 = this.pixelToWorld3D(pixel);
        return this.world3DToWGS84(cartesian3);
    } 
};

/**
 * 世界坐标转经纬度坐标
 * @param { 世界坐标 } cartesian3 
 */
MyCesium.prototype.world3DToWGS84 = function(cartesian3){
    if(Cesium.defined(cartesian3)){
        var cartographic = Cesium.Cartographic.fromCartesian(cartesian3);
        var lat = Cesium.Math.toDegrees(cartographic.latitude);
        var lng = Cesium.Math.toDegrees(cartographic.longitude);
        var height = cartographic.height.toFixed(2);
        
        lng = Number(Number(lng).toFixed(6));
        lat = Number(Number(lat).toFixed(6));
        height = Number(Number(height).toFixed(1));
        return  [lng, lat, height];
    }
};

/**
 * 添加信息提示框
 * @param { 位置 } position 
 * @param { 提示内容 } text 
 */
MyCesium.prototype.addTipInfoWindow = function(position, text){
    let options = {};
    options.viewPoint = position;
    options.content = text;
    return new TipInfoWinPrimitive(this.viewer, options);
}

/**
 * 添加基础信息提示框
 * @param { 位置 } position 
 * @param { 标题 } title 
 * @param { 内容 } content 
 * @param { 关闭事件 } onClose 
 */
MyCesium.prototype.addBaseInfoWindow = function(position, title,content, onClose) {
    let options = {};
    options.viewPoint = position;
    options.title = title;
    options.content = content;
    options.onClose = onClose;
    return new BaseInfoWinPrimitive(this.viewer, options);
}


/**
 * 加载资源管理器
 * @param { 地图资源数组 } sources 
 */
MyCesium.prototype.loadMapSources = function(sources){
    var container = this.viewer.container;
    // var ele container.getElementsByClassName("cesium-select-control");
    /*
    sources = 
    {
        name: "建筑",
        show: true,
        onClick: function(checked){
            if(_this.buildingTileset) {
                _this.buildingTileset.show = checked;
            }
        }
    }
    */
    sources = sources||[];
    var selectControl = document.createElement("div");
    selectControl.className = "cesium-select-control";
    container.appendChild(selectControl);
    
    var selectTitle = document.createElement("div");
    selectTitle.className = "cesium-select-control-title";

    var titleSpan = document.createElement("span");
    titleSpan.innerText = "图层控制";
    selectTitle.appendChild(titleSpan);

    var titleArrow = document.createElement("div");
    titleArrow.className = "arrow";
    titleArrow.select = false;
    selectTitle.appendChild(titleArrow);
    selectControl.appendChild(selectTitle);

    var selectContent = document.createElement("div");
    selectContent.className = "cesium-select-control-content";
    selectControl.appendChild(selectContent);

    selectTitle.onclick = function(){
        if(titleArrow.select){
            titleArrow.className = "arrow";
            titleArrow.select = !titleArrow.select;
            $(selectContent).hide(200);
            // selectContent.style.display = "none";
        } else {
            titleArrow.className = "arrow select";
            titleArrow.select = !titleArrow.select;
            $(selectContent).show(200);
            // selectContent.style.display = "block";
        }
    };

    sources.forEach(value => {
        var element = document.createElement("div");
        element.className = "cesium-select-control-row";
        selectContent.appendChild(element);
        var elementSpan = document.createElement("span");
        elementSpan.innerText = value.name;
        element.appendChild(elementSpan);
        var elementSelect = document.createElement("div");
        
        
        if(value.isFirst){
            element.className = "cesium-select-control-row first";
        } else {
            element.className = "cesium-select-control-row";
        }

        elementSelect.select = value.show;
        if(value.show){
            elementSelect.className = "select-btn select";
        } else {
            elementSelect.className = "select-btn";
        }

        element.appendChild(elementSelect);
        if(!value.disabled) {
            elementSelect.onclick = function() {
                if(this.select){
                    elementSelect.className = "select-btn";
                    elementSelect.select = !this.select;
                } else {
                    elementSelect.className = "select-btn select";
                    elementSelect.select = !this.select;
                }
                value.onClick(this.select);
            };
        }
    });

    return selectControl;
};

/**
 * 加载地图图例
 * @param { 地图图例数组 } legendSources 
 */
MyCesium.prototype.loadMapLegend = function(legendSources) {
    let container = this.viewer.container;
    $(container).find('#crsium-legend-container').remove();
    // let legendSources = [
    //     {
    //         id: "legend-grid",
    //         name: "栅格",
    //         show: true,
    //         items: [
    //             {
    //                 color: "#0000FF",
    //                 text: "[1,5)",
    //                 onClick: function() {
    //                 },
    //             },
    //             {
    //                 color: "#00FFFF",
    //                 text: "[5,10)",
    //                 onClick: function() {
    //                 },
    //             },
    //             {
    //                 color: "#00FF00",
    //                 text: "[10,40)",
    //                 onClick: function() {
    //                 },
    //             },
    //             {
    //                 color: "#FFFF00",
    //                 text: "[40,80)",
    //                 onClick: function() {
    //                 },
    //             },
    //             {
    //                 color: "#FF0000",
    //                 text: "[80,+∞)",
    //                 onClick: function() {
    //                 },
    //             }
    //         ]
    //     }
    // ];

    let legendContainer = document.createElement("div");
    legendContainer.id = "crsium-legend-container";
    legendContainer.className = "crsium-legend-container";
    container.appendChild(legendContainer);

    legendSources.forEach(el => {
        if(!el.show) return;
        let legendControl = document.createElement("div");
        legendControl.className = "cesium-legend-control";
        legendContainer.appendChild(legendControl);
        
        let legendTitle = document.createElement("div");
        legendTitle.className = "cesium-legend-title";
        legendTitle.id = el.id;
        legendTitle.innerText = el.name;
        legendControl.appendChild(legendTitle);

        let legendBody = document.createElement("ul");
        legendBody.className = "cesium-legend-body";
        legendControl.appendChild(legendBody);
        
        let type = el.type||'text-color';
        if(type == 'text-color'){
            el.items.forEach(item => {
                let legendItem = document.createElement("li");
                legendItem.className = "cesium-legend-item";
                legendBody.appendChild(legendItem);
                
                let legendSymbol = document.createElement("div");
                legendSymbol.className = "cesium-legend-symbol";
                legendSymbol.style.backgroundColor = item.color;
                legendItem.appendChild(legendSymbol);
    
                let legendText = document.createElement("span");
                legendText.className = "cesium-legend-text";
                legendText.innerText = item.text;
                legendItem.appendChild(legendText);
    
                legendItem.onclick = function(){
                    if(item.onClick){
                        item.onClick();
                    }
                }
            });
        } else  if(type == 'ud-range-color'){
            let textTop = document.createElement("div");
            textTop.className = "cesium-legend-text-top";
            textTop.innerText = el.topText||"";
            legendBody.appendChild(textTop);
            let rangeColorDom = document.createElement("div");
            rangeColorDom.className = "cesium-legend-range-color";
            rangeColorDom.style.background = "linear-gradient("+el.colorRange.join(",")+")";
            legendBody.appendChild(rangeColorDom);
            let textDown = document.createElement("div");
            textDown.className = "cesium-legend-text-down";
            textDown.innerText = el.downText||"";
            legendBody.appendChild(textDown);
        }
    });
};

/**
 * 两世界坐标点间抛物线方程
 * @param { 坐标1 } cartesian1 
 * @param { 坐标2 } cartesian2 
 * @param { 高度 } height 
 * @param { 起始高度 } extrudedHeight 
 * @param { 线性点数 } num 
 */
MyCesium.prototype.parabolaEquationByWorld3D = function (cartesian1, cartesian2, height, extrudedHeight, num) {
    var coordinate1 = this.world3DToWGS84(cartesian1);
    var coordinate2 = this.world3DToWGS84(cartesian2);
    if(coordinate1 && coordinate2) {
        return this.parabolaEquationByWGS84(coordinate1, coordinate2, height, extrudedHeight, num);
    }
};

/**
 * 两经纬度点间抛物线方程
 * @param { 坐标1 } coordinate1 
 * @param { 坐标2 } coordinate2 
 * @param { 高度 } height 
 * @param { 起始高度 } extrudedHeight 
 * @param { 线性点数 } num 
 */
MyCesium.prototype.parabolaEquationByWGS84 = function (coordinate1, coordinate2, extrudedHeight, num, rate) {
    var options = {
        pt1: {
            lon: coordinate1[0],
            lat: coordinate1[1],
            h: coordinate1[2]||0,
        },
        pt2: {
            lon: coordinate2[0],
            lat: coordinate2[1],
            h: coordinate2[2]||0,
        },
        extrudedHeight: extrudedHeight||100,
        num: num
    }

    //方程 y=-(4h/L^2)*x^2+h h:顶点高度 L：横纵间距较大者
    var h = options.extrudedHeight;
    var L = Math.abs(options.pt1.lon - options.pt2.lon) > Math.abs(options.pt1.lat - options.pt2.lat) ? Math.abs(options.pt1.lon - options.pt2.lon) : Math.abs(options.pt1.lat - options.pt2.lat);
    var num = options.num || 64;
    var result = [];
    rate = rate||0.5;//抛物线顶点分割比例
    rate = rate>=1||rate<=0?0.5:rate;
    // result.push(coordinate1);

    //求贝塞尔曲线
    var p1 = [0,options.pt1.h];
    var p2 = [num*10,options.pt2.h];
    var c1 = [num*10*rate,h];
    var c2 = [num*10*(rate + (1-rate)/2),h/2];
    var bezierPoints = Bezier.getBezierPoints(num, p1, c1, c2, p2);

    var dlt = L / num;
    //坐标相等
    if(Math.abs(options.pt1.lon - options.pt2.lon) == Math.abs(options.pt1.lat - options.pt2.lat)){
        return [];
    }
    //以lon为基准
    else if (Math.abs(options.pt1.lon - options.pt2.lon) > Math.abs(options.pt1.lat - options.pt2.lat)) {
        var delLat = (options.pt2.lat - options.pt1.lat) / num;
        if (options.pt1.lon - options.pt2.lon > 0) {
            dlt = -dlt;
        }

        for (var i = 0; i < num; i++) {
            var tempH = h - Math.pow((-0.5 * L + Math.abs(dlt) * i), 2) * 4 * h / Math.pow(L, 2);
            var lon = options.pt1.lon + dlt * i;
            var lat = options.pt1.lat + delLat * i;
            tempH = bezierPoints[i][1];
            result.push(lon, lat, tempH);
        }
    }
    //以lat为基准 
    else {
        var delLon = (options.pt2.lon - options.pt1.lon) / num;
        if (options.pt1.lat - options.pt2.lat > 0) {
            dlt = -dlt;
        }

        for (var i = 0; i < num; i++) {
            var tempH = h - Math.pow((-0.5 * L + Math.abs(dlt) * i), 2) * 4 * h / Math.pow(L, 2);
            var lon = options.pt1.lon + delLon * i;
            var lat = options.pt1.lat + dlt * i;
            tempH = bezierPoints[i][1];
            result.push(lon, lat, tempH);
        }
    }
    result.push(coordinate2[0],coordinate2[1],coordinate2[2]||0);
    
    return result;
};

/**
 * 加载性数据
 * @param {*} dataSources 
 * @param {*} options 
 */
MyCesium.prototype.loadPolylineOfDataSources = function(dataSources, options) {
    let viewer = this.viewer;
    let defoptions = {
        type: 'groundpolyline',
        width: 2.0,
        color: '#7ac1ff'
    }
    options = {...defoptions, ...options};
    if(options.type == 'entity') {
        return loadPolylineForEntity(dataSources, viewer, options)
    } else if(options.type == 'polyline') {
        return loadPolylineForPrimitives(dataSources, viewer, options)
    } else if(options.type == 'groundpolyline') {
        return loadPolylineForGroundPrimitives(dataSources, viewer, options)
    }
};

/**
 * 相机跟踪点
 * @param {*} position 
 */
MyCesium.prototype.addTracePosition = function(position) {
    var heading = Cesium.Math.toRadians(50.0);
    var pitch = Cesium.Math.toRadians(-20.0);
    var range = 2000.0;
    var transform = Cesium.Transforms.eastNorthUpToFixedFrame(position);
    this.viewer.camera.lookAtTransform(transform, new Cesium.HeadingPitchRange(heading, pitch, range));
};

/**
 * 创建组合标记点
 * @param {*} options 
 */
MyCesium.prototype.createComposeSymbolPoint = function(origin, onClick, color = '#00FF00', radius = 100) {
    let options = {
        position: origin,
        color: new Cesium.Color.fromCssColorString(color),
        radius: radius,
        slices: 6,
        properties: {},
        onClick: onClick
    }

    return  new ComposeSymbolPoint(this.viewer, options);
}

/**
 * 加载远程GeoJson
 * @param {*} url
 */
MyCesium.loadGeoJson = (url) => {
    let promise = Cesium.GeoJsonDataSource.load(url);
    return promise;
};

MyCesium.ComposeSymbolPoint = ComposeSymbolPoint

export {Cesium};