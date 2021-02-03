import {Cesium} from '../../CONST'
import {getColorRampImge, getColorRampImge2} from '../../common'

/**
 * 线网管理器
 * @param {*} viewer 
 * @param {*} options 
 */
const LineNetManager = function(viewer, options) {
    let defaultOptions = {
        show: true,
        width: 2.0,
        color: "#0000FF",
        glowPower: 0.1,
        taperPower: 1.0,
        distanceDisplayCondition: {near: 0, far: Number.MAX_VALUE}
    };
    this.viewer = viewer;

    Object.assign(defaultOptions, options);
    this.dataSource = defaultOptions.dataSource;
    this._show = !!defaultOptions.show;
    this.color = defaultOptions.color;
    this.width = defaultOptions.width;
    this.glowPower = defaultOptions.glowPower;
    this.taperPower = defaultOptions.taperPower;
    this.distanceDisplayCondition = defaultOptions.distanceDisplayCondition;
    this._rootContainer;
    this.lineNet;
}

Object.defineProperties(LineNetManager.prototype, {
    show: {
        get: function () {
            return this._show;
        },
        set: function(bool) {
            this._show = bool;
            if(this.lineNet){
                this.lineNet.show = bool;
            }
        }
    },
})

//清空
LineNetManager.prototype.clear = function(){
    if(this.lineNet && this._rootContainer){
        this._rootContainer.remove(this.lineNet);
    }
};

//以实例集合的形式加载
LineNetManager.prototype.loadToEntity = function(dataSource, viewer){
    this.clear();
    this.dataSource = dataSource||this.dataSource;
    this.viewer = viewer||this.viewer;
    
    dataSource = this.dataSource;
    viewer = this.viewer;
    if(!dataSource) return;

    let color = this.color;
    let width = this.width;
    let glowPower = this.glowPower;
    let taperPower = this.taperPower;

    let material =  new Cesium.PolylineGlowMaterialProperty({
        color: Cesium.Color.fromCssColorString(color),
        glowPower: glowPower,
        taperPower: taperPower
    });
    let distanceDisplayCondition =  new Cesium.DistanceDisplayCondition(this.distanceDisplayCondition.near, this.distanceDisplayCondition.far);
    dataSource.entities.values.forEach(entity => {
        entity.polyline.clampToGround = true;
        entity.polyline.material = material;
        entity.polyline.width = width;
        entity.polyline.distanceDisplayCondition = distanceDisplayCondition;
    });
    dataSource.show = this._show;
    this.lineNet = dataSource;
    this._rootContainer = viewer.dataSources;
    viewer.dataSources.add(dataSource);
};

//以实例普通图元的形式加载
LineNetManager.prototype.loadToPrimitive = function(dataSource, viewer){
    this.clear();
    this.dataSource = dataSource||this.dataSource;
    this.viewer = viewer||this.viewer;
    dataSource = this.dataSource;
    viewer = this.viewer;
    if(!dataSource) return;
    let color = this.color;
    let width = this.width;
    let glowPower = this.glowPower;
    let taperPower = this.taperPower;
    let lineInstances = [];
    let distanceDisplayCondition =  new Cesium.DistanceDisplayConditionGeometryInstanceAttribute (this.distanceDisplayCondition.near, this.distanceDisplayCondition.far);
    dataSource.entities.values.forEach(entity => {
        let positions = entity.polyline.positions.getValue();
        let polyline = new Cesium.PolylineGeometry({
            positions: positions,
            width: width
        });
        let geometry = Cesium.PolylineGeometry.createGeometry(polyline);
        let properties = entity.properties.getValue();
        let lineInstance = new Cesium.GeometryInstance({
            geometry: geometry,
            modelMatrix: Cesium.Matrix4.IDENTITY,
            properties: properties,
            attributes: {
                distanceDisplayCondition:  distanceDisplayCondition
            },
        });
        lineInstances.push(lineInstance);
    });

    var primitive = new Cesium.Primitive({
        geometryInstances: lineInstances,
        appearance: getPolylineMeatrialAppearance(color, glowPower, taperPower),
        asynchronous: false,
        show: this._show
    });
    this.lineNet = primitive;
    this._rootContainer = viewer.scene.primitives;
    viewer.scene.primitives.add(primitive);
};


//以地表图元的形式加载
LineNetManager.prototype.loadToGroundPrimitive = function(dataSource, viewer){
    this.clear();
    this.dataSource = dataSource||this.dataSource;
    this.viewer = viewer||this.viewer;
    
    dataSource = this.dataSource;
    viewer = this.viewer;
    if(!dataSource) return;
    
    let color = this.color;
    let width = this.width;
    let glowPower = this.glowPower;
    let taperPower = this.taperPower;
    let lineInstances = [];
    let distanceDisplayCondition =  new Cesium.DistanceDisplayConditionGeometryInstanceAttribute (this.distanceDisplayCondition.near, this.distanceDisplayCondition.far);
    dataSource.entities.values.forEach(entity => {
        let positions = entity.polyline.positions.getValue();
        let polyline = new Cesium.GroundPolylineGeometry({
            positions: positions,
            width: width
        });
        let properties = entity.properties.getValue();
        let lineInstance = new Cesium.GeometryInstance({
            geometry: polyline,
            modelMatrix: Cesium.Matrix4.IDENTITY,
            properties: properties,
            attributes: {
                distanceDisplayCondition:  distanceDisplayCondition,
            },
        });
        lineInstances.push(lineInstance);
    });
    
    var primitive = new Cesium.GroundPolylinePrimitive({
        geometryInstances: lineInstances,
        appearance: getPolylineMeatrialAppearance(color, glowPower, taperPower),
        asynchronous: false,
        show: this._show
    });
    this.lineNet = primitive;
    this._rootContainer = viewer.scene.groundPrimitives;
    viewer.scene.groundPrimitives.add(primitive);
};

const getPolylineMeatrialAppearance = (color, glowPower, taperPower) => {
    glowPower = glowPower||0.1;
    taperPower = taperPower||1.0;
    return  new Cesium.PolylineMaterialAppearance({
        material: new Cesium.Material({
            fabric: {
                type: 'animationLineShader',
                uniforms: {
                    color: Cesium.Color.fromCssColorString(color),
                    image: getColorRampImge2(color),
                    glowPower: glowPower,//发光强度，以总线宽的百分比表示（小于1.0）。
                    taperPower: taperPower,//渐缩效果的强度，以总线长的百分比表示。如果为1.0或更高，则不使用锥度效果。
                },
                source: `
                    uniform vec4 color;
                    uniform float glowPower;
                    uniform float taperPower;
                    uniform sampler2D image;
                    czm_material czm_getMaterial(czm_materialInput materialInput)
                    {   
                        czm_material material = czm_getDefaultMaterial(materialInput);
                        vec2 st = materialInput.st;
    
                        float time = czm_frameNumber / 360.0;
                        vec4 colorImage = texture2D(image, fract(vec2(st.s - time, 0.5 - st.t)));
                        // if(colorImage.a < .9) {
                        //     colorImage.a = 0.0;
                        // }
                        // colorImage.a = min(colorImage.a, .5);
                        material.diffuse = (colorImage.rgb+color.rgb)/2.0;
                        material.alpha = colorImage.a * color.a;
    
                        float glow = glowPower / abs(st.t - 0.5) - (glowPower / 0.5);
    
                        if (taperPower <= 0.99999) {
                            glow *= min(1.0, taperPower / (0.5 - st.s * 0.5) - (taperPower / 0.5));
                        }
    
                        vec4 fragColor;
                        fragColor.rgb = max(vec3(glow - 1.0 + color.rgb), color.rgb);
                        fragColor.a = clamp(0.0, 1.0, glow) * color.a;
                        fragColor = czm_gammaCorrect(fragColor);
                       
                        // material.emission = fragColor.rgb;
                        // material.diffuse = (colorImage.rgb+color.rgb)/2.0;
                        // material.alpha = fragColor.a*colorImage.a;
                        // material.diffuse = color.rgb;
                        // material.alpha = fragColor.a;
    
                        return material;
                    }
                `
            },
        }),
    });
}

export default LineNetManager